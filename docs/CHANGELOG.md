## v1.34 — Summary sidebar active-topic correction

- Fixed the sidebar selecting Topic 3.1 while the Unit 3 Summary or Unit Complete screen was displayed. The sidebar now distinguishes an explicitly empty active topic from an omitted active-topic parameter used for auto-selection.
- Preserved topic navigation, completed-status indicators, summary progress, graded checks, all student work and JSON backup formats.
- Added regression tests covering summary navigation, completion navigation and automatic next-topic selection.

## v1.33 — More complete teaching introduction for `this` and consistent Java formatting

Topic 3.9.1 now begins with the concept students already know: two objects share class method definitions but have independent private instance variables. It connects `first.add(3)` to the receiving object, introduces `this` as Java's current-object reference, walks through the complete Counter and Runner code line by line, and explains when `this.count` is optional. All Topic 3.9 titles no longer show literal backtick characters. All new and existing correct Topic 3.9 examples have private instance variables. A graded Topic 3.7 code example was corrected from `public int rank` to `private int rank`, preserving identical output, question ID, key, and mastery score. The Contact workshop's outdated error message now names its actual required private instance variables. No activities, practice/graded answer keys, progression or storage changes. Oracle Java tutorial on `this`: https://docs.oracle.com/javase/tutorial/java/javaOO/thiskey.html. The `this(...)` constructor-chaining feature mentioned there is not part of the 2025 AP CSA Topic 3.9 essential knowledge.

## v1.32 — Rebuilt Topic 3.9 around three simple rules
- Replaced Topic 3.9's complicated experimental scenarios with direct current-object tracing, matching-parameter comparison, a short pass-this example, and one static-method check.
- Replaced the GridMarker workshop with a concise independent Contact class using `this` both to address an instance variable and to pass the current object to `receiveFrom`.
- Rebuilt the practice and graded questions to reflect the new lessons. Existing Topic 3.1–3.8 assessments and student work are untouched.
- Preserved the four-part cumulative review, completion page, teacher tools, schema-1 JSON backups, and PDF exports. No old 3.9 activity migrations are required since no students used that topic.

## v1.31 — Topic 3.9.3 taught through meaningful object registration
- Replaced the Robot charging/new-object comparison with a standalone Sensor/SensorDisplay lesson showing why an object passes its own reference: a display watches the original Sensor and reads its updated instance variable later.
- Four connected guided steps: connect Sensor a, read a new temperature through its stored reference, switch the display to Sensor b, and identify why a static connect method cannot use `this`. Complete Java caller and classes precede every prediction; results and reference-state diagrams appear after checking.
- Removed artificial comparisons involving an unrelated new object and removed previous 3.9.3 saved-step compatibility requirements (no students have started Topic 3.9). All Topics 3.1–3.8 progress and graded records remain compatible, as do all other unit sections.
- 3.9.3 code panels are vertical and wrap at narrow widths. Other Topic 3.9 lessons, graded checks, and the four-part Unit Summary are not changed.

## v1.30 — Topic 3.9.3 conceptual redesign and readable code
- Replaced five disjoint ScoreBoard experiments with a single Robot/ChargingStation scenario that shows the purpose of passing `this`: another object needs a reference to the original Robot to update its energy.
- Three distinct checkpoints: charge the original object; compare passing a newly constructed object; identify why a static method cannot use `this`. Includes source, caller, predictions, revealed trace and corrected static code.
- Full Java files are displayed vertically with wrapped preformatted lines; no sideways scrolling at Chromebook widths.
- Preserve v1.29 solved IDs, original five-step completion, saved attempts, answers, topic grades, teacher overrides and schema-1 JSON backups. Previously completed 3.9.3 does not reset.

## v1.29 — Rebuilt the Topic 3.9.3 reference activity

- Replaced the confusing "Follow the reference passed as this" diagram and disconnected questions with a guided, five-step **Send a Member to the ScoreBoard** lab.
- Each experiment includes complete Java caller and class definitions, one highlighted statement, a required prediction, then a before/after view and specific explanation. Students compare `a.submit(board)` and `b.submit(board)`, then observe `a.claimBonus(board, 5)` modify the **existing** Member through an object-reference parameter. Two final steps diagnose and repair a static method that incorrectly uses `this`.
- Demonstration inputs, console outputs, private instance-variable state, and static-method repair were validated with Java 21. New responsive prediction cards and sequential navigation make the activity clearer at Chromebook widths.
- Preserved the original five scenario IDs and completion requirements so previously completed Topic 3.9.3 records remain valid, as do all previous graded scores, topic/page IDs, JSON backups, PDFs, teacher overrides, and the complete Unit 3 Summary.
- Existing Topics 3.1–3.8 and other Topic 3.9 lessons are not changed; tests cover the new flow, Java semantics, and backwards compatibility.

## v1.28 — Consistent instance-variable and class-variable terminology

- Introduced **field** once in 3.1.2 as the general term for a variable declared in a class, then use **instance variable** for per-object state and **class variable** for shared static state.
- Revised student-facing explanations, knowledge checks, graded question phrasing and guidance, and cumulative-review text across Topics 3.1–3.9. Static-variable explanations explicitly retain the class/instance distinction.
- Revised exposed interpreter diagnostics and PDF section wording, leaving code identifiers, HTML/CSS selectors, question IDs, answer indices, completion and autosave behavior untouched.
- Previously submitted graded attempts retain their saved question snapshots, feedback history, and scores. No student progress migration is required.

## v1.27 — Clear receiver calls in Topic 3.9.1

- Keep Java method-call case unchanged instead of presenting `a.increase(5)` in uppercase.
- Highlight the current statement in the complete `Runner.main` caller and repeat that exact call next to the question.
- Replace ambiguous wording and use **instance variable** consistently in this lesson, including two practice-question wordings (stable IDs and correct-answer indices).
- No new progress requirements, question changes, or changes to existing stored records.

## v1.26 — Full Unit 3 completion
- Added standalone Topic 3.9 (four lessons), GridMarker workshop, 22 behavior tests and 10-question graded check.
- Added four-section cumulative Unit 3 Summary with 28 unlimited-retry questions, feedback, persisted review data, and a final congratulations page.
- Added summary/lesson progress to navigation, dashboard and cumulative PDF. Previous topic content and saved student work preserved.

## v1.25 — Visible Java callers in Topic 3.5.2–3.5.3

Added complete Java caller and supporting class to all three state-changing method experiments in 3.5.2 and all three return-versus-print experiments in 3.5.3. Each activity now identifies exactly which method call executes and how the caller uses the result. Verified all six examples with `javac`. Read-only contextual changes; no practice, completion, grading, progress, assessment or teacher-tool contracts changed.

## v1.24 — Standalone instruction for Topics 3.5–3.7

- Added new visible explanations, worked Java examples and activity guidance before the experiments on all eight Topic 3.5 pages, all five Topic 3.6 pages and all five Topic 3.7 pages.
- Instruction is separate and read-only: no new response fields, grading gates, question changes or progress mutations.
- All lesson completion, quiz, draft, JSON-backup, teacher reset/override and PDF identifiers remain unchanged.
- Earlier approved topics 3.1–3.4, 3.8 and existing coding engines remain byte-for-byte unchanged.
- New tests cover all 18 teaching panels, their placement before the activities, preservation of the editors and completion contracts.

## Version 1.23 — Topic 3.8 instructional clarity

1. Added self-contained learning sections with definitions, worked Java examples, and explicit directions before every Topic 3.8 activity.
2. 3.8.2 shows complete `Runner` and `RewardCalc` classes before students predict `score` and `result`. The subsequent step-through remains interactive and gated by predictions.
3. 3.8.3 begins by teaching shadowing and explaining parameter/field name resolution. Its five scenarios now show consistently indented Java and a full proposed code change upon selecting a repair; "Test your repair" is now accurately labeled "Check selected repair".
4. Rewrote debugging cases 3 and 5 with clearer purpose and valid corrected Java. Aligned the case selection controls in a responsive grid.
5. Preserved graded question banks, answer keys, previously approved topic files, progress keys, existing submissions, teacher controls, and JSON backups.

## Version 1.22 — Clarified 3.8.2 caller and trace predictions

1. Displayed the complete `Runner.main` caller code **above** the method trace, including the `applyBonus(score)` call and `result` assignment. Previously, a short caller snippet appeared below the long method code and was easy to miss.
2. Rewrote the student instructions as three explicit tasks: read caller code, predict both caller variables (`score` and `result`), and step through the method.
3. Added `Caller result` to the execution-state visualizer, highlighting the caller line and correctly tracking when the return value is assigned. Both predictions are required for new traces.
4. Kept legacy completed Topic 3.8.2 records valid; no changes to its practice questions, other lessons, quiz, teacher tools, or save format.

## Version 1.21 — Topic 3.8: Scope and Access

1. Added four independent modular pages: scope explorer, parameter/local lifetime trace, shadowing/scope debugging, and a full DroneBattery class workshop with 20 behavior tests.
2. Added a 10-question graded check with code panels, one final submission, 80% passing threshold, teacher reset and missed-question review; individual and cumulative PDF evidence.
3. Reworked shared left navigation to display completed, current, available and locked topics, per-topic counts and an expanded lesson list for the current topic, including responsive styling.
4. Preserved all approved Topics 3.1–3.7 implementation files, grading rules, backups, teacher-code hash, overrides and the v1.19 live-text fix. Updated only shared registry/navigation/report metadata.

## Version 1.20 — Topic 3.7: Class Variables and Methods

1. Added 3.7.1–3.7.5 through the modular topic registry. Interactive lessons compare independently stored fields and shared class state, public static access, static method restrictions, and final constants.
2. New full-class TrailGate coding workshop with 21 executable behavior tests and diagnostic expected/actual results. The parser is isolated to the new topic, preserving prior Java evaluators.
3. New graded 10-question Topic 3.7 check, 80% mastery, one final submission, teacher reset, original code and response snapshots, missed-question review without student answer keys.
4. New Topic 3.7 and cumulative PDF evidence, with multiline student Java source and graded responses; preserves schema-1 JSON backups, teacher overrides and previous grading history.
5. All previously approved Topic 3.1–3.6 content and implementation modules remain unchanged. Shared application edit sync extended only to clear stale 3.7 tests, retaining the v1.19 live autosave fix. No plaintext teacher code distributed.

## Version 1.19 — Live character counts and dependable text autosave

1. Fixed the shared DOM query helper: simple `#id` references now resolve with `document.getElementById`, including IDs beginning with a digit (invalid as bare CSS selectors). This removes the exception that interrupted live character counts and skipped saving typed text in 3.3.4 and 3.4.5.
2. The same change restores inline save feedback for the 3.4.4, 3.5.8, and 3.6.5 code editors, and immediate graded-answer counters that used digit-prefixed IDs.
3. Added targeted regression tests for per-keystroke counts, persistence and editor labels. Confirmed behavior in a Chromium browser through isolated module imports, including no focus loss on typing.
4. No approved lesson content, questions, grading, student progress schema, teacher credentials, overrides, or PDF functionality was changed.

## Version 1.18 — More realistic Topic 3.6.5 assignment with argument validation

1. Replaced `WeatherStation` with a new `WaterTank` problem containing two private integer fields (`capacity`, `liters`). Students write the complete class from specifications; no constructor or method implementations are provided.
2. `addWater(int amount)` rejects nonpositive amounts and overflow, while `transferTo(WaterTank other, int amount)` must reject nonpositive amounts, source shortages and recipient overflow. Invalid operations return `false` and must not modify either tank. Constructor inputs are specified as valid preconditions.
3. Added 18 behavior and object-identity test cases, with exact inputs, expected returns and states, and observed values. Coverage includes boundary fills/transfers, both objects remaining unchanged after rejection, alias mutation, returning the same tank reference, and same-class private comparisons.
4. Updated the supporting caller code, all three page-5 knowledge checks, Topic 3.6 PDF evidence, and report labels without changing lessons 3.6.1–3.6.4 or the original 3.6 graded-check questions.
5. v1.17 student drafts are kept under `legacyV117`; previous `legacyV116` work, graded assessment history, and teacher overrides are preserved. Page 3.6.5 must be recompleted for the new assignment. LocalStorage key and JSON schema remain unchanged.

## Version 1.17 — New standalone 3.6.5 class-writing assignment

1. Replaced the repeated `TicketWallet` coding workshop with a new, self-contained `WeatherStation` class that has not appeared in previous lessons. The specifications require a private integer temperature field, constructor, getter, own-reading adjustment, calibration of a referenced station, choosing an existing colder station reference, and a same-class private comparison.
2. Replaced all 13 workshop tests with signed-temperature, mutation, alias, independent-object, strict-comparison and returned-identity cases. Each test still gives inputs, expected output, and actual execution results.
3. Rewrote only the 3.6.5 knowledge-check questions and sample caller code. Topic 3.6's first four lessons and its 10 graded questions are unchanged.
4. Preserved v1.16 student code as `legacyV116` during JSON/local progress import, but require completion of the new workshop. Preserve all prior graded submissions, topic progression overrides, and schema-1 storage identifiers.
5. Previously approved Topics 3.1–3.5 remain byte-for-byte unchanged.

## Version 1.16 — Topic 3.6 instructional clarity and test diagnostics

1. Added collapsible supporting-class definitions to all Topic 3.6 lessons. The private-field examples in 3.6.4 are expanded by default with visibility highlighted.
2. Clarified the returned-reference lesson subtitle and disabled code-font ligatures so `>=` displays as two characters.
3. Replaced `sameWallet` with `hasMoreTicketsThan(TicketWallet other)`, with identity tests still covered by the existing `chooseRicher` exercises and reference-return tests.
4. Rebuilt the Topic 3.6 test feedback to show inputs, expected state/reference identity, observed outputs, and execution errors for every case. Failed cases expand automatically.
5. Rewrote ambiguous Topic 3.6 practice and graded-check wording, separated Java code from question prose, and extended code formatting to submission review and PDF reports.
6. Preserved all approved Topic 3.1–3.5 files and all existing lesson, assessment, reset, teacher-override, and progress storage keys.

## Version 1.15 — Topic 3.6, live updates and teacher overrides

1. Added five original, interactive Topic 3.6 pages (reference diagrams, argument mutation/reassignment, return aliases, class-private access, and full TicketWallet coding workshop), a 10-question graded check, and PDF evidence. The independent class runs 13 identity and behavior tests.
2. Updated shared `commit()` to immediately autosave and refresh lesson navigation, page completion badges and dependent progress indicators without replacing the active editor. Changing code invalidates stale test results.
3. Added teacher lesson-completion and prerequisite exceptions with explicit confirmation, optional reasons, permanent local recording, and reversal. Exceptions do not change or synthesize graded scores. PDF reports distinguish these teacher actions from graded work.
4. Preserved every approved Topic 3.1–3.5 lesson/controller/content/report module unchanged. Continued schema-1 JSON compatibility and the existing hashed teacher access mechanism; no plaintext teacher password appears in the distribution.
5. Added topic engine, progression, grading, teacher-exception, old-save, and PDF tests. No student-facing completion-time estimates were added.

## Version 1.14 — Topic 3.5 completion and teacher access update

1. Rotated the teacher access phrase to the instructor-requested memorable phrase; it is deliberately absent from distributed documents and source files (the browser stores only the SHA-256 comparison value). Also rotated the teacher session key to prevent an older preview session from remaining open.
2. Balanced the correct positions across all three dropdowns in 3.5.5, per stable student seed.
3. Replaced 3.5.8's four separate method tasks with a complete `PrizeCard` class-design activity. Students write the class declaration, private attributes, parameterized constructor, three getters, two setters, and three methods; twelve behavioral test cases verify initial values, boundaries, state changes and method interactions.
4. Extended the limited, non-eval Java method parser to recognize common `this.field` forms and class-method invocations, and added specific feedback for structure and method behavior.
5. Standardized Topic 3.5 button, select, label, specification, and result spacing. Earlier-topic lesson data and graded question banks were not changed.
6. Preserved older method drafts and submitted assessments in student backups. Previously complete 3.5.8 work is reopened to meet the new full-class requirement; prior graded scores remain untouched.
7. Updated Topic 3.5 standalone and cumulative PDF evidence to include the full class and its test results; expanded automated coverage to check legacy migration, stable dropdown answer distribution, and accepted valid Java idioms.

## Version 1.13 — Topic 3.5 + shared review + teacher access rotation

- Added Topic 3.5 with eight interactive lessons, a bounded Java-method evaluator, a graded section check and PDF reporting.
- Added shared, filterable post-submission review (original questions/choices, student answers, concept guidance; teacher-only answer keys).
- Rotated the teacher access phrase, removed plaintext credentials from distributed documentation, retained the existing preview shortcut.
- Preserved existing topics and v1.12 student progress format.

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
