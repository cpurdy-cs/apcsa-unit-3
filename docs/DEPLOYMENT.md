# GitHub Pages deployment | Class Creation Lab v2.0.0

## Publish the website

1. Extract `APCSA_Unit3_Class_Creation_GitHubPages_v2.0.0.zip`.
2. Copy **its contents** (`index.html`, `css/`, `js/`) to the root of the GitHub Pages repository. Do not upload the ZIP in place of its contents.
3. Under repository **Settings → Pages → Build and deployment**, select **Deploy from a branch**, the intended branch (usually `main`), and `/(root)`.
4. Open the published **HTTPS** URL from a student Chromebook/browser profile. The site requires no npm build step, backend, CDN, or third-party API.
5. If scripts look unchanged after updating the repository, refresh the page without using a cached copy. Do not clear site data to troubleshoot a stale version unless the student's progress is backed up.

For local testing: `python -m http.server 8000`, then visit `http://localhost:8000`.

## Updating an existing v1.x classroom deployment

- Download a JSON progress backup **before updating**, and confirm the file is available. Keep the same site address, browser and profile to retain the existing local record.
- Replace the entire deployed website's `index.html`, `css/` and `js/` with the files from v2.0.0. Do not mix old and new JS modules.
- Do **not** rename the `flourbluff-apcsa-u3-v1` localStorage key or alter JSON `schema: 1`: v2.0.0 intentionally retains them so previous records and v1.36 backups load normally.
- This release does not reset lessons, graded checks, cumulative review progress, or submitted attempt history.

## Student-device acceptance checklist

Use a **test student**, not a live student's account, to check:

1. New student identity entry (first name and last initial); returning student's progress survives page refresh.
2. Lessons remain ordered and the next topic is locked until the prior topic's check is passed.
3. Completing each topic's required activities unlocks its graded check; reaching 80% unlocks the following topic.
4. Topic navigation correctly highlights the active lesson; Summary highlights the current review part without incorrectly highlighting Topic 3.1.
5. The cumulative Summary unlocks only after all nine topics are completed and passed. Its 28 retryable questions do not add a graded score.
6. Topic PDFs, the cumulative PDF and a normal JSON backup download and open.
7. **Switch student:** click Switch student, verify that the final switch button is disabled, download a backup, select an *old or wrong* backup and confirm switching remains disabled, then select the current matching backup, switch and verify the new identity form appears. Restore the backup to confirm previous work survived.
8. **Cancel:** open Switch student and cancel before verifying; the student record must be retained.
9. Teacher preview works via the configured shortcut and phrase; reset a *test* check and verify prior submission history remains; exit preview.
10. Inspect the actual student Chromebook width, browser policies and download permissions. Browser visual behavior cannot be guaranteed from Node.js tests alone.

## Shared-device backup rule

A download request does not prove the browser saved a file. **Switch student requires verification of the actual downloaded JSON file** against the currently stored student progress. If the downloaded file cannot be located or does not match, **do not clear the record**. Keep backups somewhere students can retrieve them again and avoid leaving confidential student progress files exposed on shared devices.

## Troubleshooting

- **Blank screen:** Verify that all relative `js/` and `css/` paths exist and that the console does not report missing modules.
- **Autosaving fails:** Check browser storage policy and free space. Export work regularly.
- **Download or switch cannot complete:** Check download permission/policy. The student must choose an existing, current JSON file to enable switching.
- **Backup verification fails:** Export a fresh JSON file. Older backups, other students' files and malformed JSON are intentionally rejected during a switch.
- **Restore fails:** Use the JSON import option for the correct student; restoring a different student's record requires switching out of the active student first.
- **Teacher code fails:** Use HTTPS or localhost; hashing relies on the Web Crypto API.
- **A check is locked:** The previous submission may have used the only graded attempt. A teacher can reset that topic check without deleting previous attempts.
- **Security:** This is a static website. It cannot offer server-verified student identities or tamper-proof grades.
