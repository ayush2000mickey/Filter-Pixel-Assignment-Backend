const fs = require("fs").promises;
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");

// If modifying these scopes, delete token.json.
const SCOPES = ["https://www.googleapis.com/auth/drive.metadata.readonly"];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "credentials.json");

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    // const content = await fs.readFile(TOKEN_PATH);
    // const credentials = JSON.parse(content);
    const credentials = {
      type: "authorized_user",
      client_id: process.env.DRIVE_API_CLIENT_ID,
      client_secret: process.env.DRIVE_API_CLIENT_SECRET,
      refresh_token: process.env.DRIVE_API_REFRESH_TOKEN,
    };
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  // const keys = JSON.parse(content);
  const keys = {
    installed: {
      client_id: process.env.CREDENTIALS_CLIENT_ID,
      project_id: process.env.CREDENTIALS_PROJECT_ID,
      auth_uri: process.env.CREDENTIALS_AUTH_URI,
      token_uri: process.env.CREDENTIALS_TOKEN_URI,
      auth_provider_x509_cert_url: process.env.CREDENTIALS_AUTH_PROVIDER,
      client_secret: process.env.CREDENTIALS_CLIENT_SECRET,
      redirect_uris: ["http://localhost"],
    },
  };
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: "authorized_user",
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 *
 */
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH,
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  return client;
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 */
async function listFiles(authClient) {
  try {
    const drive = google.drive({ version: "v3", auth: authClient });
    const res = await drive.files.list({
      pageSize: 10,
      q: "'1_qOJ0z3kI_e2IJq4X6HqF0T1ROBESygS' in parents",
    });
    const files = res.data.files;

    // if (files.length === 0) {
    //   console.log("No files found.");
    //   return;
    // }
    // console.log("Files:");
    return files.map((file) => {
      return "https://drive.google.com/uc?export=view&id=" + file.id;
    });
  } catch (e) {
    console.log("error", e);
  }
}

authorize().then(listFiles).catch(console.error);

const getDriveLinks = async (req, res) => {
  console.log("req recieved");
  const authVal = await authorize();
  const data = await listFiles(authVal);
  console.log("data is ", data);
  return res.status(200).json({ data });
};

module.exports = {
  getDriveLinks,
};
