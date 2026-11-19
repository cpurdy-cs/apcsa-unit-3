# Teacher guide | Class Creation Lab v2.0.0

## Scope

**2026 AP Computer Science A, Unit 3 — Class Creation**, aligned to the user-provided **2025 College Board Course and Exam Description**. This final release contains all nine topics, 42 lessons, nine graded topic checks (90 graded questions total), four cumulative review sections (28 retryable questions), and individual/cumulative PDF reports.

| Topic | Lessons | Main focus |
|---|---:|---|
| 3.1 | 4 | Abstraction, modeling attributes/behaviors, method decomposition |
| 3.2 | 3 | Reliability/testing, impacts and code reuse permissions |
| 3.3 | 4 | Class declarations, access control, independent object state |
| 3.4 | 5 | Constructors, defaults, parameterized initialization and copying |
| 3.5 | 8 | `void`/non-`void` methods, mutators/accessors, parameters, returns and full-class writing |
| 3.6 | 5 | Passing/returning object references and same-class access |
| 3.7 | 5 | Class variables and methods; `static`/`final` |
| 3.8 | 4 | Local and parameter scope, blocks and shadowing |
| 3.9 | 4 | Meaning of `this`, receiving objects and reference passing |

Student-facing pages intentionally **do not show estimated completion times**. The exercises include guided investigations, predictions, interactive feedback, and independent full-class coding workshops. The built-in evaluators implement the Java subset needed for those activities; they are not complete Java compilers. For additional complex Java practice, use a separate compiler-based resource.

## Progression and assessment

1. Students enter a first name and last initial. Progress is stored in that browser's localStorage.
2. Each lesson's activities must meet its completion requirements before the next lesson unlocks. Passing a graded topic check (at least **80%**) unlocks the next topic.
3. Each topic check has **one submitted attempt** by default; lesson practice supports retries. Topic 3.2 has eight equally weighted questions, so seven correct are needed to meet the 80% threshold. Other checks use their own banks and scoring.
4. Teacher resets permit another attempt but **preserve previous submissions and scores**. Review of submitted checks presents the original questions, the student's responses and guidance, while teacher preview can display the correct answers.
5. The four-part Unit 3 Summary becomes available after all nine topics' lessons are complete and checks are passed. Students answer **28 unlimited-retry questions**. Correct-answer explanations reinforce Java concepts; incorrect attempts receive hints. The Summary is required for the Unit Complete page but is **not graded**.

Teacher-authorized lesson completion and prerequisite overrides are logged as exceptions, not fabricated assessment grades. A prerequisite override alone does not count as passing a topic check for the cumulative review.

## Student reports and backups

Use **Reports & backups** for individual topic PDFs, a cumulative Unit 3 PDF and JSON progress export/import. PDFs contain the student's recorded evidence, check responses/attempts and, for the cumulative report, progress through the review. JSON backups preserve the actual saved record, including lesson work and past attempts.

**On a shared computer**, the **Switch student** button now enforces a protected flow: download a current JSON backup, select that downloaded file to verify its contents exactly match current progress, and then explicitly clear the local student record and return to identity entry. The clear action cannot proceed until the matching file is verified. Cancelling keeps the record, and storage failures prevent the switch. Students should also retain regular copies of their backups away from the device.

The website cannot confirm whether a download started merely from the browser's download request. That is why the switching dialog verifies the *actual file* selected from Downloads.

## Teacher preview and controls

- Open teacher preview with **Ctrl+Alt+Shift+T**, or click the build/version label five times. Enter the configured teacher phrase supplied separately (not included in the student website).
- Teacher preview bypasses lesson navigation for inspection and **does not save preview activity** to the student's record.
- The teacher console provides individual reset controls for **3.1–3.9** graded checks; prior attempts remain in the record.
- Lesson completion and topic prerequisite overrides can be granted or revoked for an individual student with an explanation; these exceptions appear in reports and the student's record.
- Exit teacher preview explicitly after use on a student device.

These controls are client-side classroom conveniences, **not authentication or tamper-proof grading**. Review students' written explanations and independently written Java code where important.

## Deployment and final classroom check

See `docs/DEPLOYMENT.md`. Test on an actual student browser/Chromebook, particularly downloads, JSON restoration, the new switch-student flow, PDF generation, navigation and teacher reset. Keep the same GitHub Pages URL on upgrade to preserve locally stored work. v2.0.0 preserves the established JSON **schema 1**, localStorage key, question IDs and assessment history; the major version label indicates complete course scope, **not an incompatible data migration**.
