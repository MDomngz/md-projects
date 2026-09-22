/**
 * AI Workbench — pulls feedback from the Workbench into this Google Sheet.
 *
 * The Workbench stores feedback itself; this script fetches new rows every 10 minutes.
 * It is never deployed as a web app, so it works in Workspace domains that block
 * "Anyone" access.
 *
 * Setup (one time):
 *  1. In the feedback Google Sheet: Extensions → Apps Script, replace everything with
 *     this file, save.
 *  2. Project Settings (gear) → Script properties → add:
 *       FEEDBACK_SECRET  — same value as the Vercel env var of the same name
 *       WORKBENCH_URL    — e.g. https://oddlabsworkbench.vercel.app
 *  3. Back in the editor, choose "setup" in the function dropdown and click Run.
 *     Approve the permissions prompt. This pulls existing feedback now and adds the
 *     10-minute trigger. Run it only once.
 *
 * To pull on demand, run "syncFeedback".
 */
const HEADERS = ['ID', 'Timestamp', 'Email', 'Rating (1-5)', 'Type', 'Message', 'View', 'Prompt ID', 'User agent'];

function setup() {
  ScriptApp.getProjectTriggers()
    .filter(t => t.getHandlerFunction() === 'syncFeedback')
    .forEach(t => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger('syncFeedback').timeBased().everyMinutes(10).create();
  syncFeedback();
}

function syncFeedback() {
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('FEEDBACK_SECRET');
  const base = (props.getProperty('WORKBENCH_URL') || '').replace(/\/+$/, '');
  if (!secret || !base) throw new Error('Set the FEEDBACK_SECRET and WORKBENCH_URL script properties first.');

  const lastId = Number(props.getProperty('LAST_ID')) || 0;
  const res = UrlFetchApp.fetch(`${base}/api/feedback-export?after=${lastId}`, {
    headers: { Authorization: 'Bearer ' + secret },
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error(`Workbench returned ${res.getResponseCode()}: ${res.getContentText().slice(0, 200)}`);
  }
  const rows = JSON.parse(res.getContentText()).rows || [];
  if (!rows.length) return;

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Feedback') || ss.insertSheet('Feedback');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  // Prefix with ' so text starting with = + - @ is stored as text, not run as a formula.
  const safe = v => (typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v);
  const values = rows.map(r => [r.id, r.timestamp, r.email, r.rating, r.type, r.message, r.view, r.promptId, r.userAgent].map(safe));
  sheet.getRange(sheet.getLastRow() + 1, 1, values.length, HEADERS.length).setValues(values);
  props.setProperty('LAST_ID', String(rows[rows.length - 1].id));
}
