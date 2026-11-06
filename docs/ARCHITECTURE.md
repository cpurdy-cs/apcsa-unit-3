# Modular architecture | v1.6

Version 1.4 established the architecture. Version 1.5 proves the extension point by adding Topic 3.3 as an independent module. Topics 3.4–3.9 remain unimplemented.

## Goal

You can stop after Topic 3.3 and later add Topic 3.4 **without editing Topic 3.1, 3.2, or 3.3 implementation files**. The core systems discover registered topics instead of having special cases for specific topic IDs.

## Where things live

| File | Responsibility |
|---|---|
| `js/registry.js` | **The extension point.** Identifies implemented topics, page IDs, prerequisites, lesson metadata, controllers, and per-topic report writers. The rest of the app reads this manifest. |
| `js/app.js` | Shared identity, navigation, dashboard, teacher console, click/change/input dispatch, progression completion events, and backup/report buttons. It does **not** import topic content. |
| `js/storage.js` | Existing schema-1 localStorage data and JSON backup compatibility; normalizes registered lesson keys and registered topic assessments automatically. |
| `js/pdf.js` | Shared PDF document creation, cumulative index and exports. Iterates over registered per-topic writers. |
| `js/topics/topic33-controller.js` | Topic 3.3 independent lesson UI, simulations, practice, and graded check. |
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

Topic 3.3 uses dotted IDs `3.3.1` through `3.3.4`. Future topic keys should likewise use `3.4.1`, etc.

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

## Add Topic 3.4 later

1. Create `js/content34.js` with original curriculum-aligned lessons and questions.
2. Create `js/topics/topic34-controller.js` exporting `createTopic34(ctx)` and implementing the contract above. Use `pageUnlocked(st, '3.4', n, teacher)` to enforce sequential lessons; use `topicCompleted(st, '3.4')` for check access.
3. Create `js/topics/report34.js` exporting `write34(report, state)` for practice and graded evidence.
4. Add **only** the new imports and one entry to the `plugins` object in `js/registry.js`:

```js
'3.4': {
  lessons: PAGE34,
  pageId: n => `3.4.${n}`,
  create: createTopic34,
  writeReport: write34
}
```

The ordered `UNIT` roadmap already contains Topic 3.4. The registry automatically makes it available after the student passes Topic 3.3. The dashboard, navigation, teacher preview, backups, cumulative PDF, topic PDFs, and saved progress normalization use the same registration automatically.

5. Add focused Topic 3.4 interaction and scoring tests. Run **all** tests before publishing. Make a backup and verify with a copy of a real v1.3/v1.4/v1.5 progress file.

**No existing completed topic files need modification** for step 4. Shared framework changes should be reserved for an intentional new feature, not routine topic development.

## Browser limitations

GitHub Pages is still a static site. Student progress, one-attempt restrictions, and teacher access controls are not server-secured. A student must use JSON backup/import to move progress between devices. Browser support must be checked on school Chromebooks before deployment.
