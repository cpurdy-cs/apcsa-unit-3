# 2025 College Board AP CSA Unit 3 | Release 1.19 alignment

**Source used:** user-supplied *AP Computer Science A Course and Exam Description*, Course Framework V.1, © 2025 College Board, Unit 3 *Class Creation*. The attached PDF is the sole curricular source. All lesson scenarios and scored questions are original to this project.

## Topic 3.1: Abstraction and Program Design

CED pp. 80–81, LO 3.1.A, EK 3.1.A.1–7.

| EK | Required activity |
|---|---|
| A.1 | Choose relevant details when modeling an arcade; transfer to a traffic model |
| A.2 | Use named attributes to represent player data without exposing representation |
| A.3 | Classify instance and class variables; manipulate independent scores and a shared bonus |
| A.4 | Identify reusable method behavior and decomposition |
| A.5 | Test `addScore(int points)` against multiple arguments |
| A.6 | Compare equivalent method implementations with the same contract |
| A.7 | Create a diagram of attributes and behaviors before coding |

**Assessment:** 10 original graded questions and practice on each page; 80% required.

## Topic 3.2: Impact of Program Design

CED p. 82 (attached PDF p. 10), LO **3.2.A**: explain the social and ethical implications of computing systems.

| EK | Learning and required interaction | Check questions |
|---|---|---|
| **3.2.A.1** System reliability and varied testing | Reliability Test Bench: six normal, boundary and invalid conditions; diagnose failed tests; choose a specification-compliant repair; repeat tests | Q1, Q2, Q3, Q8 |
| **3.2.A.2** Beneficial and harmful impacts, including unintended effects | Leaderboard Design: compare three policy choices; identify benefits and harms; write a balanced justification | Q4, Q5, Q8 |
| **3.2.A.3** Legal/intellectual property concerns and permission | Code Reuse Puzzle: classify four assets based on supplied license/permission facts and explain why unlicensed code needs permission | Q6, Q7, Q8 |

**Assessment:** eight original graded questions (seven multiple choice and one classification), 12.5 points each. At the 80% threshold, **seven correct answers** are necessary. The two transfer questions in Lesson 1 and two in Lesson 3 are practice, not graded exam questions. The reflection fields are exported for teacher review.

## Topic 3.3: Anatomy of a Class

CED p. 83 (attached PDF p. 11), LO **3.3.A**: designate access and visibility constraints to classes, attributes, constructors, and methods.

| EK | Learning and required interaction | Check questions |
|---|---|---|
| **3.3.A.1** Data encapsulation and `public`/`private` | Access Control Lab, visible call-site outcome and class design decisions | Q3, Q4, Q5, Q8, Q10 |
| **3.3.A.2** Public class declarations | Anatomy explorer; select the correct class header | Q1, Q9 |
| **3.3.A.3** Public constructors | Anatomy explorer; select a public constructor header with no return type | Q2, Q9 |
| **3.3.A.4** Separate instance variable for each object | Two-Player object-state experiment | Q6, Q9 |
| **3.3.A.5** Private attributes | Access Control Lab and PrizeCard private fields | Q3, Q5, Q8, Q10 |
| **3.3.A.6** Public and private methods | Access Control Lab and PrizeCard client-facing/public and internal/private methods | Q4, Q5, Q7, Q8, Q10 |

**Assessment:** 10 graded questions, 10 points each. Requires eight correct. Independent practice requires successful completion but permits unlimited retries. The builder and visibility checker only evaluate the specified rules; they are not presented as a full Java compiler.

## Remaining roadmap (3.1–3.6 are now implemented)

| Topic | Planned pages | Suggested periods |
|---|---:|---:|
| 3.7 Class Variables and Methods | 5 | 2 |
| 3.8 Scope and Access | 4 | 2 |
| 3.9 this Keyword | 3 | 1 |

The College Board topic allocations total 18 periods. The broader 21-period plan includes three integrated application/review periods after the planned units. **These additional activities are not yet part of the release.**

## Topic 3.4: Constructors

CED p. 84, LO 3.4.A, EK 3.4.A.1–5. The CED recommends two periods and assesses design/implementation of data abstractions and tracing initialized object state.

| EK | Interactive lesson and assessment coverage |
|---|---|
| 3.4.A.1 | 3.4.1 state during allocation/initialization; 3.4.3 separate Player objects; graded Q1 and Q7 |
| 3.4.A.2 | 3.4.1 stepped constructor, 3.4.3 guided parameterized initialization, 3.4.4 write/test three complete constructors; graded Q2, Q6, Q8 |
| 3.4.A.3 | 3.4.5 shared-reference vs. defensive-copy experiment with mutable TicketBalance; graded Q9–Q10 |
| 3.4.A.4 | 3.4.2 default vs. programmer-written no-arg vs. parameterized constructor; graded Q3 and Q5 |
| 3.4.A.5 | 3.4.2 explicit default-value predictions for int/double/boolean/String; graded Q4 additionally includes ArcadeMachine (reference default null) |

**Scoring:** 10 original questions, 10 points each; a score of at least 80 is required. Client-side Java exercises deliberately support only the constructs shown. They are not general Java compilers.

## Topic 3.5: Methods: How to Write Them

CED pp. 85–86, LO 3.5.A, EK 3.5.A.1–8; skills 2.C, 3.C, 3.D, 4.B.

| Knowledge / skill | Student practice | Check |
|---|---|---|
| 3.5.A.1–2: void/non-void declarations | 3.5.1 clickable headers, 3.5.2 void mutators | Q1, Q8 |
| 3.5.A.3–4: return value/control flow | 3.5.3 returned vs printed, 3.5.6 stepped returns in branches/loops | Q2, Q3, Q7, Q9 |
| 3.5.A.5–6: accessors/mutators | 3.5.5 class interface builder; 3.5.8 full-class methods | Q4, Q6 |
| 3.5.A.7–8: parameters and primitive copies | 3.5.4 animated primitive copies; independent full-class tests | Q5, Q12 |
| 3.D: debugging / correction | 3.5.7 original/repaired case test runner | Q10 |
| 4.B: preconditions | 3.5.7 positive-cost contract and boundary cases | Q11 |

**Assessment:** twelve original graded questions, 100 points total, ten correct needed for at least 80%.

## Topic 3.6: Methods: Passing and Returning References of an Object

CED printed p. 87; LO 3.6.A, EK 3.6.A.1–3; skills 2.C and 4.A.

| CED essential knowledge | Interactive coverage | Graded check |
|---|---|---|
| 3.6.A.1 Reference arguments are copied, not their objects; mutable objects can be changed | 3.6.1 aliases and distinct objects; 3.6.2 mutation versus reassignment; 3.6.5 `transferTo` reference method with shared state | Q1–5, Q10 |
| 3.6.A.2 Returning an object reference does not clone the object | 3.6.3 returned references versus explicit `new`; 3.6.5 `chooseLowerLevel` must return one of its two arguments by identity | Q6–7, Q10 |
| 3.6.A.3 Same-class private-member access | 3.6.4 comparison across same and different classes; 3.6.5 access `other.capacity` and `other.liters` inside WaterTank | Q8–9 |

**Assessment:** ten original questions worth ten points each, eight correct required; answers are student-stable shuffled, the graded submission permits a teacher reset, and the post-check review hides the correct answer outside teacher preview. Practice requires completion of experiments, not merely opening pages. The class evaluator executes a documented Java subset and checks 18 independent state/identity cases; it does not compile arbitrary Java.


**v1.17 Topic 3.6.5 transfer task:** Students apply all three essential knowledge statements to a fresh WeatherStation class that was not provided earlier. The `calibrateOther` method mutates an object through a copied reference; `chooseColder` must return one of two existing references without allocating; `isWarmerThan` accesses another WeatherStation's private `temperature` field from inside the same class. Signed temperature inputs and a same-object calibration case prevent direct reuse of the older TicketWallet solution.

**Current v1.18 Topic 3.6.5:** Students write a completely new `WaterTank` class with private fields `capacity` and `liters`, plus a constructor, accessors, and methods for valid/invalid additions and transfers. `transferTo(other, amount)` modifies a supplied object through a copied reference and preserves both objects' state on invalid inputs (3.6.A.1). `chooseLowerLevel(first, second)` returns the existing object reference rather than a copy (3.6.A.2). `hasMoreRoomThan(other)` and transfer validation read the private fields of another `WaterTank` from inside the same class (3.6.A.3). The 18 tests also exercise boundary values, alias behavior, and observed return values. Previous WeatherStation text above is historical, not the current workshop.
