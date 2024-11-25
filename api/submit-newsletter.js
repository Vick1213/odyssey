import { google } from "googleapis";

const SHEET_ID = "1lPCtFC25zNmUJcO5fmX7a7pc9yzMqGIGGUcIvrfkP4A";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Email } = req.body;

    if (!Email) {
      return res.status(400).json({ error: "Email is required!" });
    }

    try {
      // Parse the service account key from environment variable
      const SERVICE_ACCOUNT_KEY = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

      // Authenticate with Google Sheets API
      const auth = new google.auth.GoogleAuth({
        credentials: SERVICE_ACCOUNT_KEY,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      const sheets = google.sheets({ version: "v4", auth });

      // Append the email to the Google Sheet
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Sheet1!A:A", // Adjust range if needed
        valueInputOption: "RAW",
        requestBody: {
          values: [[Email]],
        },
      });

      return res.status(200).json({ success: true, message: "Email added successfully!" });
    } catch (error) {
      console.error("Error appending to Google Sheets:", error);
      return res.status(500).json({ success: false, error: "Failed to save email." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
