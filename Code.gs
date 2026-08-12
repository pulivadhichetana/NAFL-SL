/**
 * Parent Attendance Sheet Portal — backend
 * Deploy this as a Google Apps Script Web App bound to a Google Sheet.
 * See DEPLOYMENT.md for setup steps.
 *
 * Sheet layout expected (created automatically on first run if missing):
 *   Tab "MasterData": Name | Grade | Section | AdmissionNo
 *   Tab "Meta":        Key  | Value        (rows: SchoolName, SchoolAddr)
 */

var MASTER_SHEET = 'MasterData';
var META_SHEET = 'Meta';

function getSS_() {
  return SpreadsheetApp.getActiveSpreadsheet();
}

function getOrCreateSheet_(name, headerRow) {
  var ss = getSS_();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headerRow);
  }
  return sheet;
}

function jsonOut_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------- GET: read data ----------
function doGet(e) {
  var action = e.parameter.action || '';

  if (action === 'getMasterData') {
    var sheet = getOrCreateSheet_(MASTER_SHEET, ['Name', 'Grade', 'Section', 'AdmissionNo']);
    var values = sheet.getDataRange().getValues();
    var rows = [];
    for (var i = 1; i < values.length; i++) {
      var r = values[i];
      if (!r[0]) continue;
      rows.push({ name: String(r[0]), grade: String(r[1] || ''), section: String(r[2] || ''), admissionNo: String(r[3] || '') });
    }
    return jsonOut_({ ok: true, students: rows });
  }

  if (action === 'getMeta') {
    var metaSheet = getOrCreateSheet_(META_SHEET, ['Key', 'Value']);
    var values = metaSheet.getDataRange().getValues();
    var meta = {};
    for (var i = 1; i < values.length; i++) {
      if (values[i][0]) meta[values[i][0]] = values[i][1];
    }
    return jsonOut_({ ok: true, name: meta.SchoolName || 'National Academy for Learning', addr: meta.SchoolAddr || '' });
  }

  return jsonOut_({ ok: false, error: 'Unknown or missing action' });
}

// ---------- POST: write data ----------
// Sent as Content-Type: text/plain to avoid a CORS preflight (Apps Script
// doesn't respond to OPTIONS). The body is a JSON string we parse manually.
function doPost(e) {
  var body;
  try {
    body = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonOut_({ ok: false, error: 'Invalid request body' });
  }

  var action = body.action || '';

  if (action === 'saveMasterData') {
    var students = body.students || [];
    var sheet = getOrCreateSheet_(MASTER_SHEET, ['Name', 'Grade', 'Section', 'AdmissionNo']);
    sheet.clearContents();
    sheet.appendRow(['Name', 'Grade', 'Section', 'AdmissionNo']);
    if (students.length) {
      var rows = students.map(function (s) {
        return [s.name || '', s.grade || '', s.section || '', s.admissionNo || ''];
      });
      sheet.getRange(2, 1, rows.length, 4).setValues(rows);
    }
    return jsonOut_({ ok: true, count: students.length });
  }

  if (action === 'saveMeta') {
    var metaSheet = getOrCreateSheet_(META_SHEET, ['Key', 'Value']);
    metaSheet.clearContents();
    metaSheet.appendRow(['Key', 'Value']);
    metaSheet.appendRow(['SchoolName', body.name || '']);
    metaSheet.appendRow(['SchoolAddr', body.addr || '']);
    return jsonOut_({ ok: true });
  }

  return jsonOut_({ ok: false, error: 'Unknown action' });
}
