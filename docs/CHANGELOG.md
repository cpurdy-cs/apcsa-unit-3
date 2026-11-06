# Change log

## v1.6 | Topic 3.3 presentation refinements (no assessment changes)

1. Topic 3.3.1's clickable class explorer now displays a valid, fully indented, nine-line Java example. Each of the four original inspection regions and its completion tracking are preserved.
2. Topic 3.3 practice questions no longer mention that their order varies between students.
3. Topic 3.3.4 now presents its seven declaration selectors next to a live Java source preview on desktop, with a responsive stacked layout on narrower screens. The preview continues to update on selection.
4. All previously approved Topic 3.1–3.2 lessons, Topic 3.3 question banks, saved-state keys, grading thresholds, PDF formats, and teacher tools are unchanged.
5. Added three focused tests; 36 automated tests and the Topic 3.3 Chromium walkthrough pass.

## v1.5 | Topic 3.3: Anatomy of a Class

1. Implemented four independent Topic 3.3 lessons: class anatomy, public/private access tester, independent object state simulator, and interactive PrizeCard class builder.
2. Added practice gates, stable randomized choice/row ordering and detailed retry feedback; available after passing Topic 3.2.
3. Added ten original scored check questions covering 2025 CED EK 3.3.A.1–6 (eight multiple-choice and two full-correct classification). 80% unlock is eight correct.
4. Added per-topic 3.3 PDF report with the assembled class and reflection, plus automatic 3.3 inclusion in cumulative PDFs and teacher preview/reset.
5. Added 3.3 as a new registry plugin; no rewrites to approved 3.1/3.2 lesson content. Corrected only the 3.2 results-screen release-status sentence now that 3.3 exists.
6. Existing localStorage/JSON backup schema and previously submitted attempt snapshots are unchanged.
7. Expanded tests to 33, including a full 3.3 student/teacher workflow and standalone PDF verification; inspected new pages in Chromium.


## v1.4 | Modular framework refactor (no lesson-content changes)

1. Added `js/registry.js` as the single extension point for registered lessons, prerequisite progression, page keys, and per-topic PDF writers.
2. Moved the approved Topic 3.1 lesson UI and handlers to `js/topics/topic31.js` and the Topic 3.2 app integrations to `js/topics/topic32-controller.js`. Original content and simulation helpers remain unchanged.
3. Reworked the shared `js/app.js` to discover topics for navigation, dashboards, teacher tools, lesson completion and event dispatch rather than specifying 3.1 and 3.2 in separate routes.
4. Reworked `js/storage.js` to load and normalize all registered topics while preserving legacy numeric 3.1 lesson keys, dotted 3.2 keys, question IDs, attempts and backup schema 1.
5. Moved topic-specific PDF content into `js/topics/report31.js` and `js/topics/report32.js`. The common PDF writer now iterates the registry to create cumulative reports.
6. Added extension documentation and modularity tests, including synthetic Topic 3.3 registration and legacy backup restoration. Existing 20 tests still pass; total tests: 24.
7. Verified that `js/content.js`, `js/content32.js`, `js/topic32.js`, and `css/styles.css` match their v1.3 versions byte for byte.



## v1.3 | Seven classroom review improvements

1. Disabled programming-font ligatures for the reliability code panel so `>=` appears as two ordinary ASCII characters.
2. Reliability tests now load `tickets`, `cost`, and `stock` directly into the displayed Java snippet; one Run code button executes the selected case and shows the returned value and resulting ticket/stock values.
3. Repair selection updates that same snippet immediately, without revealing correctness. All repair choices can be run against all six tests, and changing the choice clears prior repair-run results.
4. Classifying normal, boundary and invalid tests now provides clear immediate feedback and an explicit 0–3 completion count.
5. Reworded graded check 3.2 question #2 to recognize testing below, exactly at, and above a purchasing threshold; historical submissions retain their original question snapshots.
6. The leaderboard starts with no policy selected or previewed. An existing student selection continues to be restored.
7. Replaced interlocking FB text with a same-size, side-by-side FB wordmark in both navigation and welcome screen.

Existing Topic 3.1 and 3.2 progress and submitted attempts remain compatible.


## v1.2 | Corrected FB monogram + Topic 3.2

1. **Logo placement**: Replaced the separate grid-positioned `F` and `B` with an interlocking text monogram. The `B` now sits at the lower-right of the larger `F`, in the existing maroon tile. No external image or font is required.
2. **Topic 3.2.1 – The Leaderboard Decision**: Compare three interactive leaderboard policies, review intended benefits and unintended harmful effects, solve two shuffled transfer questions, and explain a choice in writing.
3. **Topic 3.2.2 – Reliability Test Bench**: Run six test inputs on a deliberately faulty redemption routine, select a correct repair, rerun all six cases, classify boundary and invalid inputs. Results and classification state save automatically.
4. **Topic 3.2.3 – Who Owns This Code?**: Review four assets under supplied permission conditions; classify allowed reuse vs permission requirements; solve two transfer questions and write an original explanation.
5. **Topic 3.2 check**: Eight 12.5-point questions, including normal/boundary/invalid test classification. One submission unless teacher reset; at least seven correct are needed to reach the 80% passing threshold.
6. **Sequential progression**: Topic 3.2 unlocks after passing 3.1 and its three pages unlock in order after required practice. Existing Topic 3.1 lessons and graded records remain intact.
7. **Teacher support**: Independent reset controls, answer previews and sample report options for both available topics.
8. **Exports**: Separate Topic 3.1 and 3.2 PDFs, cumulative PDF containing both, and backward-compatible JSON saves. Topic 3.2 reports include evidence of simulated failures, repairs, decisions and written reflections.
9. **Validation**: Extended automated tests for 3.2 coverage, scoring, save migration, PDF structure, and the full student/teacher check/reset flow; visual smoke tests in Chromium via a page-content harness. Full navigation to local files is blocked in the authoring environment, so actual school-device testing remains recommended.

## v1.1 | Topic 3.1 review fixes

1. Shared `arcadeBonus` correctly multiplies future awards for both players.
2. `addScore(int points)` editor starts blank. Worked examples only appear after successful tests.
3. Stable per-student shuffling across choices, sorting rows and class design; balanced A–D correct positions on the graded check.
4. Rewrote graded question 5 to distinguish data abstraction from procedural abstraction.
5. Preserved the v1 local state format and added automated regression tests.

## Limitations

- Progress, grade integrity, and teacher access cannot be genuinely secured without a backend.
- Topic 3.1's Java execution is deliberately restricted; this is not a full Java compiler.
- Topics 3.4–3.9 are not yet implemented.
