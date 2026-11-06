# GitHub Pages deployment checklist | v1.5

1. Extract the ZIP into a folder and confirm `index.html`, `css/` and `js/` are together at its root.
2. Create or open your GitHub repository and upload the **files**, not the ZIP itself.
3. Under **Settings → Pages → Build and deployment**, select **Deploy from a branch**, `main`, `/(root)`. Save.
4. After publishing, open the HTTPS GitHub Pages URL in a normal student browser profile.
5. Confirm a brand-new student is asked for **first name and last initial**.
6. Check that Topic 3.2 cannot be opened before 3.1 is passed and 3.3 cannot be opened before 3.2 is passed, including by typing a direct `#/topic/3.2/page/1` URL.
7. Confirm Topic 3.1 activities and the check; then pass Topic 3.1 and verify Topic 3.2 unlocks.
8. On Topic 3.2, test all three leaderboard policies, run a flawed redemption case and a repaired test, complete a code permission decision, and verify graded check submission.
9. Download **all three topic PDFs**, the cumulative PDF, and a JSON backup. Test JSON restoration in a separate test browser profile.
10. Test teacher preview using **Ctrl+Alt+Shift+T** or the five-click build label. Check **separate** 3.1, 3.2 and 3.3 reset controls; exit preview afterward.
11. Return to the site and refresh a lesson to check autosaving.

No npm build, CDN, external API, or backend is required. For local previews, run `python -m http.server 8000` and visit `http://localhost:8000`.

## Updating an existing v1.4 deployment

- Download a JSON progress backup before upgrading, and keep the same GitHub Pages URL and student browser profile.
- Replace the existing files with the v1.5 ZIP contents; include new `js/content33.js`, `js/topic33.js`, `js/topics/topic33-controller.js` and `js/topics/report33.js`.
- Previously recorded topic 3.1 and 3.2 progress remains intact. Passing Topic 3.2 now unlocks Topic 3.3.
- Check new Topic 3.3 activities, graded check, teacher reset and PDF export on an actual Chromebook.

## Updating an existing v1.3 deployment

- **Back up any student JSON progress files before replacing the site.**
- Replace the contents of the GitHub Pages repository with all v1.4 files, including the new `js/registry.js`, `js/report-helpers.js`, and `js/topics/` directory. The new shared shell depends on those files.
- Keep the same site URL and browser profile; v1.3 progress and submitted attempts use the same schema and storage key.
- Check one Topic 3.1 lesson, one Topic 3.2 lesson, the graded check routes, teacher reset, and both individual and cumulative PDFs.
- A hard refresh can be needed after publication to pick up the new module graph.

## Updating an existing v1.1 deployment

- Download JSON backups of any important student progress first.
- Upload and replace the v1.1 site files, including newly added `js/content32.js` and `js/topic32.js`.
- Existing Topic 3.1 progress remains compatible **on the same browser, origin and profile**; do not clear site data.
- If new scripts seem missing, do a hard refresh and check that both new JS modules are published.

## Common problems

- **Blank screen**: Check console errors and verify that the JS files were uploaded under the expected relative paths.
- **No saving**: Confirm browser storage is enabled and the user is not in a profile that clears storage automatically. Use JSON backup/restore.
- **No exports**: Check the Chromebook download policy and browser permissions.
- **Teacher code failure**: Use an HTTPS (or localhost) origin; code hashing relies on Web Crypto.
- **Unexpectedly locked check**: Required practice is not yet completed, a prior graded submission is locked, or the previous topic has not been passed.
- **Security expectations**: Static site scoring, attempt locks, and teacher mode are not server-enforced.
