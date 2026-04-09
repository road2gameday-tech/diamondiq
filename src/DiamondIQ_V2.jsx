import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────────
const B = {
  navy:      "#1B3A6B",
  navyDark:  "#102447",
  navyLight: "#2A5298",
  sky:       "#89BEE8",
  skyLight:  "#B8D8F0",
  skyPale:   "#E8F4FC",
  white:     "#FFFFFF",
  offWhite:  "#F0F7FF",
  correct:   "#2E8B57",
  wrong:     "#C0392B",
  gold:      "#E8A020",
  goldLight: "#FDF0DC",
};

const CATS = {
  "STATS & RECORDS":    { color: B.gold,    icon: "📊", bg: "rgba(232,160,32,0.12)",   baseKey: "stats"    },
  "RULES & SITUATIONS": { color: B.sky,     icon: "📋", bg: "rgba(137,190,232,0.12)",  baseKey: "rules"    },
  "HISTORIC MOMENTS":   { color: "#E05050", icon: "🏆", bg: "rgba(224,80,80,0.12)",    baseKey: "historic" },
  "YOUTH & COLLEGE":    { color: "#4CAF8A", icon: "🎓", bg: "rgba(76,175,138,0.12)",   baseKey: "youth"    },
  "FUN & RANDOM":       { color: "#9B59B6", icon: "🎲", bg: "rgba(155,89,182,0.12)",   baseKey: "fun"      },
};

// ─────────────────────────────────────────────────────────────────
// QUESTIONS  (difficulty: 1=Rookie  2=Pro  3=All-Star)
// fact: shown on the review screen after each game
// ─────────────────────────────────────────────────────────────────
const ALL_QUESTIONS = [
  // ── STATS & RECORDS ─────────────────────────────────────────
  { q:"Which team has won the most World Series titles?",              a:"New York Yankees",            choices:["Boston Red Sox","New York Yankees","St. Louis Cardinals","Los Angeles Dodgers"],      cat:"STATS & RECORDS", diff:1, fact:"The Yankees have won 27 World Series championships — more than twice as many as any other team." },
  { q:"What was Joe DiMaggio's famous consecutive-game hitting streak?", a:"56 games",                 choices:["44 games","56 games","61 games","72 games"],                                          cat:"STATS & RECORDS", diff:1, fact:"DiMaggio's 56-game streak in 1941 is widely considered the most unbreakable record in sports." },
  { q:"Who is MLB's all-time leader in career hits?",                  a:"Pete Rose",                  choices:["Ty Cobb","Pete Rose","Hank Aaron","Derek Jeter"],                                     cat:"STATS & RECORDS", diff:1, fact:"Pete Rose retired with 4,256 career hits — 130 more than Ty Cobb in second place." },
  { q:"How many teams currently make up Major League Baseball?",       a:"30",                         choices:["28","29","30","32"],                                                                  cat:"STATS & RECORDS", diff:1, fact:"MLB has 30 teams divided into two leagues (AL and NL) with three divisions each." },
  { q:"What is Ted Williams' famous 1941 batting average?",            a:".406",                       choices:[".389",".394",".406",".412"],                                                          cat:"STATS & RECORDS", diff:1, fact:"Ted Williams hit .406 in 1941 — the last player to bat over .400. He played both games of a doubleheader on the final day to protect the mark." },
  { q:"How many consecutive games did Cal Ripken Jr. play?",           a:"2,632",                      choices:["2,130","2,400","2,632","2,900"],                                                      cat:"STATS & RECORDS", diff:1, fact:"Ripken played 2,632 consecutive games from 1982 to 1998, earning the nickname 'Iron Man.'" },

  { q:"Who holds the MLB career home run record?",                     a:"Barry Bonds",                choices:["Babe Ruth","Hank Aaron","Barry Bonds","Willie Mays"],                                 cat:"STATS & RECORDS", diff:2, fact:"Barry Bonds hit 762 career home runs across 22 seasons, surpassing Hank Aaron's previous record of 755." },
  { q:"Who set the MLB single-season hits record with 262 in 2004?",   a:"Ichiro Suzuki",              choices:["Pete Rose","Ty Cobb","Ichiro Suzuki","George Sisler"],                                cat:"STATS & RECORDS", diff:2, fact:"Ichiro smashed 262 hits in 2004 to break George Sisler's 84-year-old record of 257." },
  { q:"Who struck out 383 batters in a single season (2001)?",         a:"Randy Johnson",              choices:["Nolan Ryan","Randy Johnson","Bob Gibson","Max Scherzer"],                             cat:"STATS & RECORDS", diff:2, fact:"Randy Johnson struck out 383 batters in 2001 for the Arizona Diamondbacks. He was 6'10\" — the tallest pitcher to win a Cy Young Award." },
  { q:"Which player hit 73 home runs in a single season (2001)?",      a:"Barry Bonds",                choices:["Mark McGwire","Sammy Sosa","Barry Bonds","Alex Rodriguez"],                          cat:"STATS & RECORDS", diff:2, fact:"Barry Bonds hit 73 home runs in 2001 — the current single-season record. He walked a record 232 times the following season." },
  { q:"Who holds the record for most career stolen bases in MLB?",     a:"Rickey Henderson",           choices:["Lou Brock","Ty Cobb","Tim Raines","Rickey Henderson"],                               cat:"STATS & RECORDS", diff:2, fact:"Rickey Henderson stole 1,406 bases — over 400 more than Lou Brock in second place. He also set the single-season record with 130 steals in 1982." },
  { q:"Who holds the record for most career saves in MLB history?",    a:"Mariano Rivera",             choices:["Trevor Hoffman","Lee Smith","John Franco","Mariano Rivera"],                         cat:"STATS & RECORDS", diff:2, fact:"Mariano Rivera finished with 652 saves and was the first player unanimously elected to the Hall of Fame (100% of votes) in 2019." },
  { q:"What pitcher has the most career strikeouts in MLB history?",   a:"Nolan Ryan",                 choices:["Roger Clemens","Randy Johnson","Nolan Ryan","Steve Carlton"],                        cat:"STATS & RECORDS", diff:2, fact:"Ryan struck out 5,714 batters over 27 seasons — nearly 1,600 more than second-place Randy Johnson. He also threw 7 career no-hitters." },
  { q:"What is Ty Cobb's career batting average — the highest in MLB?", a:".366",                      choices:[".357",".366",".372",".380"],                                                          cat:"STATS & RECORDS", diff:2, fact:"Cobb's .366 career average is the highest in MLB history. He also won 12 batting titles." },
  { q:"Who was the first 40-HR / 40-stolen-base player in MLB history?", a:"Jose Canseco",             choices:["Barry Bonds","Jose Canseco","Rickey Henderson","Bobby Bonds"],                       cat:"STATS & RECORDS", diff:2, fact:"Jose Canseco became the first 40-40 player in 1988 with the Oakland A's." },

  { q:"Who holds the MLB record for most RBI in a single season (191)?", a:"Hack Wilson",              choices:["Lou Gehrig","Hack Wilson","Babe Ruth","Jimmie Foxx"],                                 cat:"STATS & RECORDS", diff:3, fact:"Hack Wilson of the 1930 Chicago Cubs drove in 191 runs — a record that has stood for nearly 100 years." },
  { q:"Which pitcher won 511 career games — a record that may never be broken?", a:"Cy Young",         choices:["Walter Johnson","Christy Mathewson","Cy Young","Grover Cleveland Alexander"],        cat:"STATS & RECORDS", diff:3, fact:"Cy Young won 511 games from 1890–1911. The annual pitching award is named in his honor." },
  { q:"Orel Hershiser set the record for consecutive scoreless innings in 1988. How many?", a:"59",     choices:["47","52","59","66"],                                                                  cat:"STATS & RECORDS", diff:3, fact:"Hershiser threw 59 consecutive scoreless innings, breaking Don Drysdale's record of 58.2. He also won the NL Cy Young AND World Series MVP that year." },
  { q:"Which pitcher threw the most no-hitters in MLB history?",       a:"Nolan Ryan (7)",             choices:["Sandy Koufax (4)","Bob Feller (3)","Nolan Ryan (7)","Randy Johnson (2)"],            cat:"STATS & RECORDS", diff:3, fact:"Nolan Ryan threw 7 career no-hitters — more than double the next closest pitcher." },
  { q:"How many stitches are on an official MLB baseball?",            a:"216",                        choices:["108","144","180","216"],                                                              cat:"STATS & RECORDS", diff:3, fact:"Each MLB baseball has exactly 216 stitches, all sewn by hand." },
  { q:"What is the MLB record for most strikeouts by a batter in a single season?", a:"223",           choices:["212","223","224","230"],                                                              cat:"STATS & RECORDS", diff:3, fact:"Mark Reynolds struck out 223 times in 2009. The modern game has seen K rates climb significantly." },
  { q:"Barry Bonds won how many consecutive NL batting titles (2000–2006)?", a:"7",                    choices:["4","5","6","7"],                                                                      cat:"STATS & RECORDS", diff:3, fact:"Barry Bonds won 7 straight NL batting titles and also holds the single-season OBP (.609) and slugging percentage (.863) records — both set in 2004." },

  // ── RULES & SITUATIONS ──────────────────────────────────────
  { q:"How many balls result in a walk?",                              a:"4",                          choices:["3","4","5","6"],                                                                      cat:"RULES & SITUATIONS", diff:1, fact:"Four balls result in a walk. In 2023, MLB introduced the automatic intentional walk — a team can signal one without throwing four pitches." },
  { q:"How many innings are in a standard MLB game?",                  a:"9",                          choices:["7","8","9","10"],                                                                     cat:"RULES & SITUATIONS", diff:1, fact:"Nine innings is the standard. Since 2020, extra innings start with a runner on second base — the 'zombie runner' rule." },
  { q:"What is a 'perfect game' in baseball?",                        a:"27 up, 27 down — no batter reaches base", choices:["A pitcher strikes out every batter","27 up, 27 down — no batter reaches base","A shutout where the pitcher goes the distance","A game where one team scores 10+ runs"], cat:"RULES & SITUATIONS", diff:1, fact:"Only 23 perfect games have been thrown in MLB history. Don Larsen's 1956 World Series perfect game remains the most famous." },
  { q:"What is a 'sacrifice fly'?",                                   a:"A fly ball caught for an out that scores a runner", choices:["A bunt that advances a runner","A fly ball caught for an out that scores a runner","A pop-up caught in foul territory","A deep fly ball caught at the wall"], cat:"RULES & SITUATIONS", diff:1, fact:"A sac fly must result in a run scoring. The batter is not charged with an at-bat, but it counts as an RBI." },
  { q:"How many players are on the field for the defensive team at one time?", a:"9",                  choices:["8","9","10","11"],                                                                    cat:"RULES & SITUATIONS", diff:1, fact:"Nine fielders: pitcher, catcher, 1B, 2B, 3B, SS, LF, CF, RF. Since 2023, at least 4 infielders must be on the dirt." },
  { q:"What is a 'balk'?",                                            a:"An illegal pitching motion that lets baserunners advance", choices:["A foul tip caught by catcher","An illegal pitching motion that lets baserunners advance","A dropped third strike","A wild pitch"], cat:"RULES & SITUATIONS", diff:1, fact:"A balk is declared when a pitcher makes an illegal motion designed to deceive baserunners. There are 13 ways to commit a balk." },

  { q:"What is the 'infield fly rule' designed to prevent?",          a:"Easy double plays on pop-ups with runners on base", choices:["Intentional errors","Easy double plays on pop-ups with runners on base","Interference calls","Stolen base attempts"], cat:"RULES & SITUATIONS", diff:2, fact:"The infield fly rule was introduced in 1895 to prevent infielders from intentionally dropping pop-ups to get easy double plays." },
  { q:"What is the 'dropped third strike' rule?",                     a:"Batter can run to first if catcher drops strike 3 and first base is unoccupied", choices:["Strikeout counts even if catcher drops the ball","Batter can run to first if catcher drops strike 3 and first base is unoccupied","Batter is awarded first base whenever catcher drops a pitch","Batter gets another pitch"], cat:"RULES & SITUATIONS", diff:2, fact:"If the catcher doesn't catch strike three — and first base is open or there are 2 outs — the batter can run to first." },
  { q:"What happens if a batted ball bounces over the outfield fence?", a:"Ground rule double",        choices:["Foul ball","Ground rule double","Home run","Batter is out"],                          cat:"RULES & SITUATIONS", diff:2, fact:"A ball bouncing over the fence is a ground rule double — batter and runners advance exactly two bases." },
  { q:"What distinguished the AL lineup from the NL before 2022?",    a:"AL used the Designated Hitter; NL pitchers batted", choices:["AL batted 10 players","AL used the Designated Hitter; NL pitchers batted","AL pitchers batted last","AL had no pinch-hitting rules"], cat:"RULES & SITUATIONS", diff:2, fact:"The DH was introduced to the AL in 1973. The NL resisted until 2020 and it became universal in 2022." },
  { q:"What must happen for a pitcher to be credited with a 'save'?", a:"Enter with a lead of 3 or fewer runs and finish the game without giving up the lead", choices:["Pitch at least 3 innings without giving up a run","Enter with a lead of 3 or fewer runs and finish the game without giving up the lead","Strike out the side to end the game","Pitch the final inning of any win"], cat:"RULES & SITUATIONS", diff:2, fact:"The save was made an official stat in 1969. It requires entering with the tying run on deck or protecting a 3-run-or-less lead." },
  { q:"What is the 'tag-up' rule on fly balls?",                      a:"Runners must return and touch their base before advancing after a catch", choices:["Runners must tag the base before the pitch","Runners must return and touch their base before advancing after a catch","Runners can advance at any time on a fly ball","Runners must wait until the ball hits the ground"], cat:"RULES & SITUATIONS", diff:2, fact:"After a fly ball is caught, runners must tag up before advancing. A fast runner can often score from third on a deep fly ball." },
  { q:"Under the 2023 MLB pitch clock, how many seconds does a pitcher have with bases empty?", a:"15 seconds", choices:["12 seconds","15 seconds","20 seconds","25 seconds"],                       cat:"RULES & SITUATIONS", diff:2, fact:"The pitch clock (15 sec empty, 20 sec with runners) was introduced in 2023. Average game time dropped by about 24 minutes." },
  { q:"What is a 'force out'?",                                       a:"An out recorded by tagging the base when the runner is forced to advance", choices:["Any out recorded by tagging the base when the runner is forced to advance","Tagging a runner directly with the ball","A strikeout","A pickoff at first base"], cat:"RULES & SITUATIONS", diff:2, fact:"A force out happens when a runner has no choice but to advance — the fielder simply holds the ball and touches the base." },

  { q:"What is the 'pine tar rule' that ended George Brett's HR in 1983?", a:"Pine tar more than 18 inches up the bat handle is illegal", choices:["Any pine tar on a bat is illegal","Pine tar more than 18 inches up the bat handle is illegal","Pine tar on the pitcher's hand is illegal","Pine tar can only be on the barrel"], cat:"RULES & SITUATIONS", diff:3, fact:"Brett's HR was nullified because pine tar exceeded 18 inches on his bat. AL President Lee MacPhail overturned it four days later, ruling the HR counted." },
  { q:"What is 'catcher's interference'?",                            a:"Batter is awarded first base when the bat strikes the catcher's glove during a swing", choices:["Batter swings and hits the catcher's mitt with no penalty","Batter is awarded first base when the bat strikes the catcher's glove during a swing","Runner running into a fielder in the baseline","Batter stepping out of the batter's box"], cat:"RULES & SITUATIONS", diff:3, fact:"Catcher's interference is called when the catcher makes contact with the batter's bat during the swing. The batter is awarded first base." },
  { q:"What is the 'neighborhood play' that MLB changed with replay in 2016?", a:"Giving middle infielders credit for a force out even if they left the bag slightly early", choices:["A rule allowing fielders to use nearby walls as a guide","Giving middle infielders credit for a force out even if they left the bag slightly early","A rule about fielders near the warning track","The catcher's right to block home plate"], cat:"RULES & SITUATIONS", diff:3, fact:"For decades, umpires gave 2B/SS the benefit of the doubt on double plays for safety. In 2016, replay changed this — fielders must now maintain contact with the bag." },
  { q:"What is the 2023 MLB shift restriction rule?",                 a:"All four infielders must have both feet on the dirt with two on each side of second base", choices:["Outfielders can't play in the infield","All four infielders must have both feet on the dirt with two on each side of second base","Only three infielders can shift to one side","Infielders must remain in marked positions until the ball is hit"], cat:"RULES & SITUATIONS", diff:3, fact:"The shift ban requires 4 infielders on the dirt with 2 on each side of 2B. Batting averages on balls in play rose slightly in 2023." },
  { q:"What happens when a fair batted ball hits a baserunner in fair territory?", a:"Runner is out, ball is dead, batter gets a single", choices:["Runner is automatically out and batter gets a double","Runner is out, ball is dead, batter gets a single","Runners can never be hit by batted balls","The ball is live and play continues"], cat:"RULES & SITUATIONS", diff:3, fact:"If a fair batted ball hits a runner before passing an infielder, the runner is out, the batter gets a single, and other runners return." },
  { q:"What is the 2023 MLB pickoff limit rule?",                    a:"Pitchers are limited to 2 pickoff attempts per plate appearance before a balk penalty", choices:["Runners can no longer dive back to first","Pitchers are limited to 2 pickoff attempts per plate appearance before a balk penalty","Stolen bases no longer count pickoffs","Runners can leave the base before the pitcher's windup"], cat:"RULES & SITUATIONS", diff:3, fact:"A third pickoff attempt is a balk unless the runner is picked off. Stolen base attempts surged as a result." },

  // ── HISTORIC MOMENTS ────────────────────────────────────────
  { q:"In what year did Jackie Robinson break the MLB color barrier?",  a:"1947",                      choices:["1945","1947","1950","1952"],                                                          cat:"HISTORIC MOMENTS", diff:1, fact:"Jackie Robinson broke the color barrier with the Brooklyn Dodgers on April 15, 1947. His number 42 is retired by every MLB team." },
  { q:"What year did Hank Aaron break Babe Ruth's career HR record?",  a:"1974",                       choices:["1971","1973","1974","1975"],                                                          cat:"HISTORIC MOMENTS", diff:1, fact:"Aaron hit his 715th homer on April 8, 1974, off Al Downing. He received thousands of death threats and finished with 755 career HRs." },
  { q:"Who was the first African American to play in MLB in the modern era?", a:"Jackie Robinson",      choices:["Willie Mays","Hank Aaron","Jackie Robinson","Josh Gibson"],                          cat:"HISTORIC MOMENTS", diff:1, fact:"Jackie Robinson broke the color barrier with the Brooklyn Dodgers on April 15, 1947. His number 42 is retired by every MLB team." },
  { q:"In what year was the first World Series played?",               a:"1903",                       choices:["1896","1900","1903","1910"],                                                          cat:"HISTORIC MOMENTS", diff:1, fact:"The 1903 World Series featured the Pittsburgh Pirates vs. Boston Americans. Boston won 5-3 in a best-of-9 format." },
  { q:"Who is the legendary 'Say Hey Kid'?",                           a:"Willie Mays",                choices:["Mickey Mantle","Hank Aaron","Roberto Clemente","Willie Mays"],                        cat:"HISTORIC MOMENTS", diff:1, fact:"Willie Mays earned his nickname for enthusiastically calling out 'Say Hey!' to teammates. He's widely considered the greatest all-around player in baseball history." },
  { q:"Which team ended a 108-year World Series drought in 2016?",     a:"Chicago Cubs",               choices:["Cleveland Indians","Chicago Cubs","Boston Red Sox","Houston Astros"],                 cat:"HISTORIC MOMENTS", diff:1, fact:"The Cubs' 2016 World Series win was their first since 1908 — the longest drought in North American sports history. They defeated Cleveland in a Game 7 rain-delay comeback." },

  { q:"The 2004 Boston Red Sox became the first team to come back from 3-0 in a series. Who did they beat?", a:"New York Yankees", choices:["New York Yankees","St. Louis Cardinals","Chicago Cubs","Houston Astros"], cat:"HISTORIC MOMENTS", diff:2, fact:"Down 3-0 to the Yankees in the ALCS, the Sox won 4 straight, then swept the Cardinals to end an 86-year championship drought." },
  { q:"The 'Miracle Mets' won the World Series in what year?",         a:"1969",                       choices:["1962","1966","1969","1973"],                                                          cat:"HISTORIC MOMENTS", diff:2, fact:"The 1969 Mets shocked the heavily-favored Baltimore Orioles in 5 games. It's still considered one of sports' greatest upsets." },
  { q:"Kirk Gibson's 1988 World Series pinch-hit HR was off which closer?", a:"Dennis Eckersley",       choices:["Lee Smith","Rich Gossage","Dennis Eckersley","Rollie Fingers"],                      cat:"HISTORIC MOMENTS", diff:2, fact:"Gibson could barely walk due to injuries but hobbled up and hit a walk-off 2-run HR off Eckersley. His fist pump is one of sports' most iconic moments." },
  { q:"Don Larsen threw the only perfect game in World Series history. What year?", a:"1956",           choices:["1952","1956","1960","1965"],                                                          cat:"HISTORIC MOMENTS", diff:2, fact:"Larsen's perfect game in Game 5 of the 1956 World Series (Yankees vs. Dodgers) is arguably the most remarkable pitching performance ever. Larsen had a 3-21 record in 1954." },
  { q:"What happened in the 1919 'Black Sox' scandal?",                a:"Eight White Sox players conspired with gamblers to lose the 1919 World Series", choices:["Eight players were caught using steroids","Eight White Sox players conspired with gamblers to lose the 1919 World Series","An umpire was bribed","Three players bet on their own team to win"], cat:"HISTORIC MOMENTS", diff:2, fact:"Eight White Sox players including 'Shoeless' Joe Jackson were banned for life by Commissioner Kenesaw Mountain Landis." },
  { q:"What year did free agency begin in MLB after Andy Messersmith challenged the reserve clause?", a:"1976", choices:["1969","1972","1976","1981"],                                                  cat:"HISTORIC MOMENTS", diff:2, fact:"Arbitrator Peter Seitz upheld Messersmith's free agency claim in December 1975. Free agency officially began in 1976, fundamentally changing baseball economics." },
  { q:"What is the 'Bartman Game' incident from the 2003 NLCS?",       a:"A fan caught a foul ball that Moises Alou appeared ready to catch, contributing to the Cubs' collapse", choices:["A fan ran onto the field and disrupted play","A Marlins fan threw debris at a Cubs outfielder","A fan caught a foul ball that Moises Alou appeared ready to catch, contributing to the Cubs' collapse","Bartman hit a HR in a pick-up game"], cat:"HISTORIC MOMENTS", diff:2, fact:"Fan Steve Bartman reached for a foul ball in the 8th inning of Game 6 with the Cubs 5 outs from the World Series. The Cubs surrendered 8 runs and lost. They lost Game 7 too." },
  { q:"What team did the Houston Astros defeat to win their first World Series in 2017?", a:"Los Angeles Dodgers", choices:["New York Yankees","Los Angeles Dodgers","Chicago Cubs","Washington Nationals"], cat:"HISTORIC MOMENTS", diff:2, fact:"The 2017 World Series (Astros vs. Dodgers) went 7 games with 5 walk-offs. It was later overshadowed by the Astros' sign-stealing scandal." },

  { q:"Who hit the 'Shot Heard Round the World' in 1951?",             a:"Bobby Thomson",              choices:["Duke Snider","Willie Mays","Bobby Thomson","Jackie Robinson"],                        cat:"HISTORIC MOMENTS", diff:3, fact:"Bobby Thomson's 3-run walk-off HR on October 3, 1951 completed the Giants' stunning comeback from 13.5 games back to beat the Dodgers." },
  { q:"Who was the pitcher when Babe Ruth allegedly hit his 'called shot' HR in the 1932 World Series?", a:"Charlie Root", choices:["Gabby Hartnett","Charlie Root","Mark Koenig","Art Ditmar"],       cat:"HISTORIC MOMENTS", diff:3, fact:"In Game 3 vs. the Cubs, Ruth supposedly pointed to center field before homering off Charlie Root. Whether he truly called it remains debated to this day." },
  { q:"Bill Mazeroski's 1960 World Series walk-off HR in Game 7 — who did he hit it off?", a:"Ralph Terry", choices:["Whitey Ford","Art Ditmar","Ralph Terry","Jim Coates"],                          cat:"HISTORIC MOMENTS", diff:3, fact:"Mazeroski's bottom-of-the-9th HR off Ralph Terry remains the only Game 7 walk-off HR to end a World Series." },
  { q:"What was the 'Merkle Boner' that cost the Giants the 1908 pennant?",  a:"Fred Merkle didn't touch second base on a walk-off hit, allowing the Cubs to record a force out", choices:["Merkle failed to tag out a runner on a double play","Fred Merkle didn't touch second base on a walk-off hit, allowing the Cubs to record a force out","Merkle dropped a routine pop-up","Merkle ran past third base and was tagged out"], cat:"HISTORIC MOMENTS", diff:3, fact:"19-year-old Merkle failed to touch 2B on what everyone thought was the game-winning hit. Cubs 2B Johnny Evers got the ball and touched 2nd for the force. The Cubs won the replayed game." },
  { q:"Which team was involved in the 'Pine Tar Game' of 1983?",       a:"Kansas City Royals vs. New York Yankees", choices:["Boston Red Sox vs. Cleveland Indians","Kansas City Royals vs. New York Yankees","Chicago White Sox vs. Detroit Tigers","Baltimore Orioles vs. Oakland A's"], cat:"HISTORIC MOMENTS", diff:3, fact:"George Brett's HR off Goose Gossage was nullified by umpires due to too much pine tar. The AL president overturned the call 4 days later." },
  { q:"How many times did Ty Cobb steal home — still an MLB record?",   a:"54 times",                  choices:["28 times","35 times","47 times","54 times"],                                         cat:"HISTORIC MOMENTS", diff:3, fact:"Ty Cobb stole home 54 times — an MLB record that still stands. His aggressive, combative style made him one of baseball's most feared players." },
  { q:"What was significant about the 1947 World Series featuring Jackie Robinson's Brooklyn Dodgers?", a:"First Series featuring a Black player AND first broadcast on national TV", choices:["First Series broadcast on national TV only","First Series featuring a Black player only","First Series featuring a Black player AND first broadcast on national TV","First Series played outdoors at night"], cat:"HISTORIC MOMENTS", diff:3, fact:"The 1947 Series was seen by an estimated 3.9 million TV viewers — and featured the first Black player in World Series history." },

  // ── YOUTH & COLLEGE ─────────────────────────────────────────
  { q:"In what state is the Little League World Series held each year?", a:"Pennsylvania",              choices:["Ohio","Pennsylvania","New York","New Jersey"],                                        cat:"YOUTH & COLLEGE", diff:1, fact:"Williamsport, Pennsylvania has hosted the LLWS since 1947. Little League Baseball was founded there in 1939 by Carl Stotz." },
  { q:"What city hosts the College World Series every year?",           a:"Omaha, Nebraska",            choices:["Omaha, Nebraska","Austin, Texas","Gainesville, Florida","Baton Rouge, Louisiana"],   cat:"YOUTH & COLLEGE", diff:1, fact:"Omaha has hosted the CWS since 1950, the longest-running championship venue in NCAA history." },
  { q:"What country has won the Little League World Series most often (non-US)?", a:"Japan",            choices:["Japan","Dominican Republic","Puerto Rico","Cuba"],                                    cat:"YOUTH & COLLEGE", diff:1, fact:"Japan has won the LLWS more than any other non-US nation, known for exceptional fundamentals and teamwork." },
  { q:"What does 'OPS' stand for in baseball stats?",                  a:"On-base Plus Slugging",       choices:["On-base Percentage System","On-base Plus Slugging","Overall Pitching Score","Out-to-hit Plus Slugging"], cat:"YOUTH & COLLEGE", diff:1, fact:"OPS combines on-base percentage and slugging percentage into a single offensive metric. A 1.000 OPS is considered elite." },
  { q:"What is 'hitting for the cycle'?",                              a:"Single, double, triple, and HR in one game", choices:["Three home runs in one game","Single, double, triple, and HR in one game","Four hits in four at-bats","A hit in every inning"], cat:"YOUTH & COLLEGE", diff:1, fact:"Hitting for the cycle happens only about 4-5 times per season. A 'natural cycle' — hits in order (1B, 2B, 3B, HR) — is the rarest form." },
  { q:"Which country won the first ever World Baseball Classic in 2006?", a:"Japan",                   choices:["United States","Dominican Republic","Cuba","Japan"],                                   cat:"YOUTH & COLLEGE", diff:1, fact:"Japan defeated Cuba 10-6 in the inaugural WBC final. Japan has since won 3 of the 5 WBC tournaments held (2006, 2009, 2023)." },

  { q:"Which college has won the most NCAA Division I baseball championships?", a:"USC",                choices:["Texas","LSU","Arizona State","USC"],                                                  cat:"YOUTH & COLLEGE", diff:2, fact:"USC has won 12 national titles, most in D-I history. LSU is the most dominant in the modern era with 6 national championships." },
  { q:"Who was drafted first overall in the 1985 MLB Draft?",          a:"B.J. Surhoff",               choices:["Ken Griffey Jr.","Barry Bonds","B.J. Surhoff","Shawn Abner"],                        cat:"YOUTH & COLLEGE", diff:2, fact:"B.J. Surhoff (Univ. of North Carolina) was the #1 pick in 1985 by Milwaukee. Ken Griffey Jr. was picked #1 in 1987." },
  { q:"What did Derek Jeter do before being drafted by the Yankees in 1992?", a:"Drafted straight out of high school", choices:["Attended University of Michigan","Played at Michigan State","Graduated from Notre Dame","Drafted straight out of high school"], cat:"YOUTH & COLLEGE", diff:2, fact:"Jeter was drafted 6th overall out of Kalamazoo Central High School. He committed to Michigan but never attended after signing." },
  { q:"Who was the top overall prospect in the 2009 MLB Draft?",       a:"Stephen Strasburg",          choices:["Bryce Harper","Stephen Strasburg","Buster Posey","Mike Stanton"],                     cat:"YOUTH & COLLEGE", diff:2, fact:"Strasburg was the consensus #1 pick from San Diego State and signed a then-record $15.1 million bonus. His 2010 MLB debut with 14 Ks was one of the most hyped in history." },
  { q:"What does 'Tommy John Surgery' repair?",                        a:"Ulnar collateral ligament in the elbow", choices:["Knee cartilage","Ulnar collateral ligament in the elbow","Shoulder labrum","Wrist tendon"], cat:"YOUTH & COLLEGE", diff:2, fact:"Tommy John surgery (UCL reconstruction) repairs the elbow ligament most stressed by pitching. Dr. Frank Jobe performed the first successful one on Tommy John in 1974." },
  { q:"What did Bryce Harper do at age 16 to become draft-eligible early?", a:"Got his GED, making him eligible as a college-age player", choices:["Applied for a medical hardship waiver","Got his GED, making him eligible as a college-age player","Declared himself a Cuban defector","Got special permission from the Commissioner"], cat:"YOUTH & COLLEGE", diff:2, fact:"Harper earned his GED at 16, enrolled at the College of Southern Nevada, and was declared draft-eligible. The Nationals drafted him #1 overall in 2010 at just 17." },
  { q:"What age are Little League World Series players?",              a:"10–12",                       choices:["8–10","10–12","11–13","12–14"],                                                       cat:"YOUTH & COLLEGE", diff:2, fact:"LLWS players are 10-12 years old. Cheating scandals around age documentation have occurred, most infamously with the 2001 champion team from Venezuela." },
  { q:"In 2023, which country won the World Baseball Classic?",        a:"USA",                        choices:["USA","Dominican Republic","Puerto Rico","Venezuela"],                                  cat:"YOUTH & COLLEGE", diff:2, fact:"The US defeated Japan 3-2 in the 2023 WBC Final. Shohei Ohtani struck out Mike Trout to end the game — teammate vs. teammate for the last out." },

  { q:"Who was the first-ever MLB Draft pick in 1965?",                a:"Rick Monday",                choices:["Tom Seaver","Steve Carlton","Rick Monday","Nolan Ryan"],                              cat:"YOUTH & COLLEGE", diff:3, fact:"Rick Monday (Arizona State) was the first-ever MLB Draft pick by the Kansas City Athletics in 1965. He's also famous for rescuing an American flag from fans who tried to burn it on the field in 1976." },
  { q:"What college did Alex Rodriguez attend before being drafted #1 overall in 1993?", a:"He was drafted directly from Westminster Christian High School", choices:["University of Miami","University of Florida","He was drafted directly from Westminster Christian High School","He was drafted from Puerto Rico"], cat:"YOUTH & COLLEGE", diff:3, fact:"Rodriguez was drafted directly out of Westminster Christian High School in Miami at age 17. He signed with the Mariners for $1.3 million." },
  { q:"Which pitcher dominated college baseball at University of Texas in the early 1980s?", a:"Roger Clemens", choices:["Roger Clemens","Greg Maddux","Nolan Ryan","Tom Seaver"],                   cat:"YOUTH & COLLEGE", diff:3, fact:"Roger Clemens pitched for Texas from 1981-1983, going 25-7 in college. He was drafted 19th overall by the Red Sox and would win 7 Cy Young Awards." },
  { q:"Which MLB team drafted the most top-10 picks in the early 2010s due to prolonged losing?", a:"Pittsburgh Pirates", choices:["Houston Astros","Kansas City Royals","Pittsburgh Pirates","San Diego Padres"], cat:"YOUTH & COLLEGE", diff:3, fact:"The Pirates drafted McCutchen, Alvarez, Gerrit Cole, Taillon, and Polanco in consecutive top-10 selections — a remarkable haul of talent." },
  { q:"What year was Little League Baseball founded in Williamsport, Pennsylvania?", a:"1939",         choices:["1935","1939","1944","1947"],                                                           cat:"YOUTH & COLLEGE", diff:3, fact:"Carl Stotz founded Little League Baseball in Williamsport in 1939 with just three teams. Today it has over 2.4 million players in 84 countries worldwide." },
  { q:"Which iconic college baseball rivalry is called the 'Civil War'?", a:"Oregon vs. Oregon State", choices:["Oregon vs. Oregon State","Washington vs. Oregon","Washington State vs. Oregon State","Stanford vs. Oregon"], cat:"YOUTH & COLLEGE", diff:3, fact:"The Oregon-Oregon State rivalry is called the Civil War. Oregon State has long been one of the country's elite baseball programs, winning national titles in 2006 and 2007." },
  { q:"What was the age of the youngest player ever to appear in an MLB game (Joe Nuxhall)?", a:"15 years old", choices:["14 years old","15 years old","16 years old","17 years old"],                cat:"YOUTH & COLLEGE", diff:3, fact:"Joe Nuxhall pitched for the Cincinnati Reds on June 10, 1944 at just 15 years and 10 months old. He didn't return to the majors for 8 years." },

  // ── FUN & RANDOM ────────────────────────────────────────────
  { q:"What is the official food most associated with baseball stadiums?", a:"Hot dog",                 choices:["Pizza","Hot dog","Nachos","Pretzel"],                                                 cat:"FUN & RANDOM", diff:1, fact:"Americans eat about 20 million hot dogs at MLB stadiums each year. The tradition dates to the 1890s." },
  { q:"What song is traditionally sung during the 7th-inning stretch?", a:"Take Me Out to the Ballgame", choices:["The Star-Spangled Banner","God Bless America","Take Me Out to the Ballgame","America the Beautiful"], cat:"FUN & RANDOM", diff:1, fact:"'Take Me Out to the Ballgame' (1908) is sung at virtually every MLB game during the 7th-inning stretch." },
  { q:"What is the name of the Chicago Cubs' iconic ballpark?",        a:"Wrigley Field",              choices:["U.S. Cellular Field","Soldier Field","Wrigley Field","Guaranteed Rate Field"],        cat:"FUN & RANDOM", diff:1, fact:"Wrigley Field opened in 1914 and is the second-oldest MLB stadium still in use, after Fenway Park (1912)." },
  { q:"Which MLB team plays home games at Fenway Park?",               a:"Boston Red Sox",             choices:["New York Yankees","Boston Red Sox","Baltimore Orioles","Toronto Blue Jays"],          cat:"FUN & RANDOM", diff:1, fact:"Fenway Park opened on April 20, 1912 — the same week the Titanic sank. The Green Monster is its 37-foot left field wall." },
  { q:"What is a 'walk-up song' in baseball?",                        a:"A song each batter chooses to play as they approach the plate", choices:["A song played when the team walks onto the field","A song each batter chooses to play as they approach the plate","A victory song played after wins","A post-game anthem"], cat:"FUN & RANDOM", diff:1, fact:"Notable walk-up songs include 'X Gon' Give It to Ya' (David Ortiz) and 'Enter Sandman' (Mariano Rivera). Usually just 5-10 seconds play." },
  { q:"What is 'hitting for the cycle' called when done in order (1B, 2B, 3B, HR)?", a:"Natural cycle", choices:["Perfect cycle","Natural cycle","Grand cycle","True cycle"],                         cat:"FUN & RANDOM", diff:1, fact:"A natural cycle — in order: single, double, triple, home run — is the rarest form. It happens only a handful of times in any given era." },

  { q:"Which baseball movie features the line: 'If you build it, he will come'?", a:"Field of Dreams", choices:["The Natural","Bull Durham","Major League","Field of Dreams"],                         cat:"FUN & RANDOM", diff:2, fact:"Field of Dreams (1989) starred Kevin Costner. MLB actually built a corn-surrounded ballpark in Iowa for a real game in 2022 as a tribute." },
  { q:"Which baseball film features the line: 'There's no crying in baseball!'?", a:"A League of Their Own", choices:["Bull Durham","Field of Dreams","A League of Their Own","Moneyball"],          cat:"FUN & RANDOM", diff:2, fact:"Tom Hanks delivered the line in A League of Their Own (1992), about the All-American Girls Professional Baseball League of the 1940s." },
  { q:"Which U.S. state hosts the 'Cactus League' Spring Training for most MLB teams?", a:"Arizona",   choices:["California","Florida","Arizona","Texas"],                                              cat:"FUN & RANDOM", diff:2, fact:"Arizona's Cactus League hosts 15 MLB teams in the Phoenix metro area. Florida hosts the other 15 in the 'Grapefruit League.'" },
  { q:"What does the baseball slang 'can of corn' mean?",              a:"An easy, routine fly ball",  choices:["An easy, routine fly ball","A player from a rural area","A slow curveball","An infield single"], cat:"FUN & RANDOM", diff:2, fact:"A 'can of corn' is a routine, easy fly ball — referring to old grocery store workers knocking a can off a high shelf and catching it. Dating to the 1800s." },
  { q:"What is 'Moneyball' in baseball terms?",                       a:"The Oakland A's statistical approach using sabermetrics to find undervalued players", choices:["A high-payroll strategy used by the Yankees","The Oakland A's statistical approach using sabermetrics to find undervalued players","A gambling strategy used in fantasy baseball","A rule about TV broadcast revenue sharing"], cat:"FUN & RANDOM", diff:2, fact:"The Oakland A's under GM Billy Beane pioneered using advanced statistics (especially OBP) to find undervalued players. Michael Lewis wrote about it in 2003; Brad Pitt starred in the 2011 film." },
  { q:"What is the significance of the number 42 in Major League Baseball?", a:"Jackie Robinson's number, retired across all of MLB", choices:["The number of stitches on a baseball","Jackie Robinson's number, retired across all of MLB","The record for most strikeouts in a single game","The number of players on an expanded roster"], cat:"FUN & RANDOM", diff:2, fact:"On April 15, 1997 — the 50th anniversary of Robinson's debut — MLB retired #42 across all teams. Mariano Rivera was the last player to wear it in a game." },
  { q:"Which famous baseball family produced three MLB players — father Bobby and son Barry?", a:"The Bonds family", choices:["The Alous","The Bells","The Bonds family","The Griffeys"],              cat:"FUN & RANDOM", diff:2, fact:"Bobby Bonds (1968-81) was a Giants star. His son Barry became baseball's all-time HR leader. The Griffeys (Ken Sr. and Jr.) also played together on the Mariners." },
  { q:"What does WHIP stand for in baseball stats?",                   a:"Walks plus Hits per Inning Pitched", choices:["Wins, Hits, Innings Pitched","Walks plus Hits per Inning Pitched","Wild pitches, Hit batters, Innings Pitched","Weighted Hit Improvement Percentage"], cat:"FUN & RANDOM", diff:2, fact:"WHIP (Walks + Hits per Inning Pitched) is a key modern statistic for measuring pitcher effectiveness. A WHIP under 1.00 is considered elite." },

  { q:"What is the origin of the word 'bullpen' for the pitching warmup area?", a:"Named after Bull Durham tobacco ads near warmup areas", choices:["Named after Bull Durham tobacco ads near warmup areas","Named after a cattle pen used at early ballparks","Named after pitcher Bull Watson","Named because pitchers 'bull' their way through lineups"], cat:"FUN & RANDOM", diff:3, fact:"The most accepted etymology links 'bullpen' to Bull Durham tobacco ads that were ubiquitous on outfield fences in the early 1900s — right above where relievers warmed up." },
  { q:"What is a 'Texas Leaguer' in baseball slang?",                 a:"A bloop single that falls between an infielder and outfielder", choices:["A player from Texas","A bloop single that falls between an infielder and outfielder","A slow curveball","A home run over the short porch"], cat:"FUN & RANDOM", diff:3, fact:"A Texas Leaguer is a bloop single that drops between the infield and outfield. The term dates back to the 1880s-1890s." },
  { q:"What is a 'fungo bat' used for?",                              a:"A lightweight bat used by coaches to hit practice grounders and fly balls", choices:["A bat used in formal games by switch-hitters","A lightweight bat used by coaches to hit practice grounders and fly balls","A batting practice bat for power hitters","A bat used during home run derbies"], cat:"FUN & RANDOM", diff:3, fact:"Fungo bats are longer, lighter, and thinner than game bats, designed for coaches to easily toss and hit precise practice balls to fielders." },
  { q:"What is the origin of the term 'southpaw' for a left-handed pitcher?", a:"Old ballparks were oriented west, so a lefty's throwing arm faced south", choices:["From a Civil War general named Southpaw","Old ballparks were oriented west, so a lefty's throwing arm faced south","From a left-handed pitcher named Paw Williams","Because left-handers throw with what 'felt south' of normal"], cat:"FUN & RANDOM", diff:3, fact:"Ballparks in the 1800s were built with home plate facing west so batters wouldn't look into the afternoon sun. This meant a left-handed pitcher's throwing arm faced south — hence 'southpaw.'" },
  { q:"Which MLB stadium has a swimming pool in the outfield that fans can rent?", a:"Chase Field, Arizona", choices:["Chase Field, Arizona","Tropicana Field, Tampa Bay","Minute Maid Park, Houston","Oracle Park, San Francisco"], cat:"FUN & RANDOM", diff:3, fact:"Chase Field in Phoenix has a swimming pool beyond right-center field that fans can rent for games. It's the first and only pool in a major league ballpark." },
  { q:"What famous MLB video game franchise is officially licensed by MLB?", a:"MLB The Show",              choices:["MVP Baseball","RBI Baseball","MLB The Show","Baseball Stars"],                    cat:"FUN & RANDOM", diff:3, fact:"MLB The Show (by Sony San Diego Studio) is the dominant MLB simulation game. Starting in 2021, it expanded to Xbox and Nintendo Switch despite being a PlayStation exclusive for years." },
];

// ─────────────────────────────────────────────────────────────────
// DAILY POOL — 10 questions, one from each diff tier per category
// ─────────────────────────────────────────────────────────────────
const DAILY_POOL = [
  { q:"Which team has won the most World Series titles?",              a:"New York Yankees",            choices:["Boston Red Sox","New York Yankees","St. Louis Cardinals","Los Angeles Dodgers"],      cat:"STATS & RECORDS",    diff:1, fact:"The Yankees have won 27 World Series championships — more than twice as many as any other team." },
  { q:"How many balls result in a walk?",                              a:"4",                          choices:["3","4","5","6"],                                                                      cat:"RULES & SITUATIONS", diff:1, fact:"Four balls result in a walk. In 2023, MLB introduced the automatic intentional walk." },
  { q:"In what year did Jackie Robinson break the MLB color barrier?",  a:"1947",                      choices:["1945","1947","1950","1952"],                                                          cat:"HISTORIC MOMENTS",   diff:1, fact:"Jackie Robinson broke the color barrier with the Brooklyn Dodgers on April 15, 1947. His number 42 is retired by every MLB team." },
  { q:"What song is traditionally sung during the 7th-inning stretch?", a:"Take Me Out to the Ballgame", choices:["The Star-Spangled Banner","God Bless America","Take Me Out to the Ballgame","America the Beautiful"], cat:"FUN & RANDOM", diff:1, fact:"'Take Me Out to the Ballgame' (1908) is sung at virtually every MLB game during the 7th-inning stretch." },
  { q:"Which player hit 73 home runs in a single season (2001)?",      a:"Barry Bonds",                choices:["Mark McGwire","Sammy Sosa","Barry Bonds","Alex Rodriguez"],                          cat:"STATS & RECORDS",    diff:2, fact:"Barry Bonds hit 73 home runs in 2001 — the current single-season record." },
  { q:"What is the 'dropped third strike' rule?",                     a:"Batter can run to first if catcher drops strike 3 and first base is unoccupied", choices:["Strikeout counts even if catcher drops the ball","Batter can run to first if catcher drops strike 3 and first base is unoccupied","Batter is awarded first base whenever catcher drops a pitch","Batter gets another pitch"], cat:"RULES & SITUATIONS", diff:2, fact:"If the catcher doesn't catch strike three — and first base is open or there are 2 outs — the batter can run to first." },
  { q:"Kirk Gibson's 1988 World Series pinch-hit HR was off which closer?", a:"Dennis Eckersley",       choices:["Lee Smith","Rich Gossage","Dennis Eckersley","Rollie Fingers"],                      cat:"HISTORIC MOMENTS",   diff:2, fact:"Gibson could barely walk due to injuries but hobbled up and hit a walk-off 2-run HR off Eckersley. His fist pump is one of sports' most iconic moments." },
  { q:"What is 'Moneyball' in baseball terms?",                       a:"The Oakland A's statistical approach using sabermetrics to find undervalued players", choices:["A high-payroll strategy used by the Yankees","The Oakland A's statistical approach using sabermetrics to find undervalued players","A gambling strategy used in fantasy baseball","A rule about TV broadcast revenue sharing"], cat:"FUN & RANDOM", diff:2, fact:"The Oakland A's under GM Billy Beane pioneered using advanced statistics (especially OBP) to find undervalued players." },
  { q:"Who hit the 'Shot Heard Round the World' in 1951?",             a:"Bobby Thomson",              choices:["Duke Snider","Willie Mays","Bobby Thomson","Jackie Robinson"],                        cat:"HISTORIC MOMENTS",   diff:3, fact:"Bobby Thomson's 3-run walk-off HR on October 3, 1951 completed the Giants' stunning comeback from 13.5 games back to beat the Dodgers." },
  { q:"What is the origin of the term 'southpaw' for a left-handed pitcher?", a:"Old ballparks were oriented west, so a lefty's throwing arm faced south", choices:["From a Civil War general named Southpaw","Old ballparks were oriented west, so a lefty's throwing arm faced south","From a left-handed pitcher named Paw Williams","Because left-handers throw with what 'felt south' of normal"], cat:"FUN & RANDOM", diff:3, fact:"Ballparks in the 1800s were built with home plate facing west so batters wouldn't look into the afternoon sun. This meant a left-handed pitcher's throwing arm faced south — hence 'southpaw.'" },
];

const RATINGS = [
  { min:0,  max:3,   label:"BENCHWARMER",  sub:"Keep swinging, rookie!",   color:"#7B8794" },
  { min:4,  max:7,   label:"ROOKIE",       sub:"You're learning the game", color: B.sky     },
  { min:8,  max:12,  label:"MINOR LEAGUER",sub:"Solid baseball knowledge", color:"#4CAF8A"  },
  { min:13, max:17,  label:"MLB STARTER",  sub:"You know your baseball",   color: B.gold    },
  { min:18, max:22,  label:"ALL-STAR",     sub:"Impressive Diamond IQ!",   color:"#E05050"  },
  { min:23, max:999, label:"HALL OF FAMER",sub:"Elite baseball mind 🔥",   color: B.navyLight},
];

// ─────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────
const getRating  = s => RATINGS.find(r => s >= r.min && s <= r.max) || RATINGS[0];
const shuffle    = a => { const b=[...a]; for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; };
const todayKey   = () => new Date().toISOString().slice(0,10);

function buildSpeedRun() {
  const r = qs => shuffle(qs).map(q=>({...q, choices:shuffle(q.choices)}));
  const d1 = r(ALL_QUESTIONS.filter(q=>q.diff===1));
  const d2 = r(ALL_QUESTIONS.filter(q=>q.diff===2));
  const d3 = r(ALL_QUESTIONS.filter(q=>q.diff===3));
  // First 30 s → Rookie, next 20 s → Pro, last 10 s → All-Star; repeat to fill 76 q
  return [...d1,...d1,...d2,...d2,...d3,...d3];
}

// localStorage helpers (safe)
const lsGet  = (k,fb) => { try { const v=localStorage.getItem(k); return v!=null?JSON.parse(v):fb; } catch{ return fb; } };
const lsSet  = (k,v)  => { try { localStorage.setItem(k,JSON.stringify(v)); } catch{} };

// ─────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────
function GamedayLogo({ size="md" }) {
  const [failed, setFailed] = useState(false);
  const scale = size==="sm"?0.55:size==="lg"?1.1:0.8;
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", transform:`scale(${scale})`, transformOrigin:"center" }}>
      {!failed ? (
        <img src="/logo/gameday-baseball.png" alt="Gameday Baseball"
          style={{ height:64, width:"auto", objectFit:"contain" }}
          onError={()=>setFailed(true)} />
      ) : (
        <div style={{ fontFamily:"'Playfair Display',serif", fontSize:38, fontWeight:700, lineHeight:1 }}>
          <span style={{ color:B.navy }}>Game</span><span style={{ color:B.sky }}>day</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// VISUAL SHARE CARD  (baseball-diamond SVG)
// ─────────────────────────────────────────────────────────────────
function ShareCard({ score, rating, catAccuracy, mode }) {
  const catKeys = Object.entries(CATS);
  // Pentagon positions for 5 categories
  const positions = [
    {x:170, y:108}, // top — Stats
    {x:210, y:133}, // upper right — Rules
    {x:196, y:168}, // lower right — Historic
    {x:144, y:168}, // lower left — Youth
    {x:130, y:133}, // upper left — Fun
  ];
  return (
    <svg viewBox="0 0 340 205" xmlns="http://www.w3.org/2000/svg"
      style={{ width:"100%", borderRadius:14, display:"block" }}>
      <rect width="340" height="205" fill={B.navyDark} rx="14"/>
      <rect width="340" height="5" fill={B.sky} rx="2"/>
      <text x="170" y="28" textAnchor="middle" fill={B.sky} fontSize="10" fontFamily="'Barlow Condensed',sans-serif" fontWeight="700" letterSpacing="4">DIAMOND IQ · {mode==="daily"?"DAILY CHALLENGE":"SPEED RUN"}</text>
      <text x="170" y="60" textAnchor="middle" fill={B.white} fontSize="26" fontFamily="'Barlow Condensed',sans-serif" fontWeight="900">{rating.label}</text>
      <text x="170" y="82" textAnchor="middle" fill={B.gold} fontSize="14" fontFamily="'Barlow Condensed',sans-serif" fontWeight="700">SCORE: {score}</text>
      {catKeys.map(([cat, info], i) => {
        const acc = catAccuracy[cat];
        const pct = acc && acc.t>0 ? acc.c/acc.t : 0;
        const filled = pct>0.5;
        const pos = positions[i];
        return (
          <g key={cat}>
            <polygon points={`${pos.x},${pos.y-14} ${pos.x+14},${pos.y} ${pos.x},${pos.y+14} ${pos.x-14},${pos.y}`}
              fill={filled ? info.color : "rgba(255,255,255,0.08)"}
              stroke={info.color} strokeWidth="1.5"/>
            <text x={pos.x} y={pos.y+4} textAnchor="middle" fill={filled?B.navyDark:info.color} fontSize="10" fontFamily="sans-serif">{info.icon}</text>
          </g>
        );
      })}
      <polygon points="170,157 176,163 176,170 164,170 164,163" fill={B.gold} opacity="0.9"/>
      <text x="170" y="197" textAnchor="middle" fill={B.sky} fontSize="9" fontFamily="'Barlow Condensed',sans-serif" letterSpacing="2" opacity="0.8">gamedaybaseball.com</text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// PLAYER PROFILE STORAGE
// ─────────────────────────────────────────────────────────────────
const EMPTY_PROFILE = {
  name: "Player",
  gamesPlayed: 0,
  bestScore: 0,
  bestStreak: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  loginStreak: 0,
  lastPlayed: null,
  catStats: {
    "STATS & RECORDS":    { c:0, t:0 },
    "RULES & SITUATIONS": { c:0, t:0 },
    "HISTORIC MOMENTS":   { c:0, t:0 },
    "YOUTH & COLLEGE":    { c:0, t:0 },
    "FUN & RANDOM":       { c:0, t:0 },
  },
  leaderboard: [],
  dailyDone: null,
  dailyScore: null,
  dailyHistory: [],
};

function loadProfile()  { return lsGet("diq_profile_v2", EMPTY_PROFILE); }
function saveProfile(p) { lsSet("diq_profile_v2", p); }

function updateLoginStreak(profile) {
  const today = todayKey();
  const yesterday = new Date(Date.now()-86400000).toISOString().slice(0,10);
  if (profile.lastPlayed === today) return profile;
  const newStreak = profile.lastPlayed === yesterday ? profile.loginStreak + 1 : 1;
  return { ...profile, loginStreak: newStreak, lastPlayed: today };
}

// ─────────────────────────────────────────────────────────────────
// STITCHED BACKGROUND
// ─────────────────────────────────────────────────────────────────
const stitchBg = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%231B3A6B' stroke-opacity='0.04' stroke-width='1'%3E%3Cpath d='M15 5 Q18 8 15 11'/%3E%3Cpath d='M45 5 Q48 8 45 11'/%3E%3Cpath d='M15 49 Q18 52 15 55'/%3E%3Cpath d='M45 49 Q48 52 45 55'/%3E%3C/g%3E%3C/svg%3E")`;

// ─────────────────────────────────────────────────────────────────
// GLOBAL CSS
// ─────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
@keyframes popIn{0%{transform:scale(0.88);opacity:0}65%{transform:scale(1.04)}100%{transform:scale(1);opacity:1}}
@keyframes shakeX{0%,100%{transform:translateX(0)}20%{transform:translateX(-7px)}40%{transform:translateX(7px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}
@keyframes slideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
@keyframes bonusPop{0%{opacity:0;transform:scale(0) rotate(-8deg)}50%{opacity:1;transform:scale(1.1)}80%{opacity:1}100%{opacity:0;transform:scale(0.9)}}
@keyframes pulseTick{0%,100%{opacity:1}50%{opacity:0.5}}
@keyframes correctFlash{0%,100%{background:rgba(255,255,255,0.88)}40%{background:rgba(46,139,87,0.15)}}
@keyframes wrongFlash{0%,100%{background:rgba(255,255,255,0.88)}40%{background:rgba(192,57,43,0.12)}}
@keyframes lifelineGlow{0%,100%{box-shadow:0 0 0 0 rgba(232,160,32,0)}50%{box-shadow:0 0 12px 3px rgba(232,160,32,0.5)}}
.slide-up{animation:slideUp 0.35s ease both;}
.pop-in{animation:popIn 0.25s ease both;}
.cta-btn{transition:transform 0.15s,box-shadow 0.15s;cursor:pointer;border:none;}
.cta-btn:hover{transform:translateY(-2px);}
.cta-btn:active{transform:scale(0.97);}
.choice{transition:transform 0.1s,background 0.1s;cursor:pointer;border:none;text-align:left;}
.choice:hover:not(:disabled){transform:translateX(4px);}
.choice:active:not(:disabled){transform:scale(0.98);}
.choice:disabled{cursor:default;}
.skip-btn{cursor:pointer;background:none;transition:opacity 0.15s;}
.skip-btn:hover{opacity:1!important;}
.review-item{border-bottom:1px solid ${B.skyPale};}
.review-item:last-child{border-bottom:none;}
.lb-row{border-bottom:1px solid ${B.skyPale};}
.lb-row:last-child{border-bottom:none;}
.nav-btn{cursor:pointer;border:none;transition:background 0.15s,transform 0.1s;}
.nav-btn:hover{transform:translateY(-1px);}
.nav-tab{cursor:pointer;border:none;background:none;transition:all 0.15s;padding:8px 14px;border-radius:20px;font-family:'Barlow Condensed',sans-serif;font-size:13px;font-weight:700;letter-spacing:1px;}
.lifeline-btn{cursor:pointer;border:none;transition:all 0.2s;}
.lifeline-btn:hover:not(:disabled){transform:scale(1.05);}
.lifeline-btn:disabled{opacity:0.35;cursor:default;}
::-webkit-scrollbar{width:4px;}
::-webkit-scrollbar-thumb{background:${B.skyLight};border-radius:4px;}
`;

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function DiamondIQ() {
  // ── Phases: intro | speedrun | daily | practice | result | leaderboard | profile | editName
  const [phase,         setPhase]         = useState("intro");
  const [gameMode,      setGameMode]      = useState("speedrun"); // "speedrun" | "daily" | "practice"
  const [profile,       setProfile]       = useState(() => {
    const p = loadProfile();
    return updateLoginStreak(p);
  });

  // ── Game state
  const [questions,     setQuestions]     = useState([]);
  const [qIndex,        setQIndex]        = useState(0);
  const [score,         setScore]         = useState(0);
  const [correctCount,  setCorrectCount]  = useState(0);
  const [streak,        setStreak]        = useState(0);
  const [maxStreak,     setMaxStreak]     = useState(0);
  const [timeLeft,      setTimeLeft]      = useState(60);
  const [feedback,      setFeedback]      = useState(null);   // null | "correct" | "wrong"
  const [selected,      setSelected]      = useState(null);
  const [answered,      setAnswered]      = useState(0);
  const [bonusFlash,    setBonusFlash]    = useState(false);
  const [answerHistory, setAnswerHistory] = useState([]);
  const [catAccuracy,   setCatAccuracy]   = useState({ "STATS & RECORDS":{c:0,t:0}, "RULES & SITUATIONS":{c:0,t:0}, "HISTORIC MOMENTS":{c:0,t:0}, "YOUTH & COLLEGE":{c:0,t:0}, "FUN & RANDOM":{c:0,t:0} });
  const [reviewOpen,    setReviewOpen]    = useState(false);
  const [nameInput,     setNameInput]     = useState("");

  // ── Lifeline state
  const [lifelineAvail,  setLifelineAvail]  = useState(false);  // earned at streak=5
  const [lifelineUsed,   setLifelineUsed]   = useState(false);
  const [eliminated,     setEliminated]     = useState([]);     // indices of elim choices

  // ── Practice state
  const [practiceCategory, setPracticeCategory] = useState(null);
  const [practicePhase,    setPracticePhase]     = useState("pick"); // pick | playing | done



  const timerRef = useRef(null);

  // ─── Persist profile changes
  const updateProfile = useCallback(patch => {
    setProfile(prev => {
      const next = typeof patch === "function" ? patch(prev) : { ...prev, ...patch };
      saveProfile(next);
      return next;
    });
  }, []);

  const endGame = useCallback(() => {
    clearInterval(timerRef.current);
    setPhase("result");
  }, []);

  // ─── Timer
  useEffect(() => {
    if (phase === "speedrun") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { endGame(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [phase, endGame]);

  // ─────────────────────────────────────────────────────────────
  // GAME ACTIONS
  // ─────────────────────────────────────────────────────────────
  const startSpeedRun = () => {
    clearInterval(timerRef.current);
    setQuestions(buildSpeedRun());
    resetGameState(60);
    setGameMode("speedrun");
    setPhase("speedrun");
  };

  const startDaily = () => {
    const today = todayKey();
    if (profile.dailyDone === today) {
      // Already done — jump straight to result with saved score
      setScore(profile.dailyScore || 0);
      setGameMode("daily");
      setPhase("result");
      return;
    }
    const qs = DAILY_POOL.map(q => ({ ...q, choices: shuffle(q.choices) }));
    setQuestions(qs);
    resetGameState(null);
    setGameMode("daily");
    setPhase("daily");
  };

  const startPractice = (cat) => {
    const qs = shuffle(ALL_QUESTIONS.filter(q => q.cat === cat)).map(q => ({ ...q, choices: shuffle(q.choices) }));
    setQuestions(qs);
    resetGameState(null);
    setGameMode("practice");
    setPracticeCategory(cat);
    setPracticePhase("playing");
    setPhase("practice");
  };

  const resetGameState = (time) => {
    setQIndex(0); setScore(0); setCorrectCount(0); setStreak(0); setMaxStreak(0);
    setTimeLeft(time || 0); setFeedback(null); setSelected(null); setAnswered(0);
    setBonusFlash(false); setAnswerHistory([]); setReviewOpen(false); setNameInput("");
    setLifelineAvail(false); setLifelineUsed(false); setEliminated([]);
    setCatAccuracy({ "STATS & RECORDS":{c:0,t:0}, "RULES & SITUATIONS":{c:0,t:0}, "HISTORIC MOMENTS":{c:0,t:0}, "YOUTH & COLLEGE":{c:0,t:0}, "FUN & RANDOM":{c:0,t:0} });
  };


  const handleAnswer = (choice) => {
    if (feedback !== null) return;
    const q = questions[qIndex];
    const correct = choice === q.a;
    setSelected(choice);
    const newAnswered = answered + 1;
    setAnswered(newAnswered);

    const histItem = { question:q.q, yourAnswer:choice, correctAnswer:q.a, correct, cat:q.cat, diff:q.diff, fact:q.fact||null };
    setAnswerHistory(h => [...h, histItem]);

    // Category accuracy
    setCatAccuracy(ca => ({
      ...ca,
      [q.cat]: { c: ca[q.cat].c + (correct?1:0), t: ca[q.cat].t + 1 }
    }));

    if (correct) {
      const ns = streak + 1;
      setStreak(ns);
      setMaxStreak(ms => Math.max(ms, ns));
      const pts = ns >= 3 ? 2 : 1;
      setScore(s => s + pts);
      setCorrectCount(c => c + 1);
      if (ns >= 3) setBonusFlash(true);
      // Lifeline unlocks at streak 5
      if (ns >= 5 && !lifelineUsed) setLifelineAvail(true);
      setFeedback("correct");
    } else {
      setStreak(0);
      setLifelineAvail(false);
      setFeedback("wrong");
    }
    setEliminated([]);

    setTimeout(() => {
      setFeedback(null); setSelected(null); setBonusFlash(false);
      const nextIndex = qIndex + 1;
      if (nextIndex >= questions.length) endGame();
      else setQIndex(nextIndex);
    }, 420);
  };

  const handleSkip = () => {
    if (feedback !== null) return;
    setStreak(0);
    const nextIndex = qIndex + 1;
    if (nextIndex >= questions.length) endGame();
    else setQIndex(nextIndex);
  };

  const useLifeline = () => {
    if (!lifelineAvail || lifelineUsed || feedback) return;
    const q = questions[qIndex];
    const wrongIndices = q.choices.map((c,i) => c !== q.a ? i : -1).filter(i => i !== -1);
    const toElim = shuffle(wrongIndices).slice(0, 2);
    setEliminated(toElim);
    setLifelineAvail(false);
    setLifelineUsed(true);
  };

  const submitScore = () => {
    const name = (nameInput || "Anonymous").trim().slice(0,20);
    const entry = {
      name, score, accuracy: answered>0?Math.round(correctCount/answered*100):0,
      streak:maxStreak, mode:gameMode, date:new Date().toLocaleDateString()
    };
    updateProfile(prev => {
      const today = todayKey();
      const newLB = [...(prev.leaderboard||[]), entry].sort((a,b)=>b.score-a.score).slice(0,20);
      const newCatStats = { ...prev.catStats };
      Object.keys(catAccuracy).forEach(cat => {
        newCatStats[cat] = {
          c: (newCatStats[cat]?.c||0) + catAccuracy[cat].c,
          t: (newCatStats[cat]?.t||0) + catAccuracy[cat].t,
        };
      });
      const dailyPatch = gameMode==="daily" ? { dailyDone:today, dailyScore:score, dailyHistory:questions.map((_,i)=>answerHistory[i]||null) } : {};
      return {
        ...prev,
        gamesPlayed: (prev.gamesPlayed||0)+1,
        bestScore: Math.max(prev.bestScore||0, score),
        bestStreak: Math.max(prev.bestStreak||0, maxStreak),
        totalCorrect: (prev.totalCorrect||0)+correctCount,
        totalAnswered: (prev.totalAnswered||0)+answered,
        catStats: newCatStats,
        leaderboard: newLB,
        ...dailyPatch,
      };
    });
    setPhase("leaderboard");
  };

  // ─────────────────────────────────────────────────────────────
  // DERIVED
  // ─────────────────────────────────────────────────────────────
  const currentQ   = questions[qIndex];
  const catInfo    = currentQ ? CATS[currentQ.cat] : null;
  const timerPct   = (timeLeft/60)*100;
  const timerColor = timeLeft<=10 ? B.wrong : timeLeft<=20 ? B.gold : B.correct;
  const accuracy   = answered>0 ? Math.round(correctCount/answered*100) : 0;
  const rating     = getRating(score);

  const DIFF_LABEL = {1:"ROOKIE",2:"PRO",3:"ALL-STAR"};
  const DIFF_COLOR = {1:B.correct,2:B.gold,3:B.wrong};

  const dailyDoneToday = profile.dailyDone === todayKey();

  // ─────────────────────────────────────────────────────────────
  // SHARED CARD CSS
  // ─────────────────────────────────────────────────────────────
  const card = {
    background:"rgba(255,255,255,0.82)", backdropFilter:"blur(8px)",
    border:`1.5px solid ${B.skyLight}`, borderRadius:18,
    boxShadow:"0 2px 16px rgba(27,58,107,0.07)",
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER HELPERS
  // ─────────────────────────────────────────────────────────────
  const NavBar = ({ back, title, sub }) => (
    <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:18 }}>
      <button className="nav-btn" onClick={back}
        style={{ padding:"8px 14px", borderRadius:10, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700 }}>
        ← BACK
      </button>
      <div style={{ flex:1, textAlign:"center" }}>
        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:B.navy }}>{title}</div>
        {sub && <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontSize:11, fontWeight:700, letterSpacing:3, color:B.navyLight }}>{sub}</div>}
      </div>
      <div style={{ width:70 }}/>
    </div>
  );

  const HUD = () => {
    const barColor = timerPct>50 ? `linear-gradient(90deg,${B.correct},#3DAA6A)` : timerPct>20 ? `linear-gradient(90deg,${B.gold},#D4921A)` : `linear-gradient(90deg,${B.wrong},#E05050)`;
    return (
      <div style={{ display:"flex", gap:10, alignItems:"stretch", marginBottom:14 }}>
        <div style={{ flex:1, background:"rgba(255,255,255,0.82)", border:`1px solid ${B.skyLight}`, borderRadius:14, padding:"12px 16px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
            <span style={{ fontSize:10, letterSpacing:3, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>TIME</span>
            <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:26, color:timerColor, lineHeight:1, animation:timeLeft<=10?"pulseTick 0.5s ease infinite":"none" }}>
              {timeLeft}<span style={{ fontSize:13, marginLeft:2 }}>s</span>
            </span>
          </div>
          <div style={{ height:7, background:B.skyPale, borderRadius:6, overflow:"hidden" }}>
            <div style={{ height:"100%", borderRadius:6, width:`${timerPct}%`, background:barColor, transition:"background 0.4s" }}/>
          </div>
        </div>
        <div style={{ background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, borderRadius:14, padding:"12px 18px", textAlign:"center", minWidth:76 }}>
          <div style={{ fontSize:9, letterSpacing:3, color:B.sky, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:4 }}>SCORE</div>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:B.white, lineHeight:1 }}>{score}</div>
        </div>
        {streak > 0 && (
          <div style={{ background:`rgba(232,160,32,0.12)`, border:`1.5px solid rgba(232,160,32,0.5)`, borderRadius:14, padding:"12px", textAlign:"center", minWidth:70, animation:"popIn 0.25s ease" }}>
            <div style={{ fontSize:9, letterSpacing:2, color:B.gold, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:4 }}>
              {streak>=3 ? "STREAK 🔥" : `${3-streak} TO BONUS`}
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:B.gold, lineHeight:1 }}>{streak}</div>
          </div>
        )}
      </div>
    );
  };

  const QuestionCard = ({ timed }) => {
    if (!currentQ) return null;
    const letters = ["A","B","C","D"];
    return (
      <div style={{ position:"relative" }}>
        {timed && <HUD />}
        {bonusFlash && (
          <div style={{ position:"absolute", top:timed?70:10, right:0, zIndex:20, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:B.gold, animation:"bonusPop 0.9s ease forwards", background:B.navy, padding:"4px 14px", borderRadius:30 }}>
            ⚡ BONUS +2!
          </div>
        )}
        <div className="pop-in" style={{
          background:"rgba(255,255,255,0.88)", backdropFilter:"blur(8px)",
          border:`1.5px solid ${feedback==="correct"?B.correct:feedback==="wrong"?B.wrong:B.skyLight}`,
          borderRadius:20, padding:"20px 20px 16px",
          animation:feedback==="correct"?"correctFlash 0.42s ease":feedback==="wrong"?"wrongFlash 0.42s ease":"none",
          transition:"border-color 0.2s",
        }}>
          {/* Category + difficulty badges */}
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12, flexWrap:"wrap" }}>
            <div style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"4px 12px", borderRadius:30, background:catInfo.bg, border:`1.5px solid ${catInfo.color}50` }}>
              <span style={{ fontSize:12 }}>{catInfo.icon}</span>
              <span style={{ fontSize:10, color:catInfo.color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1.5 }}>{currentQ.cat}</span>
            </div>
            <div style={{ padding:"4px 10px", borderRadius:30, background:`${DIFF_COLOR[currentQ.diff]}15`, border:`1px solid ${DIFF_COLOR[currentQ.diff]}50` }}>
              <span style={{ fontSize:10, color:DIFF_COLOR[currentQ.diff], fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1 }}>{DIFF_LABEL[currentQ.diff]}</span>
            </div>
          </div>

          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:"clamp(16px,4vw,22px)", lineHeight:1.35, color:B.navyDark, marginBottom:14 }}>
            {currentQ.q}
          </div>
          <div style={{ fontSize:10, color:B.sky, marginBottom:12, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>
            Q{qIndex+1}{timed?` · ${answered} ANSWERED`:` of ${questions.length}`}
          </div>

          {/* Choices */}
          <div style={{ display:"flex", flexDirection:"column", gap:9 }}>
            {currentQ.choices.map((choice, i) => {
              const isElim = eliminated.includes(i);
              if (isElim) return (
                <div key={i} style={{ background:"rgba(0,0,0,0.04)", border:`1.5px solid ${B.skyLight}50`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, opacity:0.35 }}>
                  <div style={{ width:26, height:26, borderRadius:7, background:"rgba(27,58,107,0.05)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:B.navyLight }}>{letters[i]}</div>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, fontSize:14, color:B.navyLight, textDecoration:"line-through" }}>{choice}</span>
                </div>
              );
              const isSel = selected===choice, isAns = choice===currentQ.a;
              let bg=B.offWhite, border=B.skyLight, color=B.navyDark, weight=600;
              if (feedback) {
                if (isSel && feedback==="correct") { bg="rgba(46,139,87,0.12)"; border=B.correct; color=B.correct; }
                if (isSel && feedback==="wrong")   { bg="rgba(192,57,43,0.10)"; border=B.wrong;   color=B.wrong;   }
                if (!isSel && isAns)               { bg="rgba(46,139,87,0.07)"; border=`${B.correct}80`; color=B.correct; }
              }
              return (
                <button key={i} className="choice" disabled={!!feedback} onClick={() => handleAnswer(choice)}
                  style={{ background:bg, border:`1.5px solid ${border}`, borderRadius:12, padding:"12px 14px", display:"flex", alignItems:"center", gap:10, color, animation:feedback&&isSel&&feedback==="wrong"?"shakeX 0.4s ease":"none", cursor:feedback?"default":"pointer" }}>
                  <div style={{ width:26, height:26, borderRadius:7, flexShrink:0, background:`${B.navy}12`, border:`1.5px solid ${B.sky}60`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:B.navyLight }}>
                    {letters[i]}
                  </div>
                  <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:weight, fontSize:14, flex:1 }}>{choice}</span>
                  {feedback && isSel && feedback==="correct" && <span style={{ color:B.correct }}>✓</span>}
                  {feedback && isSel && feedback==="wrong"   && <span style={{ color:B.wrong  }}>✗</span>}
                  {feedback && !isSel && isAns               && <span style={{ color:B.correct }}>✓</span>}
                </button>
              );
            })}
          </div>

          {/* Lifeline + Skip */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginTop:14 }}>
            <button className="lifeline-btn" onClick={useLifeline} disabled={!lifelineAvail || lifelineUsed || !!feedback}
              style={{ padding:"6px 14px", borderRadius:10, background:lifelineAvail&&!lifelineUsed?B.goldLight:"rgba(0,0,0,0.04)", border:`1.5px solid ${lifelineAvail&&!lifelineUsed?B.gold:B.skyLight}`, color:lifelineAvail&&!lifelineUsed?B.navyDark:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700, letterSpacing:1, animation:lifelineAvail&&!lifelineUsed?"lifelineGlow 2s ease infinite":"none" }}>
              {lifelineUsed ? "50/50 USED" : lifelineAvail ? "⚡ 50/50" : `50/50 (5🔥)`}
            </button>
            <button className="skip-btn" onClick={handleSkip} disabled={!!feedback}
              style={{ border:`1px solid ${B.skyLight}`, borderRadius:8, padding:"5px 18px", color:B.navyLight, fontSize:11, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:1, opacity:0.65 }}>
              SKIP →
            </button>
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:12 }}>
          <GamedayLogo size="sm" />
        </div>
      </div>
    );
  };

  const ReviewSection = () => (
    <div style={{ ...card, marginBottom:14, overflow:"hidden" }}>
      <button onClick={() => setReviewOpen(r => !r)}
        style={{ width:"100%", padding:"13px 18px", background:"none", border:"none", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer" }}>
        <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, letterSpacing:2, color:B.navyLight }}>
          REVIEW ANSWERS ({correctCount}/{answered} correct)
        </span>
        <span style={{ color:B.navyLight, fontSize:14, transition:"transform 0.2s", transform:reviewOpen?"rotate(180deg)":"none" }}>▾</span>
      </button>
      {reviewOpen && (
        <div style={{ padding:"0 18px 14px", maxHeight:320, overflowY:"auto" }}>
          {answerHistory.map((item, i) => (
            <div key={i} className="review-item" style={{ padding:"10px 0" }}>
              <div style={{ display:"flex", gap:8, alignItems:"flex-start", marginBottom:item.correct&&!item.fact?0:4 }}>
                <span style={{ fontSize:13, flexShrink:0 }}>{item.correct?"✅":"❌"}</span>
                <span style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, color:B.navyDark, lineHeight:1.4 }}>{item.question}</span>
              </div>
              {!item.correct && (
                <div style={{ marginLeft:21, fontSize:11, lineHeight:1.5, marginBottom:item.fact?4:0 }}>
                  <span style={{ color:B.wrong }}>You: {item.yourAnswer}</span>
                  <span style={{ margin:"0 6px", color:B.skyLight }}>→</span>
                  <span style={{ color:B.correct }}>Correct: {item.correctAnswer}</span>
                </div>
              )}
              {item.fact && (
                <div style={{ marginLeft:21, fontSize:11, color:B.navyLight, lineHeight:1.5, background:B.skyPale, borderRadius:8, padding:"6px 10px", marginTop:4 }}>
                  ⚾ {item.fact}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const ResultScoreRow = () => (
    <div style={{ display:"flex", gap:8, marginTop:20, justifyContent:"center" }}>
      {[
        { label:"SCORE",    val:score,              color:B.gold    },
        { label:"ANSWERED", val:answered,            color:B.white   },
        { label:"STREAK",   val:`${maxStreak}🔥`,   color:B.sky     },
        { label:"ACCURACY", val:`${accuracy}%`,      color:"#4CAF8A" },
      ].map(s => (
        <div key={s.label} style={{ flex:1, background:"rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 4px", textAlign:"center" }}>
          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(16px,5vw,24px)", color:s.color, lineHeight:1 }}>{s.val}</div>
          <div style={{ fontSize:8, color:`${B.sky}aa`, letterSpacing:1.5, marginTop:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{s.label}</div>
        </div>
      ))}
    </div>
  );

  // ─────────────────────────────────────────────────────────────
  // SCREENS
  // ─────────────────────────────────────────────────────────────

  // ── INTRO ──────────────────────────────────────────────────
  if (phase === "intro") {
    const streakDays = profile.loginStreak || 0;
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
          <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>

          <div style={{ maxWidth:500, width:"100%", textAlign:"center" }} className="slide-up">
            <GamedayLogo size="lg" />
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(40px,12vw,68px)", lineHeight:0.95, color:B.navy, letterSpacing:-1, margin:"8px 0 4px" }}>
              DIAMOND <span style={{ color:B.sky, WebkitTextStroke:`2px ${B.navy}` }}>IQ</span>
            </div>
            <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, letterSpacing:5, color:B.navyLight, marginBottom:16 }}>BASEBALL BRAIN SPEED TEST</div>

            {/* Player greeting + login streak */}
            <div style={{ ...card, padding:"14px 18px", marginBottom:14, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ textAlign:"left" }}>
                <div style={{ fontSize:10, letterSpacing:3, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>WELCOME BACK</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:20, color:B.navy }}>{profile.name || "Player"}</div>
                <div style={{ fontSize:11, color:B.navyLight, marginTop:2 }}>Best score: <strong style={{ color:B.gold }}>{profile.bestScore || 0}</strong> · {profile.gamesPlayed || 0} games played</div>
              </div>
              <div style={{ textAlign:"center" }}>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:30, color:streakDays>=3?B.gold:B.navy, lineHeight:1 }}>
                  {streakDays}{streakDays>=3?" 🔥":""}
                </div>
                <div style={{ fontSize:9, letterSpacing:2, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>DAY STREAK</div>
              </div>
            </div>

            {/* Mode buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:14 }}>
              {/* Speed Run */}
              <button className="cta-btn" onClick={startSpeedRun} style={{ width:"100%", padding:"16px", borderRadius:14, background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, border:`2px solid ${B.sky}40`, color:B.white, fontFamily:"'Barlow Condensed',sans-serif", fontSize:22, fontWeight:900, letterSpacing:3 }}>
                ⚡ SPEED RUN  <span style={{ fontSize:13, fontWeight:600, letterSpacing:1, opacity:0.8 }}>60 SECONDS</span>
              </button>

              {/* Daily Challenge */}
              <button className="cta-btn" onClick={startDaily} style={{ width:"100%", padding:"14px", borderRadius:14, background: dailyDoneToday ? "rgba(46,139,87,0.12)" : `linear-gradient(135deg,${B.gold},#C8880A)`, border:`1.5px solid ${dailyDoneToday?B.correct:B.gold}`, color: dailyDoneToday?B.correct:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, letterSpacing:2 }}>
                {dailyDoneToday ? `✓ DAILY DONE · ${profile.dailyScore} pts` : "📅 DAILY CHALLENGE  10 QUESTIONS"}
              </button>

              {/* Practice */}
              <button className="cta-btn" onClick={() => setPhase("practice")} style={{ width:"100%", padding:"12px", borderRadius:14, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700, letterSpacing:2 }}>
                🎓 PRACTICE MODE  <span style={{ fontWeight:600, fontSize:13 }}>PICK A CATEGORY</span>
              </button>
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button className="cta-btn" onClick={() => setPhase("leaderboard")} style={{ flex:1, padding:"11px", borderRadius:12, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, letterSpacing:1 }}>
                🏆 LEADERBOARD
              </button>
              <button className="cta-btn" onClick={() => setPhase("profile")} style={{ flex:1, padding:"11px", borderRadius:12, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:700, letterSpacing:1 }}>
                👤 MY PROFILE
              </button>
            </div>

            <div style={{ fontSize:11, color:B.navyLight, marginTop:12, letterSpacing:1 }}>gamedaybaseball.com · @gamedaybaseball</div>
          </div>
          <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
        </div>
      </>
    );
  }

  // ── SPEED RUN ───────────────────────────────────────────────
  if (phase === "speedrun" && currentQ) {
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
          <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
          <div style={{ maxWidth:560, width:"100%" }}>
            <QuestionCard timed={true} />
          </div>
          <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
        </div>
      </>
    );
  }

  // ── DAILY CHALLENGE ─────────────────────────────────────────
  if (phase === "daily" && currentQ) {
    const progress = Math.round((qIndex / questions.length) * 100);
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
          <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
          <div style={{ maxWidth:560, width:"100%" }}>
            {/* Daily header */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:B.navy }}>📅 DAILY CHALLENGE</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:14, color:B.navyLight }}>
                {qIndex+1} / {questions.length}
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height:6, background:B.skyPale, borderRadius:6, overflow:"hidden", marginBottom:14 }}>
              <div style={{ height:"100%", borderRadius:6, width:`${progress}%`, background:`linear-gradient(90deg,${B.navy},${B.sky})`, transition:"width 0.3s ease" }}/>
            </div>
            <QuestionCard timed={false} />
          </div>
          <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
        </div>
      </>
    );
  }

  // ── PRACTICE MODE ───────────────────────────────────────────
  if (phase === "practice") {
    // Category picker
    if (practicePhase === "pick" || !practiceCategory) {
      return (
        <>
          <style>{CSS}</style>
          <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
            <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
            <div style={{ maxWidth:500, width:"100%" }} className="slide-up">
              <NavBar back={() => setPhase("intro")} title="PRACTICE MODE" sub="PICK A CATEGORY" />
              <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                {Object.entries(CATS).map(([cat, info]) => {
                  const stats = profile.catStats?.[cat] || {c:0,t:0};
                  const pct = stats.t > 0 ? Math.round(stats.c/stats.t*100) : null;
                  const count = ALL_QUESTIONS.filter(q=>q.cat===cat).length;
                  return (
                    <button key={cat} className="cta-btn" onClick={() => { setPracticeCategory(cat); startPractice(cat); }}
                      style={{ ...card, padding:"18px 20px", display:"flex", alignItems:"center", gap:14, background:"rgba(255,255,255,0.82)", cursor:"pointer", border:`1.5px solid ${info.color}40` }}>
                      <span style={{ fontSize:28 }}>{info.icon}</span>
                      <div style={{ flex:1, textAlign:"left" }}>
                        <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:18, color:B.navy }}>{cat}</div>
                        <div style={{ fontSize:12, color:B.navyLight, marginTop:2 }}>{count} questions · {["Rookie","Pro","All-Star"].join(" / ")} difficulty</div>
                      </div>
                      {pct !== null && (
                        <div style={{ textAlign:"center" }}>
                          <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:pct>=70?B.correct:pct>=40?B.gold:B.wrong }}>{pct}%</div>
                          <div style={{ fontSize:9, color:B.navyLight, letterSpacing:1, fontFamily:"'Barlow Condensed',sans-serif" }}>ACCURACY</div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
          </div>
        </>
      );
    }
    // Practice playing
    if (practicePhase === "playing" && currentQ) {
      const progress = Math.round((qIndex / questions.length) * 100);
      return (
        <>
          <style>{CSS}</style>
          <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
            <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
            <div style={{ maxWidth:560, width:"100%" }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <button className="nav-btn" onClick={() => { setPhase("practice"); setPracticePhase("pick"); setPracticeCategory(null); }}
                  style={{ padding:"7px 12px", borderRadius:9, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700 }}>← BACK</button>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:16, color:B.navy }}>{CATS[practiceCategory]?.icon} {practiceCategory}</div>
                <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, color:B.navyLight }}>{qIndex+1}/{questions.length}</div>
              </div>
              <div style={{ height:5, background:B.skyPale, borderRadius:6, overflow:"hidden", marginBottom:14 }}>
                <div style={{ height:"100%", borderRadius:6, width:`${progress}%`, background:`linear-gradient(90deg,${catInfo?.color||B.navy},${catInfo?.color||B.sky})`, transition:"width 0.3s" }}/>
              </div>
              <QuestionCard timed={false} />
            </div>
            <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
          </div>
        </>
      );
    }
  }

  // ── RESULT ──────────────────────────────────────────────────
  if (phase === "result") {
    const modeLabel = gameMode==="daily" ? "DAILY CHALLENGE" : gameMode==="practice" ? `PRACTICE · ${practiceCategory}` : "SPEED RUN";
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
          <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
          <div style={{ maxWidth:460, width:"100%" }} className="slide-up">
            <div style={{ textAlign:"center", marginBottom:14 }}><GamedayLogo size="md"/></div>

            {/* Rating card */}
            <div style={{ background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, borderRadius:22, padding:"26px 22px", textAlign:"center", marginBottom:14, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", top:-40, right:-40, width:150, height:150, borderRadius:"50%", background:"rgba(255,255,255,0.03)" }}/>
              <div style={{ fontSize:10, letterSpacing:4, color:B.sky, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:6 }}>{modeLabel} · YOUR RATING</div>
              <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(30px,9vw,50px)", lineHeight:1, color:B.white, marginBottom:5 }}>{rating.label}</div>
              <div style={{ color:B.skyLight, fontSize:14, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:600, marginBottom:0 }}>{rating.sub}</div>
              <ResultScoreRow />
            </div>

            {/* Visual share card */}
            <div style={{ ...card, padding:14, marginBottom:14 }}>
              <div style={{ fontSize:10, letterSpacing:3, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:10, textAlign:"center" }}>YOUR DIAMOND CARD</div>
              <ShareCard score={score} rating={rating} catAccuracy={catAccuracy} mode={gameMode} />
              <div style={{ fontSize:11, color:B.sky, letterSpacing:1, textAlign:"center", marginTop:8 }}>
                Screenshot &amp; share · Tag @gamedaybaseball
              </div>
            </div>

            {/* Submit to leaderboard */}
            <div style={{ ...card, padding:"16px 18px", marginBottom:14 }}>
              <div style={{ fontSize:11, letterSpacing:3, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:10 }}>SUBMIT TO LEADERBOARD</div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)} maxLength={20} placeholder={profile.name || "Your name…"}
                  style={{ flex:1, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${B.skyLight}`, background:B.offWhite, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:600, color:B.navyDark, outline:"none" }}/>
                <button className="cta-btn" onClick={submitScore}
                  style={{ padding:"10px 16px", borderRadius:10, background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, color:B.white, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900, letterSpacing:1 }}>
                  SUBMIT
                </button>
              </div>
            </div>

            <ReviewSection />

            <div style={{ display:"flex", gap:10 }}>
              <button className="cta-btn" onClick={startSpeedRun} style={{ flex:1, padding:"14px", borderRadius:12, background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, color:B.white, fontFamily:"'Barlow Condensed',sans-serif", fontSize:17, fontWeight:900, letterSpacing:2 }}>PLAY AGAIN ↺</button>
              <button className="cta-btn" onClick={() => setPhase("leaderboard")} style={{ padding:"14px 16px", borderRadius:12, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700 }}>🏆</button>
              <button className="cta-btn" onClick={() => setPhase("intro")} style={{ padding:"14px 16px", borderRadius:12, background:"rgba(255,255,255,0.7)", border:`1.5px solid ${B.skyLight}`, color:B.navyDark, fontFamily:"'Barlow Condensed',sans-serif", fontSize:13, fontWeight:700 }}>HOME</button>
            </div>
          </div>
          <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
        </div>
      </>
    );
  }

  // ── LEADERBOARD ─────────────────────────────────────────────
  if (phase === "leaderboard") {
    const lb = profile.leaderboard || [];
    const medals = ["🥇","🥈","🥉"];
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
          <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
          <div style={{ maxWidth:500, width:"100%" }} className="slide-up">
            <NavBar back={() => setPhase("intro")} title="🏆 LEADERBOARD" sub="STATS & RECORDS" />

            {lb.length > 0 && (
              <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                {[
                  { l:"TOP SCORE",    v:lb[0].score,                              c:B.gold    },
                  { l:"GAMES",        v:profile.gamesPlayed||0,                   c:B.navy    },
                  { l:"BEST ACC",     v:Math.max(...lb.map(e=>e.accuracy))+"%",   c:B.correct },
                  { l:"BEST STREAK",  v:Math.max(...lb.map(e=>e.streak))+"🔥",   c:B.sky     },
                ].map(s => (
                  <div key={s.l} style={{ flex:1, background:"rgba(255,255,255,0.82)", border:`1px solid ${B.skyLight}`, borderRadius:12, padding:"10px 6px", textAlign:"center" }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:"clamp(14px,4vw,20px)", color:s.c, lineHeight:1 }}>{s.v}</div>
                    <div style={{ fontSize:8, color:B.navyLight, letterSpacing:1.5, marginTop:3, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{s.l}</div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ ...card, padding:"6px 18px 10px", marginBottom:14 }}>
              {lb.length === 0 ? (
                <div style={{ textAlign:"center", padding:"32px", color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontSize:15, letterSpacing:1 }}>No scores yet — be the first!</div>
              ) : lb.map((e, i) => (
                <div key={i} className="lb-row" style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", background:i===0?`linear-gradient(90deg,rgba(232,160,32,0.08),transparent)`:undefined }}>
                  <div style={{ width:28, textAlign:"center", fontSize:i<3?18:13, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, color:i<3?B.gold:B.navyLight }}>{i<3?medals[i]:i+1}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:15, color:i===0?B.navy:B.navyDark }}>{e.name}</div>
                    <div style={{ fontSize:11, color:B.navyLight, marginTop:1 }}>{e.accuracy}% acc · {e.streak}🔥 · {e.mode} · {e.date}</div>
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:22, color:i===0?B.gold:B.navyDark }}>{e.score}</div>
                </div>
              ))}
            </div>

            <div style={{ display:"flex", gap:10 }}>
              <button className="cta-btn" onClick={startSpeedRun} style={{ flex:1, padding:"14px", borderRadius:12, background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, color:B.white, fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, letterSpacing:2 }}>PLAY NOW ⚾</button>
              <button className="cta-btn" onClick={() => { updateProfile({ leaderboard:[] }); }} style={{ padding:"14px 16px", borderRadius:12, background:"rgba(192,57,43,0.08)", border:`1.5px solid rgba(192,57,43,0.2)`, color:B.wrong, fontFamily:"'Barlow Condensed',sans-serif", fontSize:12, fontWeight:700 }}>CLEAR</button>
            </div>
          </div>
          <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
        </div>
      </>
    );
  }

  // ── PLAYER PROFILE ──────────────────────────────────────────
  if (phase === "profile") {
    const totalAcc = profile.totalAnswered > 0 ? Math.round(profile.totalCorrect / profile.totalAnswered * 100) : 0;
    return (
      <>
        <style>{CSS}</style>
        <div style={{ minHeight:"100vh", fontFamily:"'Barlow',sans-serif", background:`${stitchBg}, linear-gradient(160deg,${B.offWhite} 0%,#DCEEf8 55%,${B.skyPale} 100%)`, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:16, position:"relative" }}>
          <div style={{ position:"fixed", top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})`, zIndex:100 }}/>
          <div style={{ maxWidth:500, width:"100%" }} className="slide-up">
            <NavBar back={() => setPhase("intro")} title="👤 MY PROFILE" />

            {/* Name editor */}
            <div style={{ ...card, padding:"16px 18px", marginBottom:14 }}>
              <div style={{ fontSize:10, letterSpacing:3, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:10 }}>YOUR NAME</div>
              <div style={{ display:"flex", gap:8 }}>
                <input value={nameInput||profile.name} onChange={e => setNameInput(e.target.value)} maxLength={20} placeholder="Enter name…"
                  style={{ flex:1, padding:"10px 12px", borderRadius:10, border:`1.5px solid ${B.skyLight}`, background:B.offWhite, fontFamily:"'Barlow Condensed',sans-serif", fontSize:16, fontWeight:700, color:B.navy, outline:"none" }}/>
                <button className="cta-btn" onClick={() => { updateProfile({ name: nameInput || profile.name }); setNameInput(""); }}
                  style={{ padding:"10px 16px", borderRadius:10, background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, color:B.white, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, fontWeight:900 }}>SAVE</button>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
              {[
                { l:"GAMES PLAYED",   v:profile.gamesPlayed||0,           c:B.navy    },
                { l:"BEST SCORE",     v:profile.bestScore||0,             c:B.gold    },
                { l:"BEST STREAK",    v:(profile.bestStreak||0)+"🔥",     c:B.sky     },
                { l:"LIFETIME ACC",   v:totalAcc+"%",                      c:B.correct },
                { l:"DAY STREAK",     v:(profile.loginStreak||0)+(profile.loginStreak>=3?" 🔥":""), c:profile.loginStreak>=3?B.gold:B.navy },
                { l:"DAILY BEST",     v:profile.dailyScore||"—",           c:"#E05050" },
              ].map(s => (
                <div key={s.l} style={{ ...card, padding:"14px 16px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:28, color:s.c, lineHeight:1, marginBottom:4 }}>{s.v}</div>
                  <div style={{ fontSize:9, color:B.navyLight, letterSpacing:2, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Category accuracy bars */}
            <div style={{ ...card, padding:"16px 18px", marginBottom:14 }}>
              <div style={{ fontSize:10, letterSpacing:3, color:B.navyLight, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, marginBottom:12 }}>CATEGORY ACCURACY</div>
              {Object.entries(CATS).map(([cat, info]) => {
                const st = profile.catStats?.[cat] || {c:0,t:0};
                const pct = st.t>0 ? Math.round(st.c/st.t*100) : 0;
                return (
                  <div key={cat} style={{ marginBottom:12 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:12, color:info.color, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700 }}>{info.icon} {cat}</span>
                      <span style={{ fontSize:12, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, color:pct>=70?B.correct:pct>=40?B.gold:B.wrong }}>{st.t>0?pct+"%":"—"}</span>
                    </div>
                    <div style={{ height:6, background:B.skyPale, borderRadius:6, overflow:"hidden" }}>
                      <div style={{ height:"100%", borderRadius:6, width:`${pct}%`, background:info.color, transition:"width 0.4s ease" }}/>
                    </div>
                    <div style={{ fontSize:10, color:B.navyLight, marginTop:3 }}>{st.c} correct / {st.t} answered</div>
                  </div>
                );
              })}
            </div>

            <button className="cta-btn" onClick={startSpeedRun} style={{ width:"100%", padding:"14px", borderRadius:12, background:`linear-gradient(135deg,${B.navy},${B.navyLight})`, color:B.white, fontFamily:"'Barlow Condensed',sans-serif", fontSize:18, fontWeight:900, letterSpacing:2 }}>
              PLAY NOW ⚾
            </button>
          </div>
          <div style={{ position:"fixed", bottom:0, left:0, right:0, height:4, background:`linear-gradient(90deg,${B.navy},${B.sky},${B.navy})` }}/>
        </div>
      </>
    );
  }

  return null;
}
