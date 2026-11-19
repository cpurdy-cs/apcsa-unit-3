// Verify the actual JSON file on disk before a shared-device student switch.
// A download request alone does not prove that the browser saved the file.
const MAX_BACKUP_BYTES = 2_000_000;

/**
 * Confirm the selected file is an exact copy of the currently saved student
 * record (aside from exportJson's timestamp). An older backup, or a different
 * student's file, must never unlock the destructive switch action.
 */
export async function verifyStudentSwitchBackup(file, currentState) {
  if (!file || typeof file.text !== 'function') {
    throw Error('Choose the JSON backup file you just downloaded.');
  }
  if (file.size > MAX_BACKUP_BYTES) {
    throw Error('This file is too large to be a valid progress backup.');
  }
  let parsed;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw Error('The selected file is not valid JSON. Try downloading a new backup.');
  }
  if (!parsed || Array.isArray(parsed) || typeof parsed !== 'object' ||
      parsed.schema !== 1 || typeof parsed.exportedAt !== 'string') {
    throw Error('This is not a progress backup exported by this website.');
  }
  // exportJson adds exactly one metadata field, without changing the record.
  const {exportedAt, ...backupState} = parsed;
  if (JSON.stringify(backupState) !== JSON.stringify(currentState)) {
    throw Error('This backup does not match the current student progress. Download a fresh backup and verify that file.');
  }
  return file.name || 'Verified progress backup';
}

/** Persist the blank record BEFORE replacing the active record in memory. */
export function saveBlankStudentBeforeSwitch(createBlank, persist) {
  const next = createBlank();
  if (!persist(next)) {
    throw Error('Browser storage could not be updated. Student progress was NOT cleared.');
  }
  return next;
}
