# Modular architecture | v1.19

Version 1.4 established the architecture. Versions 1.5 and 1.7 prove the extension point by adding Topics 3.3 and 3.4 as independent modules. Topics 3.5 and 3.6 use the same extension point. Topics 3.7–3.9 remain unimplemented.

## Goal

You can stop after Topic 3.6 and later add Topic 3.7 **without editing the approved Topic 3.1–3.6 implementation files**. The core systems discover registered topics instead of having special cases for specific topic IDs.

## Where things live

| File | Responsibility |
|---|---|
| `js/registry.js` | **The extension point.** Identifies implemented topics, page IDs, prerequisites, lesson metadata, controllers, and per-topic report writers. The rest of the app reads this manifest. |
| `js/app.js` | Shared identity, navigation, dashboard, teacher console, click/change/input dispatch, progression completion events, and backup/report buttons. It does **not** import topic content. |
| `js/storage.js` | Existing schema-1 localStorage data and JSON backup compatibility; normalizes registered lesson keys and registered topic assessments automatically. |
| `js/pdf.js` | Shared PDF document creation, cumulative index and exports. Iterates over registered per-topic writers. |
| `js/topics/topic33-controller.js` | Topic 3.3 independent lesson UI, simulations, practice, and graded check. |
| `js/content34.js`, `js/topic34.js`, `js/topics/topic34-controller.js` | Topic 3.4 separate original curriculum, constrained constructor simulations, interactive pages and check. |
| `js/topics/report34.js` | Topic 3.4 practice/graded evidence for individual and cumulative PDFs. |
| `js/content33.js`, `js/topic33.js` | Topic 3.3 questions and pure logic; original 3.1/3.2 lesson files remain untouched. |
| `js/topics/report33.js` | Topic 3.3 report section for the cumulative and individual PDFs. |
| `js/topics/topic31.js` | Topic 3.1 lesson HTML, practice activities, question handling, grading and sample evidence. |
| `js/topics/topic32-controller.js` | Topic 3.2 lesson layout, student interaction handlers, graded submission and sample evidence. |
| `js/topic32.js` | The existing, unchanged Topic 3.2 simulation, grading and activity rendering functions. |
| `js/topics/report31.js`, `js/topics/report32.js` | Topic-specific report sections, questions, written reflections, and practice evidence. |
| `js/content.js`, `js/content32.js` | Existing approved curriculum data; these files have **not** been rewritten. |
| `tests/modularity.test.mjs` | Checks a synthetic future topic's prerequisites, page locks and completion, plus legacy backup restoration. |

## Page and assessment identifiers

They were deliberately **not migrated**:

- Topic 3.1 lesson state keys remain `1`, `2`, `3`, `4`.
- Topic 3.2 lesson state keys remain `3.2.1`, `3.2.2`, `3.2.3`.
- Assessment keys remain `3.1` and `3.2`.
- Question IDs, snapshots, attempt history and the localStorage key `flourbluff-apcsa-u3-v1` remain intact.
- JSON backup `schema: 1` remains supported.

Topics 3.2–3.6 use dotted IDs. Topic 3.6 uses `3.6.1`–`3.6.5`. Future topics should follow the same convention.

## Registry plugin contract

A topic is implemented by registering an object with:

- `lessons`: page metadata array containing `title`, `subtitle`, and `ek` (teacher-only pacing metadata is optional).
- `pageId(n)`: returns the saved-data key for lesson `n`.
- `create(ctx)`: returns an instance of the topic's student/controller behavior.
- `writeReport(report, state)`: appends this topic's lesson evidence and section-check history to the shared PDF writer.

Each controller returned by `create(ctx)` exposes:

```js
{
  page(n),                 // lesson HTML
  check(),                // graded check HTML
  results(),              // graded results HTML
  complete(n, data),      // true when lesson n has satisfied practice requirements
  click(element),         // handle topic-owned data-action clicks
  change(element),        // handle topic-owned selects/radios
  input(element),         // handle topic-owned text edits
  handlesClick(action),
  handlesChange(action),
  handlesInput(element),
  sample(state, makeAttempt), // populate teacher PDF sample data
  questionBank            // original question data
}
```

All controller methods share the same context, including `view()`, `pData(key)`, `commit()`, `store()`, `render()`, `link()`, `toast()`, `assessment()`, `pageUnlocked()`, `topicUnlocked()`, and `topicCompleted()`.

Use each topic's own `data-action` prefix (e.g. `33-`) to prevent event collisions. Topic 3.1 predates this convention and is intentionally retained under its original action names.

## Add Topic 3.7 later

1. Add `js/content37.js`, `js/topic37.js`, and separate `js/topics/topic37-controller.js` and `js/topics/report37.js`. Keep the supported Java execution subset explicit.
2. Register the topic's lesson metadata, page IDs, controller, and report writer in `js/registry.js`.
3. Existing generic shell, normalization, and PDF code recognizes the registered topic. Preserve all existing page IDs, question IDs, graded snapshots, and schema-1 storage key.
4. Include targeted tests for Java semantics, the student workflow, teacher reset, progress backup, and PDF evidence. Run the complete regression suite and inspect the student pages before release.

## Shared v1.15 progress and teacher tools

- `js/app.js` owns the `commit()` callback. It now saves immediately and schedules a focus-preserving refresh of the lesson footer, progress navigation, and completion badges. It never replaces the active textarea while typing. Code-test results are invalidated when source changes.
- `js/teacher-overrides.js` provides pure and tested grant/revoke logic. The teacher console operates on the student's **actual saved record**, not on a cloned preview. `overrides.lessons` records teacher-completed pages; `overrides.topics` permits a registered topic to be opened without a passing previous topic. Both retain reasons and time stamps, and support reversal.
- `js/storage.js` retains `schema: 1` and all older attempts, including previous v1.14 backups, while normalizing registered Topic 3.6 lessons and any teacher overrides.
- `js/pdf.js` lists teacher-authorized exceptions separately from section-check grades. No fictional scores are created.
- `js/topics/reference-engine36.js` implements an intentionally restricted Java parser and object-identity runtime for the current `WaterTank` assignment. The runtime is not a general Java compiler.

## Browser limitations

GitHub Pages is still a static site. Student progress, one-attempt restrictions, and teacher access controls are not server-secured. A student must use JSON backup/import to move progress between devices. Browser support must be checked on school Chromebooks before deployment.

## v1.8 compatibility note

The Topic 3.4 activity order was intentionally revised (guided object-state exercise now 3.4.3, independent full-constructor writing now 3.4.4). The existing storage schema and key remain unchanged. `normalizeState()` recognizes a v1.7 backup without `topic34Revision: 2`, swaps activity data to the new pages, retains the previous typed assignment as a draft of the PrizeCard full-constructor exercise, and preserves submitted assessment history. Completion is recalculated for the more demanding new requirements. Future topics continue using the same registry plugin pattern.

## v1.16 Topic 3.6-only refinements

The source-panel templates, reference workshop specification and diagnostics, and question rendering are isolated in `js/topic36.js`, `js/content36.js`, and `js/topics/reference-engine36.js`. The shared review renderer adds an optional `q.code` field to display captured graded question code in a separate block; old question snapshots without that field remain supported. No existing Topic 3.1–3.5 module code is changed.


## v1.17 Topic 3.6.5 independent-workshop revision

The self-contained `WeatherStation` workshop was introduced to replace writing `TicketWallet`, whose definition is visible in earlier Topic 3.6 lessons. The new class's source, tests, field names, and instructions live in `reference-engine36.js`, `topic36.js`, `content36.js`, and `report36.js`. The `topic36Revision:2` field in state normalization preserves old work as `legacyV116`, but clears the older page-5 completion and knowledge-check answers; submitted graded attempts and teacher overrides are preserved. Do not change the schema-1 storage key or old graded question IDs.

## v1.18 Topic 3.6.5 change

The standalone `WaterTank` replaces `WeatherStation` only in Topic 3.6.5. `js/topics/reference-engine36.js` now models two private integer fields, checks 18 independent state/identity outcomes, and accepts booleans, method calls, conditionals and primitive/referenced parameter values within its documented Java subset. `js/topic36.js` and the page-5 knowledge checks in `js/content36.js` supply new specifications and caller snippets. `js/topics/report36.js` includes the new full-class code and test count. The stored `topic36Revision:3` archives v1.17 work under `legacyV117` (and keeps any older `legacyV116`) while resetting only page 3.6.5 completion and the new practice questions. Do not change previous graded submissions, registered page IDs, the teacher override log, the schema-1 storage format, or approved earlier lessons.
