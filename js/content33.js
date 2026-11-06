// Original Topic 3.3 material aligned exclusively to 2025 AP CSA CED, pp. 83 (Topic 3.3).
// Preserve question IDs and meaning after publication; reports retain question snapshots.
export const PAGE33 = [
 {title:'Inside a Java Class',subtitle:'Discover the class header, attributes, constructor, and methods',minutes:18,ek:'3.3.A.1–3.3.A.6'},
 {title:'The Access Control Lab',subtitle:'Investigate which code can access public and private members',minutes:22,ek:'3.3.A.1, 3.3.A.5, 3.3.A.6'},
 {title:'One Class, Two Objects',subtitle:'Observe independent instance-variable values across objects',minutes:20,ek:'3.3.A.4, 3.3.A.5, 3.3.A.6'},
 {title:'Build a Class',subtitle:'Assemble a class that keeps data private and exposes useful behavior',minutes:22,ek:'3.3.A.1–3.3.A.6'}
];
export const ANATOMY = [
 {id:'class',label:'public class Player {',category:'Class header',explanation:'The public class declaration defines a new type named Player. In AP CSA, class declarations are public.'},
 {id:'data',label:'private int score;',category:'Instance variable',explanation:'An instance variable belongs to one Player object. Keeping it private hides its storage from other classes.'},
 {id:'ctor',label:'public Player() { score = 0; }',category:'Constructor',explanation:'A constructor has the class name and no return type. AP CSA constructors are public.'},
 {id:'method',label:'public int getScore() { return score; }',category:'Method',explanation:'This public method offers controlled access to the score without exposing the field directly.'}
];
export const CLASS_PARTS = [
 {id:'p1',text:'public class ArcadeGame {',answer:'Class header',why:'A class declaration names and opens a type.'},
 {id:'p2',text:'private String title;',answer:'Instance variable',why:'A private attribute stores data belonging to one object.'},
 {id:'p3',text:'public ArcadeGame() { }',answer:'Constructor',why:'A constructor uses the class name, with no return type.'},
 {id:'p4',text:'public void start() { }',answer:'Method',why:'A method names a behavior.'},
 {id:'p5',text:'private int highScore;',answer:'Instance variable',why:'A field declared in the class but outside methods is an attribute.'},
 {id:'p6',text:'private void resetInternal() { }',answer:'Method',why:'Methods can be private if their behavior is only for internal use.'}
];
export const PART_KINDS=['Class header','Instance variable','Constructor','Method'];
export const ACCESS_MEMBERS=[
 {id:'score',label:'score',declaration:'private int score;',visibility:'private',kind:'field',method:'score'},
 {id:'get',label:'getScore()',declaration:'public int getScore()',visibility:'public',kind:'method',method:'getScore()'},
 {id:'add',label:'addPoints(5)',declaration:'public void addPoints(int points)',visibility:'public',kind:'method',method:'addPoints(5)'},
 {id:'reset',label:'resetInternal()',declaration:'private void resetInternal()',visibility:'private',kind:'method',method:'resetInternal()'}
];
export const ACCESS_TRANSFER=[
 {id:'a1',prompt:'Runner contains `Player p = new Player();` then tries `p.score = 50;`. Will the field access compile?',options:['Yes, because p is an object','No, because score is private in Player','Yes, because a constructor was called','No, because score must be static'],answer:1,hint:'A private instance variable can only be accessed inside its declaring class.'},
 {id:'a2',prompt:'Inside Player, addPoints calls `resetInternal();`, a private method in Player. Does that compile?',options:['No, private means nothing can call it','Only if Runner calls it too','Yes, methods of the same class can access private members','Only if resetInternal returns int'],answer:2,hint:'Private means access is restricted to code in the declaring class, not forbidden everywhere.'},
 {id:'a3',prompt:'Runner has `Player p = new Player();` then executes `int x = p.getScore();`. What happens?',options:['The public method may be called from Runner','The call is illegal because score is private','The call changes Player into Runner','All instance methods are automatically private'],answer:0,hint:'The public method is a legal interface, even though it reads a private field internally.'},
 {id:'a4',prompt:'Which declaration best protects a player’s score while permitting other classes to read it?',options:['public int score; with no methods','private int score; and private int getScore()','public int score; and public int getScore()','private int score; and public int getScore()'],answer:3,hint:'Keep the attribute private, and expose only the intended behavior publicly.'}
];
export const OBJECT_TRANSFER=[
 {id:'o1',prompt:'After `a.addPoints(8)`, what happens to the score inside a different Player object `b`?',options:['b.score increases by 8','b.score stays the same','Both scores become 8','b and a become the same object'],answer:1,hint:'Instance variables belong to individual objects.'},
 {id:'o2',prompt:'Which is the valid way for Runner to increase a Player’s private score?',options:['p.score += 5;','Player.score += 5;','p.addPoints(5);','private p.score += 5;'],answer:2,hint:'Clients should use a public method to request the behavior.'},
 {id:'o3',prompt:'Why might a class make score private?',options:['So callers must use the class’s permitted interface','To prevent the class’s own methods from reading it','To make every Player share the score','To remove the score from each Player object'],answer:0,hint:'Encapsulation keeps implementation details internal while providing a controlled interface.'}
];
// Every design slot has multiple plausible choices, stored by stable ID.
export const BUILD_SLOTS = [
 {id:'header',label:'Class declaration',choices:[
  {id:'correct',text:'public class PrizeCard {'},{id:'private',text:'private class PrizeCard {'},{id:'method',text:'public void PrizeCard {'},{id:'missing',text:'class PrizeCard {'}],hint:'The AP CSA course uses public class declarations.'},
 {id:'owner',label:'Owner attribute',choices:[
  {id:'correct',text:'private String owner;'},{id:'public',text:'public String owner;'},{id:'method',text:'public String owner();'},{id:'ctor',text:'public PrizeCard owner;'}],hint:'An attribute should remain internal to the class.'},
 {id:'tickets',label:'Ticket attribute',choices:[
  {id:'correct',text:'private int tickets;'},{id:'public',text:'public int tickets;'},{id:'method',text:'public int getTickets();'},{id:'local',text:'int tickets = 0; // only in another method'}],hint:'A private instance variable stores the tickets belonging to this card.'},
 {id:'ctor',label:'Constructor header',choices:[
  {id:'correct',text:'public PrizeCard(String ownerName, int initialTickets)'},{id:'void',text:'public void PrizeCard(String ownerName, int initialTickets)'},{id:'private',text:'private PrizeCard(String ownerName, int initialTickets)'},{id:'wrong',text:'public PrizeCard.new(String ownerName, int initialTickets)'}],hint:'Constructors are public, use the class name, and have no return type.'},
 {id:'getter',label:'Ticket reader',choices:[
  {id:'correct',text:'public int getTickets()'},{id:'private',text:'private int getTickets()'},{id:'field',text:'public int tickets;'},{id:'wrongtype',text:'public void getTickets()'}],hint:'External code needs a public method that returns an int.'},
 {id:'add',label:'Ticket-changing method',choices:[
  {id:'correct',text:'public void addTickets(int amount)'},{id:'private',text:'private void addTickets(int amount)'},{id:'field',text:'public int amount;'},{id:'ctor',text:'public PrizeCard addTickets(int amount)'}],hint:'The client should be able to call a public behavior to add tickets.'},
 {id:'helper',label:'Internal helper',choices:[
  {id:'correct',text:'private void audit()'},{id:'public',text:'public void audit()'},{id:'field',text:'private int audit;'},{id:'ctor',text:'public PrizeCard audit()'}],hint:'An internal helper can be private, since callers do not need direct access.'}
];
export const BUILD_TRANSFER=[
 {id:'b1',prompt:'Runner tries `card.audit();` after constructing a PrizeCard. What should happen?',options:['Allowed because audit exists','Not allowed because audit is private','Allowed because audit is void','Not allowed because Runner cannot create objects'],answer:1,hint:'A private helper belongs to the implementation, not the external interface.'},
 {id:'b2',prompt:'A different class needs a card’s ticket count. Which operation is part of the intended public interface?',options:['card.tickets','card.audit()','card.getTickets()','private card.tickets'],answer:2,hint:'The public accessor safely returns the value of a private attribute.'}
];
// Ten original graded questions; exactly ten points each. Correct options are redistributed per student.
export const QUESTIONS33 = [
 {id:'u33q1',kind:'choice',area:'Class declaration',objective:'3.3.A.2',prompt:'Which class header follows the declaration convention required in AP CSA?',options:['private class Player {','public class Player {','public Player class {','void class Player {'],answer:1,explanation:'The AP CSA framework declares classes using public class.'},
 {id:'u33q2',kind:'choice',area:'Constructors',objective:'3.3.A.3',prompt:'Which is a valid constructor header inside `public class Player`?',options:['private Player()','public void Player()','public Player()','public int Player()'],answer:2,explanation:'A constructor uses the class name, has no return type, and is public in this course.'},
 {id:'u33q3',kind:'choice',area:'Encapsulation',objective:'3.3.A.1, 3.3.A.5',prompt:'Why is `private int score;` generally preferred to `public int score;` in Player?',options:['It prevents any method from reading score','It makes score shared by every Player','It forces score to start at 100','It prevents other classes from changing score directly'],answer:3,explanation:'Private instance variables hide data representation and prevent unintended external direct access.'},
 {id:'u33q4',kind:'choice',area:'Private access',objective:'3.3.A.1, 3.3.A.6',prompt:'Player defines `private void resetInternal()`. Which call is allowed?',options:['A method inside Player calling resetInternal()','Runner calling p.resetInternal()','Any unrelated class calling p.resetInternal()','A method in ArcadeGame calling p.resetInternal()'],answer:0,explanation:'Methods within the declaring class may access its private methods.'},
 {id:'u33q5',kind:'choice',area:'Public interface',objective:'3.3.A.1, 3.3.A.6',prompt:'Player has a private int score and a public int getScore(). Which statement in Runner is allowed?',options:['p.score = 40;','int x = p.getScore();','int x = p.score;','p.private.score();'],answer:1,explanation:'Runner may call a public method; it may not access a private field directly.'},
 {id:'u33q6',kind:'choice',area:'Instance variables',objective:'3.3.A.4',prompt:'Player a and Player b refer to different objects. After a increases its private score, what happens to b’s score?',options:['b’s score becomes equal to a’s','b’s score is deleted','b’s score remains unchanged','Both objects now share one score'],answer:2,explanation:'Every Player object has its own copy of each instance variable.'},
 {id:'u33q7',kind:'choice',area:'Visibility of behaviors',objective:'3.3.A.6',prompt:'A method should be callable only from other methods inside PrizeCard, not from Runner. Which header is appropriate?',options:['public void audit()','public class audit()','public int audit','private void audit()'],answer:3,explanation:'A private method is available internally but not through an unrelated client.'},
 {id:'u33q8',kind:'choice',area:'Class design',objective:'3.3.A.1–3.3.A.6',prompt:'Which design best lets a client read a player’s score without allowing direct field modification?',options:['private int score; and public int getScore()','public int score; and private int getScore()','private int score; and private int getScore()','public int score; and no methods'],answer:0,explanation:'Use private data with a public accessor method for controlled external access.'},
 {id:'u33q9',kind:'category',area:'Class anatomy',objective:'3.3.A.2–3.3.A.6',prompt:'Classify each Java declaration inside public class PrizeCard.',items:[['private String owner;','Instance variable'],['public PrizeCard() { }','Constructor'],['public int getTickets() { return tickets; }','Method'],['public class PrizeCard {','Class header']],categories:['Instance variable','Constructor','Method','Class header'],explanation:'Field declarations, constructors, methods, and class headers have different roles.'},
 {id:'u33q10',kind:'category',area:'Client access',objective:'3.3.A.1, 3.3.A.6',prompt:'Given private int score; public int getScore(); and private void resetInternal() in Player, classify each attempted call.',items:[['Runner calls p.getScore()','Allowed'],['Runner reads p.score','Not allowed'],['Player method calls resetInternal()','Allowed'],['Runner calls p.resetInternal()','Not allowed']],categories:['Allowed','Not allowed'],explanation:'Outside clients can use public members, while private members are accessible only inside the declaring class.'}
];
