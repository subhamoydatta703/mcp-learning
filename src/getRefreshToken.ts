// src/getRefreshToken.ts

import "dotenv/config";
import { google } from "googleapis";
import { createServer } from "node:http";

const PORT = 3000;
const REDIRECT_URI = `http://localhost:${PORT}/oauth2callback`;

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_OAUTH2_CLIENT_ID,
  process.env.GMAIL_OAUTH2_CLIENT_SECRET,
  REDIRECT_URI,
);

const scopes = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.compose",
];

const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  prompt: "consent",
  scope: scopes,
});

const server = createServer(async (req, res) => {
  if (!req.url?.startsWith("/oauth2callback")) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }

  const url = new URL(req.url, REDIRECT_URI);
  const code = url.searchParams.get("code");

  if (!code) {
    res.writeHead(400);
    res.end("Authorization code missing");
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);

    console.log("\nOAuth successful!\n");
    console.log("Access token:", tokens.access_token);
    console.log("Refresh token:", tokens.refresh_token);

    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end(`
      <h1>OAuth successful ✅</h1>
      <p>You can close this tab and return to the terminal.</p>
    `);

    server.close();
  } catch (error) {
    console.error("Failed to exchange authorization code:", error);

    res.writeHead(500);
    res.end("OAuth failed. Check the terminal.");

    server.close();
  }
});

server.listen(PORT, () => {
  console.log(`\nOAuth callback server running at ${REDIRECT_URI}\n`);
  console.log("Open this URL in your browser:\n");
  console.log(authUrl);
});