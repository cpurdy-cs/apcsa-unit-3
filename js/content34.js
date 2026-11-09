// Original Topic 3.4 curriculum. 2025 College Board AP CSA CED pp. 84, LO 3.4.A.
// Keep published question IDs and meanings stable; reports retain question snapshots.
export const PAGE34=[
 {title:'The Object Factory',subtitle:'Step through allocation, initialization, and storing a reference',minutes:13,ek:'3.4.A.1, 3.4.A.2'},
 {title:'The Default Constructor Mystery',subtitle:'Investigate automatic field values and when Java supplies a constructor',minutes:15,ek:'3.4.A.4, 3.4.A.5'},
 {title:'Multiple Objects, Different States',subtitle:'Choose assignments, run three objects, and see why their starting states differ',minutes:16,ek:'3.4.A.1, 3.4.A.2'},
 {title:'Constructor Workshop',subtitle:'Write and test three complete Java constructors, including their headers',minutes:27,ek:'3.4.A.1, 3.4.A.2'},
 {title:'The Defensive Copy Experiment',subtitle:'Compare shared mutable objects against an independent copy',minutes:20,ek:'3.4.A.3'}
];
export const FACTORY_CALLS=[
 {id:'a',variable:'p1',name:'Alex',score:10},
 {id:'b',variable:'p2',name:'Riley',score:35},
 {id:'c',variable:'p3',name:'Jordan',score:5}
];
export const FACTORY_PRACTICE=[
 {id:'f1',prompt:'What is the purpose of `new Player("Alex", 10)`?',options:['It assigns values to every Player that already exists','It creates a new Player object and runs its constructor','It changes the Player class into a variable','It changes the name of an existing Player object'],answer:1,hint:'A constructor runs when a new object is created.'},
 {id:'f2',prompt:'What is stored in variable `p1` after `Player p1 = new Player("Alex", 10);`?',options:['A copy of the Player class source code','The number 10','A reference to the newly created Player object','The String "Alex" only'],answer:2,hint:'The variable has type Player, a reference type.'},
 {id:'f3',prompt:'Which statement describes an object’s state?',options:['Its current instance-variable values','Only the public methods declared in its class','The number of classes in the entire program','Only the number of times a constructor was called'],answer:0,hint:'Object state is defined by its attributes and their values.'}
];
export const DEFAULT_FIELDS=[
 {id:'credits',name:'credits',type:'int',answer:'0'},
 {id:'multiplier',name:'multiplier',type:'double',answer:'0.0'},
 {id:'active',name:'active',type:'boolean',answer:'false'},
 {id:'playerName',name:'playerName',type:'String',answer:'null'}
];
export const DEFAULT_SCENARIOS=[
 {id:'implicit',label:'No constructor declared',code:'public class ArcadeMachine {\n    private int credits;\n    private double multiplier;\n    private boolean active;\n    private String playerName;\n}',call:'ArcadeMachine m = new ArcadeMachine();',compiles:true,note:'Since no constructor is declared, Java supplies an implicit no-argument default constructor. Instance fields receive default values.'},
 {id:'parameter',label:'Only a parameterized constructor',code:'public class ArcadeMachine {\n    private int credits;\n\n    public ArcadeMachine(int initialCredits) {\n        credits = initialCredits;\n    }\n}',call:'ArcadeMachine m = new ArcadeMachine();',compiles:false,note:'Once a constructor is explicitly declared, Java does not generate the implicit no-argument constructor. This call has the wrong argument count.'},
 {id:'explicit',label:'A written no-argument constructor',code:'public class ArcadeMachine {\n    private int credits;\n\n    public ArcadeMachine() {\n        credits = 5;\n    }\n}',call:'ArcadeMachine m = new ArcadeMachine();',compiles:true,note:'A programmer-written no-argument constructor is valid. This is not the automatically supplied default constructor; credits becomes 5.'}
];
export const DEFAULT_PRACTICE=[
 {id:'d1',prompt:'If a class has no constructor declarations, what happens when code calls `new Example()`?',options:['Java supplies a no-argument constructor','A compiler error always occurs','The object exists but has no instance variables','Java runs a method named main instead'],answer:0,hint:'The default constructor is supplied only when no constructors were declared.'},
 {id:'d2',prompt:'Why does `new ArcadeMachine()` fail if the only constructor is `ArcadeMachine(int credits)`?',options:['The class must have a String variable','Every new expression must have two arguments','The compiler needs an int argument; Java did not supply a no-argument constructor','The instance variable credits is private'],answer:2,hint:'An explicit constructor removes the implicit no-argument default constructor.'},
 {id:'d3',prompt:'Which statement is correct about an implicit default constructor and a written no-argument constructor?',options:['They are always both generated automatically','Both must set each field to 100','A written no-argument constructor always returns an int','The default is supplied by Java only when none is declared; a written no-argument constructor is explicit'],answer:3,hint:'The existence of any declared constructor is the crucial distinction.'}
];
export const WORKSHOP_TESTS=[
 {name:'First customer',owner:'Taylor',tickets:12},
 {name:'Zero tickets',owner:'Morgan',tickets:0},
 {name:'Different arguments',owner:'Sam',tickets:73},
 {name:'Larger balance',owner:'Jamie',tickets:250}
];
// Full-constructor exercises. The evaluator accepts declarations and field assignments,
// but is not a general-purpose Java compiler. Testing uses multiple sets of arguments.
export const CONSTRUCTOR_CHALLENGES=[
 {id:'prize',className:'PrizeCard',subtitle:'Initialize a String and an int',fields:[['String','owner'],['int','tickets']],paramTypes:['String','int'],paramHints:'String newOwner, int initialTickets',tests:WORKSHOP_TESTS.map(t=>({name:t.name,args:[t.owner,t.tickets]})),description:'Write a public PrizeCard constructor that takes a String owner and an int starting ticket balance. Initialize both fields using the arguments.'},
 {id:'machine',className:'ArcadeMachine',subtitle:'Initialize three different types',fields:[['String','title'],['double','multiplier'],['boolean','active']],paramTypes:['String','double','boolean'],paramHints:'String machineTitle, double startingMultiplier, boolean isActive',tests:[{name:'First machine',args:['Galaxy Run',1.5,true]},{name:'Disabled cabinet',args:['Asteroid Rescue',0.0,false]},{name:'Different values',args:['Maze Race',2.25,true]},{name:'Negative multiplier',args:['Test Cabinet',-0.5,false]}],description:'Write a public ArcadeMachine constructor with String, double, and boolean parameters. Initialize title, multiplier, and active.'},
 {id:'player',className:'Player',subtitle:'Initialize one String and two ints',fields:[['String','name'],['int','score'],['int','lives']],paramTypes:['String','int','int'],paramHints:'String playerName, int startingScore, int startingLives',tests:[{name:'First player',args:['Alex',10,3]},{name:'Second player',args:['Blair',25,1]},{name:'Zero score',args:['Casey',0,2]},{name:'Different states',args:['Drew',100,5]}],description:'Write a public Player constructor taking String, int, and int parameters. Initialize name, score, and lives.'}
];
export const WORKSHOP_PRACTICE=[
 {id:'w1',prompt:'Why is `public void PrizeCard(String name, int count)` not a constructor?',options:['It uses parameters','It has a return type (`void`), so it is a method','It is declared public','It uses a String'],answer:1,hint:'Constructors have the exact class name and no return type, not even void.'},
 {id:'w2',prompt:'Why should a constructor initialize all of the object’s attributes?',options:['To establish a useful initial object state','To make every instance variable static','To make each field accessible from another class','To prevent `new` from allocating memory'],answer:0,hint:'A constructor establishes the starting values of the new object.'}
];
export const MULTI_CARDS=[
 {id:'a',variable:'a',name:'Alex',score:10,lives:3},
 {id:'b',variable:'b',name:'Blair',score:25,lives:1},
 {id:'c',variable:'c',name:'Casey',score:40,lives:2}
];
export const MULTI_SLOTS=[
 {id:'score',label:'Initialize score',choices:[
  {id:'zero',text:'score = 0;'},
  {id:'correct',text:'score = startingScore;'},
  {id:'wrong',text:'startingScore = score;'},
  {id:'other',text:'score = startingLives;'}
 ]},
 {id:'lives',label:'Initialize lives',choices:[
  {id:'fixed',text:'lives = 3;'},
  {id:'wrong',text:'startingLives = lives;'},
  {id:'correct',text:'lives = startingLives;'},
  {id:'other',text:'lives = startingScore;'}
 ]}
];
export const MULTI_PRACTICE=[
 {id:'m1',prompt:'If `a` was created with score 10 and `b` with score 25, what is `a`’s score after `b` is constructed?',options:['25','35','10','0'],answer:2,hint:'Constructing a different object does not overwrite the first object’s fields.'},
 {id:'m2',prompt:'Why is `lives = 3;` an incorrect implementation when the constructor should use `startingLives`?',options:['It ignores the argument, so every object starts with three lives','It copies a reference instead of a value','It makes lives into a class variable','It is not valid Java syntax'],answer:0,hint:'The requirement says to use the value supplied to the constructor.'},
 {id:'m3',prompt:'Which statement is true about the values initialized by a constructor?',options:['All objects of a class always get the same field values','Creating one object changes every other object automatically','A constructor must return the new object with a return statement','Each construction call can initialize a different object using different arguments'],answer:3,hint:'The argument values vary by construction call; instance variables belong to the new object.'}
];
export const COPY_IMPLEMENTATIONS=[
 {id:'alias',label:'Store the incoming reference',line:'balance = incomingBalance;',safe:false},
 {id:'local',label:'Rename the reference first',line:'TicketBalance temp = incomingBalance;\n        balance = temp;',safe:false},
 {id:'copy',label:'Create a new TicketBalance',line:'balance = new TicketBalance(incomingBalance.getTickets());',safe:true}
];
export const COPY_PRACTICE=[
 {id:'c1',prompt:'Why can `balance = incomingBalance;` be risky inside a constructor?',options:['It creates too many copies','It makes the constructor return void','Both references may point to one mutable object, so outside changes can affect internal state','Java does not allow reference-type fields'],answer:2,hint:'Assigning an object reference does not automatically copy the object.'},
 {id:'c2',prompt:'Which constructor statement produces a separate mutable balance with the same initial tickets?',options:['balance = incomingBalance;','balance = new TicketBalance(incomingBalance.getTickets());','incomingBalance = balance;','balance = null;'],answer:1,hint:'Creating a new TicketBalance allocates another object.'},
 {id:'c3',prompt:'After defensive copying, code increases the original balance by 30 tickets. What happens to the PrizeCard’s stored balance?',options:['Its value increases by 30','Both balances become null','The stored balance doubles','It remains unchanged because it is a different object'],answer:3,hint:'The constructor’s copy has its own state.'}
];
export const QUESTIONS34=[
 {id:'u34q1',kind:'choice',area:'Object state',objective:'3.4.A.1',prompt:'A `Player` object has private fields `name` and `score`. Which description best defines its state?',options:['The number of methods in Player','The current name and score stored in that object','The Java source file name','The constructor parameter names only'],answer:1,explanation:'An object’s state consists of its attributes and their current values.'},
 {id:'u34q2',kind:'choice',area:'Constructor execution',objective:'3.4.A.2',prompt:'What occurs when `Player p = new Player("Lee", 20);` is executed?',options:['Only a reference variable is declared, but no object exists','All existing Players receive the values Lee and 20','The Player constructor returns an int to p','Memory is allocated for a new Player, its constructor initializes it, and p stores the reference'],answer:3,explanation:'A new object is allocated and initialized, and an object reference is returned to the caller.'},
 {id:'u34q3',kind:'choice',area:'Implicit constructor',objective:'3.4.A.4',prompt:'Which class gets an implicit no-argument constructor from Java?',options:['A class with no constructor declarations','A class with only `public Record(int id)`','A class with a programmer-written `public Record()`','A class with a constructor declared private'],answer:0,explanation:'Java provides a no-argument default constructor only when no constructor is explicitly declared.'},
 {id:'u34q4',kind:'category',area:'Default field values',objective:'3.4.A.5',prompt:'Match each uninitialized instance variable type to its Java default value.',items:[['int','0'],['double','0.0'],['boolean','false'],['String','null'],['ArcadeMachine','null']],categories:['0','0.0','false','null'],explanation:'Instance fields receive type-specific defaults; reference fields default to null.'},
 {id:'u34q5',kind:'choice',area:'Constructor availability',objective:'3.4.A.4',prompt:'A class contains only `public Badge(String owner) { }`. What happens when client code executes `new Badge()`?',options:['It compiles using an implicit no-argument constructor','It fails to compile because a String argument is required','It compiles and owner automatically becomes an empty String','It invokes Badge with an int parameter'],answer:1,explanation:'Declaring a parameterized constructor prevents Java from supplying a default no-argument constructor.'},
 {id:'u34q6',kind:'choice',area:'Writing constructors',objective:'3.4.A.2',prompt:'Inside `PrizeCard(String newOwner, int initialTickets)`, which pair of assignments initializes private fields owner and tickets correctly?',options:['newOwner = owner; initialTickets = tickets;','owner = tickets; tickets = newOwner;','owner = newOwner; tickets = initialTickets;','owner = null; tickets = 0;'],answer:2,explanation:'The constructor must copy argument values into the corresponding instance fields.'},
 {id:'u34q7',kind:'category',area:'Tracing object creation',objective:'3.4.A.1, 3.4.A.2',prompt:'The constructor assigns `score = start;`. Match the code to each resulting object’s score.',items:[['Player a = new Player(7);','7'],['Player b = new Player(19);','19'],['Player c = new Player(0);','0']],categories:['0','7','19'],explanation:'Each invocation initializes a separate Player using its own argument.'},
 {id:'u34q8',kind:'choice',area:'Constructor debugging',objective:'3.4.A.2',prompt:'A constructor takes `int startingLives` but contains `lives = 3;`. What is the problem if lives should be determined by the argument?',options:['It ignores startingLives; use `lives = startingLives;`','It makes lives private','It is invalid syntax because 3 is a literal','It creates a second object automatically'],answer:0,explanation:'The hard-coded value ignores the parameter and gives all objects three lives.'},
 {id:'u34q9',kind:'choice',area:'Mutable constructor arguments',objective:'3.4.A.3',prompt:'The constructor assigns `balance = input;`, where input is a mutable TicketBalance. What is true afterward?',options:['Java automatically clones input','The balance field and input must refer to different objects','Only primitive values can be constructor arguments','Both references can refer to the same object, allowing changes through either reference'],answer:3,explanation:'Copying a reference is not the same as making an independent object.'},
 {id:'u34q10',kind:'choice',area:'Defensive copying',objective:'3.4.A.3',prompt:'Which initialization best protects a PrizeCard from later changes to a mutable TicketBalance argument?',options:['balance = input;','balance = new TicketBalance(input.getTickets());','input = balance;','balance = null;'],answer:1,explanation:'Creating another TicketBalance with the same data prevents unintentional sharing of the original mutable object.'}
];
