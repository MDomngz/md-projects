/**
 * AI Workbench — feedback sink.
 *
 * Setup (one time):
 *  1. Create a Google Sheet (e.g. "AI Workbench Feedback").
 *  2. Extensions → Apps Script, paste this file in, save.
 *  3. Project Settings → Script properties → add FEEDBACK_SECRET (same value as the
 *     Vercel env var of the same name).
 *  4. Deploy → New deployment → type "Web app":
 *       Execute as: Me    Who has access: Anyone
 *     Copy the /exec URL into Vercel as FEEDBACK_SCRIPT_URL.
 *
 * "Anyone" is required so the Vercel function can POST without a Google login;
 * the shared secret is what keeps other callers out.
 */
const HEADERS = ['Timestamp', 'Email', 'Rating (1-5)', 'Type', 'Message', 'View', 'Prompt ID', 'User agent'];

function doPost(e) {
  const out = obj => ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
  try {
    const data = JSON.parse(e.postData.contents);
    const secret = PropertiesService.getScriptProperties().getProperty('FEEDBACK_SECRET');
    if (!secret || data.secret !== secret) return out({ ok: false, error: 'unauthorized' });

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Feedback')
      || SpreadsheetApp.getActiveSpreadsheet().insertSheet('Feedback');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.setFrozenRows(1);
    }
    // Prefix with ' so a message starting with = + - @ is stored as text, not a formula.
    const safe = v => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v);
    sheet.appendRow([
      data.timestamp, data.email, data.rating, data.type,
      data.message, data.view, data.promptId, data.userAgent
    ].map(safe));
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}
