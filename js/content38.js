// Topic 3.8 — Scope and Access, aligned solely with 2025 AP CSA Unit 3 CED p.89.
export const PAGE38=[
 {title:'Scope Explorer',subtitle:'Find which variables exist at each point in a method, including a nested block.',ek:'3.8.A.1'},
 {title:'Parameters and Local Variables',subtitle:'Step through a method call and watch local variables appear and disappear.',ek:'3.8.A.1'},
 {title:'Shadowing and Scope Repair',subtitle:'Investigate names that hide instance variables, then repair scope and logic mistakes.',ek:'3.8.A.1–2'},
 {title:'DroneBattery Scope Workshop',subtitle:'Write and test a complete class using fields, parameters, and method-local variables.',ek:'3.8.A.1–2'}
];
export const SCOPE_CODE38=`public class ScoreBadge {
    private int points;

    public void addPoints(int amount) {
        int bonus = 2;
        if (amount > 0) {
            int updated = amount + bonus;
            points += updated;
        }
        // After the if block: updated is gone.
    }

    public int getPoints() {
        return points;
    }
}`;
export const SCOPE_SCENES38=[
 {id:'before',name:'Before addPoints is called',line:3,variable:'amount',answer:'no',detail:'The parameter amount exists only when addPoints is called; it is not an instance field.'},
 {id:'method',name:'Inside addPoints, before the if',line:5,variable:'bonus',answer:'yes',detail:'bonus was declared earlier inside the same method. It stays in scope through the rest of that method block.'},
 {id:'inside',name:'Inside the true if block',line:8,variable:'updated',answer:'yes',detail:'updated is declared inside the if block and can be used in that block after its declaration.'},
 {id:'after',name:'After the if block closes',line:10,variable:'updated',answer:'no',detail:'updated was declared in the inner block; it cannot be used after that block has ended.'},
 {id:'other',name:'Inside the separate getPoints method',line:14,variable:'bonus',answer:'no',detail:'A local in addPoints is not visible inside a different method.'}
];
// Every proposed repair has visible Java source, including the incorrect options.
// The browser checks the chosen explanation; it does not claim to compile Java.
export const SHADOW_CASES38=[
 {id:'param',name:'Field hidden by parameter',code:`public class Locker {
    private int code;

    public Locker(int code) {
        code = code;
    }
}`,prompt:'A new Locker always reports the default code of 0. Which change makes the constructor store the supplied value in the instance field?',options:['Rename the parameter to newCode and write code = newCode;','Change the instance field to static but keep code = code;','Remove the assignment from the constructor.'],answer:0,explain:'The parameter code shadows the field named code. In code = code, both names resolve to the parameter. Giving the parameter a different name allows the field to be assigned.',revisions:[
`public class Locker {
    private int code;

    public Locker(int newCode) {
        code = newCode;
    }
}`,
`public class Locker {
    private static int code;

    public Locker(int code) {
        code = code;
    }
}`,
`public class Locker {
    private int code;

    public Locker(int code) {
        // No assignment to the field.
    }
}`]},
 {id:'block',name:'Local after an if block',code:`public class Meter {
    public int adjusted(int value) {
        if (value > 0) {
            int bonus = 3;
        }
        return value + bonus;
    }
}`,prompt:'The method needs to return value plus a bonus of 3 for positive values, and value alone otherwise. Which repair makes bonus available at the return statement?',options:['Make bonus final, but keep its declaration inside the if block.','Declare int bonus = 0; before the if, then assign bonus = 3; inside the if.','Change the adjusted method to static without moving bonus.'],answer:1,explain:'A local is only visible from its declaration to the end of the enclosing block. Declare bonus in the method block first, then assign it in the inner if block.',revisions:[
`public class Meter {
    public int adjusted(int value) {
        if (value > 0) {
            final int bonus = 3;
        }
        return value + bonus;
    }
}`,
`public class Meter {
    public int adjusted(int value) {
        int bonus = 0;
        if (value > 0) {
            bonus = 3;
        }
        return value + bonus;
    }
}`,
`public class Meter {
    public static int adjusted(int value) {
        if (value > 0) {
            int bonus = 3;
        }
        return value + bonus;
    }
}`]},
 {id:'parameter',name:'Parameter in another method',code:`public class BankAccount {
    private int credits;

    public void deposit(int amount) {
        credits += amount;
    }

    public void reset() {
        credits = amount;
    }
}`,prompt:'The reset method should set credits to 0, but amount is a parameter of deposit. Which repair makes reset compile and perform its intended job?',options:['Add public to the amount parameter of deposit.','Add static to the amount parameter of deposit.','Replace amount with 0 inside reset.'],answer:2,explain:'amount belongs only to the deposit call. Its scope does not extend into reset, so reset must use a value it can access, such as 0.',revisions:[
`public class BankAccount {
    private int credits;

    public void deposit(public int amount) {
        credits += amount;
    }

    public void reset() {
        credits = amount;
    }
}`,
`public class BankAccount {
    private int credits;

    public void deposit(static int amount) {
        credits += amount;
    }

    public void reset() {
        credits = amount;
    }
}`,
`public class BankAccount {
    private int credits;

    public void deposit(int amount) {
        credits += amount;
    }

    public void reset() {
        credits = 0;
    }
}`]},
 {id:'local',name:'Modifier on a local variable',code:`public class Toll {
    public int total(int amount) {
        private int fee = 2;
        return amount + fee;
    }
}`,prompt:'The fee should be a temporary value inside total. Which declaration is legal for a method-local variable?',options:['int fee = 2;','public int fee = 2;','private static int fee = 2;'],answer:0,explain:'Method-local variables cannot use public or private access modifiers (or static). A local is visible within the block in which it is declared.',revisions:[
`public class Toll {
    public int total(int amount) {
        int fee = 2;
        return amount + fee;
    }
}`,
`public class Toll {
    public int total(int amount) {
        public int fee = 2;
        return amount + fee;
    }
}`,
`public class Toll {
    public int total(int amount) {
        private static int fee = 2;
        return amount + fee;
    }
}`]},
 {id:'sibling',name:'Local declared inside each branch',code:`public class GradeChecker {
    public String describe(int score) {
        if (score >= 70) {
            String status = "Passed";
        } else {
            String status = "Review";
        }
        return status;
    }
}`,prompt:'The method should return "Passed" for scores of 70 or higher and "Review" otherwise. Which repair makes status available to the return statement?',options:['Make status final in both branches, without moving the declarations.','Declare String status; before the if, then assign status in each branch.','Declare private String status; inside the method before the if.'],answer:1,explain:'Each branch is a separate block. A local declared in either branch is unavailable after the if/else ends. Declaring status in the enclosing method block makes it accessible at return.',revisions:[
`public class GradeChecker {
    public String describe(int score) {
        if (score >= 70) {
            final String status = "Passed";
        } else {
            final String status = "Review";
        }
        return status;
    }
}`,
`public class GradeChecker {
    public String describe(int score) {
        String status;
        if (score >= 70) {
            status = "Passed";
        } else {
            status = "Review";
        }
        return status;
    }
}`,
`public class GradeChecker {
    public String describe(int score) {
        private String status;
        if (score >= 70) {
            status = "Passed";
        } else {
            status = "Review";
        }
        return status;
    }
}`]}
];
export const PRACTICE38={
 1:[
 {id:'a',prompt:'Where can a method parameter be accessed?',options:['Throughout the whole class','Only in the method or constructor where it is declared','Only from outside the class','From every object'],answer:1,hint:'A parameter is a local variable of its method or constructor.'},
 {id:'b',prompt:'Which statement about a local variable declared in an if block is correct?',options:['It becomes a class variable','It can always be read from any later method','It is accessible only in its declaring block after declaration','It can be accessed from any sibling block'],answer:2,hint:'Its scope does not extend outside the braces of its declaring block.'},
 {id:'c',prompt:'Can a local variable be declared private?',options:['No, public and private apply to class members','Yes, all Java variables can be private','Only when it has an int type','Only in a constructor'],answer:0,hint:'A local variable cannot have a visibility modifier.'}
 ],
 2:[
 {id:'a',prompt:'When a method returns, what happens to its ordinary local variables?',options:['They become static variables','They remain accessible to every caller','They are saved in the next object','Their method invocation ends, so they are no longer accessible'],answer:3,hint:'Locals belong to that invocation of the method.'},
 {id:'b',prompt:'A method changes its int parameter. What happens to the caller’s original int variable?',options:['It is always changed too','The caller’s primitive value is unchanged','It becomes null','It becomes static'],answer:1,hint:'Java copies primitive argument values into parameters.'},
 {id:'c',prompt:'Which declarations are local variables?',options:['Only static fields','Only private fields','Parameters and variables declared inside a method or block','All instance fields'],answer:2,hint:'Look inside headers and method bodies.'}
 ],
 3:[
 {id:'a',prompt:'A method parameter has the same name as an instance field. What does the unqualified name resolve to?',options:['The parameter','The instance field','The newest variable in any class','A static copy'],answer:0,hint:'Within the method, the parameter shadows the instance field.'},
 {id:'b',prompt:'Can a local variable declared inside one method be used by a separate method?',options:['Yes, if both methods are public','Only if the local variable is final','No, not unless its value is passed or stored somewhere accessible','Always, if both methods belong to one class'],answer:2,hint:'Methods have distinct local scopes.'},
 {id:'c',prompt:'Which line correctly declares a method-local int?',options:['private int count = 0;','int count = 0;','public int count = 0;','static private int count = 0;'],answer:1,hint:'A local declaration does not use a member access modifier.'}
 ],
 4:[
 {id:'a',prompt:'Why does a DroneBattery method need its own local calculation?',options:['To share a class variable among all batteries','To calculate intermediate values without adding extra instance fields','To make parameters public','To avoid returning results'],answer:1,hint:'An intermediate result can be local to the method.'},
 {id:'b',prompt:'A method-local remaining variable may be used where?',options:['Only inside the block where it was declared and its nested blocks','In any other method','As a public class field','In a sibling if block'],answer:0,hint:'A local variable has block scope.'},
 {id:'c',prompt:'What should a failed completeFlight call do?',options:['Add to the flight count','Set charge to zero','Leave both charge and flight count unchanged','Always recharge automatically'],answer:2,hint:'Invalid operations should not corrupt object state.'}
 ]
};
export const QUESTIONS38=[
 {id:'q1',kind:'choice',area:'Local variables',objective:'3.8.A.1',prompt:'Which statement about a method parameter is true?',options:['It belongs to the class permanently.','It can be accessed by every method in the class.','It is local to the method or constructor in which it is declared.','It must be declared private.'],answer:2,explanation:'A method parameter is a local variable with scope within its method or constructor.'},
 {id:'q2',kind:'choice',area:'Block scope',objective:'3.8.A.1',code:'public class Display {\n    public void show(int x) {\n        if (x > 0) {\n            int bonus = 5;\n        }\n        System.out.println(bonus);\n    }\n}',prompt:'Why will this method not compile?',options:['The parameter x is not static.','bonus is declared inside the if block and cannot be used afterward.','Only constructors may have local variables.','The if condition uses a parameter.'],answer:1,explanation:'The local bonus exists only within its declaring block.'},
 {id:'q3',kind:'choice',area:'Shadowing',objective:'3.8.A.2',code:'public class Badge {\n    private int score;\n    public void update(int score) {\n        score += 3;\n    }\n    public int getScore() { return score; }\n}',prompt:'If score starts at 0, what does getScore() return after calling update(7)?',options:['3','7','10','0'],answer:3,explanation:'The parameter named score shadows the field, so score += 3 changes only the parameter.'},
 {id:'q4',kind:'choice',area:'Block scope',objective:'3.8.A.1',code:'public class Demo {\n    public static void main(String[] args) {\n        int total = 0;\n        if (total == 0) {\n            int step = 4;\n            total += step;\n        }\n        System.out.println(total);\n    }\n}',prompt:'What is printed?',options:['4','0','A compilation error because total is out of scope','A compilation error because step is local'],answer:0,explanation:'total belongs to the enclosing scope and is modified by the nested block; step is used only where visible.'},
 {id:'q5',kind:'choice',area:'Visibility modifiers',objective:'3.8.A.1',code:'public class Toll {\n    public int compute(int n) {\n        private int offset = 2;\n        return n + offset;\n    }\n}',prompt:'Which edit corrects the invalid local declaration?',options:['Change private int to public int.','Change private int to static int.','Change private int to int.','Move return before the declaration.'],answer:2,explanation:'A local variable cannot use public or private.'},
 {id:'q6',kind:'choice',area:'Parameter scope',objective:'3.8.A.1',code:'public class Meter {\n    private int reading;\n    public void set(int next) { reading = next; }\n    public int increase() { return next + 1; }\n}',prompt:'Why does increase() fail to compile?',options:['Private fields cannot be read inside their class.','next is a parameter belonging only to set().','The increase method must be static.','An int method cannot return an expression.'],answer:1,explanation:'A parameter is only in scope inside its own method.'},
 {id:'q7',kind:'choice',area:'Shadowing',objective:'3.8.A.2',code:'public class Counter {\n    private int value;\n    public Counter(int value) { value = value; }\n    public int getValue() { return value; }\n}',prompt:'Which change ensures the constructor initializes the field without using this?',options:['Make getValue private.','Add static to value.','Delete the constructor.','Rename the parameter newValue and assign value = newValue;.'],answer:3,explanation:'The parameter hides the field when the names match. A distinct name resolves the assignment.'},
 {id:'q8',kind:'choice',area:'Nested scopes',objective:'3.8.A.1',code:'public class Counter {\n    public void sample() {\n        int count = 1;\n        if (count > 0) {\n            count += 2;\n            int extra = 4;\n        }\n        count++;\n    }\n}',prompt:'Which variable is accessible at the final count++ line?',options:['count only','extra only','count and extra','Neither'],answer:0,explanation:'count belongs to the method block; extra is local to the nested if block.'},
 {id:'q9',kind:'choice',area:'Local declarations',objective:'3.8.A.1',prompt:'Where can two unrelated methods each declare a local variable named result?',options:['Never in the same class','Only when both methods are static','In their separate method bodies, because each has its own local scope','Only if result is public'],answer:2,explanation:'Different method invocations have separate local scopes.'},
 {id:'q10',kind:'choice',area:'Scope debugging',objective:'3.8.A.1–2',code:'public class Device {\n    private int level;\n    public void setLevel(int newLevel) {\n        int updated = newLevel;\n        level = updated;\n    }\n}',prompt:'What happens when setLevel(15) is called?',options:['The instance variable level becomes 15.','The instance variable level stays 0.','The updated local becomes an instance variable.','The program cannot compile because updated is local.'],answer:0,explanation:'A local can compute a value and assign it to an instance variable while in scope.'}
];
