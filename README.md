# Class Creation Lab | AP Computer Science A Unit 3

**Release 1.14: Full-class method workshop, dropdown balancing, editor fixes and teacher access rotation**

An interactive, self-paced learning website based on the user-supplied **2025 College Board AP Computer Science A Course and Exam Description, Unit 3: Class Creation**. The website runs entirely in the browser and can be hosted on **GitHub Pages** without a server, Java compiler, build step, or paid services.

**Release scope:** Topics **3.1–3.5** are implemented (24 interactive lesson pages and five graded checks). Topics 3.6–3.9 are not yet implemented.


**v1.11 fix:** In 3.4.4, clicking the `PrizeCard`, `ArcadeMachine`, or `Player` challenge buttons now switches the editor to the selected class. Separate drafts and test results persist when switching and after reloading saved progress. No changes to grading, lesson requirements, or previous-topic content.

**v1.12 presentation update:** No estimated minutes or class-period counts appear on student-facing lesson headers or course-roadmap cards for any topic, including unreleased roadmap topics. Incomplete lessons display “In progress” instead of a time estimate. Teacher-only pacing guidance remains in `docs/TEACHER_GUIDE.md`. No assessment, saved-progress, or grading changes.

## Modular design (introduced in v1.4)

The application shell, autosave normalization, teacher console, and offline PDF writer now use a **single topic registry** (`js/registry.js`). Topics 3.1–3.5 have separate controllers and topic-specific report writers. Future topics can be added by registering their files, **without editing the previously completed lessons**. Topic 3.4 was added through the registry without rewriting the already-approved Topics 3.1–3.3.

See **`docs/ARCHITECTURE.md`** for the plugin contract and the steps for adding Topic 3.6 later.

## Topic 3.1: Abstraction and Program Design (four lessons)

1. **Objects Everywhere**: inspect an arcade scene; identify classes, attributes, and behaviors.
2. **Data Abstraction**: alter independent player scores and a shared `arcadeBonus` that actually multiplies subsequent awards; classify attributes.
3. **Procedural Abstraction**: write a method body from an initially blank Java editor; run three deterministic tests; only see example solutions after passing.
4. **Class Design Studio**: select class members from shuffled choices; examine the class diagram; write an explanation.

Includes twelve independent transfer challenges, randomized choices, and a **10-question / 100-point section check**. The Java editor is a *restricted, accurately described method-body evaluator*, not a full Java compiler.

## Topic 3.2: Impact of Program Design (three lessons)

Aligned with **LO 3.2.A; EK 3.2.A.1–3** in the attached 2025 CED:

1. **The Leaderboard Decision**: interactively compare public-name, opt-in nickname, and private leaderboard designs. Identify benefits, unintended harms, mitigations; answer transfer scenarios; save a reflection.
2. **Reliability Test Bench**: load six reproducible test inputs directly into displayed Java code and run each against a *deliberately flawed* redemption algorithm. Select a proposed repair to change the code, test all six again (incorrect repairs remain testable), and classify normal/boundary/invalid inputs with immediate feedback.
3. **Who Owns This Code?**: examine four different software assets, distinguish open-source reuse with license conditions from proprietary/unlicensed code and original work, solve transfer scenarios, and explain a permission decision.

Ends with an **8-question / 100-point graded section check** (12.5 points each). Because the mastery threshold is 80%, students need **at least seven correct answers (87.5%)**; six correct is 75% and does not pass.

## Topic 3.3: Anatomy of a Class (four lessons)

Aligned with **LO 3.3.A; EK 3.3.A.1–6** in the supplied 2025 CED:

1. **Inside a Java Class**: select and inspect the properly indented class header, private field, public constructor and public getter; classify six new Java declarations; solve a private-access checkpoint.
2. **The Access Control Lab**: select a caller class and member, observe a Java call site, and check whether its access is permitted. Students must test public/private members from both inside and outside the class, then solve four independent situations.
3. **One Class, Two Objects**: instantiate two separate Player objects with different scores; call a public method on each and observe that one object's private instance value does not change the other; solve three transfer questions.
4. **Build a Class**: assemble a complete `PrizeCard` class from seven shuffled declaration choices. Preview the generated Java source beside the selection controls, validate the design against its requirements, and run an access-rule check of the public interface. Solve two practice questions and write a 40+ character explanation for the report.

Topic 3.3 ends with a **10-question / 100-point section check** (eight multiple-choice and two full-credit classification questions). Eight correct are required. All choices and practice order are stable-shuffled per student; the multiple-choice answer positions are balanced. The code builder and access checker perform **specified structural and visibility checks**, *not full Java compilation/execution*.


## Topic 3.4: Constructors (five lessons)

Aligned with **LO 3.4.A; EK 3.4.A.1–5** in the supplied 2025 CED (p. 84):

1. **The Object Factory**: step through memory allocation, default field values, constructor assignments and storing a new object reference; build two different objects and solve transfer problems.
2. **The Default Constructor Mystery**: identify `int`, `double`, `boolean`, and reference-field defaults; compare implicit default constructors, parameterized constructors and explicit no-argument constructors; predict which calls compile.
3. **Multiple Objects, Different States**: first choose constructor assignments using dropdowns beside the live Player code, then construct three objects and compare their independent states.
4. **Constructor Workshop**: work in **one complete Java file editor** per challenge, with the `public class` declaration and `private` instance variables already provided. Students write the **entire constructor** inside the class, including `public`, the matching name, parameters, braces and field assignments. Three challenges (`PrizeCard`, `ArcadeMachine`, `Player`) each require four passing test cases. There is **no separate code preview**. The restricted validator checks class/field structure as well as constructor behavior; it is **not a full Java compiler**. The editor spans the available width, supports Tab/Shift+Tab, automatic Enter indentation and Escape then Tab for keyboard navigation, and automatically saves code. Earlier v1.9 constructor-only drafts are displayed inside the complete starter class.
5. **The Defensive Copy Experiment**: select **all three** implementations (direct reference, renamed alias, and new object), mutate the outside original and inside card for every version, and compare the results in a compact side-by-side object diagram. An explicit warning shows when an outside change leaks into private card state. All six comparisons and a reflection are required.

**Review fixes in v1.8:** Constructor parameters stay on one declaration line; practice answers have balanced A–D positions across the topic; inline code is monospaced rather than printed with backticks; graded question #4 includes `ArcadeMachine` as a second reference type. The 3.3 question display also renders pre-existing backticked code correctly, without changing its content or grading. Older v1.7 Topic 3.4 progress is migrated into the new lesson order while retaining previous assessment submissions; the expanded constructor and defensive-copy requirements must still be finished.
The 3.4 section check has **10 questions worth 10 points each**, including two classification/tracing questions. Eight correct are required to pass. All practice is retryable, choices are student-stable randomized, the teacher can reset the check, and 3.4 has separate and cumulative PDF exports with full graded responses and constructor code evidence.

## v1.14 review refinements

- Topic 3.5.5 deliberately rotates correct dropdown answers across first, second and third positions, rather than relying on independent shuffles that could place all correct answers first.
- Topic 3.5.8 replaces four separate method-writing exercises with a full-class `PrizeCard` assignment, evaluated through 12 independent object-state and method-interaction tests. Its single editor starts with only directions; it does **not** supply the class declaration or private fields.
- Method validation accepts ordinary Java `this.field` references and reports more specific structural and behavioral errors.
- Topic 3.5 controls, dropdown labels, action rows, and code/test panels use consistent spacing at desktop and Chromebook widths. Other topics' approved lessons and scoring rules are unchanged.
- Teacher access has been rotated. The phrase is never included in website files or documentation and is supplied separately. All browser-only security limitations still apply.

## Student progression and data

- Students identify with **first name and last initial**.
- Completing required work unlocks the next lesson; getting 80% or more on a topic check unlocks the next implemented topic.
- Practice permits unlimited attempts. Checks permit **one final submission**, followed by a **teacher-authorized on-device reset** if needed. Each reset retains earlier attempt history.
- Browser `localStorage` autosaves progress across refreshes. JSON backups can be exported and imported for transfers or recovery; backups from **v1.0 / v1.1** remain compatible.
- Download **individual Topic 3.1–3.5 PDF reports** and a **cumulative Unit 3 PDF**. Reports contain the student's submitted answers, graded scores, all attempts, and selected practice evidence, including written reflections.
- Display order is deterministically randomized per student. Stored responses and scoring are keyed to original question identities, not their shuffled positions.

**Important security note:** GitHub Pages cannot provide server-verified identity, tamper-resistant progress, genuine single-attempt security, or true teacher password secrecy. Treat the checks as classroom learning evidence, not secure high-stakes exams.

## Teacher preview and reset

Use **Ctrl + Alt + Shift + T** (or five clicks on the small build label), then enter the teacher access phrase supplied separately to the instructor. No teacher credentials are included in this repository or its documentation.

Teacher preview unlocks all 24 available lesson pages, shows answers, allows sample report exports, and automatically offers separate reset buttons for every implemented topic. Preview practice doesn't overwrite a student's record. A reset *does* modify the real student's local record. Exit preview when finished.

## GitHub Pages deployment

1. Extract this ZIP.
2. Upload its **contents** (including `index.html`, `css/`, `js/`, `docs/`) to the root of your GitHub repository.
3. Choose **Settings → Pages → Deploy from a branch**, select `main` and `/(root)`.
4. Open the HTTPS site URL GitHub gives you.
5. Test with a student profile, verify 3.1→3.2→3.3→3.4 unlocking, check all four PDF exports, and test JSON backup/import.

The site uses hash-based routes (such as `#/topic/3.2/page/2`) so it works under a GitHub project subdirectory. No installation or network resources are required once loaded. For a local preview, run `python -m http.server 8000` from the extracted directory and visit `http://localhost:8000`. Do not rely on direct `file://` loading for JavaScript modules.

## Project files

| File | Purpose |
|---|---|
| `index.html`, `css/styles.css` | Entry point and Flour Bluff maroon/silver styling, including equal-size FB wordmark |
| `js/registry.js` | Topic/plugin registration, lesson metadata, prerequisites, and shared progression |
| `js/app.js` | Shared student/teacher shell, navigation and automatic topic event dispatch |
| `js/topics/topic31.js`, `js/topics/topic32-controller.js`, `js/topics/topic33-controller.js`, `js/topics/topic34-controller.js` | Existing lesson UIs and topic-specific interactions |
| `js/topics/report31.js`, `js/topics/report32.js`, `js/topics/report33.js`, `js/topics/report34.js` | Per-topic PDF report sections, included automatically in unit reports |
| `js/content.js`, `js/content32.js`, `js/content33.js`, `js/content34.js` | Per-topic lesson metadata, activities and original question banks |
| `js/topic32.js` | Topic 3.2 interactive lesson simulation, assessment UI, scoring helpers |
| `js/topics/editor34.js` | Native-textarea keyboard indentation behavior for Topic 3.4.4 (Tab/Shift+Tab/Enter), with normal input events for autosave |
| `js/topic34.js` | Topic 3.4 constructor-state simulator, limited assignment evaluator, question grader, and interactive page rendering |
| `js/topic33.js` | Topic 3.3 simulations, lesson completion rules, class assembler, structural feedback, assessment scorer and UI |
| `js/storage.js` | Browser autosave, JSON import/export, backward-compatible normalization |
| `js/order.js`, `js/java-mini.js`, `js/pdf.js` | Stable shuffling, restricted Java evaluator, offline PDFs |
| `docs/` | Curriculum alignment, teacher guide, architecture/extension guide, deployment checklist, change log |
| `tests/` | Node test suite (no runtime dependencies) |

## Developer tests

With Node 20+:

```sh
npm test
```

The automated regression suite covers all four topics, modular registration, legacy progress migration, graded checks, simulated student workflows, teacher resets, and PDF exports. Topic 3.4 lesson layouts and their check were reviewed in Chromium using isolated page previews. This environment blocks ordinary local website navigation in Chromium; verify in a real school browser before deployment. **Test on school Chromebooks before classroom release.**

## Copyright

All student lessons, original diagrams and activities, and graded questions are newly authored to match the attached course guide. *AP* and *College Board* are College Board trademarks; this independent resource is not endorsed by College Board.


## Version 1.14 additions

- Topic 3.5, Methods: How to Write Them, includes eight self-paced interactive lessons, a complete-class design challenge and a 12-question graded check.
- Post-submission reviews now show the full original question, choices, the submitted answer, and review guidance. The correct answer is shown only in teacher preview.
- Teacher access phrase has changed. It is supplied separately, not distributed in website source or documentation. Because GitHub Pages is a static site, this is a convenience and **not secure server-side authentication**.
- Progress remains compatible with v1.12 backups; earlier lesson content and graded questions are unchanged.

## Topic 3.5: Methods: How to Write Them (eight lessons)

Aligned with 2025 CED 3.5.A.1–8 and skills 2.C, 3.C, 3.D, 4.B:

1. Inside a Method — inspect five method parts and classify headers.
2. Methods That Change State — run three void mutators on object fields.
3. Returning Values — compare returned values, boolean accessors, and printing.
4. Parameters and Primitive Values — visualize copied primitive arguments.
5. Accessors and Mutators — construct three working public methods around a private field.
6. Following the Flow of Control — step through early returns, loops, and branches.
7. Preconditions and Debugging — run five original boundary/invalid tests, repair, then retest all five.
8. Independent Class Design Workshop — write a complete `PrizeCard` class from specifications, including three private fields, a parameterized constructor, three getters, two setters, and three additional methods (`addTickets`, `canRedeem`, and `redeemTickets`). Twelve behavioral scenarios test both methods and interactions, with clear feedback.

A separate 12-question graded check uses 100-point scoring. Ten of twelve correct (83.33%) meets the 80% passing requirement. Student results support filterable full-question review with student responses and concept guidance, while answers and explanations remain teacher-only.

The restricted Java evaluator supports the specified class structure, instance fields, constructors, selected method calls, `this.field` access, primitive/String values, conditionals, loops, and return statements. It does not claim to compile arbitrary Java. In v1.14, old individual-method drafts remain in saved progress, but the new full-class assignment must be completed to earn lesson mastery; previously submitted graded checks remain intact.
