# Modular architecture | v1.11

Version 1.4 established the architecture. Versions 1.5 and 1.7 prove the extension point by adding Topics 3.3 and 3.4 as independent modules. Topics 3.5–3.9 remain unimplemented.

## Goal

You can stop after Topic 3.4 and later add Topic 3.5 **without editing Topic 3.1, 3.2, 3.3 or 3.4 implementation files**. The core systems discover registered topics instead of having special cases for specific topic IDs.

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

Topics 3.3 and 3.4 use dotted IDs `3.3.1`–`3.3.4` and `3.4.1`–`3.4.5`. Future topic keys should use `3.5.1`, etc.

## Registry plugin contract

A topic is implemented by registering an object with:

- `lessons`: page metadata array containing `title`, `subtitle`, `minutes`, and `ek`.
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

## Add Topic 3.5 later

1. Create `js/content35.js` for the CED-aligned lessons, interactions and independent graded questions.
2. Create `js/topic35.js` for pure learning/simulation/assessment logic. Keep the supported Java execution subset explicit rather than claiming a full compiler.
3. Create `js/topics/topic35-controller.js` implementing the plugin interface above and `js/topics/report35.js` with practice/assessment evidence.
4. Register the new imports and one plugin object in `js/registry.js`:

```js
'3.5': {
  lessons: PAGE35,
  pageId: n => `3.5.${n}`,
  create: createTopic35,
  writeReport: write35
}
```

5. Preserve the schema-1 storage key and all existing lesson IDs, question IDs, and graded snapshots. Create focused tests, run the full test suite, check PDF exports, and inspect the new pages.

The shared app shell, dashboard, progress normalizer, teacher tools, and cumulative PDF already discover a registered topic. **Do not edit approved topic modules** to implement a new topic. The only intentional modification to an earlier topic in v1.7 was its post-check availability message, which now says 3.4 is released.

## Browser limitations

GitHub Pages is still a static site. Student progress, one-attempt restrictions, and teacher access controls are not server-secured. A student must use JSON backup/import to move progress between devices. Browser support must be checked on school Chromebooks before deployment.

## v1.8 compatibility note

The Topic 3.4 activity order was intentionally revised (guided object-state exercise now 3.4.3, independent full-constructor writing now 3.4.4). The existing storage schema and key remain unchanged. `normalizeState()` recognizes a v1.7 backup without `topic34Revision: 2`, swaps activity data to the new pages, retains the previous typed assignment as a draft of the PrizeCard full-constructor exercise, and preserves submitted assessment history. Completion is recalculated for the more demanding new requirements. Future topics continue using the same registry plugin pattern.
