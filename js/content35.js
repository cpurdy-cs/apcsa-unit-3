// Topic 3.5 content: original activities aligned with the 2025 AP CSA CED 3.5.A.1–8.
export const PAGE35=[
 {title:'Inside a Method',subtitle:'Identify the pieces of a method and build a valid header.',ek:'3.5.A.1–2'},
 {title:'Methods That Change State',subtitle:'Run void methods and watch what happens to an object.',ek:'3.5.A.1, 3.5.A.6'},
 {title:'Returning Values',subtitle:'Distinguish a returned value from printed output.',ek:'3.5.A.2–3, 3.5.A.5'},
 {title:'Parameters and Primitive Values',subtitle:'Follow copied primitive arguments through method calls.',ek:'3.5.A.7–8'},
 {title:'Accessors and Mutators',subtitle:'Build an interface for a class with private fields.',ek:'3.5.A.5–6'},
 {title:'Following the Flow of Control',subtitle:'Step through decisions, loops, and early returns.',ek:'3.5.A.3–4'},
 {title:'Preconditions and Debugging',subtitle:'Test a method, identify its assumptions, and repair it.',ek:'Skills 3.D, 4.B'},
 {title:'Independent Method Workshop',subtitle:'Write and test complete methods inside Java classes.',ek:'Cumulative 3.5.A.1–8'}
];
export const METHOD_PARTS35=[
 {id:'modifier',label:'public',description:'Access modifier: this method can be called from another class.'},
 {id:'return',label:'int',description:'Return type: this non-void method sends an int value to its caller.'},
 {id:'name',label:'getScore',description:'Method name: how other code refers to this behavior.'},
 {id:'params',label:'()',description:'Parameter list: empty here because no inputs are needed.'},
 {id:'body',label:'{ return score; }',description:'Method body: statements that execute when the method is called.'}
];
export const CHANGE_DEMOS35=[
 {id:'award',name:'Award points',code:'public void addScore(int amount) {\n    score += amount;\n}',start:10,amount:8,result:18,explanation:'The method changes this Player object’s score from 10 to 18. It does not return a score.'},
 {id:'reset',name:'Reset score',code:'public void resetScore() {\n    score = 0;\n}',start:36,amount:null,result:0,explanation:'A void method may modify instance variables even though it returns no value.'},
 {id:'reduce',name:'Spend tickets',code:'public void spendTickets(int cost) {\n    tickets -= cost;\n}',start:25,amount:9,result:16,explanation:'The parameter cost determines how much the instance variable changes.'}
];
export const RETURN_DEMOS35=[
 {id:'getter',name:'Return score',code:'public int getScore() {\n    return score;\n}',field:27,returned:'27',printed:'Nothing',note:'return sends 27 to the caller. It does not print anything by itself.'},
 {id:'check',name:'Return a boolean',code:'public boolean hasEnough(int cost) {\n    return tickets >= cost;\n}',field:15,returned:'true when cost is 12',printed:'Nothing',note:'A boolean expression can be returned directly.'},
 {id:'print',name:'Print instead of return',code:'public void showScore() {\n    System.out.println(score);\n}',field:27,returned:'No value (void)',printed:'27',note:'Printing a value is an observable side effect, not a value returned to the caller.'}
];
export const PARAM_DEMOS35=[
 {id:'simple',name:'Reassign the parameter',code:'public void change(int n) {\n    n = 99;\n}\n\nint x = 12;\nchange(x);',initial:12,paramAfter:99,original:12,desc:'The argument value is copied into n. Assigning 99 to n does not change x.'},
 {id:'increment',name:'Increment a parameter',code:'public void increase(int amount) {\n    amount += 4;\n}\n\nint tickets = 7;\nincrease(tickets);',initial:7,paramAfter:11,original:7,desc:'Only the local parameter changes; the original primitive variable remains 7.'},
 {id:'field',name:'Change an object field instead',code:'public void addScore(int value) {\n    score += value;\n}\n\nPlayer p = new Player(12);\np.addScore(5);',initial:12,paramAfter:5,original:17,desc:'Here the method writes to the object’s score field. The object changes, while the copied argument value is not changed.'}
];
export const ACCESS_SLOTS35=[
 {id:'accessor',label:'Read tickets',options:[{id:'correct',text:'public int getTickets() { return tickets; }'},{id:'void',text:'public void getTickets() { return tickets; }'},{id:'print',text:'public int getTickets() { System.out.println(tickets); }'}]},
 {id:'mutator',label:'Update tickets',options:[{id:'correct',text:'public void addTickets(int amount) { tickets += amount; }'},{id:'local',text:'public void addTickets(int amount) { amount += tickets; }'},{id:'return',text:'public void addTickets(int amount) { return tickets + amount; }'}]},
 {id:'predicate',label:'Check tickets',options:[{id:'correct',text:'public boolean hasTickets(int cost) { return tickets >= cost; }'},{id:'wrong',text:'public boolean hasTickets(int cost) { return tickets < cost; }'},{id:'print',text:'public boolean hasTickets(int cost) { System.out.println(cost); }'}]}
];
export const FLOW_DEMOS35=[
 {id:'early',title:'Early return',code:'public int bonus(int score) {\n    if (score >= 100) {\n        return 20;\n    }\n    return 5;\n}',result:'20',trace:['Enter bonus(120): score = 120.','Test score >= 100: true.','Execute return 20. Method ends. The return 5 statement is skipped.']},
 {id:'loop',title:'Return inside a loop',code:'public int firstMultipleOfThree(int limit) {\n    for (int i = 1; i <= limit; i++) {\n        if (i % 3 == 0) {\n            return i;\n        }\n    }\n    return -1;\n}',result:'3',trace:['Call firstMultipleOfThree(7), set i = 1.','i = 1: condition i % 3 == 0 is false.','i = 2: condition is false.','i = 3: condition is true. return 3 exits loop and method.','Code after the loop does not run.']},
 {id:'false',title:'Return when condition is false',code:'public boolean isWinning(int score) {\n    if (score < 50) {\n        return false;\n    }\n    return true;\n}',result:'false',trace:['Call isWinning(35).','Check score < 50: true.','Execute return false. The method exits without reaching return true.']}
];
export const BUG_TESTS35=[{id:'low',score:5,cost:10,expect:false},{id:'equal',score:10,cost:10,expect:true},{id:'above',score:15,cost:10,expect:true},{id:'zero',score:5,cost:0,expect:false},{id:'negative',score:7,cost:-2,expect:false}];
export const BUG_REPAIRS35=[
 {id:'original',label:'score > cost',code:'return score > cost;',fn:(s,c)=>s>c,explanation:'This incorrectly rejects equal amounts and accepts zero or negative costs.'},
 {id:'fix',label:'cost > 0 && score >= cost',code:'return cost > 0 && score >= cost;',fn:(s,c)=>c>0&&s>=c,explanation:'This checks the required precondition and accepts an exact match.'},
 {id:'bad',label:'score >= cost',code:'return score >= cost;',fn:(s,c)=>s>=c,explanation:'This accepts zero or negative costs even though the specification requires a positive cost.'}
];
export const PRACTICE35={
 1:[
  {id:'p1a',prompt:'Which part of `public boolean isReady()` tells Java the type of value that must be returned?',options:['public','boolean','isReady','()'],answer:1,hint:'Look for the keyword that names the returned data type.'},
  {id:'p1b',prompt:'A method only updates a field and does not produce a returned value. Which return type belongs in its header?',options:['int','boolean','double','void'],answer:3,hint:'Void methods do not return a value.'},
  {id:'p1c',prompt:'Which is a valid declaration for a method receiving an int and returning a boolean?',options:['public boolean enough(int n)','public void enough(boolean n)','public int enough(boolean n)','public enough(int n) boolean'],answer:0,hint:'The return type comes before the name and the parameter has its own type.'}
 ],
 2:[
  {id:'p2a',prompt:'After `score = 10;` and `addScore(8)`, where addScore executes `score += amount;`, what is score?',options:['8','18','10','0'],answer:1,hint:'The method changes the field; it does not create a new local score.'},
  {id:'p2b',prompt:'What does a void method return to a caller?',options:['An int','The value of the last expression','No value','The current object reference'],answer:2,hint:'Think about what void means in a method header.'},
  {id:'p2c',prompt:'What is the defining feature of a mutator method?',options:['It changes stored object or class state','It must return an int','It prints text','It cannot receive parameters'],answer:0,hint:'A mutator modifies data.'}
 ],
 3:[
  {id:'p3a',prompt:'A method executes `return 12;`. What happens next?',options:['The next statement in the method runs','The method exits and gives 12 to the caller','Java prints 12 automatically','The class constructor runs'],answer:1,hint:'return ends the method call.'},
  {id:'p3b',prompt:'Which is the best accessor for a private `int score` field?',options:['public void getScore() { return score; }','public int getScore() { System.out.println(score); }','public int getScore() { return score; }','public int getScore() { score = 0; }'],answer:2,hint:'It returns a copy of the primitive value without changing the field.'},
  {id:'p3c',prompt:'What is printed by `return score;` alone?',options:['Nothing','The score as text','null','false'],answer:0,hint:'Printing and returning are different operations.'}
 ],
 4:[
  {id:'p4a',prompt:'After `int x = 6; change(x);` where change assigns `n = 30;`, what is x?',options:['30','0','6','36'],answer:2,hint:'The parameter has its own copied primitive value.'},
  {id:'p4b',prompt:'Which statement changes a Player object’s score?',options:['`amount += 10;` when amount is a local parameter','`score += amount;` when score is an instance field','`amount = score;`','`int amount = 5;`'],answer:1,hint:'One statement assigns to the instance field, not just the local parameter.'},
  {id:'p4c',prompt:'A primitive argument passed to a method is...',options:['Automatically converted to a reference','Shared by all objects','Passed as a copy of its value','Always set to 0'],answer:2,hint:'Java passes copies of primitive values.'}
 ],
 5:[
  {id:'p5a',prompt:'Which method is an accessor?',options:['void setTickets(int n)','int getTickets()','void reset()','void addTickets(int amount)'],answer:1,hint:'An accessor lets callers obtain a value without altering the object.'},
  {id:'p5b',prompt:'Why keep instance variables private when providing public accessors and mutators?',options:['To control how external code reads and changes state','To prevent methods from using fields','To make fields static','To make constructors illegal'],answer:0,hint:'Encapsulation helps protect implementation details.'},
  {id:'p5c',prompt:'Which statement best describes a mutator?',options:['It must always return boolean','It only reads fields','It usually changes a field and is often void','It must be static'],answer:2,hint:'A mutator can change the state through a method call.'}
 ],
 6:[
  {id:'p6a',prompt:'For `if (x > 0) return 1; return 2;`, what is returned when x = 3?',options:['2','3','1','Nothing'],answer:2,hint:'The first return exits the method.'},
  {id:'p6b',prompt:'A loop reaches `return i;` inside its body. What happens?',options:['Only the current loop iteration ends','The loop continues','The method exits immediately','Java ignores return in loops'],answer:2,hint:'return terminates the entire method, not only the loop.'},
  {id:'p6c',prompt:'Which code after an unconditional `return` can execute?',options:['None of the subsequent statements in that block','The next line always','Only print statements','The next loop iteration'],answer:0,hint:'Unreachable statements cannot execute after return.'}
 ],
 7:[
  {id:'p7a',prompt:'Which test is best for the exact cost threshold when cost is 10?',options:['score = 99','score = 10','score = -100','score = 1000'],answer:1,hint:'A boundary test uses the equality case itself.'},
  {id:'p7b',prompt:'The specification says cost must be positive. Which is an invalid-parameter test?',options:['cost = 5','cost = 10','cost = 1','cost = 0'],answer:3,hint:'Positive means greater than zero.'},
  {id:'p7c',prompt:'A method assumes a nonzero divisor. Which precondition states that assumption?',options:['denominator != 0','denominator == 0','denominator < 0','denominator > 100'],answer:0,hint:'Division by zero must be excluded.'}
 ],
 8:[
  {id:'p8a',prompt:'When a method is declared `boolean`, what must it return along every reachable completed path?',options:['An int','A boolean value','Nothing','A String'],answer:1,hint:'The returned expression must match the declared type.'},
  {id:'p8b',prompt:'A method has type `void` and changes tickets. What should its tests inspect?',options:['Only an imaginary return value','Whether the source contains a comment','The changed tickets field','Whether the class is named Main'],answer:2,hint:'For mutators, checking final object state matters.'},
  {id:'p8c',prompt:'Why run a method against several different argument values?',options:['To catch hard-coded solutions and boundary errors','To make Java ignore parameters','To guarantee all code is correct','To avoid writing a method body'],answer:0,hint:'Different inputs expose more incorrect implementations.'}
 ]
};
export const QUESTIONS35=[
 {id:'u35q1',kind:'choice',area:'Void and non-void',objective:'3.5.A.1–2',prompt:'Which header correctly declares a public void method named addPoints that receives an int?',options:['public int addPoints(void p)','public void addPoints(int p)','void public addPoints(int p)','public addPoints(int p)'],answer:1,explanation:'A void method uses the void return type before its name.'},
 {id:'u35q2',kind:'choice',area:'Method return values',objective:'3.5.A.2–3',prompt:'A public int getScore() method should provide the private int score to a caller. Which body is correct?',options:['{ System.out.println(score); }','{ score = 0; }','{ return score; }','{ return; }'],answer:2,explanation:'A non-void accessor returns a value of the declared type.'},
 {id:'u35q3',kind:'choice',area:'Return control flow',objective:'3.5.A.4',prompt:'What is returned by `if (x > 5) { return 7; } return 2;` when x is 9?',options:['7','2','9','Both 7 and 2'],answer:0,explanation:'The first executed return exits the method.'},
 {id:'u35q4',kind:'category',area:'Accessors and mutators',objective:'3.5.A.5–6',prompt:'Classify these methods by their intended behavior.',items:[['getScore() returns score','Accessor'],['addScore(int n) changes score','Mutator'],['getLives() returns lives','Accessor'],['loseLife() subtracts from lives','Mutator']],categories:['Accessor','Mutator'],explanation:'Accessors return state; mutators change it.'},
 {id:'u35q5',kind:'choice',area:'Primitive arguments',objective:'3.5.A.8',prompt:'After `int n = 8; change(n);`, change executes `p += 5;` where p is an int parameter. What is n?',options:['13','0','8','5'],answer:2,explanation:'The primitive argument is copied into p. Updating p does not modify n.'},
 {id:'u35q6',kind:'choice',area:'State mutation',objective:'3.5.A.6–7',prompt:'A Player has score = 12. Its method addScore(int amount) executes `score += amount;`. After addScore(5), what is score?',options:['12','5','17','0'],answer:2,explanation:'The method adds the argument to the object’s score field.'},
 {id:'u35q7',kind:'choice',area:'Return vs print',objective:'3.5.A.3',prompt:'Which statement about `return score;` is correct?',options:['It automatically prints score','It replaces the object','It returns the field value to the caller without printing','It changes score to zero'],answer:2,explanation:'Returning and printing are different actions.'},
 {id:'u35q8',kind:'category',area:'Method headers',objective:'3.5.A.1–2',prompt:'Match each declaration with its return type.',items:[['public void reset()','void'],['public boolean ready()','boolean'],['public int getTickets()','int'],['public double average()','double']],categories:['void','int','double','boolean'],explanation:'The word preceding the method name is its return type.'},
 {id:'u35q9',kind:'choice',area:'Early return',objective:'3.5.A.4',prompt:'A loop executes `return i;` when i becomes 3. What happens to the method?',options:['The method ends and returns 3','Only this iteration ends','The next iteration must run','The return is ignored inside loops'],answer:0,explanation:'A return statement ends the entire method, including enclosing loops.'},
 {id:'u35q10',kind:'choice',area:'Debugging',objective:'Skill 3.D',prompt:'A method declared int has one execution path that reaches its final brace without returning a value. What is the issue?',options:['Java automatically returns zero','It may fail compilation because not every path returns a value','The constructor supplies a return value','Only void methods can have parameters'],answer:1,explanation:'An int method must return a compatible value along all paths that can finish normally.'},
 {id:'u35q11',kind:'choice',area:'Preconditions',objective:'Skill 4.B',prompt:'A method computes `total / count`, and count is an int. What precondition must be met for the division to work as intended?',options:['total is always positive','count equals zero','count is not zero','total equals count'],answer:2,explanation:'Division by zero is invalid.'},
 {id:'u35q12',kind:'choice',area:'Method behavior',objective:'3.5.A.7',prompt:'Why use a parameter in `addTickets(int amount)` instead of a separate method for every ticket count?',options:['It guarantees no bugs','It makes the method reusable with different inputs','It removes the object state','It makes the method a constructor'],answer:1,explanation:'A parameter generalizes a method for many values.'}
];
