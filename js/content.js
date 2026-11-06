export const UNIT = [
 {id:'3.1', title:'Abstraction and Program Design',pages:4,periods:2,active:true},
 {id:'3.2', title:'Impact of Program Design',pages:3,periods:1,active:true},
 {id:'3.3', title:'Anatomy of a Class',pages:4,periods:2},
 {id:'3.4', title:'Constructors',pages:5,periods:2},
 {id:'3.5', title:'Methods: How to Write Them',pages:8,periods:4},
 {id:'3.6', title:'Passing and Returning References',pages:5,periods:2},
 {id:'3.7', title:'Class Variables and Methods',pages:5,periods:2},
 {id:'3.8', title:'Scope and Access',pages:4,periods:2},
 {id:'3.9', title:'this Keyword',pages:3,periods:1}
];
export const PAGE_META = [
 {title:'Objects Everywhere',subtitle:'Turn a real-world scene into a program design',minutes:15,ek:'3.1.A.1, 3.1.A.3, 3.1.A.7'},
 {title:'Data Abstraction',subtitle:'Decide which information belongs to an object or class',minutes:16,ek:'3.1.A.2, 3.1.A.3'},
 {title:'Procedural Abstraction',subtitle:'Use methods to hide details and reduce repetition',minutes:17,ek:'3.1.A.4, 3.1.A.5, 3.1.A.6'},
 {title:'Class Design Studio',subtitle:'Design a class before writing the implementation',minutes:20,ek:'3.1.A.7; Learning Objective 3.1.A'}
];
export const CLASSIFY_SCENE = [
 {id:'s1',text:'Player',answer:'class',reason:'Player represents a type of thing we can create objects from.'},
 {id:'s2',text:'score',answer:'attribute',reason:'score is data describing a player at a given moment.'},
 {id:'s3',text:'addScore(points)',answer:'behavior',reason:'addScore names an action the player can perform.'},
 {id:'s4',text:'ArcadeGame',answer:'class',reason:'ArcadeGame is a type of object we might create.'},
 {id:'s5',text:'tickets',answer:'attribute',reason:'tickets is information tracked about a player.'},
 {id:'s6',text:'startGame()',answer:'behavior',reason:'startGame names an action rather than stored data.'}
];
export const CLASSIFY_DATA = [
 {id:'d1',text:'score for each Player',answer:'instance',reason:'Every Player needs an independent score.'},
 {id:'d2',text:'name for each Player',answer:'instance',reason:'Each Player has their own name.'},
 {id:'d3',text:'total games played across all Players',answer:'class',reason:'A single total is shared by the class.'},
 {id:'d4',text:'the number of lives left for each Player',answer:'instance',reason:'Lives belong to individual players.'},
 {id:'d5',text:'arcade-wide bonus multiplier',answer:'class',reason:'All Player objects use the same shared bonus value.'},
 {id:'d6',text:'addScore(int points)',answer:'behavior',reason:'A method is a behavior, not a variable.'}
];
export const DESIGN = {
 fields:[
  {id:'name',text:'private String name;',ok:true},
  {id:'score',text:'private int score;',ok:true},
  {id:'lives',text:'private int lives;',ok:true},
  {id:'wallpaper',text:'private String wallpaper;',ok:false},
  {id:'price',text:'private int machinePrice;',ok:false},
  {id:'games',text:'private static int gamesPlayed;',ok:false}
 ],
 methods:[
  {id:'add',text:'public void addScore(int points)',ok:true},
  {id:'get',text:'public int getScore()',ok:true},
  {id:'lose',text:'public void loseLife()',ok:true},
  {id:'paint',text:'public void repaintArcade()',ok:false},
  {id:'start',text:'public void startTournament()',ok:false},
  {id:'snack',text:'public String getSnackMenu()',ok:false}
 ]
};
/* Each item is worth exactly 10 points, all-or-nothing. The key is never shown to students after submission. */
export const QUESTIONS = [
 {id:'q1',kind:'choice',area:'Classes and attributes',objective:'3.1.A.7',
  prompt:'You are designing a system for arcade game sessions. Which choice is the best candidate for a class?',
  options:['The number 100','ArcadeGame','The act of printing a message','A player\'s current score'],answer:1,
  explanation:'A class represents a kind of entity and groups its attributes and behaviors.'},
 {id:'q2',kind:'category',area:'Classes and attributes',objective:'3.1.A.3',
  prompt:'Classify each part of the proposed Player design.',
  items:[['Player','Class'],['score','Attribute'],['loseLife()','Behavior']], categories:['Class','Attribute','Behavior'],
  explanation:'The type name identifies the class, stored information is an attribute, and a named action is a behavior.'},
 {id:'q3',kind:'choice',area:'Instance and class variables',objective:'3.1.A.3',
  prompt:'Two Player objects can have different scores. What kind of variable best represents score?',
  options:['A class variable shared by all players','A method parameter that stores every player\'s score','An instance variable in each Player object','A variable that is never stored'],answer:2,
  explanation:'An instance variable belongs to each object, so different players can have different values.'},
 {id:'q4',kind:'choice',area:'Instance and class variables',objective:'3.1.A.3',
  prompt:'A game should track one number for the total Player objects created. Which design fits that requirement?',
  options:['A separate total inside each object','A method parameter named total','A different local variable in every method','A class variable shared by all Player objects'],answer:3,
  explanation:'A class variable has one shared value for the entire class.'},
 {id:'q5',kind:'choice',area:'Data abstraction',objective:'3.1.A.2',
  prompt:'An arcade program needs to represent each player’s score and remaining lives. Which design best illustrates data abstraction?',
  options:[
   'Represent score and lives as named attributes of a Player class without requiring callers to know how those values are stored',
   'Put score and lives as unnamed numbers in many unrelated parts of the program',
   'Write an addScore(points) method so callers do not need to know its internal statements',
   'Store a separate copy of the same player’s score inside every method that uses it'
  ],answer:0,
  explanation:'Data abstraction gives relevant information meaningful names and separates the properties of a data type from the details of its representation. Writing a reusable method is procedural abstraction.'},
 {id:'q6',kind:'choice',area:'Procedural abstraction',objective:'3.1.A.4',
  prompt:'Why is player.addScore(15) an example of procedural abstraction?',
  options:['It always creates a new Player','The caller needs to know every internal statement','It lets the caller request a behavior without knowing its implementation','It removes all parameters from the method'],answer:2,
  explanation:'The method exposes what an action does without requiring the caller to know how it works.'},
 {id:'q7',kind:'choice',area:'Methods and parameters',objective:'3.1.A.5',
  prompt:'Which method header is most reusable when different point amounts must be awarded?',
  options:['public void awardTen()','public void awardPoints(int points)','public void awardFive()','public void resetScore()'],answer:1,
  explanation:'A parameter generalizes the action across different argument values.'},
 {id:'q8',kind:'choice',area:'Methods and parameters',objective:'3.1.A.6',
  prompt:'A developer makes addScore(int points) faster but keeps its signature and behavior the same. What should happen to the code that calls it?',
  options:['Every call must be rewritten','Calls must specify the algorithm used','The method must become private','The calling code can remain unchanged'],answer:3,
  explanation:'Procedural abstraction lets implementations change without changing the interface and expected behavior.'},
 {id:'q9',kind:'category',area:'Class design',objective:'3.1.A.7',
  prompt:'Classify the responsibilities proposed for Player.',
  items:[['name','Attribute'],['score','Attribute'],['getScore()','Behavior'],['loseLife()','Behavior']], categories:['Attribute','Behavior'],
  explanation:'Attributes store the player\'s data; behaviors describe actions the player can perform.'},
 {id:'q10',kind:'choice',area:'Class design',objective:'3.1.A.7',
  prompt:'A class must represent a game player who has a name, earns points, and can report their score. Which design is most appropriate?',
  options:[
   'Player with name and score attributes, addScore(points) and getScore() methods',
   'Player with only a startGame() method and no attributes',
   'Score with unrelated arcade-machine settings and no methods',
   'Player with only a printTitle() method'
  ],answer:0,
  explanation:'A good design groups the data and behaviors belonging to the modeled entity.'}
];
export const TOPIC_31_MAX = QUESTIONS.length * 10;

export const CHALLENGES = {
 1:[
  {prompt:'A school software model includes Student, studentId, and markPresent(). Which one is a class?',options:['studentId','markPresent()','Student','The value 42'],answer:2,hint:'A class names a kind of thing. A field stores a value; a method names an action.'},
  {prompt:'You are designing a Robot class. Which item is best described as a behavior?',options:['batteryLevel','moveForward(int steps)','modelNumber','speed'],answer:1,hint:'Behaviors are actions a robot can perform, not information about its current state.'},
  {prompt:'A traffic simulator predicts travel time. Which detail is least relevant to its initial model?',options:['Speed limits','Travel distance','Intersection delays','The interior upholstery pattern'],answer:3,hint:'Keep information that helps answer the modeling question and hide unrelated details.'}
 ],
 2:[
  {prompt:'Alex has 10 points and Ben has 25. If a method adds 10 to Alex only, what should Ben’s score be?',options:['10','25','35','45'],answer:1,hint:'Their scores are instance variables. One player’s score change does not update the other player.'},
  {prompt:'A static totalGamesPlayed is 7. After one new game begins and increments it, what value should every Player see?',options:['7','8','A separate value for every player','null'],answer:1,hint:'A class variable represents one shared value, not separate copies for each player.'},
  {prompt:'You want each player to have a different favoriteGame. Which is a better design?',options:['A class variable shared by all players','A method parameter with no stored value','An instance variable for each Player','One global string for the arcade'],answer:2,hint:'The value varies by object, so it belongs to each object’s state.'}
 ],
 3:[
  {prompt:'The score starts at 10. Code calls addScore(4) and then addScore(6). What should the final score be?',options:['10','14','16','20'],answer:3,hint:'Each call adds its argument to the current score, and the result carries forward.'},
  {prompt:'Why is addScore(int points) more general than addTenPoints()?',options:['It works with different values supplied by callers','It has more characters in its name','It always runs faster','It can only be called once'],answer:0,hint:'A parameter lets callers supply different arguments to the same behavior.'},
  {prompt:'Which change is least likely to require changes to calling code?',options:['Rename addScore to earn','Change its parameter type to String','Replace score += points with score = score + points','Remove its parameter'],answer:2,hint:'A different implementation may preserve the signature and externally observable behavior.'}
 ],
 4:[
  {prompt:'A LibraryBook model needs to track book information and whether it is checked out. Which design best fits?',options:['BookTitle with no behaviors','LibraryBook with title and checkedOut attributes plus borrow() and returnBook() methods','Student with machinePrice and startGame()','LibraryBook with only the school mascot'],answer:1,hint:'Choose related attributes and behaviors that describe the same entity.'},
  {prompt:'A GiftCard must remember its remaining balance. Which element should be stored as an attribute?',options:['balance','spend(int amount)','getBalance()','redeemGiftCard()'],answer:0,hint:'An attribute holds a value. A method performs an action or returns information.'},
  {prompt:'Which statement describes why designing before implementing a class is useful?',options:['It guarantees all code will run without testing','It eliminates the need for variables','It identifies responsibilities and organizes data and behavior before coding','It means every method must be static'],answer:2,hint:'A design helps you decide what the class represents and what it should do before writing code.'}
 ]
};
