# Class Creation Lab | AP Computer Science A Unit 3

**Release 1.6: Topic 3.3 interface refinements**

An interactive, self-paced learning website based on the user-supplied **2025 College Board AP Computer Science A Course and Exam Description, Unit 3: Class Creation**. The website runs entirely in the browser and can be hosted on **GitHub Pages** without a server, Java compiler, build step, or paid services.

**Release scope:** Topics **3.1, 3.2 and 3.3** are implemented (11 lesson pages and three graded checks). Topics 3.4–3.9 are clearly marked *not yet implemented*. This is not the full nine-topic curriculum yet.

## Modular design (introduced in v1.4)

The application shell, autosave normalization, teacher console, and offline PDF writer now use a **single topic registry** (`js/registry.js`). Topics 3.1, 3.2 and 3.3 have separate controllers and topic-specific report writers. Future topics can be added by registering their files, **without editing the previously completed lessons**. Topic 3.3 was added using the registry; all original Topic 3.1 and 3.2 curriculum content remains unchanged.

See **`docs/ARCHITECTURE.md`** for the plugin contract and the exact steps for adding Topic 3.4 after a break in development.

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

## Student progression and data

- Students identify with **first name and last initial**.
- Completing required work unlocks the next lesson; getting 80% or more on a topic check unlocks the next implemented topic.
- Practice permits unlimited attempts. Checks permit **one final submission**, followed by a **teacher-authorized on-device reset** if needed. Each reset retains earlier attempt history.
- Browser `localStorage` autosaves progress across refreshes. JSON backups can be exported and imported for transfers or recovery; backups from **v1.0 / v1.1** remain compatible.
- Download **individual Topic 3.1, 3.2 and 3.3 PDF reports** and a **cumulative Unit 3 PDF**. Reports contain the student's submitted answers, graded scores, all attempts, and selected practice evidence, including written reflections.
- Display order is deterministically randomized per student. Stored responses and scoring are keyed to original question identities, not their shuffled positions.

**Important security note:** GitHub Pages cannot provide server-verified identity, tamper-resistant progress, genuine single-attempt security, or true teacher password secrecy. Treat the checks as classroom learning evidence, not secure high-stakes exams.

## Teacher preview and reset

Use **Ctrl + Alt + Shift + T** (or five clicks on the small build label), then enter the same teacher access phrase as v1.1: **`HornetLab31`**. The local code-checking hash can be changed in `js/app.js` by updating `TEACHER_CODE_SHA256`.

Teacher preview unlocks all eleven pages, shows answers, allows sample report exports, and automatically offers separate reset buttons for every implemented topic. Preview practice doesn't overwrite a student's record. A reset *does* modify the real student's local record. Exit preview when finished.

## GitHub Pages deployment

1. Extract this ZIP.
2. Upload its **contents** (including `index.html`, `css/`, `js/`, `docs/`) to the root of your GitHub repository.
3. Choose **Settings → Pages → Deploy from a branch**, select `main` and `/(root)`.
4. Open the HTTPS site URL GitHub gives you.
5. Test with a student profile, verify 3.1→3.2→3.3 unlocking, check all three PDF exports, and test JSON backup/import.

The site uses hash-based routes (such as `#/topic/3.2/page/2`) so it works under a GitHub project subdirectory. No installation or network resources are required once loaded. For a local preview, run `python -m http.server 8000` from the extracted directory and visit `http://localhost:8000`. Do not rely on direct `file://` loading for JavaScript modules.

## Project files

| File | Purpose |
|---|---|
| `index.html`, `css/styles.css` | Entry point and Flour Bluff maroon/silver styling, including equal-size FB wordmark |
| `js/registry.js` | Topic/plugin registration, lesson metadata, prerequisites, and shared progression |
| `js/app.js` | Shared student/teacher shell, navigation and automatic topic event dispatch |
| `js/topics/topic31.js`, `js/topics/topic32-controller.js`, `js/topics/topic33-controller.js` | Existing lesson UIs and topic-specific interactions |
| `js/topics/report31.js`, `js/topics/report32.js`, `js/topics/report33.js` | Per-topic PDF report sections, included automatically in unit reports |
| `js/content.js`, `js/content32.js`, `js/content33.js` | Per-topic lesson metadata, activities and original question banks |
| `js/topic32.js` | Topic 3.2 interactive lesson simulation, assessment UI, scoring helpers |
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

The 33 automated tests cover all three topics, modular registration, legacy progress migration, graded checks, simulated student workflows, teacher resets, and PDF exports. New Topic 3.3 lesson pages and their check were also inspected using a Chromium interface smoke test. The testing browser restricts ordinary local navigation; verify in a real school browser before deployment. **Test on school Chromebooks before classroom release.**

## Copyright

All student lessons, original diagrams and activities, and graded questions are newly authored to match the attached course guide. *AP* and *College Board* are College Board trademarks; this independent resource is not endorsed by College Board.
