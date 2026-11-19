# Class Creation Lab | Version 2.0.0

**Final classroom release — 2026 AP Computer Science A, Unit 3 (2025 College Board CED)**

Class Creation Lab is a self-contained, browser-based learning experience for AP CSA Unit 3. Students work independently through **all nine topics (3.1–3.9), 42 lesson pages, nine graded topic checks, and a four-section cumulative Unit 3 Summary with 28 retryable review questions**. It uses no server, remote API, account system, or build step. It is designed for hosting on GitHub Pages.

## Student experience

- Lessons unlock in order within each topic; a topic check unlocks after required lesson activities are completed.
- A score of at least **80%** passes each graded topic check and unlocks the next topic. Each check permits one submitted attempt unless the teacher resets it. Practice within lessons is retryable.
- Topics use interactive Java traces, experiments, prediction and explanation questions, and independent full-class Java workshops. Java tests run in a restricted browser-side evaluator, not a full Java compiler.
- Once all nine topic checks are passed and lessons are completed, the four-part Unit 3 Summary unlocks. The 28 review questions are unlimited-retry practice, **not another graded check**.
- Students can create individual topic PDFs and a cumulative PDF with their evidence and recorded results.
- Progress is saved locally in the browser. Students can export/import a JSON progress backup to transfer between devices.

## Switching students safely (new in v2.0.0)

Select **Switch student** in the sidebar. The site now requires three distinct actions:

1. **Download progress backup** to request a JSON export of the *actual saved student record*.
2. **Choose backup file to verify**, and select the file that was just saved. The app compares its contents with the current student record, so a stale or different student's backup cannot be used to authorize the switch.
3. Only after verification can **Clear local progress and switch student** be selected. The app saves a blank record before changing the active student in memory; storage failures prevent the switch.

Cancelling or failing verification keeps the current record. This is designed for a shared device where switching students replaces the record stored in that browser. **Keep the backup file**: clearing the local record does not erase the downloaded backup. If the browser prohibits downloads, the student cannot complete the protected switching flow. A download button alone is not proof that a file was saved; the file verification step is required.

## Teacher tools and deployment

The teacher access phrase is **supplied separately** to the instructor and is not included in the published package. The local teacher preview, topic check resets and progress overrides remain available. Preview lesson work is separate from the saved student record. Graded attempt history remains in the record when a check is reset.

Deploy the **GitHubPages_v2.0.0.zip** contents at the repository root; upload the extracted files, not the ZIP itself. Keep the existing GitHub Pages URL and browser profile to retain local progress. See:

- `docs/DEPLOYMENT.md` for deployment, upgrades and student-device validation.
- `docs/TEACHER_GUIDE.md` for grading, backups, teacher tools and classroom guidance.
- `docs/CURRICULUM_ALIGNMENT.md` for topic-by-topic CED coverage.
- `docs/ARCHITECTURE.md` for file structure and compatibility expectations.
- `docs/CHANGELOG.md` for release history.

To test locally, run `python -m http.server 8000`, then open `http://localhost:8000`. To run the automated suite: `npm test` (Node.js required for testing only).

## Version and compatibility

**2.0.0** signifies that the complete Unit 3 course has reached its final-release baseline. It **does not mean a breaking change to student data**. The existing localStorage key `flourbluff-apcsa-u3-v1`, JSON `schema: 1`, lesson IDs, graded question IDs, scores, teacher overrides and previous attempts are deliberately preserved. Existing v1.36 records and backups continue to work.

The project is static and entirely client-side. Student-identification fields, one-attempt locks and teacher access are conveniences, not secure server-enforced controls. Browser storage can be cleared by a device policy or browser settings. Students should download regular JSON backups, even when not switching devices.
