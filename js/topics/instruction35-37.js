// Read-only instruction for Topics 3.5–3.7. No new responses, progress keys,
// grading rules, or completion requirements are introduced by these panels.
// Java samples deliberately use different classes from the graded workshops.
const LESSONS = {
  '3.5': [
    {
      title: 'A method has a header and a body',
      intro: 'A <strong>method</strong> gives a name to a behavior. Other code calls it by name; Java executes the statements between its braces. Reading the header tells you whether the method can be called from another class, what value it returns, and what information it accepts.',
      points: [
        '<code>public</code> controls access. The <strong>return type</strong> comes next: <code>void</code> for no returned value, or a type such as <code>int</code> or <code>boolean</code>.',
        'The method name is followed by parentheses. Inside them, each parameter has a type and a name; empty parentheses mean no parameters.',
        'The body goes in braces. A non-<code>void</code> method must return a compatible value along every possible path.'
      ],
      exampleTitle: 'Worked example: read a method declaration',
      example: `public class ReadingLog {
    private int pages;

    public boolean hasReadPages() {
        return pages > 0;
    }
}`,
      takeaway: 'Here <code>public</code> is the modifier, <code>boolean</code> is the return type, <code>hasReadPages</code> is the name, <code>()</code> is an empty parameter list, and the body returns a true/false result. This is a method, not a constructor: it has a return type.',
      action: 'Explore all five parts of the <code>getScore</code> method, then build your understanding with the practice questions.'
    },
    {
      title: 'A void method can change the object',
      intro: 'An <strong>instance field</strong> belongs to an object and keeps its value between method calls. A <strong>mutator</strong> changes stored state. The word <code>void</code> means the method does not send a value back to the caller; it does not mean the method does nothing.',
      points: [
        'An instance method can read and assign its object’s private fields.',
        'A parameter, such as <code>amount</code>, supplies input for that particular call. The field retains the updated value after the method finishes.',
        'When deciding the result, identify which variable is on the left of the assignment: a field or just a local parameter.'
      ],
      exampleTitle: 'Worked example: mutating a field',
      example: `public class Lamp {
    private boolean on;

    public void turnOn() {
        on = true;
    }

    public boolean isOn() {
        return on;
    }
}`,
      takeaway: 'After <code>lamp.turnOn()</code>, the <code>on</code> field in that Lamp is <code>true</code>. The <code>turnOn</code> call itself returns no value; a later <code>lamp.isOn()</code> call returns <code>true</code>.',
      action: 'Choose each state-changing method, observe the field before and after the call, and explain why a <code>void</code> method can still have an effect.'
    },
    {
      title: 'Returning a value is different from printing one',
      intro: '<code>return</code> ends a method call and provides a value to the caller. <code>System.out.println</code> displays text in program output instead. Both are useful, but a printed number cannot automatically be used in an expression as a returned number.',
      points: [
        'A non-<code>void</code> method declares the type it returns and uses <code>return</code> with a compatible expression.',
        'An <strong>accessor</strong> typically returns a field value without modifying the field.',
        'The caller can store a returned value: <code>int n = object.getValue();</code>. Calling a printing method does not assign a result.'
      ],
      exampleTitle: 'Worked example: two different behaviors',
      example: `public class Thermometer {
    private int degrees;

    public int getDegrees() {
        return degrees;
    }

    public void displayDegrees() {
        System.out.println(degrees);
    }
}`,
      takeaway: '<code>int x = t.getDegrees();</code> is valid because the accessor returns an <code>int</code>. <code>t.displayDegrees()</code> prints a number, but it is <code>void</code> and cannot be assigned to an <code>int</code>.',
      action: 'Run all three experiments. For each one, look separately at “Returned value” and “Printed output.”'
    },
    {
      title: 'Primitive arguments are copied into parameters',
      intro: 'When a method is called with an <code>int</code>, <code>double</code>, or <code>boolean</code>, Java copies that primitive value into a new parameter variable. The caller’s variable and the parameter are not the same storage location.',
      points: [
        'Changing a primitive parameter changes only that method’s local variable.',
        'If the method also updates an instance field, the object can change even while the caller’s primitive argument stays the same.',
        'Trace the caller’s variable and the parameter separately. They may begin equal but end with different values.'
      ],
      exampleTitle: 'Worked example: a copied int',
      example: `public class NumberTools {
    public void addThree(int copy) {
        copy += 3;
    }

    public int tryIt() {
        int original = 8;
        addThree(original);
        return original;
    }
}`,
      takeaway: '<code>tryIt()</code> returns <code>8</code>, not <code>11</code>. The parameter <code>copy</code> becomes 11 inside <code>addThree</code>; the caller’s <code>original</code> is still 8 after that call.',
      action: 'Read the complete caller and method snippets in each experiment, then compare the starting value, the local parameter, and the caller afterward.'
    },
    {
      title: 'Accessors expose information; mutators change state',
      intro: 'Keeping fields <code>private</code> allows the class to control how its state is used. A public <strong>accessor</strong> provides information to other code. A public <strong>mutator</strong> changes fields. A true/false accessor is often called a <strong>predicate</strong>.',
      points: [
        'An accessor normally has a non-<code>void</code> return type and does not change the field it reads.',
        'A mutator often uses <code>void</code> because its purpose is to change state; it may accept parameters.',
        'A predicate returns <code>boolean</code> and answers a question about an object, such as whether a door is open.'
      ],
      exampleTitle: 'Worked example: public behaviors, private state',
      example: `public class Door {
    private boolean open;

    public boolean isOpen() {
        return open;
    }

    public void close() {
        open = false;
    }
}`,
      takeaway: '<code>isOpen()</code> is a boolean accessor (predicate); <code>close()</code> is a mutator. Other classes use these public methods instead of directly editing the private field.',
      action: 'Choose the correct getter, mutator, and predicate declarations. Watch the complete <code>PrizeCard</code> code change before running the checks.'
    },
    {
      title: 'A return statement stops the method immediately',
      intro: 'Java executes a method in order, following its conditionals and loops. As soon as a <code>return</code> statement executes, the entire method ends. That is true even when <code>return</code> appears inside an <code>if</code> statement or loop.',
      points: [
        'In a non-<code>void</code> method, <code>return expression;</code> gives the expression’s value to the caller.',
        'Statements later on the path are skipped after a return; a loop does not continue once the method has returned.',
        'A branch may return early while another path reaches a later return statement.'
      ],
      exampleTitle: 'Worked example: an early exit from a loop',
      example: `public int firstEven(int limit) {
    for (int n = 1; n <= limit; n++) {
        if (n % 2 == 0) {
            return n;
        }
    }
    return -1;
}`,
      takeaway: '<code>firstEven(5)</code> returns 2. The loop never reaches 3, 4, or 5 because <code>return n;</code> exits the method at 2. If the loop finds no even number, the final <code>return -1;</code> executes.',
      action: 'Step through each trace. Identify the exact return statement reached and which statements are skipped.'
    },
    {
      title: 'Preconditions tell you which inputs are allowed',
      intro: 'A <strong>precondition</strong> is a requirement that must be true before an operation is used as specified. It might be stated explicitly (a positive cost) or implied by the task (enough tickets to pay). Good debugging begins by translating requirements into test cases.',
      points: [
        'For a rule “a positive amount up to the available balance,” test zero, negative, just below the balance, exactly the balance, and just above it.',
        'A method can compile successfully and still return the wrong result because its condition is incomplete.',
        'Run the original implementation, identify failures, change the condition, and rerun the same cases to verify the repair.'
      ],
      exampleTitle: 'Worked example: derive tests from a requirement',
      example: `// Requirement: 1 to 5 seats can be reserved.
public boolean validGroup(int seats) {
    return seats >= 1 && seats <= 5;
}`,
      takeaway: 'Useful cases are 0 (invalid), 1 (valid boundary), 5 (valid boundary), and 6 (invalid). A normal case such as 3 is also important, but it is not enough to test only that case.',
      action: 'In the <code>canAfford</code> lab, identify both the positive-cost precondition and the sufficient-score condition. Run all original tests before attempting a repair.'
    },
    {
      title: 'Plan the class before you write the methods',
      intro: 'A class-design specification describes the state to store and the behaviors to expose. Before writing code, separate <strong>fields</strong> (values that persist between calls) from <strong>parameters and locals</strong> (values used during one call). Then work from construction through simple accessors toward more complicated operations.',
      points: [
        'Create the public class, declare its required private fields, and write a constructor that initializes each field.',
        'Implement accessors first; they make it easier to inspect whether constructors and mutators work.',
        'For each mutator, write the behavior rules as conditions before changing the state. Test normal, boundary, and invalid inputs.'
      ],
      exampleTitle: 'Planning example: an unrelated inventory item',
      example: `// InventoryItem design plan (not solution code):
// Fields: String label; int quantity;
// Constructor: store label and initial quantity
// Accessor: getQuantity() returns quantity
// Mutator: restock(int amount)
//   reject amount <= 0; otherwise increase quantity`,
      takeaway: 'This is a design plan rather than a completed class. Use the same sequence for <code>PrizeCard</code>, but make all of its own methods satisfy the provided specifications and automated tests.',
      action: 'Write the entire <code>PrizeCard</code> class in the editor. Keep the independent workshop specifications visible as you build and test it.'
    }
  ],
  '3.6': [
    {
      title: 'A reference variable points to an object',
      intro: 'For a class type such as <code>Player</code>, the variable holds a <strong>reference</strong> to an object, not an embedded copy of the object. Java allocates a new object when it evaluates <code>new</code>. Copying one reference into another variable does not construct a second object.',
      points: [
        '<code>Player b = a;</code> copies a reference. If <code>a</code> and <code>b</code> now refer to one mutable object, either variable can be used to call methods that change that same object.',
        '<code>Player b = new Player(...);</code> allocates a different object, even if its initial field values match another Player.',
        'Reassigning one reference variable changes where that variable points; it does not redirect every other alias.'
      ],
      exampleTitle: 'Read these two alternatives',
      example: `// Inside a method using the Player class:
Player first = new Player(20);
Player alias = first;            // same object
Player separate = new Player(20); // new object`,
      takeaway: 'Changing the Player through <code>alias</code> is visible through <code>first</code>, because both point to the same object. The <code>separate</code> Player starts with an equal score but has a different identity.',
      action: 'Predict whether each Player example creates a new object, then trace the arrows before answering the practice questions.'
    },
    {
      title: 'Java copies reference values into parameters too',
      intro: 'When you pass an object argument to a method, Java copies the <strong>reference value</strong> into the parameter. The object itself is not copied. During the call, the parameter and caller’s variable may point to the same mutable object.',
      points: [
        '<strong>Mutation:</strong> a method can call a mutator through its parameter and change the original object that both references point to.',
        '<strong>Reassignment:</strong> assigning a different object reference to the parameter changes only that local parameter. The caller’s reference stays unchanged.',
        'If a method mutates the old object and then redirects its parameter, the earlier mutation remains on the old object.'
      ],
      exampleTitle: 'Worked comparison: mutate versus redirect',
      example: `public class Box {
    private int value;

    public Box(int n) { value = n; }
    public void setValue(int n) { value = n; }

    public void mutate(Box b) {
        b.setValue(9);      // changes b's object
    }
    public void redirect(Box b) {
        b = new Box(99);   // only local b changes
    }
}`,
      takeaway: 'If the caller has <code>Box original = new Box(2);</code>, then calling <code>original.mutate(original)</code> changes its value to 9. Calling <code>original.redirect(original)</code> afterward does not redirect the caller’s variable.',
      action: 'In every experiment, ask separately: “Did the method change an object’s field, or did it only change which object the parameter references?”'
    },
    {
      title: 'Returning a reference does not automatically copy an object',
      intro: 'A method with a class return type can return an existing object reference. The caller receives the same reference value, so later changes through that returned reference affect the same object. Only an explicit object-creation operation such as <code>new</code> creates a different object.',
      points: [
        '<code>return selected;</code> sends back the reference already stored in <code>selected</code>.',
        '<code>return new Card(...);</code> first creates a different object and returns a reference to it.',
        'To determine whether references are identical, trace the object identity, not just equal field values.'
      ],
      exampleTitle: 'Worked example: choose an existing object',
      example: `public class Medal {
    private int points;

    public Medal(int n) { points = n; }
    public Medal echo(Medal selected) {
        return selected;   // no new Medal here
    }
}`,
      takeaway: 'If <code>b = a.echo(a)</code>, both <code>a</code> and <code>b</code> reference the same Medal. If the method instead returned <code>new Medal(...)</code>, its returned reference would point to a new object.',
      action: 'Trace both “existing reference” and “new object” experiments. After the returned variable changes a field, inspect which original variable observes that change.'
    },
    {
      title: 'Private access is based on the enclosing class',
      intro: '<code>private</code> means code outside the declaring class cannot directly access that member. It does <strong>not</strong> mean one object of a class is forbidden to inspect the private fields of another object of the same class. The key question is where the method’s code is written.',
      points: [
        'A method declared inside <code>Badge</code> can read a private field on a parameter of type <code>Badge</code>. Both objects are instances of the same declaring class.',
        'A method in an unrelated class cannot access that private field directly, even if it holds a reference to a Badge.',
        'Code in another class should use an appropriate public accessor or method.'
      ],
      exampleTitle: 'Worked example: same-class private access',
      example: `public class Badge {
    private int id;

    public Badge(int initialId) { id = initialId; }
    public int getId() { return id; }
    public boolean matches(Badge other) {
        return id == other.id; // legal here
    }
}`,
      takeaway: '<code>other.id</code> is legal inside <code>Badge.matches</code>. An unrelated class cannot write <code>someBadge.id</code> when <code>id</code> is private; it can call <code>someBadge.getId()</code>. Look at the expanded class definitions before the access checks.',
      action: 'For each scenario, identify the enclosing class first, then identify the referenced object’s class before choosing whether the access compiles.'
    },
    {
      title: 'Plan reference methods around identity and valid state',
      intro: 'Methods that receive objects must honor both the reference relationship and the class’s behavior rules. In the independent project, valid operations may change <strong>two existing objects</strong>. Invalid operations must leave both unchanged, and a method asked to select an object must return an existing reference rather than an invented copy.',
      points: [
        'Identify the state belonging to each object, especially the source and destination of an operation.',
        'Check <strong>all</strong> conditions before changing either object. If a required condition fails, return the specified failure value and do not partially update state.',
        'For a method returning one of two references, return one of its parameters. Test equal-value cases as well as different values to verify identity and tie rules.'
      ],
      exampleTitle: 'Planning example: transfer between book bins',
      example: `// Before transferring 4 books from A to B:
// 1. Verify the number 4 is positive.
// 2. Verify A contains at least 4 books.
// 3. Verify B has space for 4 books.
// 4. Only then change BOTH existing bins.
// If any check fails, change neither bin.`,
      takeaway: 'Notice the order: validate first, mutate afterward. A reference parameter is an existing object, not a signal to construct a replacement. Apply the same reasoning to the new WaterTank class without copying this example as code.',
      action: 'Build WaterTank from the supplied specifications, run all behavior tests, and use the actual object-state diagnostics for failed cases.'
    }
  ],
  '3.7': [
    {
      title: 'Instance fields are separate; static fields are shared',
      intro: 'An <strong>instance variable</strong> belongs to one object, so different objects can hold different values. A <strong>class variable</strong> uses the keyword <code>static</code>; Java stores one shared copy for the class rather than a separate copy for each object.',
      points: [
        'Each constructed object gets its own instance fields.',
        'A <code>static</code> field is shared across all instances, including when constructors and instance methods update it.',
        'Creating a new object does not duplicate the class’s static field. A class-wide counter can therefore record how many objects were constructed.'
      ],
      exampleTitle: 'Worked example: a shared badge count',
      example: `public class VisitorBadge {
    private int visits;
    private static int badgesCreated;

    public VisitorBadge() {
        badgesCreated++;
    }

    public void recordVisit() {
        visits++;
    }
}`,
      takeaway: 'After constructing two VisitorBadges, the shared <code>badgesCreated</code> is 2. If only the first badge calls <code>recordVisit()</code>, its <code>visits</code> becomes 1 while the second badge’s visits stays 0. The two objects do not get separate copies of <code>badgesCreated</code>.',
      action: 'Predict the class counter before creating each Player, then modify one Player’s score. Compare class-wide storage with each object’s independent storage.'
    },
    {
      title: 'Use the class name when accessing public static data',
      intro: 'A public static field can be read or assigned with <code>ClassName.fieldName</code> from another class. The expression names the class because the data belongs to the class. This differs from an instance field, which requires a particular object.',
      points: [
        'Declaration: <code>public static int eventsHeld;</code> declares a class-wide integer field.',
        'Read: <code>Festival.eventsHeld</code> reads the shared value. Assignment: <code>Festival.eventsHeld = 3;</code> updates it.',
        'Access rules still apply: another class cannot directly access a <code>private static</code> field merely because it is static.'
      ],
      exampleTitle: 'Worked example: class-qualified access',
      example: `public class Festival {
    public static int eventsHeld;

    public void update() {
        Festival.eventsHeld = 3;
        int count = Festival.eventsHeld;
    }
}`,
      takeaway: 'The same <code>Festival.eventsHeld</code> value is used for the whole class. Writing <code>someObject.eventsHeld</code> can compile for a static field, but the class-qualified form is clearer and is the form to practice.',
      action: 'For each code-building case, distinguish a static declaration, a class-qualified read, and a class-qualified assignment. Inspect the inserted Java statement before checking it.'
    },
    {
      title: 'A static method has no current object',
      intro: 'An instance method is called for a particular object, so it can use that object’s fields directly. A <strong>static method</strong> belongs to the class and is not called for a particular instance. It can access static fields and other static methods directly, but it needs a reference to access an object’s instance state.',
      points: [
        'Inside a static method, using an instance field like <code>value</code> with no object reference is a compile-time error.',
        'A static method can use its class’s static field directly and call another static method directly.',
        'If it receives an object parameter, it can use <code>someObject.value</code> when Java access rules permit that field.'
      ],
      exampleTitle: 'Worked example: direct versus reference-based access',
      example: `public class Register {
    private int items;
    private static int allItems;

    public static int total() {
        return allItems; // class field: legal
    }
    public static int inspect(Register r) {
        return r.items;  // object reference: legal
    }
    // return items; in a static method would fail.
}`,
      takeaway: 'The object parameter <code>r</code> tells Java which Register’s <code>items</code> to read. Without that reference, a static method has no specific Register instance to inspect.',
      action: 'Inspect each complete class in the static-method lab. Before selecting “compiles,” ask whether every instance-field access has an actual object reference.'
    },
    {
      title: 'Static and final describe different things',
      intro: '<code>static</code> controls <em>ownership</em>: the field belongs to the class. <code>final</code> controls <em>reassignment</em>: after a final variable receives its value, it cannot be assigned a different value. Combining them creates a class-wide constant.',
      points: [
        '<code>static</code> alone does not stop a value from changing.',
        '<code>final</code> alone does not make a field shared by all objects; an instance can have its own final field.',
        '<code>public static final int LIMIT = 10;</code> defines one publicly accessible, non-reassignable integer constant. Uppercase names are a convention for constants.'
      ],
      exampleTitle: 'Worked example: shared count, final ID, shared limit',
      example: `public class EventRules {
    public static final int GROUP_LIMIT = 10;
    private static int registrations;
    private final int memberId;

    public EventRules(int id) {
        memberId = id;
        registrations++;
    }
    // GROUP_LIMIT = 12; would not compile.
}`,
      takeaway: '<code>registrations</code> is shared and can change; <code>memberId</code> belongs to an instance but cannot be reassigned after construction; <code>GROUP_LIMIT</code> is both shared and final.',
      action: 'Try all the compilation predictions. Explain each result using the separate meanings of <code>static</code> and <code>final</code>.'
    },
    {
      title: 'Plan a class with independent and shared state',
      intro: 'A class can track state for one object and a total shared across every object. The design challenge is deciding which value belongs where and which methods should operate on an instance versus the class. Plan each update before writing code.',
      points: [
        'Declare per-object fields without <code>static</code>; declare the common total with <code>static</code>. Use <code>static final</code> for a fixed shared limit.',
        'A successful operation can update both the object’s field and the shared total. An invalid operation must leave both unchanged.',
        'Static utility methods that need one object’s data should receive an object parameter. Check inputs and boundaries before updating anything.'
      ],
      exampleTitle: 'Planning example: concert booths',
      example: `// Design plan for ConcertBooth (not full code):
// Each booth tracks its own ticketsSold.
// All booths share a static totalTicketsSold.
// A public static final LIMIT controls group size.
// sell(groupSize): validate before updating both
// counts; a rejected sale changes neither.`,
      takeaway: 'For two booths that successfully sell 2 and 4 tickets, their instance counts are 2 and 4, and their class-wide total is 6. The same design decisions apply to TrailGate, but you must implement its own specifications.',
      action: 'Write TrailGate from scratch. Test the class with multiple objects, invalid group sizes, exact-capacity boundaries, and static utility calls.'
    }
  ]
};
const escapeHTML = value => String(value ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
export function renderLessonInstruction(topic, page) {
  const lesson = LESSONS[String(topic)]?.[Number(page)-1];
  if (!lesson) return '';
  return `<section class="panel topic-instruction" aria-label="Instruction before lesson activity">
    <p class="kicker">Learn the concept · before the experiment</p>
    <h2>${escapeHTML(lesson.title)}</h2>
    <p class="topic-instruction-intro">${lesson.intro}</p>
    <div class="topic-instruction-grid">
      <div class="topic-instruction-ideas"><h3>What you need to know</h3><ul>${lesson.points.map(x=>`<li>${x}</li>`).join('')}</ul></div>
      <div class="topic-instruction-example"><p class="kicker">${escapeHTML(lesson.exampleTitle)}</p><pre><code>${escapeHTML(lesson.example)}</code></pre></div>
    </div>
    <p class="topic-instruction-takeaway"><strong>Why the example works:</strong> ${lesson.takeaway}</p>
    <p class="topic-instruction-next"><strong>Your task in this lesson:</strong> ${lesson.action}</p>
  </section>`;
}
export const LESSON_INSTRUCTION_COUNTS = Object.freeze(Object.fromEntries(Object.entries(LESSONS).map(([topic,lessons])=>[topic,lessons.length])));
