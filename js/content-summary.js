// Unit 3 cumulative review. Required unlimited-retry practice, NOT an assessment.
// Answers are stored by question ID so future text edits do not invalidate work.
export const SUMMARY_PARTS=[
 {title:'Designing Classes',topics:'3.1–3.3',sections:[
 ['Abstraction and class design','Abstraction means focusing on the essential features of an entity. Instance variables describe one object; class variables describe data shared by a class. Choose attributes that belong to the entity and methods that express its behaviors.'],
 ['Encapsulation and access','Instance variables are usually private so methods control valid changes. A public class and public constructors can be used by other classes, while private members are accessible only inside their declaring class (including other instances of that class).'],
 ['Reliable and responsible design','A reliable program behaves as expected under stated conditions. Test normal, boundary and invalid cases; consider unintended social effects, legal code reuse, and intellectual property.']
 ],code:`public class LibraryBook {
    private int pagesRead;

    public LibraryBook() { pagesRead = 0; }

    public void read(int pages) {
        if (pages > 0) pagesRead += pages;
    }

    public int getPagesRead() { return pagesRead; }
}

// Caller: LibraryBook b = new LibraryBook();
//         b.read(10);
//         System.out.println(b.getPagesRead()); // 10`,
 questions:[
 ['What is abstraction in class design?',['Including all implementation details in every caller','Focusing on essential attributes and behaviors','Replacing methods with public instance variables','Copying every variable'],1,'Think about reducing complexity by separating essential details.'],
 ['A Student object stores a unique name. What should name normally be?',['A class variable','A parameter of every unrelated method','An instance variable','A method return type'],2,'Each individual Student needs its own value.'],
 ['Why keep an account balance private?',['So no method can ever read it','To ensure only approved operations change it','Because Java automatically copies it','To make it a constant'],1,'Encapsulation limits outside access to internal representation.'],
 ['Which class component defines behavior?',['A method','An instance variable','A constructor parameter by itself','The class filename'],0,'Methods describe actions that objects can perform.'],
 ['What is an example of boundary testing for an allowed age range 13–18?',['Only age 15','Age 0 only','A random password','Try ages 13 and 18'],3,'Boundary tests target values at the edges of the allowed range.'],
 ['A publicly visible source file is always free to reuse without permission.',['True; all online code is public domain','False; check license and permissions','True, but only with a variable renamed','False only when it includes Java'],1,'Accessibility is not the same as permission to reuse.'],
 ['After creating a LibraryBook and calling read(10), which method reads its state without changing it?',['LibraryBook()','read(10)','getPagesRead()','private int pagesRead'],2,'An accessor returns information without mutating it.']
 ]},
 {title:'Creating and Using Objects',topics:'3.4',sections:[
 ['Constructors initialize state','The keyword new allocates a new object and calls a constructor to initialize its instance variables. A constructor has the same name as its class and no return type. Constructor parameters provide values to initialize object state.'],
 ['Defaults and overloaded constructors','If no constructor is declared, Java supplies a no-argument default constructor. Declaring any constructor prevents that automatic default constructor. Instance variables default to 0, 0.0, false, or null according to type.'],
 ['Defensive copying','When an incoming reference points to a mutable object, storing it directly may permit surprising changes from outside the class. Construct a separate copy when the specification requires isolation. Assigning a reference does not copy the object.']
 ],code:`public class CounterBox {
    private int count;

    public CounterBox(int start) {
        count = start;
    }

    public int getCount() { return count; }
}

// Caller: CounterBox first = new CounterBox(4);
//         CounterBox second = new CounterBox(4);
// These are two distinct objects with independent count instance variables.`,
 questions:[
 ['What happens when new CounterBox(4) executes?',['An object is allocated and initialized','A static method is called only','The class is copied to a new file','Nothing until println'],0,'The new operator creates an object and invokes its constructor.'],
 ['Which is a legal constructor declaration inside class CounterBox?',['public void CounterBox(int start)','public int CounterBox(int start)','public CounterBox(int start)','private class CounterBox(int start)'],2,'A constructor has the class name but no return type.'],
 ['What is the default value of an uninitialized boolean instance variable?',['true','false','null','1'],1,'Java assigns false to boolean instance variables when not explicitly initialized.'],
 ['A class declares only public Box(int size). Can new Box() compile automatically?',['Yes, always','Only if size is zero','Yes, if size is an int','No, because declaring a constructor suppresses the implicit no-argument constructor'],3,'The compiler-supplied no-argument constructor appears only when no constructors are declared.'],
 ['Two separate new CounterBox(4) expressions create what?',['Two references to one object','Two independent objects','One class variable','Two aliases for the same object'],1,'Every new expression allocates a distinct object.'],
 ['Why create a defensive copy of a mutable input?',['To avoid sharing a mutable object unexpectedly','To increase every static counter','To convert a primitive parameter to an instance variable','To make methods static'],0,'Copying can protect internal state from outside mutations.'],
 ['Which assignment alone does NOT create a second object?',['CounterBox b = new CounterBox(8);','CounterBox b = new CounterBox(0);','CounterBox b = a;','new CounterBox(4);'],2,'Assigning one reference variable to another copies the reference.']
 ]},
 {title:'Methods and References',topics:'3.5–3.6',sections:[
 ['Parameters and results','An argument initializes a parameter when a method is called. Primitive parameters receive copies of primitive values. Non-void methods return a value to the caller; println only displays text. return immediately exits the method.'],
 ['Accessors, mutators, predicates, preconditions','Accessors return information; mutators change state; boolean predicates answer true/false questions. A precondition states what must already be true for the method to behave as specified.'],
 ['Reference identity and mutation','Object reference arguments copy the reference value, not the object. Using that reference may change the existing object. Reassigning the parameter changes only the local reference. Returning a reference normally returns the existing object, not a clone.']
 ],code:`public class Wallet {
    private int tickets;
    public Wallet(int start) { tickets = start; }
    public void addTickets(int amount) { tickets += amount; }
    public int getTickets() { return tickets; }
}

// Caller:
// Wallet w = new Wallet(5);
// Wallet alias = w;
// alias.addTickets(3);
// int result = w.getTickets(); // 8; same object`,
 questions:[
 ['What does void mean in a method header?',['The method is private','The method does not return a value','The method is static','The method always prints'],1,'A void method performs actions without returning a result.'],
 ['Which statement returns a value to a caller?',['System.out.println(score);','score += 1;','return score;','int score = 5;'],2,'Printing and returning are different operations.'],
 ['After int x=5; change(x); where change(int a) sets a=9, what is x?',['5','9','0','Undefined'],0,'A primitive parameter receives a copy; reassigning it does not change the caller variable.'],
 ['Which method is an accessor?',['void reset() changing instance variables','int getCount() returning an instance variable','boolean spend(int amount) subtracting tickets','A constructor'],1,'An accessor obtains a value without changing object state.'],
 ['What does return do inside an if block in a method?',['Leaves only the if','Skips one iteration','Continues with the next line','Exits the entire method'],3,'return transfers control back to the caller immediately.'],
 ['If Wallet alias = w, what does alias.addTickets(3) change?',['A new Wallet copy','The same Wallet object referenced by w','Only the alias variable name','A class-wide class variable'],1,'Both variables refer to the same object.'],
 ['A method reassigns its object-reference parameter to new Wallet(0). What happens to the caller reference?',['It now refers to the new Wallet','It becomes null','It is unchanged; only the local parameter is reassigned','The original Wallet is deleted'],2,'Java passes copies of reference values, not caller variable locations.']
 ]},
 {title:'Static, Scope, and this',topics:'3.7–3.9',sections:[
 ['Class variables and methods','Class variables belong to the class and are shared across instances. Static methods have no receiving object and cannot directly access instance variables. public static values may be accessed as ClassName.variableName. final prevents reassignment.'],
 ['Variable scope and shadowing','Local variables exist within the block where declared. Method and constructor parameters have local scope. A closer local declaration or parameter shadows an instance variable with the same name.'],
 ['The meaning of this','Inside a constructor or instance method, this refers to the current receiving object. this.score distinguishes an instance variable from a shadowing parameter. this may be passed as a reference to another method. Static methods have no this reference.']
 ],code:`public class GamePlayer {
    private int score;
    private static int created;

    public GamePlayer(int score) {
        this.score = score;
        created++;
    }

    public int getScore() { return this.score; }
    public static int getCreated() { return created; }
}

// Caller:
// GamePlayer p = new GamePlayer(6);
// GamePlayer q = new GamePlayer(9);
// p.getScore() == 6; GamePlayer.getCreated() == 2`,
 questions:[
 ['What does the static modifier on a variable declared in a class mean?',['Each object gets a different copy','The variable is shared by the class','The variable cannot be reassigned','The variable is a parameter'],1,'Class variables belong to the class, not individual instances.'],
 ['What does final mean for an initialized variable?',['Its value cannot be reassigned','It belongs to the class','It can be used only in constructors','It cannot be read'],0,'Final restricts reassignment, not ownership.'],
 ['A local variable declared inside an if block can be used afterward outside that block.',['Yes, always','Only if private','No, it is out of scope','Only when its value is positive'],2,'Block-local variables are visible only within the block where they are declared.'],
 ['Inside Player(int score), what does bare score refer to?',['The class variable','The local parameter','A static method','The current object'],1,'The constructor parameter shadows the instance variable.'],
 ['Which assignment correctly updates the instance variable with the parameter?',['score = score;','Player.score = score;','this = score;','this.score = score;'],3,'this.score refers to the instance variable belonging to the current object.'],
 ['Inside an instance method, passing this to another method does what?',['Creates a new instance','Copies the current object reference value as an argument','Removes the old object','Calls the default constructor'],1,'The receiving method gets a reference to the same existing object.'],
 ['Which statement about this in a static method is correct?',['this is the newest instance','this always refers to the class','No this reference exists in a static method','this refers to the first instance'],2,'A class method has no receiving object.']
 ]}
];
// Explanations appear only after a correct response. Hints remain separate for retries.
const SUMMARY_EXPLANATIONS = [
 'Abstraction keeps a class focused on what clients need to know and do, while hiding the implementation. A LibraryBook needs operations such as read and getPagesRead; callers should not need to know how pagesRead is stored.',
 "A name identifies one particular Student, so it belongs to that object's state. Making it static would force all Student objects to share one name; a method parameter would exist only for a particular call.",
 "A private balance prevents outside code from assigning arbitrary amounts. Public methods such as deposit and withdraw can validate an amount before changing the instance variable, preserving the account's rules.",
 'Methods implement behavior: read(10) updates the book, while getPagesRead() reports its state. Instance variables such as pagesRead store information; a constructor initializes a new object rather than representing a regular action.',
 'The smallest and largest permitted values are boundaries where comparison mistakes often appear. Testing 13 and 18 checks that both endpoints are accepted; also try 12 and 19 to ensure values just outside the range are rejected.',
 'Being able to view source code does not grant permission to copy, modify, or redistribute it. A license or explicit permission specifies the permitted uses; if neither exists, do not assume public-domain status.',
 "getPagesRead() is an accessor: it returns the instance variable's current value without changing it. In contrast, read(10) is a mutator that changes pagesRead, and LibraryBook() is the constructor that initializes a new book.",
 "new allocates a distinct CounterBox object, and CounterBox(4) runs its constructor to set that object's count to 4. The constructor executes during object creation, not later when the value is printed.",
 "A constructor's name must match its class exactly and it has no return type, not even void. Adding void or int makes the declaration a method rather than a constructor.",
 'Java automatically initializes boolean instance variables to false before constructor code runs. This default applies to instance variables, not uninitialized local variables, which must be assigned before they are read.',
 'Java generates a no-argument constructor only if the class declares no constructors at all. Since Box(int size) is declared, new Box() has no matching constructor unless the programmer explicitly adds Box().',
 "Each evaluation of new allocates a fresh object, even when both constructor arguments are 4. The two CounterBox instances begin with equal counts, but changing one object's instance variable will not change the other's.",
 "Without a defensive copy, storing a mutable input reference may let outside code change the object's internal state later. Creating an independent copy breaks that alias, provided the copy also handles any mutable nested state that must be isolated.",
 'CounterBox b = a assigns the same reference value to b; it does not invoke a constructor. Both variables now refer to one object, so a mutation through b is visible through a.',
 "void states that a method does not return a value the caller can assign or use in an expression. A void method may still print information or change an object's state; printing is not the same as returning.",
 "return score; sends the value of score back to the calling expression and ends the method. System.out.println(score) merely writes characters to the console, so the caller cannot store that printed output as the method's return value.",
 "Java passes the primitive value 5 into a new local parameter a. Changing a to 9 changes only that copy, so the caller's x remains 5; the method would need to return a value that the caller assigns to x to update x.",
 "getCount() is an accessor because it reads and returns an object's count without changing its state. A reset or spend method modifies instance variables and is a mutator, even if it also returns a value.",
 'A return statement immediately ends the entire method, regardless of whether it occurs inside an if block or loop. Any statements after that return on the executed path are skipped, and control resumes at the caller.',
 'The assignment alias = w copies the reference, making both variables point to one Wallet. Calling addTickets(3) through alias therefore changes the tickets stored in the object that w also references.',
 "Object parameters receive copies of references. Reassigning the parameter to new Wallet(0) changes only that local copy; the caller's reference still points to the original Wallet, although mutations through the parameter before reassignment could affect it.",
 'static associates one variable with the GamePlayer class, not with each GamePlayer object. When constructors increment created, all instances contribute to the same counter; ordinary instance variables such as score remain separate.',
 'final prohibits assigning a new value to that variable after its permitted initialization. It does not automatically make the variable static or shared; static and final describe different properties.',
 "A variable declared between an if block's braces is scoped to that block. After the closing brace it is no longer accessible by name; declare it in the enclosing block first if later code needs to use it.",
 'In Player(int score), the parameter named score shadows any instance field of the same name. An unqualified score refers to that parameter; this.score identifies the instance variable of the object being constructed.',
 "this.score selects the current object's instance field, while the unqualified score on the right refers to the constructor parameter. Writing score = score; would assign the parameter to itself and leave the instance variable unchanged.",
 "this is a reference to the object receiving the current instance-method call. Passing it copies that reference into the other method's parameter; no new object is created, so the receiving method can interact with the original object.",
 'A static method belongs to the class and is called without a particular receiving object. Because this means "the current receiving object," there is no this reference in a static context; an object must be supplied explicitly to access its instance state.',
];
// Enrich questions with stable IDs; no grading metadata or test answers are shown until practice feedback.
for(let i=0;i<SUMMARY_PARTS.length;i++)SUMMARY_PARTS[i].questions=SUMMARY_PARTS[i].questions.map((q,j)=>({id:`r${i+1}-${j+1}`,prompt:q[0],options:q[1],answer:q[2],hint:q[3],explanation:SUMMARY_EXPLANATIONS[i*7+j]}));
export const REVIEW_QUESTION_COUNT=SUMMARY_PARTS.reduce((s,p)=>s+p.questions.length,0);
