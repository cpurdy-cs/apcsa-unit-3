/* 2025 College Board AP CSA CED, Topic 3.2, LO 3.2.A, EK 3.2.A.1-3.
 * All situations, wording, and assessment items are original to this lab. */
export const PAGE32 = [
 {title:'The Leaderboard Decision', subtitle:'Weigh intended benefits against unexpected consequences',minutes:13,ek:'3.2.A.2'},
 {title:'Reliability Test Bench',subtitle:'Find failures by testing ordinary and unusual conditions',minutes:17,ek:'3.2.A.1'},
 {title:'Who Owns This Code?',subtitle:'Make responsible decisions about permission and reuse',minutes:12,ek:'3.2.A.3'}
];
export const POLICIES = [
 {id:'public',label:'Real names, public rankings',benefit:'Competitive players can find their names easily; rankings may encourage participation.',risk:'A student who never consented may be embarrassed by a publicly visible low score or have identifying information exposed.',mitigation:'Offer opt-in participation, limit identifying details, and let players remove entries.',preview:['Alex Rivera — 1240','Ben Carter — 880','Morgan Lee — 120']},
 {id:'alias',label:'Nicknames, opt-in rankings',benefit:'Players can choose to compete and share achievements while revealing less personal information.',risk:'An identifying nickname or unwanted screenshot could still link a result to a student.',mitigation:'Explain the audience and retention period; let players withdraw and change nicknames.',preview:['PixelFox — 1240','BugHunter — 880','LevelZero — 120']},
 {id:'private',label:'Scores shown only to the player',benefit:'Players can track personal progress without public comparison or exposure.',risk:'A private board removes some friendly competition and may reduce interest in community challenges.',mitigation:'Offer a separate opt-in competition with limited information.',preview:['Your score — 1240','Personal best — 1240','Public list — OFF']}
];
export const IMPACT_CHALLENGES = [
 {id:'impact1',prompt:'A school deploys a ranking app to celebrate attendance. Some students become anxious when their names are shown at the bottom. Which statement is best supported?',options:['A useful program can also produce unintended harmful effects','All ranking programs are necessarily illegal','The program is reliable, so it cannot have negative effects','The benefits make all other effects irrelevant'],answer:0,hint:'A program may meet its original goal and still affect people in unanticipated ways.'},
 {id:'impact2',prompt:'Which action best reduces privacy risk while preserving a voluntary competition?',options:['Publish every student’s full name automatically','Remove all testing and launch sooner','Use opt-in aliases and a way to remove a score','Keep names but hide the leaderboard title'],answer:2,hint:'Try to reduce a specific harm without needlessly eliminating the intended benefit.'}
];
export const RELIABILITY_TESTS = [
 {id:'normal',label:'Normal purchase',tickets:30,cost:10,stock:4,kind:'Normal',expect:'Redeemed',reason:'A valid purchase with more than enough tickets and inventory.'},
 {id:'exact',label:'Exactly enough tickets',tickets:10,cost:10,stock:1,kind:'Boundary',expect:'Redeemed',reason:'Exactly the required ticket amount should be accepted.'},
 {id:'short',label:'Not enough tickets',tickets:9,cost:10,stock:2,kind:'Boundary',expect:'Rejected',reason:'One ticket below the requirement must be rejected.'},
 {id:'empty',label:'Prize out of stock',tickets:20,cost:10,stock:0,kind:'Boundary',expect:'Rejected',reason:'Zero prizes must not be treated as available inventory.'},
 {id:'negative',label:'Negative ticket cost',tickets:20,cost:-5,stock:2,kind:'Invalid',expect:'Rejected',reason:'A negative price should never award a purchase or give the player more tickets.'},
 {id:'free',label:'Zero ticket cost',tickets:20,cost:0,stock:3,kind:'Invalid',expect:'Rejected',reason:'The stated rules say the cost must be positive.'}
];
export const RELIABILITY_FIXES = [
 {id:'a',text:'Check only whether tickets >= cost; assume all other values are valid.',correct:false,reason:'This is the original bug: it misses zero stock and zero or negative costs.'},
 {id:'b',text:'Require cost > 0, stock > 0, and tickets >= cost before redeeming.',correct:true,reason:'All three stated conditions are checked before changing tickets or inventory.'},
 {id:'c',text:'Allow every request, and fix invalid records at the end of the day.',correct:false,reason:'Letting invalid changes happen fails the stated reliability requirement.'},
 {id:'d',text:'Require tickets > cost but do not check stock or price.',correct:false,reason:'Exact ticket amounts should work, and this still ignores two failure cases.'}
];
export const CODE_ASSETS = [
 {id:'opensource',name:'Open-source score formatter',description:'The author published the source code under a license permitting reuse with a required copyright notice.',answer:'licensed',why:'This code can be reused if the project follows the stated open-source license conditions.'},
 {id:'commercial',name:'Commercial payment library',description:'The vendor sells licenses and prohibits copying without permission.',answer:'permission',why:'Closed-source/commercial code requires the necessary license or permission before reuse.'},
 {id:'snippet',name:'Forum snippet with no stated license',description:'You found a useful code sample on a public website, but its author gives no permission terms.',answer:'permission',why:'Publicly visible does not automatically mean free to copy into your own program.'},
 {id:'original',name:'Code you wrote yourself',description:'You independently wrote this Java class for the arcade. No outside material was copied.',answer:'own',why:'You can reuse your own original code, subject to any separate obligations in the project.'}
];
export const ASSET_DECISIONS = [
 {id:'licensed',label:'May reuse under stated license conditions'},
 {id:'permission',label:'Obtain permission or a license first'},
 {id:'own',label:'Your own original work'}
];
export const ETHICS_CHALLENGES = [
 {id:'rights1',prompt:'A GitHub repository lets anyone read its source, but you cannot find permission terms. What is the safest conclusion?',options:['Everything on GitHub is free to reuse','Code is public to view, but reuse rights still need to be checked','The code can be sold without credit','The copyright automatically expires'],answer:1,hint:'Availability to read is not the same as having permission to reuse.'},
 {id:'rights2',prompt:'Your arcade includes a third-party library under an open-source license requiring its copyright notice. What should you do?',options:['Remove the notice because the source is public','Treat the library as your own original work','Ignore the terms unless somebody complains','Keep the notice and comply with the license'],answer:3,hint:'Open-source licenses grant rights subject to their terms.'}
];
export const QUESTIONS32 = [
 {id:'u32q1',kind:'choice',area:'System reliability',objective:'3.2.A.1',prompt:'Which statement best describes a reliable computer program?',options:['It performs its intended tasks under stated conditions without failure','It always has a visually appealing interface','It uses only one type of input','It never needs to be tested'],answer:0,explanation:'Reliability means performing expected tasks as intended under the conditions specified.'},
 {id:'u32q2',kind:'choice',area:'Reliability tests',objective:'3.2.A.1',prompt:'A prize costs 10 tickets and is in stock. Which set of ticket amounts gives the most thorough test of the purchase threshold?',options:['100, 200, and 300 tickets','9, 10, and 11 tickets','20, 30, and 40 tickets','Only 10 tickets'],answer:1,explanation:'Testing just below (9), exactly at (10), and just above (11) the threshold checks both the transition and accepted values near it.'},
 {id:'u32q3',kind:'category',area:'Test conditions',objective:'3.2.A.1',prompt:'Classify these test cases according to the stated ticket rules (positive cost and positive stock required).',items:[['30 tickets, cost 10, stock 3','Normal'],['10 tickets, cost 10, stock 1','Boundary'],['20 tickets, cost -3, stock 2','Invalid']],categories:['Normal','Boundary','Invalid'],explanation:'A normal use case differs from an exact boundary value and from an invalid negative cost.'},
 {id:'u32q4',kind:'choice',area:'Impacts of programs',objective:'3.2.A.2',prompt:'An arcade leaderboard increases participation but unexpectedly reveals the lowest-scoring students to the whole school. What does this illustrate?',options:['A program can have intended benefits and unintended harmful effects','Public rankings guarantee system reliability','Social effects cannot be considered until code is finished','If the code compiles, the design has no ethical implications'],answer:0,explanation:'Beneficial goals do not rule out unintended harmful social consequences.'},
 {id:'u32q5',kind:'choice',area:'Responsible design',objective:'3.2.A.2',prompt:'Which change best reduces the privacy harm of a public leaderboard while keeping an option for competition?',options:['Publish everyone’s full name automatically','Turn off all scores, including personal scores','Use optional participation and aliases, with a way to remove results','Hide score values but continue publishing names without consent'],answer:2,explanation:'An opt-in leaderboard with aliases and removal controls addresses privacy while preserving some benefit.'},
 {id:'u32q6',kind:'choice',area:'Code ownership',objective:'3.2.A.3',prompt:'You find a useful code library that is not open source. What must you do before incorporating it into your project?',options:['Copy it because it is available online','Obtain the required permission or license','Rename the methods so it becomes your code','Use it without permission if you do not charge money'],answer:1,explanation:'Non-open-source code needs the appropriate permission, and often a paid license.'},
 {id:'u32q7',kind:'choice',area:'Open source',objective:'3.2.A.3',prompt:'An open-source library permits reuse but requires including its copyright notice. Which action is appropriate?',options:['Do not use it because all open-source code is forbidden','Remove the notice after changing a variable name','Keep the required notice and follow the license terms','Claim that you wrote every line yourself'],answer:2,explanation:'The permission to reuse is subject to the license conditions.'},
 {id:'u32q8',kind:'choice',area:'Testing and responsibility',objective:'3.2.A.1–3',prompt:'Which release plan best addresses reliability and responsible reuse for a new arcade prize system?',options:['Test only a typical purchase and copy any code found online','Focus on performance and skip reviewing unintended consequences','Publish immediately; repair errors if anyone complains','Test normal, boundary and invalid inputs, evaluate impacts, and check reuse permissions'],answer:3,explanation:'Responsible programming combines varied testing, consideration of social effects, and legal/ethical code use.'}
];
export const TOPIC32_PASS_CORRECT=7;
