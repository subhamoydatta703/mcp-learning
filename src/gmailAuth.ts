import "dotenv/config";

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope?: string;
  refresh_token?: string; 
}

interface TokenState {
  accessToken: string;
  expiresAt: number; // epoch ms
}

let cached: TokenState | null = null;

async function refreshAccessToken(): Promise<TokenState> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GMAIL_OAUTH2_CLIENT_ID!,
      client_secret: process.env.GMAIL_OAUTH2_CLIENT_SECRET!,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN!,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    throw new Error(`Token refresh failed: ${res.status} ${await res.text()}`);
  }

  const data = (await res.json()) as GoogleTokenResponse;

  if (typeof data.access_token !== "string" || typeof data.expires_in !== "number") {
    throw new Error(`Unexpected token response shape: ${JSON.stringify(data)}`);
  }

  return {
    accessToken: data.access_token,
    // refresh 60s before actual expiry to avoid edge-of-window failures
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
}

export async function getGmailAccessToken(): Promise<string> {
  if (!cached || Date.now() >= cached.expiresAt) {
    cached = await refreshAccessToken();
  }
  return cached.accessToken;
}