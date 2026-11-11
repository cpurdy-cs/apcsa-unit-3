# Teacher Guide | Class Creation Lab v1.19

## Release 1.6 note

Topic 3.3 now uses a correctly indented clickable code explorer, simpler practice wording, and side-by-side Class Builder controls and live source preview. Scores, progress, and graded questions are unchanged.

## Release 1.5 note

The modular framework now includes Topic 3.3. Topic 3.1 and 3.2 lesson content and graded questions remain unchanged; only the outdated 3.2 post-check release-status message was updated. Student progress and previous submissions remain compatible. See `docs/ARCHITECTURE.md` for how to add Topic 3.4 without editing completed lessons.

## Topic 3.5 v1.14 review notes

Topic 3.5.5 correctly distributes the three expected methods across the available dropdown positions. Topic 3.5.8 is now a **full-class design task**, not four small method exercises. The expected class has `String owner`, `int tickets`, and `boolean active` private instance variables; a three-parameter constructor; getters `getOwner`, `getTickets`, and `isActive`; setters `setOwner` and `setActive`; and the additional behaviors `addTickets`, `canRedeem`, and `redeemTickets`. All 12 tests must pass. Java `this.field` and calls such as `canRedeem(cost)` are recognized by the restricted evaluator. The exact expected Java answer is not included here.

Student progress is compatible with the earlier releases. Previous Topic 3.5.8 method drafts remain in backups, but the revised full-class task must be completed. Graded assessment attempts remain unchanged. Teacher access uses the replacement phrase given **separately to the instructor**; no credentials are distributed with the website.

## Source and scope

Based only on the user-provided **2025 AP Computer Science A Course and Exam Description**, Unit 3. This release implements 3.1 Abstraction and Program Design, 3.2 Impact of Program Design, 3.3 Anatomy of a Class 3.4 Constructors, 3.5 Methods: How to Write Them, and 3.6 Passing and Returning References. Topics 3.7–3.9 remain planned.

Plan approximately **two 45–50-minute class periods** for Topic 3.1 **one 45–50-minute period** for Topic 3.2 and **two 45–50-minute periods** for Topic 3.3. These estimates are for teacher planning only; the student-facing site shows no expected completion times. Students work at their own pace.

## Topic 3.1 mastery gates

- **3.1.1**: Explore three arcade items; sort all six elements; solve three transfer challenges; answer the concept question.
- **3.1.2**: Change the shared bonus and award points using that bonus; sort six variables/methods; solve three transfer challenges; answer the concept question.
- **3.1.3**: Write `addScore` from an initially blank body and pass three restricted-Java tests; solve three transfer challenges; answer both concept checkpoints.
- **3.1.4**: Select the required three fields and three methods from shuffled choices; explain the design in at least 30 characters; solve three transfer challenges; answer the concept question.
- **Check**: ten questions, ten points each, **80/100** to unlock Topic 3.2.

## Topic 3.2 mastery gates

- **3.2.1, The Leaderboard Decision**: Compare all three leaderboard policies; correctly solve both transfer scenarios; enter a reflection of at least 40 characters explaining benefits, harms and mitigation.
- **3.2.2, Reliability Test Bench**: Run **all six** test cases with the flawed code; select the repair checking positive cost, positive stock and sufficient tickets; rerun all six with the repair; correctly classify three highlighted tests. The initial code intentionally fails for zero stock and zero/negative costs. Results are deterministic.
- **3.2.3, Who Owns This Code?**: Correctly identify responsible reuse choices for four assets; solve two transfer scenarios; write at least 40 characters explaining how to obtain permission for unlicensed code.
- **Check**: eight questions, 12.5 points each, **at least 7/8 correct (87.5%)** required to pass the 80% threshold. One submitted attempt unless reset by the teacher.

The Topic 3.2 learning objectives are:

- **EK 3.2.A.1:** Reliable systems operate as expected under stated conditions; programs should be tested under varied conditions.
- **EK 3.2.A.2:** Programs can benefit or harm society, culture and the economy, including through unintended effects.
- **EK 3.2.A.3:** Legal and intellectual property concerns arise when incorporating someone else's code; non-open-source code requires appropriate permission and often payment.

## Report review

**Reports & backups** provides individual Topic 3.1–3.6 PDFs and a cumulative Unit 3 report. Topic 3.2 reports include comparisons made in the leaderboard lab, written reflections, test outcomes before/after repairs, software reuse classifications, full graded answers and attempt history. Student reports do not reveal answer keys; teacher preview does.

## Preview and resetting attempts

Teacher access: **Ctrl+Alt+Shift+T** or click the build label five times; enter the configured phrase. The access phrase is supplied separately to the instructor and is not included in this package. Teacher preview unlocks the lessons without altering student practice. To reset a submitted check, open **Teacher tools**, select the appropriate **Reset 3.1 / 3.2 / 3.3 / 3.4 / 3.5 / 3.6 check**, and confirm. The prior attempt remains in the student's PDF and saved progress. Always exit teacher preview after using a student device.

## Update from v1.1

No fresh start is required. Progress backups from earlier versions use the same schema, and the v1.5 application can restore previously completed Topic 3.1 and 3.2 pages, evidence and scores. Current progress on a particular computer is retained as long as it is served from the **same site origin/path and browser profile** (and storage has not been cleared). Download a JSON backup before making deployment changes, and test restoring it on another browser profile.

## Classroom reliability and integrity

The site is dependency-free and runs on GitHub Pages. Student data and scores are stored in the student's browser; neither the single-attempt policy nor teacher preview is secure against deliberate source or browser-storage manipulation. Treat results as instructional evidence and review selected written explanations for depth. Always verify PDF and JSON downloads on the actual Chromebooks and browser profiles your students use.

### Topic 3.2 reliability lab (v1.3)
Students load one test case at a time into the Java code and press Run code. All six original tests must be run before the repair choices appear. Selecting a repair changes the displayed condition without stating whether it is correct; students must run the six cases again. A failed repair can be changed and retested, with new repair results recorded separately from the original-code results. Test categories give immediate feedback. Section-check Q2 includes 9, 10 and 11 tickets around a threshold of 10.


## Topic 3.3: Anatomy of a Class (v1.5)

This section uses the 2025 College Board AP CSA CED, LO 3.3.A, EK 3.3.A.1–6 (attached PDF page 11). Its four pages build on 3.1 and 3.2:

1. Inspect a public class, private field, public constructor and public method; classify six declarations, then answer a checkpoint.
2. Change the calling context and target member to explore `public`/`private`; run four required access-rule comparisons and solve four practice scenarios.
3. Create two Player objects, modify each through a public method and observe separate private scores; solve three practice scenarios.
4. Assemble PrizeCard from seven shuffled declarations; validate the design, verify client access expectations, solve two questions and save a written explanation.

The 3.3 class builder is a constrained **declaration and access-rule validator**, not a complete Java compiler. It displays assembled Java source but does not execute student-written arbitrary Java. All graded questions are automatically scored (10 points each); eight correct are needed to pass. Submitted answers appear in the separate 3.3 PDF, and the assembled source and written explanation are included as selected practice evidence. Teacher mode provides an independent 3.3 reset and sample PDF.

## Topic 3.4: Constructors (v1.8)

Five interactive pages align with LO 3.4.A and EK 3.4.A.1–5 (2025 CED PDF page 12 / printed p. 84). Suggested activity timings are 13, 15, 16, 27, and 20 minutes, excluding transitions and optional review. Complete constructor writing is intentionally more demanding than guided dropdown work.

- **3.4.1 Object Factory:** Three steps reveal field defaults, constructor initialization and returned reference. Two objects and three correct transfer answers required.
- **3.4.2 Default Constructor Mystery:** Four field defaults and three constructor-availability tests, each with a prediction first.
- **3.4.3 Multiple Objects:** Students select assignments beside the class code, create three separate objects and diagnose erroneous starting state. Three transfer questions required.
- **3.4.4 Constructor Workshop:** Students work in one editable Java class per challenge. Class declarations and private instance fields are provided; they write **three full constructors** inside those classes, including headers, parameter lists, braces and field assignments, for PrizeCard, ArcadeMachine and Player. Four varied tests per constructor must all pass. The evaluator supports direct assignments to typed instance fields using matching parameters and literals, not arbitrary Java; it accurately reports name shadowing. It accepts valid parameter names that differ from the examples. Source for all three constructors appears in reports. Two transfer questions required.
- **3.4.5 Defensive Copy Experiment:** Three code options must each be constructed and tested in both directions: outside original and inside card mutations (six demonstrations). The simulation explains unsafe shared references and a separately allocated defensive copy, with high-contrast state changes in the same visual area as the controls. Three transfer answers and a written explanation (50+ characters) required.

**Progress migration:** v1.7 page 3/4 activity data is swapped to match the revised lesson order; old typed assignments are retained in the first full-constructor editor as a draft. Existing topic assessments are preserved. Former 3.4 completion status may be reopened because the revised labs require three complete constructors and all three defensive-copy implementations; existing 3.1–3.3 records are unchanged.
**Section check 3.4:** 10 questions worth 10 points each, including two all-or-nothing category questions. A score of 80+ is required. The check allows one final submission until you reset it from Teacher Tools; previous scores remain in the report. The student PDF contains question/answer evidence plus all three full constructor declarations and mutable-reference experiment. The new topic is automatically included in cumulative PDFs and in JSON progress backups.

**Teacher preview:** Use the replacement access phrase supplied privately for this release. Preview mode unlocks Topic 3.4 and can generate a sample Topic 3.4 report. Existing student records remain schema 1, and prior submissions remain readable.


### Version 1.9: Constructor Workshop typing

Topic 3.4.4 uses a full-width Java textarea. Tab inserts four spaces, Shift+Tab removes indentation, and Enter copies the previous line indentation (adding four spaces after `{`). Press Escape then Tab to move to the next control. Input from the indentation shortcuts is autosaved and immediately reflected in the live class preview.

### Version 1.10: Single-file Java editor

Topic 3.4.4 now has one code editor and no separate live preview. For each class, students see the given public class header and private fields and insert a complete constructor in the indicated location. The validator checks that the class structure is retained before testing constructor behavior. Existing v1.9 constructor-only saved drafts are shown inside the full class when reopened; all prior scores remain intact.

## v1.15: Topic 3.6 and teacher progress exceptions

Topic 3.6 aligns with 2025 CED Topic 3.6 (printed p. 87), covering EK 3.6.A.1–3. Five pages teach shared object references, parameter mutation versus reassignment, returned references, same-class private access, and writing complete reference-aware methods. The updated, standalone `WaterTank` class workshop requires 18 deterministic behavior, validation and identity tests and ends in a 10-question/100-point graded check.

**Student autosave:** Text and code inputs save continuously to the current browser profile. Completion navigation updates without forcing a reload. A changed code editor shows an untested state until Run Tests succeeds; saved code is not considered automatically correct. Continue recommending JSON exports when switching devices.

**Teacher Progress Override:** While working on the student's own computer/profile, enter the teacher code and open **Teacher tools**. In the Student Progress Override panel, select a lesson to mark completed, or select a topic to allow entry without passing its usual prerequisite. Enter an optional reason, confirm, and exit teacher preview. These actions update the actual saved student record (not temporary preview), log the exception, and appear on PDF reports. They do **not** create passing assessment scores. The panel also allows explicit reversal of a previous override; downstream student work and prior graded attempts are retained when an exception is reversed.

Because GitHub Pages has no teacher database, exceptions can only be made on the student device/record currently open. Neither teacher access nor progress is tamper-proof. No plaintext teacher credential is included in this package.

### v1.16 reference-lesson refinements

Supporting class definitions are available in every Topic 3.6 lesson and open automatically for the private-access lab. The independent class now includes `hasMoreTicketsThan(TicketWallet other)` instead of `sameWallet`. Its 13 tests disclose input calls and both expected and observed results for debugging. Correct answers remain teacher-only during post-assessment student review. Previously submitted checks remain unchanged.


### v1.17 independent Topic 3.6.5 class

The workshop is now a **new `WeatherStation` class** not shown in any earlier topic or lesson. Students independently implement an integer `temperature` field (degrees Celsius), a constructor, `getTemperature`, `adjustTemperature`, `calibrateOther`, `chooseColder`, and `isWarmerThan`. The 13 tests check negative values, calibration of a *different* station or an alias to the same one, same-class private-field comparisons, tie handling, and exact returned-reference identity. The teacher's previous approved material in 3.6.1–3.6.4 is unaffected.

Old v1.16 `TicketWallet` work remains in the JSON backup's `legacyV116` evidence and prior graded attempts remain untouched. The revised 3.6.5 must be completed anew for mastery. Supporting sample caller code does **not** disclose the solution implementation.

### v1.18: New Topic 3.6.5 WaterTank assignment

Students write an original `WaterTank` class with private `int capacity` and `int liters` fields. The constructor's preconditions guarantee positive capacity and an initial level between zero and capacity; there is no requirement to reject invalid constructor inputs. The `addWater` and `transferTo` methods have **explicit validation requirements** for their integer arguments. A failed operation returns `false`, leaving all tank states unchanged; successful operations return `true`. `getCapacity`, `getLiters`, `chooseLowerLevel`, and `hasMoreRoomThan` assess additional state, returned-reference identity and same-class private member access. The 18 automatically graded tests give concrete Java-style caller code, expected results and actual returns/states. Students may use different valid implementation strategies and parameter names within the supported Java subset.

This replaces only the 3.6.5 exercise; earlier lessons and section-check questions are unchanged. Imported v1.17 WeatherStation drafts remain under `legacyV117` in progress data, while a prior `legacyV116` TicketWallet draft is also retained. Because the assignment is new, 3.6.5 must be recompleted. Previously submitted section assessments and teacher-authorized progression exceptions are never replaced or scored artificially. All student-facing activity-duration estimates remain omitted.
