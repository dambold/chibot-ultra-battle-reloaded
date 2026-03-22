export const ARENAS = [
  { id:'default', name:'Null Arena', desc:'A featureless void.', effect:{}, happening:[
    // 90s Easter eggs
    {msg:'A Tamagotchi falls from nowhere and lands on %T\'s head. It immediately dies. %T feels responsible.', dmg:15, chance:0.08},
    {msg:'The Macarena starts playing from an unknown source in the void. %T involuntarily begins dancing and loses their turn!!', skipTurn:true, chance:0.07},
    {msg:'A single Beanie Baby floats past. %T grabs it. It\'s the rare Princess Diana bear. %T is momentarily elated and distracted!!', skipTurn:true, chance:0.06}] },
  { id:'volcanic', name:'Volcanic Crater', desc:'Random fire eruptions. +fire dmg.', effect:{fire:1.3}, happening:[
    {msg:'%T is scorched by volcanic gases!', elem:'fire', chance:0.08, dmg:50}
  ,
    // 90s Easter eggs
    {msg:'The Macarena blasts out of nowhere mid-eruption!! %T involuntarily starts doing the arm movements and cannot stop!!', skipTurn:true, chance:0.08},
    {msg:'A lava flow spells out "ALL THAT" in burning letters!! %T stops to read it and gets scorched!!', dmg:30, chance:0.07},
    {msg:'A Mighty Morphin Power Rangers Zord crashes into the volcano!! The shockwave sends debris flying at %T!!', dmg:40, chance:0.07}]},
  { id:'frozen', name:'Frozen Tundra', desc:'Blizzard conditions. +ice dmg.', effect:{ice:1.3}, happening:[
    {msg:'A blizzard strikes %T!', elem:'ice', chance:0.07, dmg:45}
  ,
    // 90s Easter eggs
    {msg:'%T\'s Tamagotchi freezes solid in the cold!! The grief of losing a digital pet is genuinely debilitating!! %T cannot focus!!', skipTurn:true, chance:0.08},
    {msg:'Vanilla Ice slides past on an ice sheet performing Ice Ice Baby!! %T stops to watch in horrified fascination!!', skipTurn:true, chance:0.07},
    {msg:'A giant inflatable Barney the Dinosaur rolls through the blizzard and flattens %T!! I love you, you love me!!', dmg:35, chance:0.07},
    {msg:'%T slips on a Starter jacket someone dropped on the ice!! %T goes flying!!', dmg:20, chance:0.09}]},
  { id:'mall', name:'The Mall', desc:'Someone is always having a sale. And something is always going wrong.', effect:{}, happening:[
    // Original hazards
    {msg:'%T gets distracted by a sale at JCPenney!', skipTurn:true, chance:0.10},
    {msg:'%T gets distracted by a sale at Suncoast Video!', skipTurn:true, chance:0.10},
    {msg:'%T gets swarmed by shoppers during a Midnight Madness sale!', skipTurn:true, chance:0.08},
    // Store hazards
    {msg:'Sam Goody is blasting the new Ace of Base CD at full volume! %T stops dead in their tracks and cannot focus!!', skipTurn:true, chance:0.09},
    {msg:'A pack of Hot Topic kids in trench coats completely blocks the hallway! %T cannot get through!', skipTurn:true, chance:0.09},
    {msg:'A Spencer\'s Gifts fart machine goes off right next to %T! %T is disoriented and mortified!!', dmg:25, statusEffect:'chaos', statusChance:0.60, chance:0.08},
    {msg:'A Foot Locker employee chases %T down demanding to know their shoe size! %T cannot escape!!', skipTurn:true, chance:0.09},
    // Food court hazards
    {msg:'An Orange Julius spills all over %T!! %T is soaked in orange slush and furious!!', dmg:30, chance:0.09},
    {msg:'%T grabs a slice of Sbarro pizza without realizing it just came out of the oven!! %T burns their mouth and hands!!', dmg:35, chance:0.08},
    {msg:'The smell of Cinnabon wafts through the food court and %T simply cannot resist!! %T abandons the fight to get a cinnamon roll!!', skipTurn:true, chance:0.10},
    // Specific 90s energy hazards
    {msg:'A kiosk guy ambushes %T with a perfume spritzer!! %T is blinded by a cloud of cheap body spray!!', skipTurn:true, statusEffect:'blind', statusChance:0.75, chance:0.09},
    {msg:'A Claire\'s employee corners %T with a piercing gun!! %T did not consent to this!!', dmg:30, chance:0.08},
    {msg:'A Waldenbooks customer hits %T over the head with a hardcover copy of The Pelican Brief!! %T sees stars!!', dmg:35, chance:0.08},
    {msg:'%T\'s pager goes off!! %T sprints to the nearest payphone and is out of the fight for a moment!!', skipTurn:true, chance:0.09},
    {msg:'A kid sitting in the middle of the walkway playing a Game Boy trips %T!! %T goes flying!!', dmg:20, chance:0.10},
    {msg:'The decorative fountain coins fly up and pelt %T from all directions!! It\'s like getting hit by a tiny hailstorm!!', dmg:25, chance:0.09},
    {msg:'The mall Santa has completely lost it and is chasing everyone!! %T takes a direct hit from a candy cane!!', dmg:40, chance:0.07},
    {msg:'A Wet Seal sale causes a full stampede!! %T is trampled by deal-hungry shoppers and loses their next turn!!', skipTurn:true, dmg:20, chance:0.08},
  ]},
  { id:'mugen', name:'Mugen Academy', desc:'Elite school with dangerous surprises.', effect:{}, happening:[
    {msg:'%T gets pulled into a pop quiz!', skipTurn:true, chance:0.12},
    {msg:'%T is stopped in their tracks as a chemistry lab explodes!', skipTurn:true, chance:0.10},
  ,
    // 90s Easter eggs
    {msg:'A Riverdance troupe thunders down the hallway in full performance!! %T is completely blocked and cannot pass!!', skipTurn:true, chance:0.09},
    {msg:'Someone\'s dial-up modem connecting sound echoes through the school!! The SCREECHING is unbearable!! %T loses all concentration!!', skipTurn:true, statusEffect:'chaos', statusChance:0.50, chance:0.08},
    {msg:'A Lisa Frank trapper keeper explodes open and covers %T in glittery rainbow unicorn stickers!! %T cannot see!!', skipTurn:true, statusEffect:'blind', statusChance:0.65, chance:0.08},
    {msg:'The teacher puts on a VHS copy of Bill Nye the Science Guy!! %T refuses to leave until the episode ends!!', skipTurn:true, chance:0.07}]},
  { id:'ginza', name:'Ginza District, Tokyo', desc:'The heart of Tokyo. Stylish but distracting.', effect:{}, happening:[
    {msg:'%T gets distracted by a clothing sale!', skipTurn:true, chance:0.12},
  ,
    // 90s Easter eggs
    {msg:'A Spice Girls CD falls from a window and beans %T directly on the head!! GIRL POWER!!', dmg:25, chance:0.09},
    {msg:'A giant Tamagotchi billboard flickers and falls into the street!! %T barely avoids it!!', dmg:30, chance:0.08},
    {msg:'The Macarena starts playing from every shop simultaneously!! The entire Ginza District is doing it!! %T has no choice but to join!!', skipTurn:true, chance:0.08},
    {msg:'A pack of Furbies in a toy store window all activate at once and start screaming!! %T is frozen in existential horror!!', skipTurn:true, statusEffect:'chaos', statusChance:0.55, chance:0.07}]},
  { id:'fourside', name:'Fourside City', desc:'Something strange is always happening here.', effect:{}, happening:[
    {msg:'%T was stopped by a weird police barricade!', skipTurn:true, mpDrain:10, chance:0.12},
    {msg:'%T was abducted by a UFO!', skipTurn:true, mpDrain:10, chance:0.10},
  ,
    // 90s Easter eggs
    {msg:'Ross Perot drives through in a motorcade pointing at giant charts!! %T is stopped by his security detail!!', skipTurn:true, chance:0.09},
    {msg:'Jerry Springer is filming on location!! A surprise guest ambushes %T from behind a news van!! JERRY!! JERRY!!', dmg:30, chance:0.08},
    {msg:'A kid on a Skip-It nearly takes out %T\'s ankles!! %T goes down hard!!', dmg:20, chance:0.09},
    {msg:'The Fresh Prince theme starts playing from a nearby boom box!! %T stops everything to recite along with it!!', skipTurn:true, chance:0.07}]},
  { id:'kamehouse', name:'Kame House', desc:'Master Roshi\'s island. Don\'t touch the flowers.', effect:{}, happening:[
    {msg:'%T gets Mr. Roshi mad by trampling his flowers. Mr. Roshi unleashes his Kamehameha at %T!', dmg:35, mpDrain:30, chance:0.12},
  ,
    // 90s Easter eggs
    {msg:'Master Roshi is watching a Dragon Ball Z VHS tape and won\'t pause it!! %T trips over the tape collection!!', dmg:20, chance:0.09},
    {msg:'A Pog slammer tournament breaks out on the island!! %T gets sucked in and loses their turn!!', skipTurn:true, chance:0.08},
    {msg:'Krillin\'s karaoke machine turns on and blasts I Will Always Love You at full volume!! %T cannot hear anything!! MUTED!!', statusEffect:'mute', statusChance:0.70, chance:0.08},
    {msg:'A giant inflatable sumo wrestler toy rolls off the roof and flattens %T!! Master Roshi laughs hysterically!!', dmg:35, chance:0.07}]},
  { id:'xfiles', name:'The X-Files Office', desc:'The truth is out there. So is the danger.', effect:{}, happening:[
    {msg:'A weird kid psychically attacks %T!', dmg:0, mpDrain:20, chance:0.12},
    {msg:'A reptile alien attacks %T!', dmg:20, chance:0.12},
    {msg:'A man in black attacks %T!', dmg:15, chance:0.10},
  ,
    // 90s Easter eggs
    {msg:'Mulder has pinned a new conspiracy theory to the bulletin board!! %T stops to read it and cannot look away!! The truth is out there!!', skipTurn:true, chance:0.09},
    {msg:'Someone left a copy of The X-Files Game on CD-ROM running!! The loading screen has been going for 45 minutes!! %T watches in hypnotized horror!!', skipTurn:true, chance:0.08},
    {msg:'Scully\'s cell phone goes off playing a tinny MIDI ringtone!! The interruption ruins %T\'s concentration completely!!', statusEffect:'chaos', statusChance:0.55, chance:0.08},
    {msg:'A grainy VHS copy of the Alien Autopsy special is playing on the office TV!! %T cannot stop watching!!', skipTurn:true, chance:0.07}]},
  { id:'scully', name:"Scully's House", desc:'Quiet and calm. Everyone gets their energy back.', effect:{mpRegen:12}, happening:[
    // 90s Easter eggs
    {msg:'Friends is on TV and the One Where Nobody is Ready episode is playing!! %T refuses to leave the couch!! But recovers some HP in the process!!', skipTurn:true, chance:0.08},
    {msg:'A Seinfeld rerun is so good that %T sits down involuntarily!! But the laugh track is genuinely restorative!!', skipTurn:true, chance:0.07},
    {msg:'No Doubt\'s Don\'t Speak comes on the radio!! The emotional weight of the song restores %T\'s fighting spirit!!', chance:0.08}] },
  { id:'cassie', name:"Cassie's Barn", desc:'Animals and aliens lurk around every corner.', effect:{}, happening:[
    {msg:'A red tailed hawk flies down and attacks %T!', dmg:20, chance:0.12},
    {msg:'A grizzly bear appears and mauls %T!', dmg:20, chance:0.12},
    {msg:'A jaguar appears and mauls %T!', dmg:20, chance:0.10},
    {msg:'Visser Three appears and attacks %T!', dmg:20, chance:0.08},
    {msg:'The Taxxons attack %T out of nowhere!', dmg:20, chance:0.10},
  ,
    // 90s Easter eggs
    {msg:'A Furby hidden in the hay suddenly activates and starts screaming in the dark!! %T screams back!! The mutual screaming is paralyzing!!', skipTurn:true, statusEffect:'chaos', statusChance:0.60, chance:0.09},
    {msg:'A Mighty Max playset falls from the loft and beans %T on the head!! %T sees stars!!', dmg:25, chance:0.09},
    {msg:'The Animorphs kids morph in the barn and accidentally trample %T on their way out!!', dmg:30, chance:0.08},
    {msg:'A Giga Pet falls from a shelf and lands in %T\'s pocket!! %T spends their turn feeding it!!', skipTurn:true, chance:0.07}]},
  { id:'juban', name:'Juban District', desc:'Tokyo\'s most eventful neighborhood. Sailor Moon is always nearby.', effect:{}, happening:[
    {msg:'%T runs towards the Youma but is stopped by Sailor Moon battling Negaverse bad guys! %T has to wait until the fighting stops!', skipTurn:true, chance:0.12},
  ,
    // 90s Easter eggs
    {msg:'A Sailor Moon R movie poster falls off a telephone pole and wraps around %T\'s face!! %T cannot see!!', skipTurn:true, statusEffect:'blind', statusChance:0.65, chance:0.09},
    {msg:'A street vendor is selling bootleg Sailor Moon merchandise!! %T stops to browse!! The bargains are too good!!', skipTurn:true, chance:0.08},
    {msg:'The Sailor Moon S opening theme blasts from a nearby arcade!! %T stops dead and starts humming along completely involuntarily!!', skipTurn:true, chance:0.08},
    {msg:'A kid drops their entire Sailor Moon card collection!! %T helps pick them up because they\'re a decent person!! %T loses their turn!!', skipTurn:true, chance:0.07}]},
  { id:'casabonita', name:'Casa Bonita', desc:'Colorado\'s most chaotic dining experience. Fire, cliff divers, and sopapillas.', effect:{fire:1.2}, happening:[
    {msg:'A cliff diver leaps from the waterfall and lands directly on %T!! The crowd goes wild!!', dmg:40, chance:0.09},
    {msg:'The fake volcano erupts right next to %T!! Sparks and foam fly everywhere!! %T is singed!!', elem:'fire', dmg:35, chance:0.09},
    {msg:'A mariachi band surrounds %T and plays at full volume directly in their face!! %T cannot concentrate!!', skipTurn:true, chance:0.09},
    {msg:'%T wanders into Black Bart\'s Cave and cannot find their way out!! The animatronic outlaws are terrifying!!', skipTurn:true, chance:0.08},
    {msg:'A basket of sopapillas lands on %T\'s head!! The honey is everywhere!! %T is sticky and furious!!', dmg:20, chance:0.09},
    {msg:'The waterfall surges and floods %T\'s position!! %T is soaked and pushed back!!', dmg:30, chance:0.08},
    {msg:'A cliff diver misses the pool and collides with %T mid-arena!! Both parties are confused!!', dmg:45, chance:0.07},
    {msg:'%T is handed a basket of chips by a waiter who doesn\'t notice the battle happening!! %T loses their turn trying to explain the situation!!', skipTurn:true, chance:0.08},
    // 90s Easter eggs
    {msg:'The South Park kids are here on a field trip!! Cartman is screaming about something!! %T cannot focus over the noise!!', skipTurn:true, statusEffect:'chaos', statusChance:0.55, chance:0.08},
    {msg:'Someone ordered a birthday cake and the entire staff starts singing!! %T involuntarily joins in!! It\'s just how Casa Bonita works!!', skipTurn:true, chance:0.07},
    {msg:'A kid throws a sopapilla and it hits %T directly in the eye!! Nobody apologizes!!', dmg:15, chance:0.09},
    {msg:'The puppet show in the corner starts and %T cannot look away!! The puppets are deeply unsettling!!', skipTurn:true, chance:0.07},
  ]},

  { id:'galaxiathrone', name:'Galaxia\'s Throne Room', desc:'The heart of Shadow Galactica. Star seeds drain here. Your power belongs to her.', effect:{hpDrain:8}, happening:[
    {msg:'Sailor Phi and Chi materialize from the walls and blast %T with Galactica energy!!', dmg:45, chance:0.09},
    {msg:'The Galactica bracelets on the walls activate and reach toward %T\'s star seed!! %T feels their power draining!!', mpDrain:35, chance:0.10},
    {msg:'Sailor Galaxia\'s golden energy radiates from the throne and burns %T!!', dmg:40, elem:'golden', chance:0.09},
    {msg:'An Animamate appears from the shadows and fires a Galactica blast at %T before vanishing!!', dmg:35, chance:0.08},
    {msg:'The star seeds in the Galactica jars along the walls pulse and drain %T\'s energy!!', mpDrain:25, dmg:20, chance:0.09},
    {msg:'%T steps on a stray Galactica bracelet!! It activates and shocks them with golden energy!!', dmg:30, chance:0.08},
    {msg:'Galaxia\'s voice echoes through the throne room — "Your star seed will be mine!" — the sound alone is physically painful!!', dmg:25, statusEffect:'chaos', statusChance:0.50, chance:0.08},
    {msg:'The golden floor of the throne room blazes with Galactica power and burns %T\'s feet!!', dmg:35, chance:0.08},
    // 90s Easter eggs
    {msg:'Someone left a Sailor Stars VHS tape playing on a small TV in the corner!! %T stops to watch the transformation sequence!!', skipTurn:true, chance:0.07},
    {msg:'A Sailor Moon Stars soundtrack CD falls from somewhere above and beans %T on the head!! It was the limited edition one!!', dmg:20, chance:0.08},
  ]},

  { id:'dangerroom', name:'The Danger Room', desc:'The X-Men\'s training facility. The equipment malfunctions. The training never stops.', effect:{physStr:1.15, magStr:1.15}, happening:[
    {msg:'A laser grid activates unexpectedly and %T runs directly into it!! Cyclops did not warn anyone!!', dmg:40, chance:0.09},
    {msg:'A holographic Sentinel materializes and fires at %T before the safety protocols kick in!!', dmg:45, chance:0.08},
    {msg:'The gravity simulator malfunctions and %T is suddenly fighting at 3x gravity!! %T\'s next action is slowed!!', skipTurn:true, chance:0.09},
    {msg:'Beast\'s latest Danger Room upgrade fires a sonic pulse at %T!! He is still calibrating!!', dmg:35, statusEffect:'chaos', statusChance:0.55, chance:0.08},
    {msg:'Wolverine left his adamantium claws in the training floor again!! %T finds them with their foot!!', dmg:50, chance:0.07},
    {msg:'The ice simulation activates and %T is flash-frozen by Danger Room ice jets!!', dmg:30, statusEffect:'stop', statusChance:0.50, chance:0.08},
    {msg:'Cyclops is running a drill and accidentally fires his optic blast at %T!! He apologizes exactly once!!', dmg:40, chance:0.08},
    {msg:'The training course obstacle wall collapses on %T!! Maintenance has been requested since 1992!!', dmg:35, chance:0.08},
    // 90s Easter eggs
    {msg:'Professor X is watching from the control room on a very large 90s computer monitor!! The loading bar is at 12%!! He cannot intervene!!', skipTurn:true, chance:0.07},
    {msg:'Someone left an X-Men animated series VHS running on the monitor!! The theme song plays!! %T stops dead!! IT IS SIMPLY TOO GOOD!!', skipTurn:true, chance:0.08},
    {msg:'A Danger Room simulation of the 90s Sentinel design activates!! It is extremely purple and extremely 90s!! %T cannot take it seriously!!', skipTurn:true, statusEffect:'chaos', statusChance:0.50, chance:0.07},
    {msg:'Jubilee snuck in to practice and accidentally fires pyrokinetic blasts at %T!! She apologizes profusely!!', dmg:25, chance:0.08},
  ]},

  { id:'rave', name:'The Rave', desc:'1994. A warehouse somewhere. Glow sticks, fog machines, and extremely loud music.', effect:{mpRegen:8}, happening:[
    {msg:'The fog machine engulfs the arena!! %T cannot see anything!! Visibility zero!!', skipTurn:true, statusEffect:'blind', statusChance:0.70, chance:0.09},
    {msg:'A glow stick explodes and sprays fluorescent liquid directly into %T\'s eyes!!', dmg:20, statusEffect:'blind', statusChance:0.65, chance:0.09},
    {msg:'The bass drops so hard the entire warehouse shakes!! %T is knocked off their feet by the sonic force!!', dmg:30, chance:0.09},
    {msg:'Someone in JNCO jeans the size of parachutes trips %T with a trouser leg!! %T goes flying!!', dmg:20, chance:0.08},
    {msg:'A stranger offers %T a warm Surge from a cooler!! %T drinks it without thinking and is momentarily restored!!', chance:0.07},
    {msg:'The DJ scratches a record so hard it fires vinyl shards at %T!! The music never stops!!', dmg:25, chance:0.08},
    {msg:'%T gets tangled in seventeen glow stick necklaces simultaneously!! %T cannot move!!', skipTurn:true, chance:0.09},
    {msg:'Someone starts the Macarena and %T involuntarily joins in!! It is 1994 and there is no escape!!', skipTurn:true, chance:0.08},
    {msg:'A laser light show activates and the beams sweep directly across %T\'s eyes!! %T is temporarily blinded!!', statusEffect:'blind', statusChance:0.60, chance:0.08},
    {msg:'The entire crowd starts doing the Running Man around %T!! %T is surrounded and cannot escape!!', skipTurn:true, chance:0.07},
  ]},

  { id:'arcade', name:'The Arcade', desc:'1993. Tokens, Street Fighter II, and the smell of carpet that has seen things.', effect:{}, happening:[
    {msg:'Someone shoves %T away from the Street Fighter II cabinet mid-combo!! %T is furious!!', dmg:20, skipTurn:true, chance:0.09},
    {msg:'A Mortal Kombat fatality sound effect plays at full volume right next to %T\'s ear!! %T is rattled!!', statusEffect:'chaos', statusChance:0.55, chance:0.09},
    {msg:'%T slips on a pile of discarded tokens!! %T goes down hard!!', dmg:25, chance:0.09},
    {msg:'A pinball machine tilts and fires its steel ball directly at %T!!', dmg:35, chance:0.08},
    {msg:'The claw machine drops its prize on %T\'s head!! It is a stuffed Pikachu and it hurts!!', dmg:20, chance:0.08},
    {msg:'%T gets sucked into a Dance Dance Revolution crowd and cannot escape the arrows!!', skipTurn:true, chance:0.08},
    {msg:'A kid rage-quits a fighting game and throws the joystick at %T!!', dmg:25, chance:0.09},
    {msg:'The Whack-A-Mole machine malfunctions and starts whacking %T instead!!', dmg:30, chance:0.08},
    {msg:'%T finds a token on the ground and gets distracted looking for the machine it belongs to!!', skipTurn:true, chance:0.07},
    {msg:'The Terminator 2 pinball machine fires its multiball at %T!! Several steel balls connect simultaneously!!', dmg:40, chance:0.07},
  ]},

  { id:'lanparty', name:'The LAN Party', desc:'1998. Sixteen computers. One ethernet hub. Quake III. Someone\'s basement.', effect:{magStr:1.10}, happening:[
    {msg:'%T trips over a tangle of ethernet cables and crashes to the floor!! The cables were everywhere!!', dmg:25, chance:0.10},
    {msg:'Someone\'s dial-up modem screeches to life right next to %T\'s ear!! %T loses all concentration!!', skipTurn:true, statusEffect:'chaos', statusChance:0.55, chance:0.09},
    {msg:'A CRT monitor falls off a folding table and nearly crushes %T!! Those things weigh forty pounds!!', dmg:40, chance:0.08},
    {msg:'%T gets fragged by a twelve-year-old in Quake III and is so humiliated they cannot act!!', skipTurn:true, chance:0.08},
    {msg:'The power strip overloads and sends a spark shooting at %T!!', dmg:30, chance:0.08},
    {msg:'%T\'s chair collapses!! It was a folding chair!! It was always going to collapse!!', dmg:20, chance:0.09},
    {msg:'Someone installs a virus called "Fun.exe" on the battle computer!! %T\'s attacks are scrambled!!', statusEffect:'chaos', statusChance:0.65, chance:0.08},
    {msg:'The host\'s mom comes downstairs with pizza and blocks %T\'s line of sight!! %T cannot act!!', skipTurn:true, chance:0.08},
    {msg:'A massive Tower of CD-ROMs falls on %T!! StarCraft, Quake, Half-Life, Diablo — all of them!!', dmg:35, chance:0.07},
    {msg:'Someone starts playing the AIM door sound effect on loop!! %T cannot function!!', skipTurn:true, statusEffect:'chaos', statusChance:0.50, chance:0.07},
  ]},

  { id:'lasertag', name:'Laser Tag Arena', desc:'1993. Fog, vests, and the smell of adolescent competition.', effect:{}, happening:[
    {msg:'The fog machine fires directly at %T!! %T is completely blind in the neon haze!!', skipTurn:true, statusEffect:'blind', statusChance:0.70, chance:0.10},
    {msg:'%T\'s laser tag vest activates and shocks them!! The sensors are not supposed to do that!!', dmg:30, chance:0.09},
    {msg:'A twelve-year-old in full camo gear ambushes %T from behind a foam barrier!!', dmg:25, chance:0.09},
    {msg:'The strobe lights activate at maximum intensity!! %T cannot see or think straight!!', skipTurn:true, statusEffect:'chaos', statusChance:0.60, chance:0.09},
    {msg:'%T runs into a foam pillar in the darkness!! Foam does not hurt less just because it\'s foam!!', dmg:20, chance:0.09},
    {msg:'The arena music — a Jock Jams instrumental — is so motivating that %T stops fighting to vibe!!', skipTurn:true, chance:0.08},
    {msg:'%T\'s vest runs out of battery mid-battle!! A laser tag employee appears to swap it out!! The interruption is total!!', skipTurn:true, chance:0.08},
    {msg:'A rogue laser blast from across the arena hits %T in the sensor vest!! The alarm is deafening!!', dmg:20, statusEffect:'chaos', statusChance:0.50, chance:0.08},
    {msg:'%T slips on the slick arena floor in the dark and goes down hard!!', dmg:25, chance:0.08},
    {msg:'The game ends and the lights come on mid-fight!! Both fighters blink at each other in fluorescent light!!', skipTurn:true, chance:0.06},
  ]},

  { id:'centralperk', name:'Central Perk', desc:'New York City. The couch is free for some reason. Ross is explaining something.', effect:{mpRegen:10}, happening:[
    {msg:'Ross corners %T and begins explaining the geological significance of something nearby!! %T cannot escape for an entire turn!!', skipTurn:true, chance:0.10},
    {msg:'Chandler makes a sarcastic comment at exactly the wrong moment and %T bursts out laughing!! %T cannot act!!', skipTurn:true, chance:0.09},
    {msg:'Gunther slides a large coffee directly into %T\'s path!! %T trips and goes flying!!', dmg:20, chance:0.09},
    {msg:'Phoebe starts performing an original song!! %T stops everything to listen because honestly it\'s pretty good!!', skipTurn:true, chance:0.08},
    {msg:'Joey takes %T\'s food!! %T is too shocked to act!! "Joey doesn\'t share food!!"!!', skipTurn:true, chance:0.09},
    {msg:'Monica starts cleaning the table %T is standing on while they\'re standing on it!! The disturbance is total!!', skipTurn:true, chance:0.08},
    {msg:'The theme song starts playing from somewhere!! Everyone instinctively begins clapping!! The battle pauses!!', skipTurn:true, chance:0.07},
    {msg:'Rachel spills an entire coffee on %T!! It is scalding and %T is furious!!', dmg:30, chance:0.09},
    {msg:'%T sits in the big orange chair!! Somehow this restores their energy — it is an incredibly comfortable chair!!', chance:0.07},
    {msg:'"We were on a break!!" echoes through the coffee shop!! %T is so confused by the context that they lose focus!!', skipTurn:true, statusEffect:'chaos', statusChance:0.50, chance:0.07},
  ]},

  { id:'peachpit', name:'The Peach Pit', desc:'Beverly Hills. Dylan is brooding. Brandon is working. Something dramatic is happening.', effect:{mpRegen:8}, happening:[
    {msg:'Dylan McKay stares intensely at %T from his booth!! The raw brooding energy is physically debilitating!!', skipTurn:true, statusEffect:'chaos', statusChance:0.55, chance:0.09},
    {msg:'Brandon Walsh tries to give %T unsolicited life advice!! %T cannot escape the sincerity!!', skipTurn:true, chance:0.09},
    {msg:'Nat spills a milkshake on %T!! It is thick and cold and covers everything!!', dmg:20, chance:0.09},
    {msg:'Kelly and Brenda are having a dramatic argument in the booth next to %T!! The drama is contagious and disorienting!!', statusEffect:'chaos', statusChance:0.55, chance:0.09},
    {msg:'Steve Sanders tries to pull %T into a scheme!! %T loses a turn extricating themselves!!', skipTurn:true, chance:0.08},
    {msg:'Andrea Zuckerman appears and asks %T for a quote for the school paper!! %T cannot refuse and loses their turn!!', skipTurn:true, chance:0.08},
    {msg:'The jukebox fires up and plays something impossibly 90s at full volume!! %T involuntarily starts reminiscing!!', skipTurn:true, chance:0.08},
    {msg:'%T sits at the counter and Nat brings them a burger without asking!! The smell is restorative!!', chance:0.07},
    {msg:'Dylan\'s motorcycle is parked directly in %T\'s path!! %T cannot get past without moving it!! The keys are nowhere!!', skipTurn:true, chance:0.08},
    {msg:'Someone mentions the West Beverly Blaze and %T gets involved in the editorial drama involuntarily!!', skipTurn:true, chance:0.07},
  ]},

  { id:'suncoast', name:'Suncoast Video', desc:'The mall\'s sacred anime shrine. VHS imports, dubbed vs subbed arguments, and Sailor Moon merchandise.', effect:{}, happening:[
    {msg:'%T gets into a heated subtitles vs dubbing argument with another customer!! %T cannot disengage!! The argument is IMPORTANT!!', skipTurn:true, statusEffect:'chaos', statusChance:0.55, chance:0.10},
    {msg:'A tower of Dragon Ball Z VHS tapes falls on %T!! There are 291 episodes and they are ALL here!!', dmg:35, chance:0.09},
    {msg:'%T finds the import section and becomes completely transfixed by a bootleg they have never seen!!', skipTurn:true, chance:0.09},
    {msg:'The Sailor Moon S movie VHS falls off the shelf and hits %T perfectly in the head!!', dmg:20, chance:0.09},
    {msg:'A Suncoast employee asks %T if they need help finding something!! %T spends their entire turn explaining what they\'re looking for!!', skipTurn:true, chance:0.08},
    {msg:'%T discovers the clearance bin!! The deals are too good!! %T cannot leave without going through every single tape!!', skipTurn:true, chance:0.09},
    {msg:'The store TV is playing an uncut anime with violence that was edited out of the American version!! %T cannot look away!!', skipTurn:true, chance:0.08},
    {msg:'%T finds a Sailor Moon R movie poster they have never seen before!! This is a religious experience!! %T loses their turn!!', skipTurn:true, chance:0.08},
    {msg:'A CD soundtrack falls from the rack and hits %T!! It is the Evangelion OST and it absolutely slaps!!', dmg:15, chance:0.08},
    {msg:'Someone is AMV-ing in the corner on a VCR they brought from home!! %T stops to watch!! It is set to Evanescence and it\'s actually incredible!!', skipTurn:true, chance:0.07},
  ]},

  { id:'blockbuster', name:'Blockbuster Video', desc:'Friday night, 1996. Every copy of Space Jam is gone. Late fees will be incurred.', effect:{}, happening:[
    {msg:'%T cannot find the movie they want because someone didn\'t rewind it and it\'s in the wrong section!! %T spends their turn searching!!', skipTurn:true, chance:0.10},
    {msg:'A Be Kind Rewind sign falls off the shelf and hits %T directly!!', dmg:20, chance:0.09},
    {msg:'Every copy of Space Jam is gone!! %T is devastated and cannot act from the disappointment!!', skipTurn:true, chance:0.09},
    {msg:'%T owes $47 in late fees!! A Blockbuster employee appears and demands payment!! %T is frozen in shame!!', skipTurn:true, statusEffect:'chaos', statusChance:0.55, chance:0.09},
    {msg:'The membership card scanner goes off right next to %T\'s ear!! %T flinches and loses their footing!!', dmg:15, chance:0.09},
    {msg:'%T finds the horror section and makes the mistake of looking at the Hellraiser box art!! %T cannot unsee it!!', statusEffect:'chaos', statusChance:0.60, chance:0.08},
    {msg:'A display of candy at the counter falls on %T!! Gushers, Fruit by the Foot and Fun Dip rain down!!', dmg:20, chance:0.08},
    {msg:'%T picks up a movie that looks good but is sealed with industrial sticker tape!! %T tears their nail trying to open it!! Ow!!', dmg:10, skipTurn:true, chance:0.08},
    {msg:'The employee recommendation section has a VHS of Hackers facing out!! %T stops to read the back of the box!! It is extremely 1995!!', skipTurn:true, chance:0.07},
    {msg:'%T finds a forgotten copy of the Sailor Moon movie in the anime section!! This is the greatest day of their life!! %T\'s HP is fully restored from the joy!!', chance:0.05},
  ]},
];

// ── GAME STATE ────────────────────────────────
