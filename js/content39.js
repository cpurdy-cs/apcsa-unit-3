// 2025 AP CSA Course and Exam Description, Unit 3 Topic 3.9 (3.9.A.1–A.3).
// Self-contained examples deliberately use very small, complete Java classes.
export const PAGE39=[
 {title:'What Does this Mean?',subtitle:'Understand which object is executing an instance method.',ek:'3.9.A.1'},
 {title:'When Do You Need this?',subtitle:'Distinguish an instance variable from a parameter with the same name.',ek:'3.9.A.1'},
 {title:'Passing this and Static Methods',subtitle:'Pass the current object as an argument; recognize when this is unavailable.',ek:'3.9.A.2–3'},
 {title:'Contact Class Workshop',subtitle:'Write a short complete Java class that puts the three ideas together.',ek:'3.9.A.1–3'}
];
export const COUNTER39=`public class Counter {
    private int count;

    public Counter(int start) {
        count = start;
    }

    public void add(int amount) {
        this.count += amount;
    }

    public int getCount() {
        return count;
    }
}`;
export const COUNTER_CALLER39=`public class Runner {
    public static void main(String[] args) {
        Counter a = new Counter(3);
        Counter b = new Counter(10);
        a.add(2);
        b.add(4);
        a.add(1);
        System.out.println(a.getCount());
        System.out.println(b.getCount());
    }
}`;
export const RECEIVER_CASES39=[
 {id:'one',label:'a.add(2)',answer:'a',who:'a',before:[3,10],after:[5,10],explain:'a receives add(2), so this refers to a. Only a.count increases.'},
 {id:'two',label:'b.add(4)',answer:'b',who:'b',before:[5,10],after:[5,14],explain:'b receives add(4), so this refers to b. The existing a object is unchanged.'},
 {id:'three',label:'a.add(1)',answer:'a',who:'a',before:[5,14],after:[6,14],explain:'When a receives the next call, this again refers to a. Final counts are a=6 and b=14.'}
];
export const SHADOW_CASES39=[
 {id:'same',title:'Same name without this',body:'count = count;',expected:0,answer:1,options:['The constructor prints 8.','The constructor prints 0.','This does not compile.'],explain:'The parameter count hides the instance variable count. Both unqualified names refer to the parameter, so the instance variable remains at its default of 0.',corrected:'this.count = count;'},
 {id:'qualified',title:'Same name with this',body:'this.count = count;',expected:8,answer:0,options:['The constructor prints 8.','The constructor prints 0.','This does not compile.'],explain:'this.count names the instance variable, while count names the parameter. The argument 8 is stored in the object.',corrected:'this.count = count;'},
 {id:'different',title:'Different parameter name',body:'count = start;',param:'start',expected:8,answer:2,options:['The constructor prints 0.','This does not compile.','The constructor prints 8.'],explain:'No parameter named count hides the instance variable, so count = start; updates the instance variable. this.count would also be valid.',corrected:'count = start;'}
];
export function shadowClass39(s){return `public class Counter {
    private int count;

    public Counter(int ${s.param||'count'}) {
        ${s.body}
    }

    public int getCount() {
        return count;
    }
}`;}
export const SHADOW_CALLER39=`public class Runner {
    public static void main(String[] args) {
        Counter c = new Counter(8);
        System.out.println(c.getCount());
    }
}`;
export const GROUP39=`public class Group {
    private Participant member;

    public void add(Participant p) {
        member = p;
    }

    public Participant getMember() {
        return member;
    }
}`;
export const PARTICIPANT39=`public class Participant {
    public void join(Group group) {
        group.add(this);
    }
}`;
export const JOIN_CALLER39=`public class Runner {
    public static void main(String[] args) {
        Participant p = new Participant();
        Group group = new Group();
        p.join(group);
        System.out.println(group.getMember() == p);
    }
}`;
export const STATIC_BAD39=`public class Participant {
    public static void join(Group group) {
        group.add(this); // Compilation error
    }
}`;
export const STATIC_CALLER39=`public class Runner {
    public static void main(String[] args) {
        Group group = new Group();
        Participant.join(group);
    }
}`;
export const PASS_CASES39=[
 {id:'pass',title:'Pass the current Participant',call:'p.join(group)',answer:0,options:['The Group stores a reference to p.','The Group creates a new Participant.','The Group stores only a number, not an object reference.'],explain:'Inside p.join(group), this means p. group.add(this) passes that existing Participant reference. The printed result is true.'},
 {id:'static',title:'Can a static method use this?',call:'Participant.join(group)',answer:1,options:['It compiles and registers the most recently created Participant.','It does not compile because static methods have no this reference.','It compiles but passes null.'],explain:'A static method has no receiving Participant. It cannot use this. Leave join as an instance method and call p.join(group).'}
];
const q=(id,prompt,options,answer,hint)=>({id,prompt,options,answer,hint});
export const PRACTICE39={
 1:[
  q('39-p1','In a.add(3), what does this refer to inside add?', ['The Counter class','The Counter referenced by a','The argument 3'],1,'Find the object to the left of the dot in the method call.'),
  q('39-p2','When b.add(1) runs, which instance variable changes?', ['Only a.count','Both counters','Only b.count'],2,'Each Counter object owns its own count.')
 ],
 2:[
  q('39-p3','Given private int size; and a constructor parameter int size, how do you update the instance variable?', ['this.size = size;','size = size;','size = this.size;'],0,'The instance variable needs an explicit receiver because the parameter hides its name.'),
  q('39-p4','Which statement is true if the parameter is named newSize and the instance variable is size?', ['You must write this.size = newSize;','size = newSize; is valid without this.','newSize = size; changes the instance variable'],1,'Without a matching local name, the unqualified instance variable is accessible.')
 ],
 3:[
  q('39-p5','In p.join(group), what is passed by group.add(this)?', ['A new Group','The number of Participants','A reference to p'],2,'this is the object receiving join.'),
  q('39-p6','Where is this invalid?', ['In an instance constructor','In a static method','In an instance method'],1,'Static methods do not have a current object.')
 ],
 4:[
  q('39-p7','Inside a Contact constructor with parameter String name, how can you initialize the name instance variable?', ['name = name;','this.name = name;','Contact.name = name;'],1,'The parameter shadows the instance variable.'),
  q('39-p8','What does recipient.receiveFrom(this) pass?', ['The current Contact object reference','A copy of the Contact object','Only the current Contact name'],0,'this is a reference, and Java passes a copy of that reference as the argument.')
 ]
};
const g=(id,area,objective,prompt,options,answer,explanation,code)=>({id,area,objective,prompt,options,answer,explanation,code});
const SHORT_COUNTER=`public class Counter {
    private int count;
    public Counter(int start) { count = start; }
    public void add(int amount) { this.count += amount; }
    public int getCount() { return count; }
}

public class Runner {
    public static void main(String[] args) {
        Counter a = new Counter(2);
        Counter b = new Counter(10);
        a.add(3);
        System.out.println(a.getCount());
        System.out.println(b.getCount());
    }
}`;
const SHADOW_QUESTION=`public class Box {
    private int width;
    public Box(int width) { width = width; }
    public int getWidth() { return width; }
}

public class Runner {
    public static void main(String[] args) {
        Box b = new Box(7);
        System.out.println(b.getWidth());
    }
}`;
const GOOD_BOX=`public class Box {
    private int width;
    public Box(int width) { this.width = width; }
    public int getWidth() { return width; }
}

public class Runner {
    public static void main(String[] args) {
        Box b = new Box(7);
        System.out.println(b.getWidth());
    }
}`;
const STATIC_QUESTION=`public class Box {
    private int width;
    public static void change() {
        this.width = 5;
    }
}`;
export const QUESTIONS39=[
 g('39-g1','Current object','3.9.A.1','During a.add(3), what does this refer to?',['The object referenced by a','The object referenced by b','The class Counter','The parameter amount'],0,'this refers to the receiving object, which is a.',SHORT_COUNTER),
 g('39-g2','Receiver state','3.9.A.1','What two values are printed?',['2 then 10','5 then 13','5 then 10','10 then 5'],2,'a changes, but b is a different object with its own count.',SHORT_COUNTER),
 g('39-g3','Shadowing','3.9.A.1','What is printed?',['7','0','Compilation error','The value of this'],1,'width = width; assigns the parameter to itself; the instance variable remains 0.',SHADOW_QUESTION),
 g('39-g4','Shadowing repair','3.9.A.1','Which constructor assignment correctly stores the parameter?',['width = width;','Box.width = width;','width = this.width;','this.width = width;'],3,'this.width identifies the instance variable.',SHADOW_QUESTION),
 g('39-g5','Constructor','3.9.A.1','What is printed in this corrected version?',['0','7','Compilation error','null'],1,'The argument 7 is stored in the instance variable.',GOOD_BOX),
 g('39-g6','Optional this','3.9.A.1','If an instance variable is width and a constructor parameter is size, which assignment is valid?',['width = size;','size = size; always updates width','Box.width = size;','this.size = width;'],0,'Different names mean width is not shadowed.'),
 g('39-g7','Passing this','3.9.A.2','Inside p.join(group), what is passed to group.add(this)?',['A new Participant','The reference to Group','An integer rather than a Participant reference','The current Participant reference'],3,'this refers to p, and the method passes that reference.',`${PARTICIPANT39}\n\n${GROUP39}\n\n${JOIN_CALLER39}`),
 g('39-g8','Reference identity','3.9.A.2','What does the Runner print?',['true','false','7','A compilation error'],0,'The group stores the reference to the same Participant p.',`${PARTICIPANT39}\n\n${GROUP39}\n\n${JOIN_CALLER39}`),
 g('39-g9','Static method','3.9.A.3','Why does this class fail to compile?',['number is private','The constructor uses this','The static method uses this','Group has no constructor'],2,'Static methods have no current object reference.',STATIC_QUESTION),
 g('39-g10','Static repair','3.9.A.3','Which change makes join valid?',['Keep join static, but use this.number','Make Group.add static','Call Participant.join(group) without an instance','Remove static from join and call it on a Participant'],3,'An instance-method call supplies the receiver to which this refers.',STATIC_BAD39)
];
