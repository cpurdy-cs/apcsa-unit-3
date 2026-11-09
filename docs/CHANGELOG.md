# Change log

## v1.12 | Remove student-facing lesson time estimates

1. Replaced estimated minute badges with “In progress” on every Topic 3.1–3.4 instructional page; completed pages still show “Completed.”
2. Removed suggested instructional-period counts from all course roadmap cards (including unpublished future topics). Page counts remain visible.
3. Preserved lesson duration metadata and teacher-only planning suggestions in the teacher guide.
4. Updated build labels to 1.12 and added regression coverage; no changes to lesson requirements, answers, grades, reports, or the saved-progress format.

## v1.11 | Fix Topic 3.4.4 constructor challenge buttons

1. Corrected the three constructor challenge tabs to use button click events instead of form change events. Previously only the initially selected PrizeCard was usable.
2. Updated the end-to-end Topic 3.4 workflow test to click each challenge tab, verify that the matching code editor and Test button appear, and confirm the drafts survive switching and navigation.
3. Preserved saved progress schema, existing question banks, teacher tools, PDF reports, and the approved Topics 3.1–3.3.


## v1.10 | Topic 3.4 single-editor constructor workshop

1. Replaced the separate constructor textbox and generated class preview with one full-width Java file editor. Each of the three challenges starts with its correct public class header and private field declarations; students add the entire constructor within the class.
2. Test runner checks the complete class/field scaffold in addition to validating the constructor signature, assignments, and four argument-based object-state tests. It remains an intentionally restricted Java evaluator, not a full compiler.
3. Preserved native-textarea Tab / Shift+Tab, Enter auto-indent, Escape then Tab, autosave, completion gates, PDF reports, and one-attempt grading.
4. v1.9 constructor-only drafts are wrapped into full class source when displayed and are accepted by the existing tests; earlier reports and saved assessment history remain intact.
5. Updated visual and regression tests to verify the one-editor layout, full-class validation, and legacy progress compatibility. Previously approved Topic 3.1–3.3 content was not modified.

## v1.9 | Topic 3.4 constructor editor usability

1. Widened the 3.4.4 constructor-writing area to the entire lesson column, with the live class preview underneath, and switched the narrow-laptop layout to give the editor more horizontal space.
2. Added Tab indentation (four spaces), Shift+Tab outdent, multiline block indentation, and automatic indentation when entering a new line (one extra level after an opening brace). Typing a closing brace at the start of an indented line removes one level.
3. Added accessible keyboard escape: press Escape then Tab to leave the code textarea and move to the next control. The UI explains this shortcut.
4. Kept edits connected to existing autosave, constructor testing, and live Java preview. Added six targeted editor regression tests and verified keyboard interactions in isolated Chromium.
5. Preserved Topics 3.1–3.3, all question banks, saved progress format, reports and teacher tools.

## v1.8 | Topic 3.4 lesson redesign and classroom feedback

1. Reordered Topic 3.4.3 and 3.4.4: dropdown-based object-state debugging now precedes full constructor writing.
2. Replaced the old constructor-body exercise with three complete-constructor challenges for PrizeCard, ArcadeMachine and Player. Students write headers, parameter declarations, braces, and field assignments; a restricted evaluator tests four argument sets per class, including name shadowing behavior.
3. Kept constructor parameter lists on the same declaration line across 3.4 examples, previews, and generated source.
4. Refactored the defensive-copy lab into a compact, side-by-side code and object-state view. Unsafe shared changes trigger explicit warnings; all three implementations and both mutation directions per implementation are required.
5. Balanced correct multiple-choice positions across 3.4 practice for each student seed. Graded options remain A–D balanced. Rendered inline backticked snippets in 3.4 and the pre-existing 3.3 question displays as code, without changing previously approved questions.
6. Expanded graded question #4 with ArcadeMachine as an additional reference type whose default is null.
7. Preserved local save schema and previous check submissions. Older 3.4 drafts are migrated into the new page sequence; revised lab requirements reopen incomplete work rather than falsely granting mastery.
8. Updated topic PDF evidence to include all three submitted constructor implementations and all three defensive-copy experiments; added targeted tests while retaining all prior-topic regression tests.


## v1.7 | Topic 3.4 Constructors

1. Added five original interactive pages: Object Factory, Default Constructor Mystery, Constructor Workshop, Multiple Objects, and Defensive Copy Experiment, covering the 2025 CED LO 3.4.A and EK 3.4.A.1–5.
2. Added a restricted, validated Java constructor-body assignment evaluator with four tests, a side-by-side editor/source preview and diagnostic feedback; it does not run arbitrary Java.
3. Added five graded-progress gates, ten original 10-point section-check questions, stable shuffled options, one-attempt submission and teacher-controlled resets; 80% unlock remains mandatory.
4. Added Topic 3.4 standalone and cumulative PDF sections with submitted responses, code, object-state evidence and defensive-copy reflection.
5. Registered new topic modules in `js/registry.js`. Kept legacy keys/schema 1, graded submissions, and approved Topics 3.1–3.3 content. Only the old 3.3 results message now correctly identifies Topic 3.4 as available.
6. Updated the entry heading to **2026 AP COMPUTER SCIENCE A · UNIT 3** as requested, while retaining the **2025 College Board** source attribution.
7. Added nine new Topic 3.4 tests, including a full student/teacher workflow and PDF verification. All 45 tests pass; visual review used isolated Chromium page previews because navigation is blocked in this environment.


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
- Topics 3.5–3.9 are not yet implemented.
