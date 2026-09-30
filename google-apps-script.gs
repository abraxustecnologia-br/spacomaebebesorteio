/**
 * Cole este código no Apps Script vinculado à planilha e publique como app da web.
 * A primeira execução cria os cabeçalhos automaticamente.
 */
const SHEET_NAME = 'Inscrições';
const HEADERS = [
  'dataHora',
  'responsavel',
  'whatsapp',
  'email',
  'crianca',
  'idade',
  'fase',
  'interesses',
  'participaSorteio',
  'autorizouComunicacao',
  'visita',
  'origem'
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const payload = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }

    sheet.appendRow(HEADERS.map(header => sanitizeCell(payload[header] || '')));
    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message });
  } finally {
    lock.releaseLock();
  }
}

function sanitizeCell(value) {
  const text = String(value).trim();
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function jsonResponse(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
