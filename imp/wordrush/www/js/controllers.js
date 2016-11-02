angular.module('starter.controllers', ['wordrush.startapp'])

// .controller('AppCtrl', function($scope, $ionicModal, $timeout) {

// })

// .controller('PlaylistsCtrl', function($scope) {

// })

// .controller('PlaylistCtrl', function($scope, $stateParams) {})

.controller('playAreaCtrl', function($scope, StartAppAds, $ionicPopup, storageService, NetworkService, Loader, VibrateService, $cordovaAppRate, LocalStorageService, APP_CONSTANT, roundProgressService, $interval, $timeout, $ionicModal, $ionicActionSheet, $state, $ionicPlatform, $cordovaNativeAudio, RankService) {

    var admobid = {};
     
      admobid = {            
            //interstitial: 'ca-app-pub-1204262321700562/9653073534' -- old
          interstitial: 'ca-app-pub-1204262321700562/9735944330'  
        };

        var facebookid = {
        	interstitial : '949548208482657_949577068479771'
        };
//     if( ionic.Platform.isAndroid() )  { 
//        if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, isTesting: false, autoShow:false} );
// }
    $scope.allWords = ["ABLE","ABET","ARTY","AXON","AYIN","AWED","ACME","AVER","ABUT","APER","ACID","AQUA","ARCH","ANON","AMBO","ALUM","ALPS","ALGA","AHEM","AFRO","AGUE","AGAR","TAMP","ARMY","AGOG","BIRR","BABY","BACK","BALL","BAND","BASE","BARB","BATH","BASS","BELL","BAWD","BIRD","BITE","BLOW","BLUE","BAUD","BAWL","BARD","YAWL","WORT","BITT","SPAM","SOYA","RAND","BARM","BODE","BLEB","BOLL","BEAU","BURL","BUNT","BRIE","BOXY","BRIS","BUBO","BRAD","BONK","BOAT","BEVY","BLAT","YURT","BILK","UNIX","BETA","BERM","BODY","BERK","BONE","BOOK","BOOT","BULB","BURN","BUSK","BURR","CYAN","CRAG","CHUB","CELT","CHAD","CALX","CEDI","CANT","CAKE","CARD","CARE","CART","RIVE","ROAN","POCK","CHIN","COAL","COAT","COLD","COMB","VALE","VANE","VAMP","COME","COOK","CUSP","COPY","COHO","YETI","COWL","COSY","COIF","CORM","COOT","CONK","COLE","CORD","SATE","CODA","CORK","DADO","DARK","DAFT","ORYX","DEAD","DIVA","DOER","DEAR","DYNE","GOOP","GLUG","GLEN","GYRE","UVEA","GELD","DYER","DOLT","DOFF","DOGE","ROUE","ROVE","DHOW","DILL","RIFF","RILL","DIGS","DISC","DIVA","DIBS","DEWY","DELL","DEBT","DEEP","DOOR","DOWN","DUFF","DROP","UREA","DOZY","DRAM","DUST","ZEBU","EXON","ECRU","EAST","EDGE","EVEN","EVER","EWER","EURO","FACE","FACT","FINK","FLOE","FAUN","FAUX","FALL","FARM","FEAR","FIRE","FISH","FLAG","FLAT","FOLD","FOOD","FOOT","FORK","FORM","FOWL","FREE","FROM","FULL","FLAN","FLAX","GIRL","GUCK","GIVE","GIRD","ROOD","GAFF","GOTH","GAGA","GAGE","ZULU","PRAM","GOAT","GILT","GIMP","GOLD","GOOD","GREY","GLIA","GRIP","HOAR","HYPO","HAEM","HAIR","HASP","HICK","HAND","HARD","OUZO","HATE","HAVE","HEAD","PUCE","YULE","YUAN","TSAR","HEAR","TAKA","HEAT","HELP","HIGH","HOLE","HOOK","HOPE","HORN","HOUR","IDEA","IRON","JOIN","JUMP","KOOK","KUDU","KALE","KINE","KINA","KERN","YANG","KEEP","TALC","SWAG","KELP","KICK","KIND","KISS","KNEE","KNOT","LADE","LAND","LAUD","LAST","LATE","LEAD","LEAF","LODE","LOTI","LUTE","LYNX","LYRE","LOUT","LOIN","QUID","LAZE","LIRA","LOCH","LIMN","LARI","LAVE","LANK","LEFT","LIFT","LIKE","LINE","LIST","LOCK","LONG","LOOK","SNOG","LOSS","LOUD","LUAU","LUBE","LOVE","MUON","MAKE","MALE","MARK","MASS","MEAL","MEAT","MILK","TROY","MIND","MINE","ZETA","MIST","MACH","MARA","SCOT","MOON","MOVE","MUCH","NAIL","NAME","NEAR","NECK","NEED","NEWS","NOSE","NOTE","ONLY","OPEN","OVEN","OVER","PAGE","PAIN","PART","PAST","PIPE","PLAY","POOR","PULL","PUMP","PUSH","RAIL","TINE","TING","VIBE","RAIN","TALA","RATE","REST","RICE","RING","ROAD","ROLL","ROOF","ROOM","VEND","ROOT","RULE","SAFE","SAIL","SALT","SAME","SAND","SEAT","SEED","TYRO","TZAR","SEEM","SELF","SEND","SHIP","SHOE","ORCA","RIME","SHUT","SIDE","SIGN","SILK","SIZE","SKIN","SLIP","SLOW","SNOW","SOAP","SOCK","SOFT","SOME","ULNA","SONG","SORT","SOUP","STAR","STEM","STEP","STOP","SUCH","SWIM","TAIL","TAKE","TALK","TALL","TEST","THAN","THAT","THEN","THIN","THIS","TILL","TIME","TOWN","TRAY","TREE","TRUE","TURN","UNIT","VERY","VIEW","WALK","WALL","WARM","RIAL","WASH","WAVE","YOWL","WEEK","WELL","WEST","YAWP","WHIP","WIDE","WILL","WIND","WINE","WING","TRAM","WIRE","WISE","WITH","WOOD","WOOL","WORD","WORK","WORM","YEAR","GRAY","PLOW","ALLY","ALSO","AREA","ARMS","ROIL","AWAY","BANK","BEAT","BEST","BILL","BOIL","BOMB","BORN","BOTH","BURY","BUSY","WAUL","CALL","CALM","CAMP","CASE","CITY","MYNA","COOL","CORN","COST","CREW","CURE","DATE","WHEY","DEAF","DEAL","WOAD","DENY","DIET","WIFI","DIRT","SEXT","DIVE","SHAH","DRUG","DUTY","EACH","SEER","EARN","EASE","EASY","EVIL","FAIL","FAIR","FAST","FEED","TUFF","FEEL","FILL","FILM","ZING","ZITI","FIND","FINE","FIRM","FAIN","FLEE","FLAY","SLOE","FLOW","PENT","FOOL","FUEL","NAZI","RUFF","NEAP","GAIN","GAME","GIFT","TERN","GOAL","GROW","HALF","SPAY","HALT","HANG","TARE","TARN","HARM","HEAL","HERE","HERO","HULA","HIDE","HILL","HOLD","HOLY","HOME","WIVE","HUGE","HUNT","HURT","JAIL","JOKE","JURY","JUST","KILL","KNOW","LACK","LAKE","LEAK","LEND","LESS","LIFE","LINK","PESO","LIVE","PELF","PITH","LOAD","LOAN","WHOP","LUFF","LUGE","LOAM","LOSE","LUCK","MAIL","MAIN","MEME","TEAL","MIDI","MESA","MANY","VOLE","MIFF","MATE","MEAN","MEET","MINX","MELT","MISS","MORE","MOST","MEAD","MUST","NAVY","NEXT","NICE","NOON","NOVA","NOEL","OBEY","ONCE","OUST","PASS","PATH","PLAN","PLOT","POEM","PORT","POUR","PRAY","PURE","RACE","RAID","RAPE","RARE","READ","REAL","ONYX","RICH","RIDE","RIOT","RISE","RISK","ROCK","ROPE","RUIN","SAVE","SELL","SHOW","SICK","SING","SINK","SOIL","SOON","STAB","STAY","SURE","TANK","TEAM","TEAR","TELL","TERM","THEM","THEY","TOOL","TRAP","TRIP","TUBE","URGE","VETO","VISA","VOTE","WAIT","WANT","WARN","WEAK","WEAR","WHAT","WIFE","WILD","WISH","ZERO","INTO","MADE","SAID","DONE","DRAW","FIVE","FOUR","UPON","FELT","GOER","GONE","HELD","KEPT","TINY","FELL","IMAM","INCH","KING","NAVE","LOST","SENT","THUS","BEAR","GLAD","JACK","LADY","MARY","PAIR","NINE","NIGH","NONE","YORE","ONTO","PICK","ROSE","SOLD","TYPE","VERB","YARD","CELL","CENT","CROP","LAID","MIKE","NOUN","PAID","SHOT","BARN","BOWL","DEER","DESK","DREW","MILE","NEST","SHOP","TONE","WHOM","ASIA","CAVE","CLAY","HALL","LION","MAMA","PARK","POST","ROPY","SUIT","VAST","AUNT","CAGE","CLUB","DICK","GATE","PAPA","POLE","POND","SANG","BARE","BARK","DUCK","MICA","PACK","PINE","PINK","POOL","BEAN","BUSH","JULY","JUNE","LAMP","PILE","PONY","TASK","TENT","ATOM","BEND","DAWN","DULL","FROG","GULF","OHIO","PALE","REAR","ROAR","ROME","TIDE","TORN","CAST","DOLL","FORT","MILL","NUTS","RUSH","SALE","SPIN","TUNE","WOLF","BELT","DISH","EDDY","HERD","MARS","MOOD","PLUS","POET","TAPE","THOU","EYES","DAYS","USED","LORD","SOUL","SAKE","DARE","PITY","FOND","MERE","SPOT","ABET","ABLY","ACHE","ACHY","ACNE","ACRE","AIDE","AIDS","AIRS","AIRY","AJAR","AKIN","ALAS","ALMS","ALTO","AMEN","AMMO","AMOK","ANAL","ANEW","ANTE","ANUS","APEX","ARAB","ARIA","ARID","ARTS","AUTO","AVID","AVOW","AWOL","AWRY","SUMO","SUNG","AXLE","BABE","BADE","BAHT","BAIL","BAIT","BAKE","BALD","SERE","BALE","BALK","BALM","BANE","BANG","BARF","BASH","BASK","BASS","BAWL","BEAD","BEAK","BEAM","BEEF","BEEP","BEER","BEET","BIAS","BIDE","BIKE","BILE","BIND","BLAB","BLAH","BLIP","BLOB","BLOC","BLOT","BLUR","BOAR","BOLD","BOLT","BOND","BONY","BOOB","BOOM","BOON","BOOR","BORE","BOSS","BOUT","BOZO","BRAG","BRAN","BRAT","BRAY","BREW","BRIM","BROW","BUCK","BUFF","BULK","BULL","BUMP","BUNK","BUOY","BURP","BUST","BUTT","BUZZ","BYTE","CAFE","CALF","CANE","CAPE","CARP","CASH","CASK","CEDE","CHAP","CHAR","CHAT","CHEF","CHEW","CHIC","CHIP","CHIT","CHOP","CHOW","CHUG","CHUM","CITE","CLAD","SHIM","SHIV","CLAM","CLAN","CLAP","CLAW","CLEF","CLIP","CLOD","CLOG","CLOT","CLUE","COAX","COCK","CODE","COIL","COIN","COKE","COLA","TUTU","COLT","COMA","CONE","COOP","COPE","CORE","COUP","COVE","COZY","CRAB","CRAM","RUNT","CRAP","CRIB","CROW","CRUD","CRUX","CUBE","CUFF","CULL","CULT","CURB","CURD","CURL","CURT","CUSS","CUTE","CYST","CZAR","DAME","DAMN","DAMP","DANK","DARN","DART","DASH","DATA","DAUB","DAZE","DEAN","DECK","DEED","DEEM","DEFT","DEFY","DEMO","DENT","DIAL","PUPA","DICE","DIKE","DIME","DINE","DIRE","DISK","DOCK","DOLE","DOME","DOOM","DOPE","DORK","DORM","DOSE","DOTE","DOUR","DOVE","DOZE","DRAB","DRAG","DRIP","DRUM","DUAL","DUCT","DUDE","DUEL","DUET","DUKE","DULY","DUMB","DUMP","DUNE","DUNG","DUNK","DUPE","DUSK","DYKE","ECHO","EDGY","EDIT","EMIR","EMIT","ENVY","EPIC","ETCH","EXAM","EXEC","EXIT","EXPO","FADE","FAKE","FAME","FANG","FARE","FART","FATE","SUET","FAWN","FAZE","FEAT","FEND","FERN","FETE","FEUD","FIAT","FILE","FIST","FIZZ","FLAB","SCAT","FLAK","FLAP","FLAW","FLEA","FLEX","FLIP","FLIT","FLOG","FLOP","FLUB","FLUE","FLUX","FOAL","FOAM","FOGY","FOIL","FOLK","FONT","FORD","FORE","FOUL","FOXY","FRAT","FRAY","FRET","FUCK","FUME","FUND","FUNK","FURL","FURY","FUSE","FUSS","FUZZ","GAIT","GALA","GALE","GALL","GANG","GAPE","GARB","GASH","GASP","GAWK","GAZE","GEAR","GEEK","GENE","GENT","GERM","GIBE","GILD","GILL","GIST","GLEE","GLIB","GLOB","GLOW","GLUE","GLUM","GLUT","GNAT","GNAW","GOAD","GOLF","GONG","GOOF","GOON","GORE","GORY","GOUT","GOWN","GRAB","GRAD","GRAM","GRID","GRIM","GRIN","GRIT","GRUB","GUFF","GULL","GULP","GUNK","GURU","GUSH","GUST","GUTS","HACK","HAIL","HALE","HALO","HARE","HARK","HARP","HASH","HAUL","HAWK","HAZE","HAZY","HEAP","HEED","HEEL","HEIR","HELL","HELM","HEMP","HERB","HEWN","HIKE","HILT","HIND","HINT","HIRE","HISS","HIVE","HOAX","HOBO","HOCK","HONE","HONK","RIEL","RICK","HOOD","HOOF","HOOP","HOOT","HOSE","HOST","HOWL","HUFF","HULK","HULL","HUMP","HUNK","RUNE","HURL","HUSH","HUSK","HYMN","HYPE","WILE","IBEX","IBIS","ICKY","ICON","IDLE","IDLY","IDOL","SERF","SETA","IFFY","INFO","IOTA","IRIS","IDEA","ISLE","ITCH","ITEM","JADE","JAMB","JAZZ","JEEP","JEER","JERK","JEST","JIBE","JILT","JINX","JIVE","JOCK","JOLT","JUNK","KEEL","SCUD","KEEN","KILN","KILO","KILT","KINK","KITE","KIWI","KNIT","KNOB","LACE","LACY","LAIR","LAMB","LAME","LANE","LARD","LARK","LASH","LAVA","LAWN","LAZY","LEAN","LEAP","LEEK","LEER","LENS","LENT","LEVY","LEWD","LIAR","LICK","LIEN","LIEU","LILT","LILY","LIMB","LIME","LIMO","LIMP","LINT","LISP","LITE","LOAF","LOBE","LOFT","LOGO","LOLL","LONE","LOOM","LOOP","LOOT","LOON","LOPE","LORE","LOTS","LULL","LUMP","LUNG","LURE","LURK","LUSH","LUST","MACE","MAID","MAIM","MALL","MALT","MANE","ZOIC","MARE","MART","MARL","MASH","MASK","MAST","MATH","MAUL","MAYO","MATT","MAZE","MEEK","MELD","MEMO","MEND","MENU","MEOW","MESH","MESS","METE","MILD","MIME","MINI","MINK","MINT","SWIG","MIRE","MITE","MITT","MOAN","MOAT","MOCK","MODE","MOLD","MOLE","MOLT","MONK","MONO","MOOR","MOOT","MOPE","MOSS","MOTH","MOWN","MUCK","MUFF","MULE","MULL","MUSE","MUSH","MUSK","MUSS","MUTE","MUTT","MYTH","NAPE","NARC","NEAT","NEON","NERD","NEWT","NICK","NODE","NOOK","NORM","NOSY","NUDE","NUKE","NULL","NUMB","OATH","OBOE","ODDS","OBOE","ODOR","OGLE","OGRE","OILY","OINK","OKAY","OKRA","OMEN","OMIT","ONUS","OOZE","OPAL","ORAL","ORGY","OVAL","OXEN","PACE","PACT","PAIL","PALL","PALM","PANE","PANG","PANT","PARE","PATE","PAVE","PAWN","PEAK","PEAL","PEAR","PEAT","PECK","PEEK","PEEL","PEEP","PEER","WEND","PELT","PEON","PERK","PERM","PERT","PEST","PIER","PIKE","PILL","PIMP","PING","PINT","PISS","PLEA","PLOD","PLOP","PLOY","PLUG","PLUM","POKE","POKY","POLL","POLO","POMP","POOP","POPE","PORE","PORK","PORN","POSE","POSH","POSY","POUT","PREP","PREY","PRIM","PROD","PROF","PROM","PROP","PROW","PUCK","PUFF","WEIR","PUKE","PULP","PUMA","PUNK","PUNT","YOGI","PUNY","PURR","PUTT","PYRE","QUAD","QUAY","QUIP","QUIT","QUIZ","RACK","RACY","RAFT","RAGE","RAKE","RAMP","RANK","RANT","RAPT","RASH","RASP","RAVE","RAZE","RAZZ","REAM","REAP","REDO","REED","REEF","REEK","REEL","REIN","RELY","REND","RENT","RIFE","RIFT","RILE","RIND","RINK","RIPE","RITE","ROAM","ROBE","ROLE","ROMP","ROOK","ROSY","ROTE","ROUT","RUBY","RUDE","RUTH","RUMP","RUNG","RUSE","RUST","SACK","SAGA","SAGE","SANE","SASH","SASS","SCAB","SCAM","SCAN","SCAR","SCUM","SEAL","SEAM","SEAR","SECT","SEEK","SEEP","SEWN","SEXY","SHAM","SHED","SHIN","SHIT","SHOD","SHOO","SHUN","SIFT","SIGH","SIKH","SILL","SILO","SILT","SIRE","SITE","SKEW","SKID","SKIM","SKIP","SKIT","SLAB","SLAM","SLAP","SLAT","SLAY","SLED","SLEW","SLIM","SLIT","SLOB","SLOG","SLOP","SLOT","SLUG","SLUM","SLUR","SLUT","SMOG","SMUG","SMUT","SNAG","SNAP","SNIP","SNIT","SNOB","SNOT","SNUB","SNUG","SOAK","SOAR","SODA","SOFA","SOLE","SOLO","SOOT","SORE","SOUR","SOWN","SPAN","SPAR","SPAT","SPEW","SPIT","SPRY","SPUD","SPUR","STAG","STEW","STIR","STOW","STUB","STUD","STUN","SUCK","SUDS","SULK","SUNG","SUNK","SURF","SWAB","SWAN","SWAP","SWAT","SWAY","SYNC","TACK","TACO","TACT","TALE","TAME","TAPS","TARP","TART","TAUT","TAXI","TEAK","TEAT","TEEM","TEEN","TEMP","TEND","TEXT","THAW","THUD","THUG","TICK","TIDY","TIER","TIFF","TILE","TILT","TINT","TIRE","TOAD","TOFU","TOGA","TOGS","TOIL","TOLL","TOMB","TOME","TONS","TOOT","TORE","TORT","TOSS","TOTE","TOUR","TOUT","TREK","TRIM","TRIO","TROT","TUBA","TUCK","TUFT","TUNA","TURD","TURF","TUSH","TUSK","TWIG","TWIN","TWIT","TYKE","TYPO","UGLY","UNDO","USER","VAIN","VARY","VASE","VEAL","VEER","VEIL","VEIN","VENT","VEST","VIAL","VICE","VILE","VINE","VISE","VOID","VOLT","WADE","WAFT","WAGE","WAIF","WAIL","WAKE","WAND","WANE","WARD","WARE","WARP","WART","WARY","WASP","WATT","WAVY","WAXY","WEAN","WEED","WEEP","WELD","WELT","WHAM","WHET","WHIM","WHIR","WHIZ","WICK","WILT","WILY","WIMP","WINK","WINO","WIPE","WIRY","WISP","WITS","WOMB","WONT","WOOF","WORN","WRAP","WREN","WRIT","YANK","YARN","YAWN","YEAH","YELL","YELP","YOGA","YOKE","YOLK","ZANY","ZEAL","ZEST","ZINC","ZONE","ZOOM","ZORI","TOON","BLOG","JEAN","TIED"];
    $scope.allWordsDetails = [{"def":"having a strong healthy body","word":"ABLE"},{"def":"assist or encourage, usually in some wrongdoing","word":"ABET"},{"def":"showily imitative of art or artists","word":"ARTY"},{"def":"long nerve fiber that conducts away from the cell body of the neuron","word":"AXON"},{"def":"the 16th letter of the Hebrew alphabet","word":"AYIN"},{"def":"inspired by a feeling of fearful wonderment or reverence","word":"AWED"},{"def":"the highest point (of something)","word":"ACME"},{"def":"report or maintain","word":"AVER"},{"def":"lie adjacent to another or share a boundary","word":"ABUT"},{"def":"someone who copies the words or behavior of another","word":"APER"},{"def":"street name for lysergic acid diethylamide","word":"ACID"},{"def":"a shade of blue tinged with green","word":"AQUA"},{"def":"a passageway under a curved masonry construction","word":"ARCH"},{"def":"(old-fashioned or informal) in a little while","word":"ANON"},{"def":"a platform raised above the surrounding level to give prominence to the person on it","word":"AMBO"},{"def":"a white crystalline double sulfate of aluminum: the potassium double sulfate of aluminum","word":"ALUM"},{"def":"a large mountain system in south-central Europe; scenic beauty and winter sports make them a popular tourist attraction","word":"ALPS"},{"def":"primitive chlorophyll-containing mainly aquatic eukaryotic organisms lacking true stems and roots and leaves","word":"ALGA"},{"def":"the utterance of a sound similar to clearing the throat; intended to get attention, express hesitancy, fill a pause, hide embarrassment, warn a friend, etc.","word":"AHEM"},{"def":"a rounded thickly curled hairdo","word":"AFRO"},{"def":"successive stages of chills and fever that is a symptom of malaria","word":"AGUE"},{"def":"a colloidal extract of algae; used especially in culture media and as a gelling agent in foods","word":"AGAR"},{"def":"press down tightly","word":"TAMP"},{"def":"the army of the United States of America; the agency that organizes and trains soldiers for land warfare","word":"ARMY"},{"def":"highly excited by eagerness, curiosity, etc.","word":"AGOG"},{"def":"make a soft swishing sound","word":"BIRR"},{"def":"a very young child (birth to 1 year) who has not yet begun to walk or talk","word":"BABY"},{"def":"a support that you can lean against while sitting","word":"BACK"},{"def":"a lavish dance requiring formal attire","word":"BALL"},{"def":"an unofficial association of people or groups","word":"BAND"},{"def":"a terrorist network intensely opposed to the United States that dispenses money and logistical support and training to a wide variety of radical Islamic terrorist groups; has cells in more than 50 countries","word":"BASE"},{"def":"an aggressive remark directed at a person like a missile and intended to have a telling effect","word":"BARB"},{"def":"an ancient Hebrew liquid measure equal to about 10 gallons","word":"BATH"},{"def":"the lowest adult male singing voice","word":"BASS"},{"def":"the shape of a bell","word":"BELL"},{"def":"a woman who engages in sexual intercourse for money","word":"BAWD"},{"def":"informal terms for a (young) woman","word":"BIRD"},{"def":"a painful wound caused by the thrust of an insect's stinger into skin","word":"BITE"},{"def":"make a mess of, destroy or ruin","word":"BLOW"},{"def":"of the color intermediate between green and violet; having a color similar to that of a clear unclouded sky","word":"BLUE"},{"def":"(computer science) a data transmission rate (bits/second) for modems","word":"BAUD"},{"def":"shout loudly and without restraint","word":"BAWL"},{"def":"put a caparison on","word":"BARD"},{"def":"a sailing vessel with two masts; a small mizzen is aft of the rudderpost","word":"YAWL"},{"def":"unfermented or fermenting malt","word":"WORT"},{"def":"a strong post (as on a wharf or quay or ship for attaching mooring lines)","word":"BITT"},{"def":"unwanted e-mail (usually of a commercial nature sent out in bulk)","word":"SPAM"},{"def":"erect bushy hairy annual herb having trifoliate leaves and purple to pink flowers; extensively cultivated for food and forage and soil improvement but especially for its nutritious oil-rich seeds; native to Asia","word":"SOYA"},{"def":"a rocky region in the southern Transvaal in northeastern South Africa; contains rich gold deposits and coal and manganese","word":"RAND"},{"def":"a commercial leavening agent containing yeast cells; used to raise the dough in making bread and for fermenting beer or whiskey","word":"BARM"},{"def":"indicate, as with a sign or an omen","word":"BODE"},{"def":"(pathology) an elevation of the skin filled with serous fluid","word":"BLEB"},{"def":"the rounded seed-bearing capsule of a cotton or flax plant","word":"BOLL"},{"def":"a man who is the lover of a man or woman","word":"BEAU"},{"def":"soft lump or unevenness in a yarn; either an imperfection or created by design","word":"BURL"},{"def":"hit a ball in such a way so as to make it go a short distance","word":"BUNT"},{"def":"soft creamy white cheese; milder than Camembert","word":"BRIE"},{"def":"resembling a box in rectangularity","word":"BOXY"},{"def":"the Jewish rite of circumcision performed on a male child on the eighth day of his life","word":"BRIS"},{"def":"a genus of Strigidae","word":"BUBO"},{"def":"a small nail","word":"BRAD"},{"def":"hit hard","word":"BONK"},{"def":"a dish (often boat-shaped) for serving gravy or sauce","word":"BOAT"},{"def":"a flock of birds (especially when gathered close together on the ground)","word":"BEVY"},{"def":"cry plaintively","word":"BLAT"},{"def":"a circular domed dwelling that is portable and self-supporting; originally used by nomadic Mongol and Turkic people of central Asia but now used as inexpensive alternative or temporary housing","word":"YURT"},{"def":"escape, either physically or mentally","word":"BILK"},{"def":"trademark for a powerful operating system","word":"UNIX"},{"def":"beets","word":"BETA"},{"def":"a narrow edge of land (usually unpaved) along the side of a road","word":"BERM"},{"def":"the property of holding together and retaining its shape","word":"BODY"},{"def":"a stupid person who is easy to take advantage of","word":"BERK"},{"def":"remove the bones from","word":"BONE"},{"def":"physical objects consisting of a number of pages bound together","word":"BOOK"},{"def":"the act of delivering a blow with the foot","word":"BOOT"},{"def":"electric lamp consisting of a transparent or translucent glass housing containing a wire filament (usually tungsten) that emits light when heated by electricity","word":"BULB"},{"def":"pain that feels hot as if it were on fire","word":"BURN"},{"def":"play music in a public place and solicit money for it","word":"BUSK"},{"def":"small bit used in dentistry or surgery","word":"BURR"},{"def":"of a bluish shade of green","word":"CYAN"},{"def":"a steep rugged rock or cliff","word":"CRAG"},{"def":"European freshwater game fish with a thick spindle-shaped body","word":"CHUB"},{"def":"a member of a European people who once occupied Britain and Spain and Gaul prior to Roman times","word":"CELT"},{"def":"a family of Afroasiatic tonal languages (mostly two tones) spoken in the regions west and south of Lake Chad in north central Africa","word":"CHAD"},{"def":"a white crystalline oxide used in the production of calcium hydroxide","word":"CALX"},{"def":"the basic unit of money in Ghana","word":"CEDI"},{"def":"a characteristic language of a particular group (as among thieves)","word":"CANT"},{"def":"small flat mass of chopped food","word":"CAKE"},{"def":"a list of dishes available at a restaurant","word":"CARD"},{"def":"prefer or wish to do something","word":"CARE"},{"def":"draw slowly or heavily","word":"CART"},{"def":"separate or cut with a tool, such as a sharp instrument","word":"RIVE"},{"def":"a horse having a brownish coat thickly sprinkled with white or gray","word":"ROAN"},{"def":"mark with a scar","word":"POCK"},{"def":"the protruding part of the lower jaw","word":"CHIN"},{"def":"burn to charcoal","word":"COAL"},{"def":"put a coat on; cover the surface of; furnish with a surface","word":"COAT"},{"def":"the absence of heat","word":"COLD"},{"def":"search thoroughly","word":"COMB"},{"def":"a long depression in the surface of the land that usually contains a river","word":"VALE"},{"def":"mechanical device attached to an elevated structure; rotates freely to show the direction of the wind","word":"VANE"},{"def":"provide (a shoe) with a new vamp","word":"VAMP"},{"def":"come from; be connected by a relationship of blood, for example","word":"COME"},{"def":"tamper, with the purpose of deception","word":"COOK"},{"def":"a thin triangular flap of a heart valve","word":"CUSP"},{"def":"a reproduction of a written record (e.g. of a legal or school record)","word":"COPY"},{"def":"small salmon of northern Pacific coasts and the Great Lakes","word":"COHO"},{"def":"a large hairy humanoid creature said to live in the Himalayas","word":"YETI"},{"def":"protective covering consisting of a metal part that covers the engine","word":"COWL"},{"def":"a padded cloth covering to keep a teapot warm","word":"COSY"},{"def":"the arrangement of the hair (especially a woman's hair)","word":"COIF"},{"def":"solid swollen underground bulb-shaped stem or stem base and serving as a reproductive structure","word":"CORM"},{"def":"slate-black slow-flying birds somewhat resembling ducks","word":"COOT"},{"def":"pass from physical life and lose all bodily attributes and functions necessary to sustain life","word":"CONK"},{"def":"a hardy cabbage with coarse curly leaves that do not form a head","word":"COLE"},{"def":"a cut pile fabric with vertical ribs; usually made of cotton","word":"CORD"},{"def":"fill to satisfaction","word":"SATE"},{"def":"the closing section of a musical composition","word":"CODA"},{"def":"the plug in the mouth of a bottle (especially a wine bottle)","word":"CORK"},{"def":"panel forming the lower part of an interior wall when it is finished differently from the rest of the wall","word":"DADO"},{"def":"the time after sunset and before sunrise while it is dark outside","word":"DARK"},{"def":"informal or slang terms for mentally irregular","word":"DAFT"},{"def":"large African antelope with long straight nearly upright horns","word":"ORYX"},{"def":"devoid of physical sensation; numb","word":"DEAD"},{"def":"a distinguished female operatic singer; a female operatic star","word":"DIVA"},{"def":"a person who acts and gets things done","word":"DOER"},{"def":"a sweet innocent mild-mannered person (especially a child)","word":"DEAR"},{"def":"a unit of force equal to the force that imparts an acceleration of 1 cm/sec/sec to a mass of 1 gram","word":"DYNE"},{"def":"street names for gamma hydroxybutyrate","word":"GOOP"},{"def":"make a gurgling sound as of liquid issuing from a bottle","word":"GLUG"},{"def":"a narrow secluded valley (in the mountains)","word":"GLEN"},{"def":"a round shape formed by a series of concentric circles (as formed by leaves or flower petals)","word":"GYRE"},{"def":"the part of the eye that contains the iris and ciliary body and choroid","word":"UVEA"},{"def":"cut off the testicles (of male animals such as horses)","word":"GELD"},{"def":"someone whose job is to dye cloth","word":"DYER"},{"def":"a person who is not very bright","word":"DOLT"},{"def":"remove","word":"DOFF"},{"def":"formerly the chief magistrate in the republics of Venice and Genoa","word":"DOGE"},{"def":"a dissolute man in fashionable society","word":"ROUE"},{"def":"move about aimlessly or without any destination, often in search of food or employment","word":"ROVE"},{"def":"a lateen-rigged sailing vessel used by Arabs","word":"DHOW"},{"def":"aromatic threadlike foliage of the dill plant used as seasoning","word":"DILL"},{"def":"look through a book or other written material","word":"RIFF"},{"def":"a small stream","word":"RILL"},{"def":"an excavation for ore or precious stones or for archaeology","word":"DIGS"},{"def":"sound recording consisting of a disk with a continuous groove; used to reproduce music by rotating while a phonograph needle tracks in the groove","word":"DISC"},{"def":"a distinguished female operatic singer; a female operatic star","word":"DIVA"},{"def":"a claim of rights","word":"DIBS"},{"def":"wet with dew","word":"DEWY"},{"def":"a small wooded hollow","word":"DELL"},{"def":"an obligation to pay or do something","word":"DEBT"},{"def":"of an obscure nature","word":"DEEP"},{"def":"the entrance (the space in a wall) through which you enter or leave a room or building; the space that a door can close","word":"DOOR"},{"def":"English physician who first described Down's syndrome (1828-1896)","word":"DOWN"},{"def":"a stiff flour pudding steamed or boiled usually and containing e.g. currants and raisins and citron","word":"DUFF"},{"def":"a shape that is spherical and small","word":"DROP"},{"def":"the chief solid component of mammalian urine; synthesized from ammonia and carbon dioxide and used as fertilizer and in animal feed and in plastics","word":"UREA"},{"def":"half asleep","word":"DOZY"},{"def":"a unit of apothecary weight equal to an eighth of an ounce or to 60 grains","word":"DRAM"},{"def":"the remains of something that has been destroyed or broken up","word":"DUST"},{"def":"domesticated ox having a humped back and long horns and a large dewlap; used chiefly as a draft animal in India and east Asia","word":"ZEBU"},{"def":"sequence of a gene's DNA that transcribes into protein structures","word":"EXON"},{"def":"a very light brown","word":"ECRU"},{"def":"the countries of Asia","word":"EAST"},{"def":"the attribute of urgency in tone of voice","word":"EDGE"},{"def":"to a greater degree or extent; used with comparisons","word":"EVEN"},{"def":"at all times; all the time and on every occasion","word":"EVER"},{"def":"an open vessel with a handle and a spout for pouring","word":"EWER"},{"def":"the basic monetary unit of most members of the European Union (introduced in 1999); in 2002 twelve European nations (Germany, France, Belgium, Luxembourg, the Netherlands, Italy, Spain, Portugal, Ireland, Greece, Austria, Finland) adopted the euro as their basic unit of money and abandoned their traditional currencies","word":"EURO"},{"def":"a contorted facial expression","word":"FACE"},{"def":"a concept whose truth can be proved","word":"FACT"},{"def":"someone acting as an informer or decoy for the police","word":"FINK"},{"def":"a flat mass of ice (smaller than an ice field) floating at sea","word":"FLOE"},{"def":"ancient Italian deity in human shape, with horns, pointed ears and a goat's tail; equivalent to Greek satyr","word":"FAUN"},{"def":"not genuine or real; being an imitation of the genuine article","word":"FAUX"},{"def":"move downward and lower, but not necessarily all the way","word":"FALL"},{"def":"cultivate by growing, often involving improvements by means of agricultural techniques","word":"FARM"},{"def":"regard with feelings of respect and reverence; consider hallowed or exalted or be in awe of","word":"FEAR"},{"def":"call forth (emotions, feelings, and responses)","word":"FIRE"},{"def":"(astrology) a person who is born while the sun is in Pisces","word":"FISH"},{"def":"a rectangular piece of fabric used as a signalling device","word":"FLAG"},{"def":"a deflated pneumatic tire","word":"FLAT"},{"def":"a folded part (as in skin or muscle)","word":"FOLD"},{"def":"any solid substance (as opposed to liquid) that is used as a source of nourishment","word":"FOOD"},{"def":"lowest support of a structure","word":"FOOT"},{"def":"the region of the angle formed by the junction of two branches","word":"FORK"},{"def":"the visual appearance of something or someone","word":"FORM"},{"def":"a domesticated gallinaceous bird thought to be descended from the red jungle fowl","word":"FOWL"},{"def":"not taken up by scheduled activities","word":"FREE"},{"def":"Out of the neighborhood of; lessening or losing proximity to; leaving behind; by reason of; out of; by aid of; -- used whenever departure, setting out, commencement of action, being, state, occurrence, etc., or procedure, emanation, absence, separation, etc., are to be expressed. It is construed with, and indicates, the point of space or time at which the action, state, etc., are regarded as setting out or beginning; also, less frequently, the source, the cause, the occasion, out of which anything proceeds; the anitithesis and correlative of to; ","word":"FROM"},{"def":"increase in phase","word":"FULL"},{"def":"open pastry filled with fruit or custard","word":"FLAN"},{"def":"fiber of the flax plant that is made into thread and woven into linen fabric","word":"FLAX"},{"def":"a girl or young woman with whom a man is romantically involved","word":"GIRL"},{"def":"any thick, viscous matter","word":"GUCK"},{"def":"be the cause or source of","word":"GIVE"},{"def":"bind with something round or circular","word":"GIRD"},{"def":"representation of the cross on which Jesus died","word":"ROOD"},{"def":"an iron hook with a handle; used for landing large fish","word":"GAFF"},{"def":"a crude uncouth ill-bred person lacking culture or refinement","word":"GOTH"},{"def":"intensely enthusiastic about or preoccupied with","word":"GAGA"},{"def":"a measuring instrument for measuring and indicating a quantity such as the thickness of wire or the amount of rain etc.","word":"GAGE"},{"def":"a Bantu language of considerable literary importance in southeastern Africa","word":"ZULU"},{"def":"a small vehicle with four wheels in which a baby or child is pushed around","word":"PRAM"},{"def":"a victim of ridicule or pranks","word":"GOAT"},{"def":"a coating of gold or of something that looks like gold","word":"GILT"},{"def":"disability of walking due to crippling of the legs or feet","word":"GIMP"},{"def":"a soft yellow malleable ductile (trivalent and univalent) metallic element; occurs mainly as nuggets in rocks and alluvial deposits; does not react with most chemicals but is attacked by chlorine and aqua regia","word":"GOLD"},{"def":"that which is pleasing or valuable or useful","word":"GOOD"},{"def":"make grey","word":"GREY"},{"def":"sustentacular tissue that surrounds and supports neurons in the central nervous system; glial and neural cells together compose the tissue of the central nervous system","word":"GLIA"},{"def":"to grip or seize, as in a wrestling match","word":"GRIP"},{"def":"ice crystals forming a white deposit (especially on objects outside)","word":"HOAR"},{"def":"a piston syringe that is fitted with a hypodermic needle for giving injections","word":"HYPO"},{"def":"a complex red organic pigment containing iron and other atoms to which oxygen binds","word":"HAEM"},{"def":"a very small distance or space","word":"HAIR"},{"def":"a fastener for a door or lid; a hinged metal plate is fitted over a staple and is locked with a pin or padlock","word":"HASP"},{"def":"a person who is not very intelligent or interested in culture","word":"HICK"},{"def":"the (prehensile) extremity of the superior limb","word":"HAND"},{"def":"(of light) transmitted directly from a pointed light source","word":"HARD"},{"def":"a Greek liquor flavored with anise","word":"OUZO"},{"def":"the emotion of intense dislike; a feeling of dislike so strong that it demands action","word":"HATE"},{"def":"serve oneself to, or consume regularly","word":"HAVE"},{"def":"(computer science) a tiny electromagnetic coil and metal pole used to write and read magnetic patterns on a disk","word":"HEAD"},{"def":"a color varying from dark purplish brown to dark red","word":"PUCE"},{"def":"period extending from Dec. 24 to Jan. 6","word":"YULE"},{"def":"the imperial dynasty of China from 1279 to 1368","word":"YUAN"},{"def":"a male monarch or emperor (especially of Russia prior to 1917)","word":"TSAR"},{"def":"get to know or become aware of, usually accidentally","word":"HEAR"},{"def":"the basic unit of money in Bangladesh; equal to 100 paisa","word":"TAKA"},{"def":"gain heat or get hot","word":"HEAT"},{"def":"a person who contributes to the fulfillment of a need or furtherance of an effort or purpose","word":"HELP"},{"def":"a high place","word":"HIGH"},{"def":"informal terms for a difficult situation","word":"HOLE"},{"def":"anything that serves as an enticement","word":"HOOK"},{"def":"intend with some possibility of fulfilment","word":"HOPE"},{"def":"a brass musical instrument consisting of a conical tube that is coiled into a spiral and played by means of valves","word":"HORN"},{"def":"clock time","word":"HOUR"},{"def":"(music) melodic subject of a musical composition","word":"IDEA"},{"def":"home appliance consisting of a flat metal base that is heated and used to smooth cloth","word":"IRON"},{"def":"be or become joined or united or linked","word":"JOIN"},{"def":"bypass","word":"JUMP"},{"def":"someone regarded as eccentric or crazy and standing out from a group","word":"KOOK"},{"def":"either of two spiral-horned antelopes of the African bush","word":"KUDU"},{"def":"a hardy cabbage with coarse curly leaves that do not form a head","word":"KALE"},{"def":"domesticated bovine animals as a group regardless of sex or age","word":"KINE"},{"def":"the basic unit of money in Papua New Guinea","word":"KINA"},{"def":"United States composer of musical comedies (1885-1945)","word":"KERN"},{"def":"the bright positive masculine principle in Chinese dualistic cosmology","word":"YANG"},{"def":"the main tower within the walls of a medieval castle or fortress","word":"KEEP"},{"def":"a fine grained mineral having a soft soapy feel and consisting of hydrated magnesium silicate; used in a variety of products including talcum powder","word":"TALC"},{"def":"goods or money obtained illegally","word":"SWAG"},{"def":"large brown seaweeds having fluted leathery fronds","word":"KELP"},{"def":"the act of delivering a blow with the foot","word":"KICK"},{"def":"agreeable, conducive to comfort","word":"KIND"},{"def":"the act of caressing with the lips (or an instance thereof)","word":"KISS"},{"def":"joint between the femur and tibia in a quadruped; corresponds to the human knee","word":"KNEE"},{"def":"soft lump or unevenness in a yarn; either an imperfection or created by design","word":"KNOT"},{"def":"remove with or as if with a ladle","word":"LADE"},{"def":"material in the top layer of the surface of the earth in which plants can grow (especially with reference to its quality or use)","word":"LAND"},{"def":"praise, glorify, or honor","word":"LAUD"},{"def":"persist for a specified period of time","word":"LAST"},{"def":"in the recent past","word":"LATE"},{"def":"be in charge of","word":"LEAD"},{"def":"look through a book or other written material","word":"LEAF"},{"def":"a deposit of valuable ore occurring within definite boundaries separating it from surrounding rocks","word":"LODE"},{"def":"the basic unit of money in Lesotho","word":"LOTI"},{"def":"a substance for packing a joint or coating a porous surface to make it impervious to gas or liquid","word":"LUTE"},{"def":"short-tailed wildcats with usually tufted ears; valued for their fur","word":"LYNX"},{"def":"a harp used by ancient Greeks for accompaniment","word":"LYRE"},{"def":"an awkward stupid person","word":"LOUT"},{"def":"either side of the backbone between the hipbone and the ribs in humans as well as quadrupeds","word":"LOIN"},{"def":"something for something; that which a party receives (or is promised) in return for something he does or gives or promises","word":"QUID"},{"def":"be idle; exist in a changeless situation","word":"LAZE"},{"def":"the basic unit of money in Turkey","word":"LIRA"},{"def":"a long narrow inlet of the sea in Scotland (especially when it is nearly landlocked)","word":"LOCH"},{"def":"trace the shape of","word":"LIMN"},{"def":"gulls; terns; jaegers; skimmers","word":"LARI"},{"def":"wash one's face and hands","word":"LAVE"},{"def":"long and lean","word":"LANK"},{"def":"the hand that is on the left side of the body","word":"LEFT"},{"def":"lifting device consisting of a platform or cage that is raised and lowered mechanically in a vertical shaft in order to move people from one floor to another in a building","word":"LIFT"},{"def":"prefer or wish to do something","word":"LIKE"},{"def":"a course of reasoning aimed at demonstrating a truth or falsehood; the methodical process of logical reasoning","word":"LINE"},{"def":"give or make a list of; name individually; give the names of","word":"LIST"},{"def":"a restraint incorporated into the ignition switch to prevent the use of a vehicle by persons who do not have the key","word":"LOCK"},{"def":"good at remembering","word":"LONG"},{"def":"take charge of or deal with","word":"LOOK"},{"def":"touch with the lips or press the lips (against someone's mouth or other body part) as an expression of love, greeting, etc.","word":"SNOG"},{"def":"the amount by which the cost of a business exceeds its revenue","word":"LOSS"},{"def":"with relatively high volume","word":"LOUD"},{"def":"an elaborate Hawaiian feast or party (especially one accompanied by traditional foods and entertainment)","word":"LUAU"},{"def":"apply a lubricant to","word":"LUBE"},{"def":"sexual activities (often including sexual intercourse) between two people","word":"LOVE"},{"def":"an elementary particle with a negative charge and a half-life of 2 microsecond; decays to electron and neutrino and antineutrino","word":"MUON"},{"def":"put in order or neaten","word":"MAKE"},{"def":"characteristic of a man","word":"MALE"},{"def":"celebrate by some ceremony or observation","word":"MARK"},{"def":"the common people generally","word":"MASS"},{"def":"the food served and eaten at one time","word":"MEAL"},{"def":"the choicest or most essential or most vital part of some idea or experience","word":"MEAT"},{"def":"a river that rises in the Rockies in northwestern Montana and flows eastward to become a tributary of the Missouri River","word":"MILK"},{"def":"an ancient city in Asia Minor that was the site of the Trojan War","word":"TROY"},{"def":"pay close attention to; give heed to","word":"MIND"},{"def":"excavation in the earth from which ores and minerals are extracted","word":"MINE"},{"def":"the 6th letter of the Greek alphabet","word":"ZETA"},{"def":"become covered with mist","word":"MIST"},{"def":"Austrian physicist and philosopher who introduced the Mach number and who founded logical positivism (1838-1916)","word":"MACH"},{"def":"hare-like rodent of the pampas of Argentina","word":"MARA"},{"def":"a native or inhabitant of Scotland","word":"SCOT"},{"def":"United States religious leader (born in Korea) who founded the Unification Church in 1954; was found guilty of conspiracy to evade taxes (born in 1920)","word":"MOON"},{"def":"give an incentive for action","word":"MOVE"},{"def":"frequently or in great quantities","word":"MUCH"},{"def":"hit hard","word":"NAIL"},{"def":"assign a specified (usually proper) proper name to","word":"NAME"},{"def":"with or in a close or intimate relationship","word":"NEAR"},{"def":"kiss, embrace, or fondle with sexual passion","word":"NECK"},{"def":"have need of","word":"NEED"},{"def":"information about recent and important events","word":"NEWS"},{"def":"catch the scent of; get wind of","word":"NOSE"},{"def":"a piece of paper money (especially one issued by a central bank)","word":"NOTE"},{"def":"without any others being included or involved","word":"ONLY"},{"def":"(of textures) full of small openings or gaps","word":"OPEN"},{"def":"kitchen appliance used for baking or roasting","word":"OVEN"},{"def":"having come or been brought to a conclusion","word":"OVER"},{"def":"United States diplomat and writer about the Old South (1853-1922)","word":"PAGE"},{"def":"cause emotional anguish or make miserable","word":"PAIN"},{"def":"the effort contributed by a person in bringing about a result","word":"PART"},{"def":"a verb tense that expresses actions or states in the past","word":"PAST"},{"def":"a hollow cylindrical shape","word":"PIPE"},{"def":"contend against an opponent in a sport, game, or battle","word":"PLAY"},{"def":"of insufficient quantity to meet a need","word":"POOR"},{"def":"strip of feathers","word":"PULL"},{"def":"the hollow muscular organ located behind the sternum and between the lungs; its rhythmic contractions move the blood through the body","word":"PUMP"},{"def":"press, drive, or impel (someone) to action or completion of an action","word":"PUSH"},{"def":"a barrier consisting of a horizontal bar and supports","word":"RAIL"},{"def":"prong on a fork or pitchfork or antler","word":"TINE"},{"def":"a light clear metallic sound as of a small bell","word":"TING"},{"def":"a distinctive emotional aura experienced instinctively","word":"VIBE"},{"def":"anything happening rapidly or in quick successive","word":"RAIN"},{"def":"the basic unit of money in Western Samoa","word":"TALA"},{"def":"assign a rank or rating to","word":"RATE"},{"def":"sit, as on a branch","word":"REST"},{"def":"English lyricist who frequently worked with Andrew Lloyd Webber (born in 1944)","word":"RICE"},{"def":"the sound of a bell ringing","word":"RING"},{"def":"an open way (generally public) for travel or transportation","word":"ROAD"},{"def":"a list of names","word":"ROLL"},{"def":"an upper limit on what is allowed","word":"ROOF"},{"def":"space for movement","word":"ROOM"},{"def":"sell or offer for sale from place to place","word":"VEND"},{"def":"a simple form inferred as the common basis from which related words in several languages can be derived by linguistic processes","word":"ROOT"},{"def":"(linguistics) a rule describing (or prescribing) a linguistic practice","word":"RULE"},{"def":"contraceptive device consisting of a sheath of thin rubber or latex that is worn over the penis during intercourse","word":"SAFE"},{"def":"move with sweeping, effortless, gliding motions","word":"SAIL"},{"def":"the taste experience when common salt is taken into the mouth","word":"SALT"},{"def":"a member of an indigenous nomadic people living in northern Scandinavia and herding reindeer","word":"SAME"},{"def":"French writer known for works concerning women's rights and independence (1804-1876)","word":"SAND"},{"def":"show to a seat; assign a seat for","word":"SEAT"},{"def":"the thick white fluid containing spermatozoa that is ejaculated by the male genital tract","word":"SEED"},{"def":"someone new to a field or activity","word":"TYRO"},{"def":"a male monarch or emperor (especially of Russia prior to 1917)","word":"TZAR"},{"def":"give a certain impression or have a certain outward aspect","word":"SEEM"},{"def":"your consciousness of your own identity","word":"SELF"},{"def":"transfer","word":"SEND"},{"def":"go on board","word":"SHIP"},{"def":"a restraint provided when the brake linings are moved hydraulically against the brake drum to retard the wheel's rotation","word":"SHOE"},{"def":"predatory black-and-white toothed whale with large dorsal fin; common in cold seas","word":"ORCA"},{"def":"ice crystals forming a white deposit (especially on objects outside)","word":"RIME"},{"def":"move so that an opening or passage is obstructed; make shut","word":"SHUT"},{"def":"an opinion that is held in opposition to another in an argument or dispute","word":"SIDE"},{"def":"structure displaying a board on which advertisements can be posted","word":"SIGN"},{"def":"a fabric made from the fine threads produced by certain insect larvae","word":"SILK"},{"def":"the actual state of affairs","word":"SIZE"},{"def":"a member of any of several British or American groups consisting predominantly of young people who shave their heads; some engage in white supremacist and anti-immigrant activities and this leads to the perception that all skinheads are racist and violent","word":"SKIN"},{"def":"move obliquely or sideways, usually in an uncontrolled manner","word":"SLIP"},{"def":"cause to proceed more slowly","word":"SLOW"},{"def":"English writer of novels about moral dilemmas in academe (1905-1980)","word":"SNOW"},{"def":"street names for gamma hydroxybutyrate","word":"SOAP"},{"def":"hit hard","word":"SOCK"},{"def":"not brilliant or glaring","word":"SOFT"},{"def":"(of quantities) imprecise but fairly close to correct","word":"SOME"},{"def":"the inner and longer of the two bones of the human forearm","word":"ULNA"},{"def":"the act of singing","word":"SONG"},{"def":"an operation that segregates items into groups according to a specified criterion","word":"SORT"},{"def":"an unfortunate situation","word":"SOUP"},{"def":"mark with an asterisk","word":"STAR"},{"def":"cylinder forming a long narrow part of something","word":"STEM"},{"def":"treat badly","word":"STEP"},{"def":"put an end to a state or an activity","word":"STOP"},{"def":"of so extreme a degree or extent","word":"SUCH"},{"def":"the act of swimming","word":"SWIM"},{"def":"a spy employed to follow someone and report their movements","word":"TAIL"},{"def":"the income or profit arising from such transactions as the sale of land or other property","word":"TAKE"},{"def":"exchange thoughts; talk with","word":"TALK"},{"def":"too improbable to admit of belief","word":"TALL"},{"def":"trying something to find out about it","word":"TEST"},{"def":"A particle expressing comparison, used after certain adjectives and adverbs which express comparison or diversity, as more, better, other, otherwise, and the like. It is usually followed by the object compared in the nominative case. Sometimes, however, the object compared is placed in the objective case, and than is then considered by some grammarians as a preposition. Sometimes the object is expressed in a sentence, usually introduced by that.","word":"THAN"},{"def":"As a demonstrative pronoun, that usually points out, or refers to, a person or thing previously mentioned, or supposed to be understood. That, as a demonstrative, may precede the noun to which it refers.","word":"THAT"},{"def":"subsequently or soon afterward (often used as sentence connectors)","word":"THEN"},{"def":"lacking excess flesh","word":"THIN"},{"def":"As a demonstrative pronoun, this denotes something that is present or near in place or time, or something just mentioned, or that is just about to be mentioned.","word":"THIS"},{"def":"a treasury for government funds","word":"TILL"},{"def":"a reading of a point in time as given by a clock","word":"TIME"},{"def":"an administrative division of a county","word":"TOWN"},{"def":"an open receptacle for holding or displaying or serving articles or food","word":"TRAY"},{"def":"stretch (a shoe) on a shoetree","word":"TREE"},{"def":"as acknowledged","word":"TRUE"},{"def":"to break and turn over earth especially with a plow","word":"TURN"},{"def":"an organization regarded as part of a larger social group","word":"UNIT"},{"def":"being the exact same one; not any other:","word":"VERY"},{"def":"the act of looking or seeing or observing","word":"VIEW"},{"def":"the act of traveling by foot","word":"WALK"},{"def":"an embankment built around a space for defensive purposes","word":"WALL"},{"def":"easily aroused or excited","word":"WARM"},{"def":"the basic unit of money in Oman","word":"RIAL"},{"def":"the erosive process of washing away soil or gravel by water (as from a roadway)","word":"WASH"},{"def":"signal with the hands or nod","word":"WAVE"},{"def":"utter shrieks, as of cats","word":"YOWL"},{"def":"hours or days of work in a calendar week","word":"WEEK"},{"def":"in a manner affording benefit or advantage","word":"WELL"},{"def":"United States film actress (1892-1980)","word":"WEST"},{"def":"make a raucous noise","word":"YAWP"},{"def":"beat severely with a whip or rod","word":"WHIP"},{"def":"not on target","word":"WIDE"},{"def":"a legal document declaring a person's wishes regarding the disposal of their property when they die","word":"WILL"},{"def":"raise or haul up with or as if with mechanical help","word":"WIND"},{"def":"a red as dark as red wine","word":"WINE"},{"def":"travel through the air; be airborne","word":"WING"},{"def":"a four-wheeled wagon that runs on tracks in a mine","word":"TRAM"},{"def":"a message transmitted by telegraph","word":"WIRE"},{"def":"United States Jewish leader (born in Hungary) (1874-1949)","word":"WISE"},{"def":"denotes or expresses some situation or relation of nearness, proximity, association, connection, or the like.","word":"WITH"},{"def":"United States painter noted for works based on life in the Midwest (1892-1942)","word":"WOOD"},{"def":"a fabric made from the hair of sheep","word":"WOOL"},{"def":"the divine word of God; the second person in the Trinity (incarnate in Jesus)","word":"WORD"},{"def":"make uniform","word":"WORK"},{"def":"to move in a twisting or contorted motion, (especially when struggling)","word":"WORM"},{"def":"a body of students who graduate together","word":"YEAR"},{"def":"make grey","word":"GRAY"},{"def":"to break and turn over earth especially with a plow","word":"PLOW"},{"def":"an associate who provides cooperation or assistance","word":"ALLY"},{"def":"in addition","word":"ALSO"},{"def":"a part of an animal that has a special function or is supplied by a given artery or nerve","word":"AREA"},{"def":"the official symbols of a family, state, etc.","word":"ARMS"},{"def":"make turbid by stirring up the sediments of","word":"ROIL"},{"def":"out of the way (especially away from one's thoughts)","word":"AWAY"},{"def":"a financial institution that accepts deposits and channels the money into lending activities","word":"BANK"},{"def":"a regular route for a sentry or policeman","word":"BEAT"},{"def":"Canadian physiologist (born in the United States) who assisted F. G. Banting in research leading to the discovery of insulin (1899-1978)","word":"BEST"},{"def":"a statute in draft before it becomes law","word":"BILL"},{"def":"a painful sore with a hard core filled with pus","word":"BOIL"},{"def":"throw bombs at or attack with bombs","word":"BOMB"},{"def":"being talented through inherited qualities","word":"BORN"},{"def":"(used with count nouns) two considered together; the two","word":"BOTH"},{"def":"place in a grave or tomb","word":"BURY"},{"def":"(of facilities such as telephones or lavatories) unavailable for use by anyone else or indicating unavailability; (`engaged' is a British term for a busy telephone line)","word":"BUSY"},{"def":"make high-pitched, whiney noises","word":"WAUL"},{"def":"assign a specified (usually proper) proper name to","word":"CALL"},{"def":"steadiness of mind under stress","word":"CALM"},{"def":"an exclusive circle of people with a common purpose","word":"CAMP"},{"def":"a specific size and style of type within a type family","word":"CASE"},{"def":"people living in a large densely populated municipality","word":"CITY"},{"def":"tropical Asian starlings","word":"MYNA"},{"def":"great coolness and composure under strain","word":"COOL"},{"def":"a hard thickening of the skin (especially on the top or sides of the toes) caused by the pressure of ill-fitting shoes","word":"CORN"},{"def":"be priced at","word":"COST"},{"def":"an informal body of friends","word":"CREW"},{"def":"a medicine or therapy that cures disease or relieve pain","word":"CURE"},{"def":"a participant in a date","word":"DATE"},{"def":"the serum or watery part of milk that is separated from the curd in making cheese","word":"WHEY"},{"def":"(usually followed by `to') unwilling or refusing to pay heed","word":"DEAF"},{"def":"an agreement between parties (usually arrived at after discussion) fixing obligations of each","word":"DEAL"},{"def":"a blue dyestuff obtained from the woad plant","word":"WOAD"},{"def":"deny formally (an allegation of fact by the opposing party) in a legal suit","word":"DENY"},{"def":"the act of restricting your food intake (or your intake of particular foods)","word":"DIET"},{"def":"a local area network that uses high frequency radio signals to transmit and receive data over distances of a few hundred feet; uses ethernet protocol","word":"WIFI"},{"def":"obscene terms for feces","word":"DIRT"},{"def":"the fourth of the seven canonical hours; about noon","word":"SEXT"},{"def":"a steep nose-down descent by an aircraft","word":"DIVE"},{"def":"title for the former hereditary monarch of Iran","word":"SHAH"},{"def":"use recreational drugs","word":"DRUG"},{"def":"the social force that binds you to the courses of action demanded by that force","word":"DUTY"},{"def":"to or from every one of two or more (considered individually)","word":"EACH"},{"def":"an authoritative person who divines the future","word":"SEER"},{"def":"earn on some commercial or business transaction; earn as salary or wages","word":"EARN"},{"def":"make easier","word":"EASE"},{"def":"not hurried or forced","word":"EASY"},{"def":"morally objectionable behavior","word":"EVIL"},{"def":"disappoint, prove undependable to; abandon, forsake","word":"FAIL"},{"def":"(of a manuscript) having few alterations or corrections","word":"FAIR"},{"def":"unwavering in devotion to friend or vow or cause","word":"FAST"},{"def":"food for domestic livestock","word":"FEED"},{"def":"hard volcanic rock composed of compacted volcanic ash","word":"TUFF"},{"def":"the general atmosphere of a place or situation and the effect that it has on people","word":"FEEL"},{"def":"make full, also in a metaphorical sense","word":"FILL"},{"def":"make a film or photograph of something","word":"FILM"},{"def":"the activeness of an energetic personality","word":"ZING"},{"def":"medium-sized tubular pasta in short pieces","word":"ZITI"},{"def":"the act of discovering something","word":"FIND"},{"def":"money extracted as a penalty","word":"FINE"},{"def":"not liable to fluctuate or especially to fall","word":"FIRM"},{"def":"in a willing manner","word":"FAIN"},{"def":"run away quickly","word":"FLEE"},{"def":"strip the skin off","word":"FLAY"},{"def":"wild plum of northeastern United States having dark purple fruits with yellow flesh","word":"SLOE"},{"def":"something that resembles a flowing stream in moving continuously","word":"FLOW"},{"def":"closely confined","word":"PENT"},{"def":"a person who lacks good judgment","word":"FOOL"},{"def":"provide with fuel","word":"FUEL"},{"def":"a German member of Adolf Hitler's political party","word":"NAZI"},{"def":"(card games) the act of taking a trick with a trump when unable to follow suit","word":"RUFF"},{"def":"a less than average tide occurring at the first and third quarters of the moon","word":"NEAP"},{"def":"the amount of increase in signal power or voltage or current expressed as the ratio of output to input","word":"GAIN"},{"def":"your occupation or line of work","word":"GAME"},{"def":"natural abilities or qualities","word":"GIFT"},{"def":"small slender gull having narrow wings and a forked tail","word":"TERN"},{"def":"the state of affairs that a plan is intended to achieve and that (when achieved) terminates behavior intended to achieve it","word":"GOAL"},{"def":"pass into a condition gradually, take on a specific property or attribute; become","word":"GROW"},{"def":"one of two equal parts of a divisible whole","word":"HALF"},{"def":"remove the ovaries of","word":"SPAY"},{"def":"an interruption or temporary suspension of progress or movement","word":"HALT"},{"def":"fall or flow in a certain way","word":"HANG"},{"def":"weedy annual grass often occurs in grainfields and other cultivated land; seeds sometimes considered poisonous","word":"TARE"},{"def":"a mountain lake (especially one formed by glaciers)","word":"TARN"},{"def":"the act of damaging something or someone","word":"HARM"},{"def":"provide a cure for, make healthy again","word":"HEAL"},{"def":"to this place (especially toward the speaker)","word":"HERE"},{"def":"a large sandwich made of a long crusty roll split lengthwise and filled with meats and cheese (and tomato and onion and lettuce and condiments); different names are used in different sections of the United States","word":"HERO"},{"def":"a Polynesian rain dance performed by a woman","word":"HULA"},{"def":"make undecipherable or imperceptible by obscuring or concealing","word":"HIDE"},{"def":"United States railroad tycoon (1838-1916)","word":"HILL"},{"def":"be capable of holding or containing","word":"HOLD"},{"def":"a sacred place of pilgrimage","word":"HOLY"},{"def":"(baseball) base consisting of a rubber slab where the batter stands; it must be touched by a base runner in order to score","word":"HOME"},{"def":"marry a woman, take a wife","word":"WIVE"},{"def":"unusually great in size or amount or degree or especially extent or scope","word":"HUGE"},{"def":"an association of huntsmen who hunt for sport","word":"HUNT"},{"def":"the act of damaging something or someone","word":"HURT"},{"def":"lock up or confine, in or as in a jail","word":"JAIL"},{"def":"a ludicrous or grotesque act done for fun and amusement","word":"JOKE"},{"def":"a committee appointed to judge a competition","word":"JURY"},{"def":"(used for emphasis) absolutely","word":"JUST"},{"def":"mark for deletion, rub off, or erase","word":"KILL"},{"def":"accept (someone) to be what is claimed or accept his power and authority","word":"KNOW"},{"def":"be without","word":"LACK"},{"def":"a body of (usually fresh) water surrounded by land","word":"LAKE"},{"def":"unauthorized (especially deliberate) disclosure of confidential information","word":"LEAK"},{"def":"bestow a quality on","word":"LEND"},{"def":"used to form the comparative of some adjectives and adverbs","word":"LESS"},{"def":"the experience of being alive; the course of human events and activities","word":"LIFE"},{"def":"a two-way radio communication system (usually microwave); part of a more extensive telecommunication network","word":"LINK"},{"def":"the basic unit of money in Cuba; equal to 100 centavos","word":"PESO"},{"def":"actually being performed at the time of hearing or viewing","word":"LIVE"},{"def":"informal terms for money","word":"PELF"},{"def":"the choicest or most essential or most vital part of some idea or experience","word":"PITH"},{"def":"a quantity that can be processed or transported at one time","word":"LOAD"},{"def":"a word borrowed from another language; e.g. `blitz' is a German word borrowed into modern English","word":"LOAN"},{"def":"hit hard","word":"WHOP"},{"def":"sail close to the wind","word":"LUFF"},{"def":"move along on a luge or toboggan","word":"LUGE"},{"def":"a rich soil consisting of a mixture of sand and clay and decaying organic materials","word":"LOAM"},{"def":"fail to perceive or to catch with the senses or the mind","word":"LOSE"},{"def":"an unknown and unpredictable phenomenon that leads to a favorable outcome","word":"LUCK"},{"def":"cause to be directed or transmitted to another place","word":"MAIL"},{"def":"(of a clause) capable of standing syntactically alone as a complete sentence","word":"MAIN"},{"def":"a cultural unit (an idea or value or pattern of behavior) that is passed from one person to another by non-genetic means (as by imitation)","word":"MEME"},{"def":"a blue-green color or pigment","word":"TEAL"},{"def":"a standard protocol for communication between electronic musical instruments and computers","word":"MIDI"},{"def":"flat tableland with steep edges","word":"MESA"},{"def":"a quantifier that can be used with count nouns and is often preceded by `as' or `too' or `so' or `that'; amounting to a large but indefinite number","word":"MANY"},{"def":"any of various small mouselike rodents of the family Cricetidae (especially of genus Microtus) having a stout short-tailed body and inconspicuous ears and inhabiting fields or meadows","word":"VOLE"},{"def":"a state of irritation or annoyance","word":"MIFF"},{"def":"the officer below the master on a commercial ship","word":"MATE"},{"def":"(used of sums of money) so small in amount as to deserve contempt","word":"MEAN"},{"def":"contend against an opponent in a sport, game, or battle","word":"MEET"},{"def":"a seductive woman who uses her sex appeal to exploit men","word":"MINX"},{"def":"the process whereby heat changes something from a solid to a liquid","word":"MELT"},{"def":"fail to perceive or to catch with the senses or the mind","word":"MISS"},{"def":"(comparative of `much' used with mass nouns) a quantifier meaning greater in size or amount or extent or degree","word":"MORE"},{"def":"(of actions or states) slightly short of or not quite accomplished; all but","word":"MOST"},{"def":"United States anthropologist noted for her claims about adolescence and sexual behavior in Polynesian cultures (1901-1978)","word":"MEAD"},{"def":"the quality of smelling or tasting old or stale or mouldy","word":"MUST"},{"def":"a dark shade of blue","word":"NAVY"},{"def":"immediately following in time or order","word":"NEXT"},{"def":"done with delicacy and skill","word":"NICE"},{"def":"the middle of the day","word":"NOON"},{"def":"a star that ejects some of its material in the form of a cloud and becomes more luminous in the process","word":"NOVA"},{"def":"period extending from Dec. 24 to Jan. 6","word":"NOEL"},{"def":"be obedient to","word":"OBEY"},{"def":"on one occasion","word":"ONCE"},{"def":"remove from a position or office","word":"OUST"},{"def":"move past","word":"PASS"},{"def":"an established line of travel or access","word":"PATH"},{"def":"an arrangement scheme","word":"PLAN"},{"def":"make a plat of","word":"PLOT"},{"def":"a composition written in metrical feet forming rhythmical lines","word":"POEM"},{"def":"(computer science) computer circuit consisting of the hardware and associated circuitry that links one device with another (especially a computer and a hard disk drive or other peripherals)","word":"PORT"},{"def":"pour out","word":"POUR"},{"def":"call upon in supplication; entreat","word":"PRAY"},{"def":"without qualification; used informally as (often pejorative) intensifiers","word":"PURE"},{"def":"compete in a race","word":"RACE"},{"def":"search without warning, make a sudden surprise attack on","word":"RAID"},{"def":"the crime of forcing a person to submit to sexual intercourse against his or her will","word":"RAPE"},{"def":"marked by an uncommon quality; especially superlative or extreme of its kind","word":"RARE"},{"def":"have or contain a certain wording or form","word":"READ"},{"def":"being or reflecting the essential or genuine character of something","word":"REAL"},{"def":"a chalcedony with alternating black and white bands; used in making cameos","word":"ONYX"},{"def":"marked by richness and fullness of flavor","word":"RICH"},{"def":"a journey in a vehicle (usually an automobile)","word":"RIDE"},{"def":"a joke that seems extremely funny","word":"RIOT"},{"def":"get up and out of bed","word":"RISE"},{"def":"the probability of becoming infected given that exposure to an infectious agent has occurred","word":"RISK"},{"def":"move back and forth or sideways","word":"ROCK"},{"def":"street names for flunitrazepan","word":"ROPE"},{"def":"deprive of virginity","word":"RUIN"},{"def":"make unnecessary an expenditure or effort","word":"SAVE"},{"def":"deliver to an enemy by treachery","word":"SELL"},{"def":"provide evidence for","word":"SHOW"},{"def":"affected by an impairment of normal physical or mental function","word":"SICK"},{"def":"make a whining, ringing, or whistling sound","word":"SING"},{"def":"fall heavily or suddenly; decline markedly","word":"SINK"},{"def":"material in the top layer of the surface of the earth in which plants can grow (especially with reference to its quality or use)","word":"SOIL"},{"def":"in the near future","word":"SOON"},{"def":"stab or pierce","word":"STAB"},{"def":"hang on during a trial of endurance","word":"STAY"},{"def":"having or feeling no doubt or uncertainty; confident and assured","word":"SURE"},{"def":"a large (usually metallic) vessel for holding gases or liquids","word":"TANK"},{"def":"form a team","word":"TEAM"},{"def":"a drop of the clear salty saline solution secreted by the lacrimal glands","word":"TEAR"},{"def":"give instructions to or direct somebody to do something with authority","word":"TELL"},{"def":"the end of gestation or point at which birth is imminent","word":"TERM"},{"def":"The objective case of they.","word":"THEM"},{"def":"The plural of he, she, or it. They is never used adjectively, but always as a pronoun proper, and sometimes refers to persons without an antecedent expressed.","word":"THEY"},{"def":"ride in a car with no particular goal and just for the pleasure of it","word":"TOOL"},{"def":"to hold fast or prevent from moving","word":"TRAP"},{"def":"get high, stoned, or drugged","word":"TRIP"},{"def":"a hollow cylindrical shape","word":"TUBE"},{"def":"an instinctive motive","word":"URGE"},{"def":"command against","word":"VETO"},{"def":"an endorsement made in a passport that allows the bearer to enter the country issuing it","word":"VISA"},{"def":"a legal right guaranteed by the 15th amendment to the US Constitution; guaranteed to women by the 19th amendment","word":"VOTE"},{"def":"the act of waiting (remaining inactive in one place while expecting something)","word":"WAIT"},{"def":"have need of","word":"WANT"},{"def":"advise or counsel in terms of someone's behavior","word":"WARN"},{"def":"deficient in magnitude; barely perceptible; lacking clarity or brightness or loudness etc","word":"WEAK"},{"def":"exhaust or get tired through overuse or great strain or stress","word":"WEAR"},{"def":"Something; thing; stuff.","word":"WHAT"},{"def":"a married woman; a man's partner in marriage","word":"WIFE"},{"def":"in an uncontrolled and rampant manner","word":"WILD"},{"def":"prefer or wish to do something","word":"WISH"},{"def":"indicating the absence of any or all units under consideration","word":"ZERO"},{"def":"To the inside of; within. It is used in a variety of applications.","word":"INTO"},{"def":"produced by a manufacturing process","word":"MADE"},{"def":"being the one previously mentioned or spoken of","word":"SAID"},{"def":"having finished or arrived at completion","word":"DONE"},{"def":"thread on or as if on a string","word":"DRAW"},{"def":"a team that plays basketball","word":"FIVE"},{"def":"being one more than three","word":"FOUR"},{"def":"On; -- used in all the senses of that word, with which it is interchangeable.","word":"UPON"},{"def":"change texture so as to become matted and felt-like","word":"FELT"},{"def":"someone who leaves","word":"GOER"},{"def":"drained of energy or effectiveness; extremely tired; completely exhausted","word":"GONE"},{"def":"occupied or in the control of; often used in combination","word":"HELD"},{"def":"(especially of promises or contracts) not violated or disregarded","word":"KEPT"},{"def":"very small","word":"TINY"},{"def":"pass away rapidly","word":"FELL"},{"def":"(Islam) the man who leads prayers in a mosque; for Shiites an imam is a recognized authority on Islamic theology and law and a spiritual guide","word":"IMAM"},{"def":"a unit of measurement for advertising space","word":"INCH"},{"def":"a male sovereign; ruler of a kingdom","word":"KING"},{"def":"the central area of a church","word":"NAVE"},{"def":"deeply absorbed in thought","word":"LOST"},{"def":"100 senti equal 1 kroon in Estonia","word":"SENT"},{"def":"an aromatic gum resin obtained from various Arabian or East African trees; formerly valued for worship and for embalming and fumigation","word":"THUS"},{"def":"put up with something or somebody unpleasant","word":"BEAR"},{"def":"eagerly disposed to act or to be of service","word":"GLAD"},{"def":"someone who works with their hands; someone engaged in manual labor","word":"JACK"},{"def":"a woman of refinement","word":"LADY"},{"def":"the mother of Jesus; Christians refer to her as the Virgin Mary; she is especially honored by Roman Catholics","word":"MARY"},{"def":"a set of two similar things considered as a unit","word":"PAIR"},{"def":"the cardinal number that is the sum of eight and one","word":"NINE"},{"def":"not far distant in time or space or degree or circumstances","word":"NIGH"},{"def":"a canonical hour that is the ninth hour of the day counting from sunrise","word":"NONE"},{"def":"time long past","word":"YORE"},{"def":"On the top of; upon.","word":"ONTO"},{"def":"the quantity of a crop that is harvested","word":"PICK"},{"def":"any of many shrubs of the genus Rosa that bear roses","word":"ROSE"},{"def":"disposed of to a purchaser","word":"SOLD"},{"def":"a person of a specified kind (usually with many eccentricities)","word":"TYPE"},{"def":"a content word that denotes an action, occurrence, or state of existence","word":"VERB"},{"def":"a unit of volume (as for sand or gravel)","word":"YARD"},{"def":"a room where a prisoner is kept","word":"CELL"},{"def":"a coin worth one-hundredth of the value of the basic unit","word":"CENT"},{"def":"cultivate, tend, and cut back the growth of","word":"CROP"},{"def":"set down according to a plan","word":"LAID"},{"def":"device for converting sound waves into electrical energy","word":"MIKE"},{"def":"a content word that can be used to refer to a person, place, thing, quality, or action","word":"NOUN"},{"def":"involving gainful employment in something often done as a hobby","word":"PAID"},{"def":"an estimate based on little or no information","word":"SHOT"},{"def":"(physics) a unit of nuclear cross section; the effective circular area that one particle presents to another as a target for an encounter","word":"BARN"},{"def":"a small round container that is open at the top for holding tobacco","word":"BOWL"},{"def":"distinguished from Bovidae by the male's having solid deciduous antlers","word":"DEER"},{"def":"a piece of furniture with a writing surface and usually drawers or other compartments","word":"DESK"},{"def":"United States actor (born in Ireland); father of Georgiana Emma Barrymore (1827-1862)","word":"DREW"},{"def":"a unit of length used in navigation; exactly 1,852 meters; historically based on the distance spanned by one minute of arc in latitude","word":"MILE"},{"def":"move or arrange oneself in a comfortable and cozy position","word":"NEST"},{"def":"small workplace where handcrafts or manufacturing are done","word":"SHOP"},{"def":"a quality of a given color that differs slightly from another color","word":"TONE"},{"def":"The objective case of who.","word":"WHOM"},{"def":"the largest continent with 60% of the earth's population; it is joined to Europe on the west to form Eurasia; it is the site of some of the world's earliest civilizations","word":"ASIA"},{"def":"hollow out as if making a cave or opening","word":"CAVE"},{"def":"the dead body of a human being","word":"CLAY"},{"def":"United States chemist who developed an economical method of producing aluminum from bauxite (1863-1914)","word":"HALL"},{"def":"large gregarious predatory feline of Africa and India having a tawny coat with a shaggy mane in the male","word":"LION"},{"def":"informal terms for a mother","word":"MAMA"},{"def":"a large area of land preserved in its natural state as public property","word":"PARK"},{"def":"a job in an organization","word":"POST"},{"def":"(British informal) very poor in quality","word":"ROPY"},{"def":"enhance the appearance of","word":"SUIT"},{"def":"unusually great in size or amount or degree or especially extent or scope","word":"VAST"},{"def":"the sister of your father or mother; the wife of your uncle","word":"AUNT"},{"def":"a movable screen placed behind home base to catch balls during batting practice","word":"CAGE"},{"def":"golf equipment used by a golfer to hit a golf ball","word":"CLUB"},{"def":"someone who is a detective","word":"DICK"},{"def":"a computer circuit with several inputs but only one output that can be activated by particular combinations of inputs","word":"GATE"},{"def":"an informal term for a father; probably derived from baby talk","word":"PAPA"},{"def":"a contact on an electrical device (such as a battery) at which electric current enters or leaves","word":"POLE"},{"def":"a small lake","word":"POND"},{"def":"North American woodland herb similar to and used as substitute for the Chinese ginseng","word":"SANG"},{"def":"apart from anything else; without additions or modifications","word":"BARE"},{"def":"remove the bark of a tree","word":"BARK"},{"def":"avoid or try to avoid fulfilling, answering, or performing (duties, questions, or issues)","word":"DUCK"},{"def":"any of various minerals consisting of hydrous silicates of aluminum or potassium etc. that crystallize in forms that allow perfect cleavage into very thin leaves; used as dielectrics because of their resistance to electricity","word":"MICA"},{"def":"press down tightly","word":"PACK"},{"def":"have a desire for something or someone who is not present","word":"PINE"},{"def":"of a light shade of red","word":"PINK"},{"def":"something resembling a pool of liquid","word":"POOL"},{"def":"informal terms for a human head","word":"BEAN"},{"def":"43rd President of the United States; son of George Herbert Walker Bush (born in 1946)","word":"BUSH"},{"def":"the month following June and preceding August","word":"JULY"},{"def":"the month following May and preceding July","word":"JUNE"},{"def":"an artificial source of visible illumination","word":"LAMP"},{"def":"the yarn (as in a rug or velvet or corduroy) that stands up from the weave","word":"PILE"},{"def":"a literal translation used in studying a foreign language (often used illicitly)","word":"PONY"},{"def":"a specific piece of work required to be done as a duty or for a specific fee","word":"TASK"},{"def":"a portable shelter (usually of canvas stretched over supporting poles and fastened to the ground with ropes and pegs)","word":"TENT"},{"def":"(nontechnical usage) a tiny piece of anything","word":"ATOM"},{"def":"turn from a straight course, fixed direction, or line of interest","word":"BEND"},{"def":"become clear or enter one's consciousness or emotions","word":"DAWN"},{"def":"darkened with overcast","word":"DULL"},{"def":"a person of French descent","word":"FROG"},{"def":"an unbridgeable disparity (as from a failure of understanding)","word":"GULF"},{"def":"a midwestern state in north central United States in the Great Lakes region","word":"OHIO"},{"def":"abnormally deficient in color as suggesting physical or emotional distress","word":"PALE"},{"def":"located in or toward the back or rear","word":"REAR"},{"def":"utter words loudly and forcefully","word":"ROAR"},{"def":"capital and largest city of Italy; on the Tiber; seat of the Roman Catholic Church; formerly the capital of the Roman Republic and the Roman Empire","word":"ROME"},{"def":"there are usually two high and two low tides each day","word":"TIDE"},{"def":"having edges that are jagged from injury","word":"TORN"},{"def":"the act of throwing a fishing line out over the water by means of a rod and reel","word":"CAST"},{"def":"informal terms for a (young) woman","word":"DOLL"},{"def":"a fortified defensive structure","word":"FORT"},{"def":"machinery that processes materials by grinding or crushing","word":"MILL"},{"def":"informal or slang terms for mentally irregular","word":"NUTS"},{"def":"a sudden forceful flow","word":"RUSH"},{"def":"an agreement (or contract) in which property is transferred from the seller (vendor) to the buyer (vendee) for a fixed price in money (paid or agreed to be paid by the buyer)","word":"SALE"},{"def":"cause to spin","word":"SPIN"},{"def":"adjust the pitches of (musical instruments)","word":"TUNE"},{"def":"a cruelly rapacious person","word":"WOLF"},{"def":"a vigorous blow","word":"BELT"},{"def":"an activity that you like or at which you are superior","word":"DISH"},{"def":"flow in a circular current, of liquids","word":"EDDY"},{"def":"a crowd especially of ordinary or undistinguished persons or things","word":"HERD"},{"def":"a small reddish planet that is the 4th from the sun and is periodically visible to the naked eye; minerals rich in iron cover its surface and are responsible for its characteristic color","word":"MARS"},{"def":"the prevailing psychological state","word":"MOOD"},{"def":"involving advantage or good","word":"PLUS"},{"def":"a writer of poems (the term is usually reserved for writers of good poetry)","word":"POET"},{"def":"measuring instrument consisting of a narrow strip (cloth or metal) marked in inches or centimeters and used for measuring lengths","word":"TAPE"},{"def":"the cardinal number that is the product of 10 and 100","word":"THOU"},{"def":"opinion or judgment","word":"EYES"},{"def":"the time during which someone's life continues","word":"DAYS"},{"def":"(of persons) taken advantage of","word":"USED"},{"def":"a titled peer of the realm","word":"LORD"},{"def":"the immaterial part of a person; the actuating cause of an individual life","word":"SOUL"},{"def":"Japanese alcoholic beverage made from fermented rice; usually served hot","word":"SAKE"},{"def":"take upon oneself; act presumptuously, without permission","word":"DARE"},{"def":"a feeling of sympathy and sorrow for the misfortunes of others","word":"PITY"},{"def":"extravagantly or foolishly loving and indulgent","word":"FOND"},{"def":"apart from anything else; without additions or modifications","word":"MERE"},{"def":"a job in an organization","word":"SPOT"},{"def":"assist or encourage, usually in some wrongdoing","word":"ABET"},{"def":"with competence; in a competent capable manner","word":"ABLY"},{"def":"feel physical pain","word":"ACHE"},{"def":"causing a dull and steady pain","word":"ACHY"},{"def":"an inflammatory disease involving the sebaceous glands of the skin; characterized by papules or pustules or comedones","word":"ACNE"},{"def":"a town and port in northwestern Israel in the eastern Mediterranean","word":"ACRE"},{"def":"an officer who acts as military assistant to a more senior officer","word":"AIDE"},{"def":"a serious (often fatal) disease of the immune system transmitted through blood products especially by sexual contact or contaminated needles","word":"AIDS"},{"def":"affected manners intended to impress others","word":"AIRS"},{"def":"not practical or realizable; speculative","word":"AIRY"},{"def":"slightly open","word":"AJAR"},{"def":"similar in quality or character","word":"AKIN"},{"def":"by bad luck","word":"ALAS"},{"def":"money or goods contributed to the poor","word":"ALMS"},{"def":"the highest adult male singing voice","word":"ALTO"},{"def":"a primeval Egyptian personification of air and breath; worshipped especially at Thebes","word":"AMEN"},{"def":"projectiles to be fired from a gun","word":"AMMO"},{"def":"wildly; without self-control","word":"AMOK"},{"def":"a stage in psychosexual development when the child's interest is concentrated on the anal region; fixation at this stage is said to result in orderliness, meanness, stubbornness, compulsiveness, etc.","word":"ANAL"},{"def":"again but in a new or different way","word":"ANEW"},{"def":"place one's stake","word":"ANTE"},{"def":"the excretory opening at the end of the alimentary canal","word":"ANUS"},{"def":"the point on the celestial sphere toward which the sun and solar system appear to be moving relative to the fixed stars","word":"APEX"},{"def":"a member of a Semitic people originally from the Arabian peninsula and surrounding territories who speaks Arabic and who inhabits much of the Middle East and northern Africa","word":"ARAB"},{"def":"an elaborate song for solo voice","word":"ARIA"},{"def":"lacking vitality or spirit; lifeless","word":"ARID"},{"def":"studies intended to provide general knowledge and intellectual skills (rather than occupational or professional skills)","word":"ARTS"},{"def":"a motor vehicle with four wheels; usually propelled by an internal combustion engine","word":"AUTO"},{"def":"marked by active interest and enthusiasm","word":"AVID"},{"def":"admit openly and bluntly; make no bones about","word":"AVOW"},{"def":"absent without permission","word":"AWOL"},{"def":"turned or twisted to one side","word":"AWRY"},{"def":"a Japanese form of wrestling; you lose if you are forced out of a small ring or if any part of your body (other than your feet) touches the ground","word":"SUMO"},{"def":"the imperial dynasty of China from 960 to 1279; noted for art and literature and philosophy","word":"SUNG"},{"def":"a shaft on which a wheel rotates","word":"AXLE"},{"def":"a very young child (birth to 1 year) who has not yet begun to walk or talk","word":"BABE"},{"def":"a Chadic language spoken in northern Nigeria","word":"BADE"},{"def":"the basic unit of money in Thailand","word":"BAHT"},{"def":"(criminal law) money that must be forfeited by the bondsman if an accused person fails to appear in court for trial","word":"BAIL"},{"def":"anything that serves as an enticement","word":"BAIT"},{"def":"be very hot, due to hot weather or exposure to the sun","word":"BAKE"},{"def":"without the natural or usual covering","word":"BALD"},{"def":"(used especially of vegetation) having lost all moisture","word":"SERE"},{"def":"a city in northwestern Switzerland","word":"BALE"},{"def":"the area on a billiard table behind the balkline","word":"BALK"},{"def":"semisolid preparation (usually containing a medicine) applied externally as a remedy or for soothing an irritation","word":"BALM"},{"def":"something causing misery or death","word":"BANE"},{"def":"a vigorous blow","word":"BANG"},{"def":"the matter ejected in vomiting","word":"BARF"},{"def":"hit hard","word":"BASH"},{"def":"derive or receive pleasure from; get enjoyment from; take pleasure in","word":"BASK"},{"def":"the lowest adult male singing voice","word":"BASS"},{"def":"shout loudly and without restraint","word":"BAWL"},{"def":"a shape that is spherical and small","word":"BEAD"},{"def":"horny projecting mouth of a bird","word":"BEAK"},{"def":"a group of nearly parallel lines of electromagnetic radiation","word":"BEAM"},{"def":"informal terms for objecting","word":"BEEF"},{"def":"a short high tone produced as a signal or warning","word":"BEEP"},{"def":"a general name for alcoholic beverages made by fermenting a cereal (or mixture of cereals) flavored with hops","word":"BEER"},{"def":"round red root vegetable","word":"BEET"},{"def":"a partiality that prevents objective consideration of an issue or situation","word":"BIAS"},{"def":"dwell","word":"BIDE"},{"def":"ride a bicycle","word":"BIKE"},{"def":"a digestive juice secreted by the liver and stored in the gallbladder; aids in the digestion of fats","word":"BILE"},{"def":"stick to firmly","word":"BIND"},{"def":"speak (about unimportant matters) rapidly and incessantly","word":"BLAB"},{"def":"pompous or pretentious talk or writing","word":"BLAH"},{"def":"a radar echo displayed so as to show the position of a reflecting surface","word":"BLIP"},{"def":"make a spot or mark onto","word":"BLOB"},{"def":"a group of countries in special alliance","word":"BLOC"},{"def":"an act that brings discredit to the person who does it","word":"BLOT"},{"def":"make a smudge on; soil by smudging","word":"BLUR"},{"def":"Old World wild swine having a narrow body and prominent tusks from which most domestic swine come; introduced in United States","word":"BOAR"},{"def":"a typeface with thick heavy lines","word":"BOLD"},{"def":"a discharge of lightning accompanied by thunder","word":"BOLT"},{"def":"stick to firmly","word":"BOND"},{"def":"having bones especially many or prominent bones","word":"BONY"},{"def":"commit a faux pas or a fault or make a serious mistake","word":"BOOB"},{"def":"a pole carrying an overhead microphone projected over a film or tv set","word":"BOOM"},{"def":"a desirable state","word":"BOON"},{"def":"a crude uncouth ill-bred person lacking culture or refinement","word":"BOOR"},{"def":"make a hole, especially with a pointed power or hand tool","word":"BORE"},{"def":"raise in a relief","word":"BOSS"},{"def":"an occasion for excessive eating or drinking","word":"BOUT"},{"def":"a man who is a stupid incompetent fool","word":"BOZO"},{"def":"exceptionally good","word":"BRAG"},{"def":"broken husks of the seeds of cereal grains that are separated from the flour by sifting","word":"BRAN"},{"def":"a small pork sausage","word":"BRAT"},{"def":"reduce to small pieces or particles by pounding or abrading","word":"BRAY"},{"def":"drink made by steeping and boiling and fermenting rather than distilling","word":"BREW"},{"def":"the top edge of a vessel or other container","word":"BRIM"},{"def":"the arch of hair above each eye","word":"BROW"},{"def":"resist","word":"BUCK"},{"def":"strike, beat repeatedly","word":"BUFF"},{"def":"the property of something that is great in magnitude","word":"BULK"},{"def":"(astrology) a person who is born while the sun is in Taurus","word":"BULL"},{"def":"come upon, as if by accident; meet with","word":"BUMP"},{"def":"unacceptable behavior (especially ludicrously false statements)","word":"BUNK"},{"def":"keep afloat","word":"BUOY"},{"def":"a reflex that expels gas noisily from the stomach through the mouth","word":"BURP"},{"def":"an occasion for excessive eating or drinking","word":"BUST"},{"def":"a victim of ridicule or pranks","word":"BUTT"},{"def":"sound of rapid vibration","word":"BUZZ"},{"def":"a sequence of 8 bits (enough to represent one character of alphanumeric data) processed as a single unit of information","word":"BYTE"},{"def":"a small restaurant where drinks and snacks are sold","word":"CAFE"},{"def":"the muscular back part of the shank","word":"CALF"},{"def":"beat with a cane","word":"CANE"},{"def":"a sleeveless garment like a cloak but shorter","word":"CAPE"},{"def":"raise trivial objections","word":"CARP"},{"def":"money in the form of bills or coins","word":"CASH"},{"def":"a cylindrical container that holds liquids","word":"CASK"},{"def":"give over; surrender or relinquish to the physical control of another","word":"CEDE"},{"def":"a long narrow depression in a surface","word":"CHAP"},{"def":"burn slightly and superficially so as to affect color","word":"CHAR"},{"def":"talk socially without exchanging too much information","word":"CHAT"},{"def":"a professional cook","word":"CHEF"},{"def":"a wad of something chewable as tobacco","word":"CHEW"},{"def":"elegance by virtue of being fashionable","word":"CHIC"},{"def":"the act of chipping something","word":"CHIP"},{"def":"the bill in a restaurant","word":"CHIT"},{"def":"cut into pieces","word":"CHOP"},{"def":"informal terms for a meal","word":"CHOW"},{"def":"make a dull, explosive sound","word":"CHUG"},{"def":"a close friend who accompanies his buddies in their activities","word":"CHUM"},{"def":"refer to for illustration or proof","word":"CITE"},{"def":"wearing or provided with clothing; sometimes used in combination","word":"CLAD"},{"def":"a thin wedge of material (wood or metal or stone) for driving into crevices","word":"SHIM"},{"def":"a knife used as a weapon","word":"SHIV"},{"def":"a piece of paper money worth one dollar","word":"CLAM"},{"def":"group of people related by blood or marriage","word":"CLAN"},{"def":"a common venereal disease caused by the bacterium Neisseria gonorrhoeae; symptoms are painful urination and pain around the urethra","word":"CLAP"},{"def":"a mechanical device that is curved or bent to suspend or hold or pull something","word":"CLAW"},{"def":"a musical notation written on a staff indicating the pitch of the notes following it","word":"CLEF"},{"def":"cultivate, tend, and cut back the growth of","word":"CLIP"},{"def":"an awkward stupid person","word":"CLOD"},{"def":"become or cause to become obstructed","word":"CLOG"},{"def":"a lump of material formed from the content of a liquid","word":"CLOT"},{"def":"a slight indication","word":"CLUE"},{"def":"influence or urge by gentle urging, caressing, or flattering","word":"COAX"},{"def":"faucet consisting of a rotating device for regulating flow of a liquid","word":"COCK"},{"def":"a set of rules or principles or laws (especially written ones)","word":"CODE"},{"def":"a structure consisting of something wound in a continuous series of loops","word":"COIL"},{"def":"form by stamping, punching, or printing","word":"COIN"},{"def":"street names for cocaine","word":"COKE"},{"def":"carbonated drink flavored with extract from kola nuts (`dope' is a southernism in the United States)","word":"COLA"},{"def":"South African prelate and leader of the antiapartheid struggle (born in 1931)","word":"TUTU"},{"def":"a kind of revolver","word":"COLT"},{"def":"a state of deep and often prolonged unconsciousness; usually the result of disease or injury","word":"COMA"},{"def":"a shape whose base is a circle and whose sides taper up to a point","word":"CONE"},{"def":"an enclosure made or wire or metal bars in which birds or animals can be kept","word":"COOP"},{"def":"brick that is laid sideways at the top of a wall","word":"COPE"},{"def":"(computer science) a tiny ferrite toroid formerly used in a random access memory to store one bit of data; now superseded by semiconductor memories","word":"CORE"},{"def":"a sudden and decisive change of government illegally or by force","word":"COUP"},{"def":"a small inlet","word":"COVE"},{"def":"having or fostering a warm or friendly and informal atmosphere","word":"COZY"},{"def":"a quarrelsome grouch","word":"CRAB"},{"def":"study intensively, as before an exam","word":"CRAM"},{"def":"disparaging terms for small people","word":"RUNT"},{"def":"obscene terms for feces","word":"CRAP"},{"def":"a card game (usually for two players) in which each player is dealt six cards and discards one or two","word":"CRIB"},{"def":"dwell on with satisfaction","word":"CROW"},{"def":"any substance considered disgustingly foul or unpleasant","word":"CRUD"},{"def":"a small conspicuous constellation in the southern hemisphere in the Milky Way near Centaurus","word":"CRUX"},{"def":"a block in the (approximate) shape of a cube","word":"CUBE"},{"def":"hit with the hand","word":"CUFF"},{"def":"look for and gather","word":"CULL"},{"def":"an interest followed with exaggerated zeal","word":"CULT"},{"def":"lessen the intensity of; temper; hold in restraint; hold or keep within limits","word":"CURB"},{"def":"a coagulated liquid resembling milk curd","word":"CURD"},{"def":"wind around something in coils or loops","word":"CURL"},{"def":"marked by rude or peremptory shortness","word":"CURT"},{"def":"profane or obscene expression usually of surprise or anger","word":"CUSS"},{"def":"obviously contrived to charm","word":"CUTE"},{"def":"a small anatomically normal sac or bladderlike structure (especially one containing fluid)","word":"CYST"},{"def":"a male monarch or emperor (especially of Russia prior to 1917)","word":"CZAR"},{"def":"informal terms for a (young) woman","word":"DAME"},{"def":"something of little value","word":"DAMN"},{"def":"lessen in force or effect","word":"DAMP"},{"def":"unpleasantly cool and humid","word":"DANK"},{"def":"something of little value","word":"DARN"},{"def":"run or move very quickly or hastily","word":"DART"},{"def":"the longer of the two telegraphic signals used in Morse code","word":"DASH"},{"def":"a collection of facts from which conclusions may be drawn","word":"DATA"},{"def":"a blemish made by dirt","word":"DAUB"},{"def":"to cause someone to lose clear vision, especially from intense light","word":"DAZE"},{"def":"United States film actor whose moody rebellious roles made him a cult figure (1931-1955)","word":"DEAN"},{"def":"a pack of 52 playing cards","word":"DECK"},{"def":"something that people do or cause to happen","word":"DEED"},{"def":"keep in mind or convey as a conviction or view","word":"DEEM"},{"def":"skillful in physical movements; especially of the hands","word":"DEFT"},{"def":"resist or confront with resistance","word":"DEFY"},{"def":"give an exhibition of to an interested audience","word":"DEMO"},{"def":"a depression scratched or carved into a surface","word":"DENT"},{"def":"a disc on a telephone that is rotated a fixed distance for each number called","word":"DIAL"},{"def":"an insect in the inactive stage of development (when it is not feeding) intermediate between larva and adult","word":"PUPA"},{"def":"cut into cubes","word":"DICE"},{"def":"(slang) offensive term for a lesbian who is noticeably masculine","word":"DIKE"},{"def":"street name for a packet of illegal drugs that is sold for ten dollars","word":"DIME"},{"def":"give dinner to; host for dinner","word":"DINE"},{"def":"fraught with extreme danger; nearly hopeless","word":"DIRE"},{"def":"draw a harrow over (land)","word":"DISK"},{"def":"a platform built out from the shore into the water and supported by piles; provides access to ships and boats","word":"DOCK"},{"def":"money received from the state","word":"DOLE"},{"def":"informal terms for a human head","word":"DOME"},{"def":"pronounce a sentence on (somebody) in a court of law","word":"DOOM"},{"def":"slang terms for inside information","word":"DOPE"},{"def":"a dull stupid fatuous person","word":"DORK"},{"def":"a college or university building containing living quarters for students","word":"DORM"},{"def":"street name for lysergic acid diethylamide","word":"DOSE"},{"def":"be foolish or senile due to old age","word":"DOTE"},{"def":"harshly uninviting or formidable in manner or appearance","word":"DOUR"},{"def":"flesh of a pigeon suitable for roasting or braising; flesh of a dove (young squab) may be broiled","word":"DOVE"},{"def":"sleep lightly or for a short period of time","word":"DOZE"},{"def":"a dull greyish to yellowish or light olive brown","word":"DRAB"},{"def":"proceed for an extended period of time","word":"DRAG"},{"def":"the sound of a liquid falling drop by drop","word":"DRIP"},{"def":"a bulging cylindrical shape; hollow with flat ends","word":"DRUM"},{"def":"consisting of or involving two parts or components usually in pairs","word":"DUAL"},{"def":"a bodily passage or tube lined with epithelial cells and conveying a secretion or other substance","word":"DUCT"},{"def":"a man who is much concerned with his dress and appearance","word":"DUDE"},{"def":"a prearranged fight with deadly weapons by two people (accompanied by seconds) in order to settle a quarrel over a point of honor","word":"DUEL"},{"def":"two performers or singers who perform together","word":"DUET"},{"def":"a British peer of the highest rank","word":"DUKE"},{"def":"in accordance with what is appropriate or suitable for the circumstances","word":"DULY"},{"def":"unable to speak because of hereditary deafness","word":"DUMB"},{"def":"sell at artificially low prices","word":"DUMP"},{"def":"a ridge of sand created by the wind; found in deserts or near lakes and oceans","word":"DUNE"},{"def":"fecal matter of animals","word":"DUNG"},{"def":"dip into a liquid while eating","word":"DUNK"},{"def":"fool or hoax","word":"DUPE"},{"def":"the time of day immediately following sunset","word":"DUSK"},{"def":"(slang) offensive term for a lesbian who is noticeably masculine","word":"DYKE"},{"def":"ring or echo with sound","word":"ECHO"},{"def":"being in a tense state","word":"EDGY"},{"def":"prepare for publication or presentation by correcting, revising, or adapting","word":"EDIT"},{"def":"an independent ruler or chieftain (especially in Africa or Arabia)","word":"EMIR"},{"def":"expel (gases or odors)","word":"EMIT"},{"def":"spite and resentment at seeing the success of another (personified as one of the deadly sins)","word":"ENVY"},{"def":"constituting or having to do with or suggestive of a literary epic","word":"EPIC"},{"def":"carve or cut a design or letters into","word":"ETCH"},{"def":"a set of questions or exercises evaluating skill or knowledge","word":"EXAM"},{"def":"the chief executive department of the United States government","word":"EXEC"},{"def":"move out of or depart from","word":"EXIT"},{"def":"a collection of things (goods or works of art etc.) for public display","word":"EXPO"},{"def":"gradually ceasing to be visible","word":"FADE"},{"def":"tamper, with the purpose of deception","word":"FAKE"},{"def":"the state or quality of being widely honored and acclaimed","word":"FAME"},{"def":"a Bantu language spoken in Cameroon","word":"FANG"},{"def":"an agenda of things to do","word":"FARE"},{"def":"a reflex that expels intestinal gas through the anus","word":"FART"},{"def":"decree or designate beforehand","word":"FATE"},{"def":"hard fat around the kidneys and loins in beef and sheep","word":"SUET"},{"def":"a color or pigment varying around a light grey-brown color","word":"FAWN"},{"def":"disturb the composure of","word":"FAZE"},{"def":"a notable achievement","word":"FEAT"},{"def":"withstand the force of something","word":"FEND"},{"def":"any of numerous flowerless and seedless vascular plants having true roots from a rhizome and fronds that uncurl upward; reproduce by spores","word":"FERN"},{"def":"an elaborate party (often outdoors)","word":"FETE"},{"def":"a bitter quarrel between two parties","word":"FEUD"},{"def":"a legally binding command or decision entered on the court record (as if issued by a court or judge)","word":"FIAT"},{"def":"record in a public office or in a court of law","word":"FILE"},{"def":"a hand with the fingers clenched in the palm (as for hitting)","word":"FIST"},{"def":"become bubbly or frothy or foaming","word":"FIZZ"},{"def":"loose or flaccid body fat","word":"FLAB"},{"def":"singing jazz; the singer substitutes nonsense syllables for the words of the song and tries to sound like a musical instrument","word":"SCAT"},{"def":"artillery designed to shoot upward at airplanes","word":"FLAK"},{"def":"the motion made by flapping up and down","word":"FLAP"},{"def":"an imperfection in an object or machine","word":"FLAW"},{"def":"any wingless bloodsucking parasitic insect noted for ability to leap","word":"FLEA"},{"def":"bend a joint","word":"FLEX"},{"def":"the act of flipping a coin","word":"FLIP"},{"def":"move along rapidly and lightly; skim or dart","word":"FLIT"},{"def":"beat severely with a whip or rod","word":"FLOG"},{"def":"exactly","word":"FLOP"},{"def":"make a mess of, destroy or ruin","word":"FLUB"},{"def":"flat bladelike projection on the arm of an anchor","word":"FLUE"},{"def":"(physics) the number of changes in energy flow across a given surface per unit area","word":"FLUX"},{"def":"a young horse","word":"FOAL"},{"def":"a mass of small bubbles formed in or on a liquid","word":"FOAM"},{"def":"someone whose style is out of fashion","word":"FOGY"},{"def":"a device consisting of a flat or curved piece (as a metal plate) so that its surface reacts to the water it is passing through","word":"FOIL"},{"def":"people in general (often used in the plural)","word":"FOLK"},{"def":"a specific size and style of type within a type family","word":"FONT"},{"def":"38th President of the United States; appointed vice president and succeeded Nixon when Nixon resigned (1913-2006)","word":"FORD"},{"def":"near or toward the bow of a ship or cockpit of a plane","word":"FORE"},{"def":"become or cause to become obstructed","word":"FOUL"},{"def":"marked by skill in deception","word":"FOXY"},{"def":"a social club for male undergraduates","word":"FRAT"},{"def":"a noisy fight","word":"FRAY"},{"def":"gnaw into; make resentful or angry","word":"FRET"},{"def":"have sexual intercourse with","word":"FUCK"},{"def":"treat with fumes, expose to fumes, especially with the aim of disinfecting or eradicating pests","word":"FUME"},{"def":"a reserve of money set aside for some purpose","word":"FUND"},{"def":"draw back, as with fear or pain","word":"FUNK"},{"def":"form into a cylinder by rolling","word":"FURL"},{"def":"state of violent mental agitation","word":"FURY"},{"def":"any igniter that is used to initiate the burning of a propellant","word":"FUSE"},{"def":"a quarrel about petty points","word":"FUSS"},{"def":"uncomplimentary terms for a policeman","word":"FUZZ"},{"def":"the rate of moving (especially walking or running)","word":"GAIT"},{"def":"a gay festivity","word":"GALA"},{"def":"a strong wind moving 45-90 knots; force 7 to 10 on Beaufort scale","word":"GALE"},{"def":"a digestive juice secreted by the liver and stored in the gallbladder; aids in the digestion of fats","word":"GALL"},{"def":"an informal body of friends","word":"GANG"},{"def":"look with amazement; look stupidly","word":"GAPE"},{"def":"provide with clothes or put clothes on","word":"GARB"},{"def":"a strong sweeping cut made with a sharp instrument","word":"GASH"},{"def":"a short labored intake of breath with the mouth open","word":"GASP"},{"def":"look with amazement; look stupidly","word":"GAWK"},{"def":"look at with fixed eyes","word":"GAZE"},{"def":"set the level or character of","word":"GEAR"},{"def":"a person with an unusual or odd personality","word":"GEEK"},{"def":"(genetics) a segment of DNA that is involved in producing a polypeptide chain; it can include regions preceding and following the coding DNA as well as introns between the exons; it is considered a unit of heredity","word":"GENE"},{"def":"port city in northwestern Belgium and industrial center; famous for cloth industry","word":"GENT"},{"def":"a minute life form (especially a disease-causing bacterium); the term is not in technical use","word":"GERM"},{"def":"an aggressive remark directed at a person like a missile and intended to have a telling effect","word":"GIBE"},{"def":"decorate with, or as if with, gold leaf or liquid gold","word":"GILD"},{"def":"any of the radiating leaflike spore-producing structures on the underside of the cap of a mushroom or similar fungus","word":"GILL"},{"def":"the central meaning or theme of a speech or literary work","word":"GIST"},{"def":"great merriment","word":"GLEE"},{"def":"artfully persuasive in speech","word":"GLIB"},{"def":"a compact mass","word":"GLOB"},{"def":"light from nonthermal sources","word":"GLOW"},{"def":"join or attach with or as if with glue","word":"GLUE"},{"def":"showing a brooding ill humor","word":"GLUM"},{"def":"overeat or eat immodestly; make a pig of oneself","word":"GLUT"},{"def":"any of various small biting flies: midges; biting midges; black flies; sand flies","word":"GNAT"},{"def":"become ground down or deteriorate","word":"GNAW"},{"def":"a pointed instrument that is used to prod into a state of motion","word":"GOAD"},{"def":"a game played on a large open course with 9 or 18 holes; the object is use as few strokes as possible in playing all the holes","word":"GOLF"},{"def":"a percussion instrument consisting of a set of tuned bells that are struck with a hammer; used as an orchestral instrument","word":"GONG"},{"def":"commit a faux pas or a fault or make a serious mistake","word":"GOOF"},{"def":"an awkward stupid person","word":"GOON"},{"def":"the shedding of blood resulting in murder","word":"GORE"},{"def":"covered with blood","word":"GORY"},{"def":"a painful inflammation of the big toe and foot caused by defects in uric acid metabolism resulting in deposits of the acid and its salts in the blood and joints","word":"GOUT"},{"def":"outerwear consisting of a long flowing garment used for official or ceremonial occasions","word":"GOWN"},{"def":"the act of catching an object with the hands","word":"GRAB"},{"def":"a person who has received a degree from a school (high school or college or university)","word":"GRAD"},{"def":"a metric unit of weight equal to one thousandth of a kilogram","word":"GRAM"},{"def":"a system of high tension cables by which electrical power is distributed throughout a region","word":"GRID"},{"def":"harshly uninviting or formidable in manner or appearance","word":"GRIM"},{"def":"a facial expression characterized by turning up the corners of the mouth; usually shows pleasure or amusement","word":"GRIN"},{"def":"a hard coarse-grained siliceous sandstone","word":"GRIT"},{"def":"informal terms for a meal","word":"GRUB"},{"def":"unacceptable behavior (especially ludicrously false statements)","word":"GUFF"},{"def":"fool or hoax","word":"GULL"},{"def":"a large and hurried swallow","word":"GULP"},{"def":"any thick, viscous matter","word":"GUNK"},{"def":"a Hindu or Buddhist religious leader and spiritual teacher","word":"GURU"},{"def":"issue in a jet; come out in a jet; stream or spring forth","word":"GUSH"},{"def":"a strong current of air","word":"GUST"},{"def":"fortitude and determination","word":"GUTS"},{"def":"cough spasmodically","word":"HACK"},{"def":"praise vociferously","word":"HAIL"},{"def":"prolific United States writer (1822-1909)","word":"HALE"},{"def":"an indication of radiant light drawn around the head of a saint","word":"HALO"},{"def":"flesh of any of various rabbits or hares (wild or domesticated) eaten as food","word":"HARE"},{"def":"listen; used mostly in the imperative","word":"HARK"},{"def":"a small rectangular free-reed instrument having a row of free reeds set back in air holes and played by blowing into the desired hole","word":"HARP"},{"def":"purified resinous extract of the hemp plant; used as a hallucinogen","word":"HASH"},{"def":"draw slowly or heavily","word":"HAUL"},{"def":"a square board with a handle underneath; used by masons to hold or carry mortar","word":"HAWK"},{"def":"confusion characterized by lack of clarity","word":"HAZE"},{"def":"indistinct or hazy in outline","word":"HAZY"},{"def":"a car that is old and unreliable","word":"HEAP"},{"def":"pay close attention to; give heed to","word":"HEED"},{"def":"someone who is morally reprehensible","word":"HEEL"},{"def":"a person who is entitled by law or by the terms of a will to inherit the estate of another","word":"HEIR"},{"def":"(Christianity) the abode of Satan and the forces of evil; where sinners suffer eternal punishment","word":"HELL"},{"def":"be at or take the helm of","word":"HELM"},{"def":"any plant of the genus Cannabis; a coarse bushy annual with palmate leaves and clusters of small green flowers; yields tough fibers and narcotic drugs","word":"HEMP"},{"def":"a plant lacking a permanent woody stem; many are flowering garden plants or potherbs; some having medicinal properties; some are pests","word":"HERB"},{"def":"cut or shaped with hard blows of a heavy cutting instrument like an ax or chisel","word":"HEWN"},{"def":"an increase in cost","word":"HIKE"},{"def":"the handle of a sword or dagger","word":"HILT"},{"def":"located at or near the back of an animal","word":"HIND"},{"def":"a slight indication","word":"HINT"},{"def":"engage or hire for work","word":"HIRE"},{"def":"make a sharp hissing sound, as if to show disapproval","word":"HISS"},{"def":"a man-made receptacle that houses a swarm of bees","word":"HIVE"},{"def":"something intended to deceive; deliberate trickery intended to gain an advantage","word":"HOAX"},{"def":"a worker who moves around and works temporarily in different places","word":"HOBO"},{"def":"any of several white wines from the Rhine River valley in Germany (`hock' is British usage)","word":"HOCK"},{"def":"make perfect or complete","word":"HONE"},{"def":"cry like a goose","word":"HONK"},{"def":"the basic unit of money in Cambodia; equal to 100 sen","word":"RIEL"},{"def":"twist suddenly so as to sprain","word":"RICK"},{"def":"a protective covering that is part of a plant","word":"HOOD"},{"def":"walk","word":"HOOF"},{"def":"horizontal circular metal hoop supporting a net through which players try to throw the basketball","word":"HOOP"},{"def":"something of little value","word":"HOOT"},{"def":"a flexible pipe for conveying a liquid or gas","word":"HOSE"},{"def":"a person who acts as host at formal occasions (makes an introductory speech and introduces other speakers)","word":"HOST"},{"def":"emit long loud cries","word":"HOWL"},{"def":"inhale recreational drugs","word":"HUFF"},{"def":"appear very large or occupy a commanding position","word":"HULK"},{"def":"United States diplomat who did the groundwork for creating the United Nations (1871-1955)","word":"HULL"},{"def":"have sexual intercourse with","word":"HUMP"},{"def":"a large piece of something without definite shape","word":"HUNK"},{"def":"any character from an ancient Germanic alphabet used in Scandinavia from the 3rd century to the Middle Ages","word":"RUNE"},{"def":"make a thrusting forward movement","word":"HURL"},{"def":"cause to be quiet or not talk","word":"HUSH"},{"def":"remove the husks from","word":"HUSK"},{"def":"a song of praise (to God or to a saint or to a nation)","word":"HYMN"},{"def":"blatant or sensational promotion","word":"HYPE"},{"def":"the use of tricks to deceive someone (usually to extract money from them)","word":"WILE"},{"def":"wild goat of mountain areas of Eurasia and northern Africa having large recurved horns","word":"IBEX"},{"def":"wading birds of warm regions having long slender down-curved bills","word":"IBIS"},{"def":"soft and sticky","word":"ICKY"},{"def":"a visual representation (of an object or scene or person or abstraction) produced on a surface","word":"ICON"},{"def":"not having a job","word":"IDLE"},{"def":"in an idle manner","word":"IDLY"},{"def":"an ideal instance; a perfect embodiment of a concept","word":"IDOL"},{"def":"(Middle Ages) a person who is bound to the land and owned by the feudal lord","word":"SERF"},{"def":"a stiff hair or bristle","word":"SETA"},{"def":"subject to accident or chance or change","word":"IFFY"},{"def":"a message received and understood","word":"INFO"},{"def":"a tiny or scarcely detectable amount","word":"IOTA"},{"def":"diaphragm consisting of thin overlapping plates that can be adjusted to change the diameter of a central opening","word":"IRIS"},{"def":"(music) melodic subject of a musical composition","word":"IDEA"},{"def":"a small island","word":"ISLE"},{"def":"have a strong desire or urge to do something","word":"ITCH"},{"def":"an individual instance of a type of symbol","word":"ITEM"},{"def":"exhaust or get tired through overuse or great strain or stress","word":"JADE"},{"def":"upright consisting of a vertical side member of a door or window frame","word":"JAMB"},{"def":"empty rhetoric or insincere or exaggerated talk","word":"JAZZ"},{"def":"a car suitable for traveling over rough terrain","word":"JEEP"},{"def":"laugh at with contempt and derision","word":"JEER"},{"def":"a dull stupid fatuous person","word":"JERK"},{"def":"activity characterized by good humor","word":"JEST"},{"def":"an aggressive remark directed at a person like a missile and intended to have a telling effect","word":"JIBE"},{"def":"a woman who jilts a lover","word":"JILT"},{"def":"an evil spell","word":"JINX"},{"def":"a style of jazz played by big bands popular in the 1930s; flowing rhythms but less complex than later styles of jazz","word":"JIVE"},{"def":"a person trained to compete in sports","word":"JOCK"},{"def":"a sudden jarring impact","word":"JOLT"},{"def":"the remains of something that has been destroyed or broken up","word":"JUNK"},{"def":"walk as if unable to control one's movements","word":"KEEL"},{"def":"the act of moving along swiftly (as before a gale)","word":"SCUD"},{"def":"express grief verbally","word":"KEEN"},{"def":"a furnace for firing or burning or drying such things as porcelain or bricks","word":"KILN"},{"def":"one thousand grams; the basic unit of mass adopted under the Systeme International d'Unites","word":"KILO"},{"def":"a knee-length pleated tartan skirt worn by men as part of the traditional dress in the Highlands of northern Scotland","word":"KILT"},{"def":"curl tightly","word":"KINK"},{"def":"a bank check drawn on insufficient funds at another bank in order to take advantage of the float","word":"KITE"},{"def":"fuzzy brown egg-shaped fruit with slightly tart green flesh","word":"KIWI"},{"def":"needlework created by interlacing yarn in a series of connected loops using straight eyeless needles or by machine","word":"KNIT"},{"def":"an ornament in the shape of a ball on the hilt of a sword or dagger","word":"KNOB"},{"def":"add alcohol to (beverages)","word":"LACE"},{"def":"made of or resembling lace","word":"LACY"},{"def":"the habitation of wild animals","word":"LAIR"},{"def":"a sweet innocent mild-mannered person (especially a child)","word":"LAMB"},{"def":"deprive of the use of a limb, especially a leg","word":"LAME"},{"def":"a narrow way or road","word":"LANE"},{"def":"add details to","word":"LARD"},{"def":"a songbird that lives mainly on the ground in open country; has streaky brown plumage","word":"LARK"},{"def":"leather strip that forms the flexible part of a whip","word":"LASH"},{"def":"rock that in its molten form (as magma) issues from volcanos; lava is what magma is called when it reaches the surface","word":"LAVA"},{"def":"a field of cultivated and mowed grass","word":"LAWN"},{"def":"disinclined to work or exertion","word":"LAZY"},{"def":"lacking excess flesh","word":"LEAN"},{"def":"a light, self-propelled movement upwards or forwards","word":"LEAP"},{"def":"plant having a large slender white bulb and flat overlapping dark green leaves; used in cooking; believed derived from the wild Allium ampeloprasum","word":"LEEK"},{"def":"a facial expression of contempt or scorn; the upper lip curls","word":"LEER"},{"def":"genus of small erect or climbing herbs with pinnate leaves and small inconspicuous white flowers and small flattened pods: lentils","word":"LENS"},{"def":"a period of 40 weekdays from Ash Wednesday to Holy Saturday","word":"LENT"},{"def":"cause to assemble or enlist in the military","word":"LEVY"},{"def":"suggestive of or tending to moral looseness","word":"LEWD"},{"def":"a person who has lied or who lies repeatedly","word":"LIAR"},{"def":"take up with the tongue","word":"LICK"},{"def":"a large dark-red oval organ on the left side of the body between the stomach and the diaphragm; produces cells involved in immune responses","word":"LIEN"},{"def":"the post or function properly or customarily occupied or served by another","word":"LIEU"},{"def":"a jaunty rhythm in music","word":"LILT"},{"def":"any liliaceous plant of the genus Lilium having showy pendulous flowers","word":"LILY"},{"def":"any projection that is thought to resemble a human arm","word":"LIMB"},{"def":"any of various related trees bearing limes","word":"LIME"},{"def":"large luxurious car; usually driven by a chauffeur","word":"LIMO"},{"def":"the uneven manner of walking that results from an injured leg","word":"LIMP"},{"def":"cotton or linen fabric with the nap raised on one side; used to dress wounds","word":"LINT"},{"def":"a flexible procedure-oriented programing language that manipulates symbols in the form of lists","word":"LISP"},{"def":"having relatively few calories","word":"LITE"},{"def":"be lazy or idle","word":"LOAF"},{"def":"(anatomy) a somewhat rounded subdivision of a bodily organ or part","word":"LOBE"},{"def":"a raised shelter in which pigeons are kept","word":"LOFT"},{"def":"a company emblem or device","word":"LOGO"},{"def":"hang loosely or laxly","word":"LOLL"},{"def":"lacking companions or companionship","word":"LONE"},{"def":"appear very large or occupy a commanding position","word":"LOOM"},{"def":"wind around something in coils or loops","word":"LOOP"},{"def":"goods or money obtained illegally","word":"LOOT"},{"def":"a person with confused ideas; incapable of serious thought","word":"LOON"},{"def":"a slow pace of running","word":"LOPE"},{"def":"knowledge gained through tradition or anecdote","word":"LORE"},{"def":"to a very great degree or extent","word":"LOTS"},{"def":"a pause during which things are calm or activities are diminished","word":"LULL"},{"def":"group or chunk together in a certain order or place side by side","word":"LUMP"},{"def":"either of two saclike respiratory organs in the chest of vertebrates; serves to remove carbon dioxide and provide oxygen to the blood","word":"LUNG"},{"def":"anything that serves as an enticement","word":"LURE"},{"def":"be about","word":"LURK"},{"def":"a person who drinks alcohol to excess habitually","word":"LUSH"},{"def":"have a craving, appetite, or great desire for","word":"LUST"},{"def":"an official who carries a mace of office","word":"MACE"},{"def":"a female domestic","word":"MAID"},{"def":"injure or wound seriously and leave permanent disfiguration or mutilation","word":"MAIM"},{"def":"mercantile establishment consisting of a carefully landscaped complex of shops representing leading merchandisers; usually includes restaurants and a convenient parking area; a modern version of the traditional marketplace","word":"MALL"},{"def":"a lager of high alcohol content; by law it is considered too alcoholic to be sold as lager or beer","word":"MALT"},{"def":"growth of hair covering the scalp of a human being","word":"MANE"},{"def":"pertaining to animals or animal life or action","word":"ZOIC"},{"def":"a dark region of considerable extent on the surface of the moon","word":"MARE"},{"def":"an area in a town where a public mercantile establishment is set up","word":"MART"},{"def":"a loose and crumbling earthy deposit consisting mainly of calcite or dolomite; used as a fertilizer for soils deficient in lime","word":"MARL"},{"def":"to compress with violence, out of natural shape or condition","word":"MASH"},{"def":"a party of guests wearing costumes and masks","word":"MASK"},{"def":"any sturdy upright pole","word":"MAST"},{"def":"a science (or group of related sciences) dealing with the logic of quantity and shape and arrangement","word":"MATH"},{"def":"a heavy long-handled hammer used to drive stakes or wedges","word":"MAUL"},{"def":"egg yolks and oil and vinegar","word":"MAYO"},{"def":"not reflecting light; not glossy","word":"MATT"},{"def":"something jumbled or confused","word":"MAZE"},{"def":"evidencing little spirit or courage; overly submissive or compliant","word":"MEEK"},{"def":"mix together different elements","word":"MELD"},{"def":"a written proposal or reminder","word":"MEMO"},{"def":"restore by replacing a part or putting together what is torn or broken","word":"MEND"},{"def":"a list of dishes available at a restaurant","word":"MENU"},{"def":"the sound made by a cat (or any sound resembling this)","word":"MEOW"},{"def":"the topology of a network whose components are all connected directly to every other component","word":"MESH"},{"def":"informal terms for a difficult situation","word":"MESS"},{"def":"a line that indicates a boundary","word":"METE"},{"def":"mild and pleasant","word":"MILD"},{"def":"a performance using gestures and body movements without words","word":"MIME"},{"def":"a very short skirt","word":"MINI"},{"def":"fur coat made from the soft lustrous fur of minks","word":"MINK"},{"def":"a candy that is flavored with a mint oil","word":"MINT"},{"def":"a large and hurried swallow","word":"SWIG"},{"def":"a soft wet area of low-lying land that sinks underfoot","word":"MIRE"},{"def":"a slight but appreciable amount","word":"MITE"},{"def":"the (prehensile) extremity of the superior limb","word":"MITT"},{"def":"indicate pain, discomfort, or displeasure","word":"MOAN"},{"def":"ditch dug as a fortification and usually filled with water","word":"MOAT"},{"def":"treat with contempt","word":"MOCK"},{"def":"any of various fixed orders of the various diatonic notes within an octave","word":"MODE"},{"def":"a distinctive nature, character, or type","word":"MOLD"},{"def":"a protective structure of stone or concrete; extends from shore into the water to prevent a beach from washing away","word":"MOLE"},{"def":"cast off hair, skin, horn, or feathers","word":"MOLT"},{"def":"United States jazz pianist who was one of the founders of the bebop style (1917-1982)","word":"MONK"},{"def":"designating sound transmission or recording or reproduction over a single channel","word":"MONO"},{"def":"secure in or as if in a berth or dock","word":"MOOR"},{"def":"think about carefully; weigh","word":"MOOT"},{"def":"be apathetic, gloomy, or dazed","word":"MOPE"},{"def":"tiny leafy-stemmed flowerless plants","word":"MOSS"},{"def":"typically crepuscular or nocturnal insect having a stout body and feathery or hairlike antennae","word":"MOTH"},{"def":"(used of grass or vegetation) cut down with a hand implement or machine","word":"MOWN"},{"def":"soil with mud, muck, or mire","word":"MUCK"},{"def":"make a mess of, destroy or ruin","word":"MUFF"},{"def":"a slipper that has no fitting around the heel","word":"MULE"},{"def":"reflect deeply on a subject","word":"MULL"},{"def":"reflect deeply on a subject","word":"MUSE"},{"def":"writing or music that is excessively sweet and sentimental","word":"MUSH"},{"def":"an odorous glandular secretion from the male musk deer; used as a perfume fixative","word":"MUSK"},{"def":"a state of confusion and disorderliness","word":"MUSS"},{"def":"unable to speak because of hereditary deafness","word":"MUTE"},{"def":"an inferior dog or one of mixed breed","word":"MUTT"},{"def":"a traditional story accepted as history; serves to explain the world view of a people","word":"MYTH"},{"def":"the back side of the neck","word":"NAPE"},{"def":"a lawman concerned with narcotics violations","word":"NARC"},{"def":"free from clumsiness; precisely or deftly executed","word":"NEAT"},{"def":"a colorless odorless gaseous element that give a red glow in a vacuum tube; one of the six inert gasses; occurs in the air in small amounts","word":"NEON"},{"def":"an insignificant student who is ridiculed as being affected or boringly studious","word":"NERD"},{"def":"small usually bright-colored semiaquatic salamanders of North America and Europe and northern Asia","word":"NEWT"},{"def":"a small cut","word":"NICK"},{"def":"the source of lymph and lymphocytes","word":"NODE"},{"def":"an interior angle formed by two meeting walls","word":"NOOK"},{"def":"a statistic describing the location of a distribution","word":"NORM"},{"def":"offensively curious or inquisitive","word":"NOSY"},{"def":"a statue of a naked human figure","word":"NUDE"},{"def":"cook or heat in a microwave oven","word":"NUKE"},{"def":"lacking any legal or binding force","word":"NULL"},{"def":"make numb or insensitive","word":"NUMB"},{"def":"profane or obscene expression usually of surprise or anger","word":"OATH"},{"def":"a slender double-reed instrument; a woodwind with a conical bore and a double-reed mouthpiece","word":"OBOE"},{"def":"the ratio by which one better's wager is greater than that of another","word":"ODDS"},{"def":"a slender double-reed instrument; a woodwind with a conical bore and a double-reed mouthpiece","word":"OBOE"},{"def":"any property detected by the olfactory system","word":"ODOR"},{"def":"look at with amorous intentions","word":"OGLE"},{"def":"a cruel wicked and inhuman person","word":"OGRE"},{"def":"unpleasantly and excessively suave or ingratiating in manner or speech","word":"OILY"},{"def":"the short low gruff noise of the kind made by hogs","word":"OINK"},{"def":"in a satisfactory or adequate manner","word":"OKAY"},{"def":"long mucilaginous green pods; may be simmered or sauteed but used especially in soups and stews","word":"OKRA"},{"def":"a sign of something about to happen","word":"OMEN"},{"def":"leave undone or leave out","word":"OMIT"},{"def":"an onerous or difficult concern","word":"ONUS"},{"def":"the process of seeping","word":"OOZE"},{"def":"a translucent mineral consisting of hydrated silica of variable color; some varieties are used as gemstones","word":"OPAL"},{"def":"using speech rather than writing","word":"ORAL"},{"def":"any act of immoderate indulgence","word":"ORGY"},{"def":"rounded like an egg","word":"OVAL"},{"def":"domesticated bovine animals as a group regardless of sex or age","word":"OXEN"},{"def":"a unit of length equal to 3 feet; defined as 91.44 centimeters; originally taken to be the average length of a stride","word":"PACE"},{"def":"a written agreement between two states or sovereigns","word":"PACT"},{"def":"the quantity contained in a pail","word":"PAIL"},{"def":"lose interest or become bored with something or somebody","word":"PALL"},{"def":"an award for winning a championship or commemorating some other event","word":"PALM"},{"def":"street name for lysergic acid diethylamide","word":"PANE"},{"def":"a mental pain or distress","word":"PANG"},{"def":"a short labored intake of breath with the mouth open","word":"PANT"},{"def":"decrease gradually or bit by bit","word":"PARE"},{"def":"the top of the head","word":"PATE"},{"def":"a setting with precious stones so closely set that no metal shows","word":"PAVE"},{"def":"leave as a guarantee in return for money","word":"PAWN"},{"def":"the highest point (of something)","word":"PEAK"},{"def":"a deep prolonged sound (as of thunder or large bells)","word":"PEAL"},{"def":"Old World tree having sweet gritty-textured juicy fruit; widely cultivated in many varieties","word":"PEAR"},{"def":"partially carbonized vegetable matter saturated with water; can be used as a fuel when dried","word":"PEAT"},{"def":"eat like a bird","word":"PECK"},{"def":"a secret look","word":"PEEK"},{"def":"British politician (1788-1850)","word":"PEEL"},{"def":"a secret look","word":"PEEP"},{"def":"a person who is of equal standing with another in a group","word":"PEER"},{"def":"direct one's course or way","word":"WEND"},{"def":"attack and bombard with or as if with missiles","word":"PELT"},{"def":"a laborer who is obliged to do menial work","word":"PEON"},{"def":"an incidental benefit awarded for certain types of employment (especially if it is regarded as a right)","word":"PERK"},{"def":"a series of waves in the hair made by applying heat and chemicals","word":"PERM"},{"def":"characterized by a lightly pert and exuberant quality","word":"PERT"},{"def":"any epidemic disease with a high death rate","word":"PEST"},{"def":"a platform built out from the shore into the water and supported by piles; provides access to ships and boats","word":"PIER"},{"def":"a broad highway designed for high-speed traffic","word":"PIKE"},{"def":"a contraceptive in the form of a pill containing estrogen and progestin to inhibit ovulation and so prevent conception","word":"PILL"},{"def":"someone who procures customers for whores (in England they call a pimp a ponce)","word":"PIMP"},{"def":"a river in western Thailand; a major tributary of the Chao Phraya","word":"PING"},{"def":"a United States dry unit equal to 0.5 quart or 33.6 cubic inches","word":"PINT"},{"def":"eliminate urine","word":"PISS"},{"def":"a humble request for help from someone in authority","word":"PLEA"},{"def":"the act of walking with a slow heavy gait","word":"PLOD"},{"def":"set (something or oneself) down with or as if with a noise","word":"PLOP"},{"def":"a maneuver in a game or conversation","word":"PLOY"},{"def":"an old or over-worked horse","word":"PLUG"},{"def":"any of several trees producing edible oval fruit having a smooth skin and a single hard stone","word":"PLUM"},{"def":"hit hard with the hand, fist, or some heavy instrument","word":"POKE"},{"def":"small and remote and insignificant","word":"POKY"},{"def":"convert into a pollard","word":"POLL"},{"def":"Venetian traveler who explored Asia in the 13th century and served Kublai Khan (1254-1324)","word":"POLO"},{"def":"ceremonial elegance and splendor","word":"POMP"},{"def":"obscene terms for feces","word":"POOP"},{"def":"English poet and satirist (1688-1744)","word":"POPE"},{"def":"direct one's attention on something","word":"PORE"},{"def":"meat from a domestic hog or pig","word":"PORK"},{"def":"creative activity (writing or pictures or films etc.) of no literary or artistic value other than to stimulate sexual desire","word":"PORN"},{"def":"introduce","word":"POSE"},{"def":"elegant and fashionable","word":"POSH"},{"def":"an arrangement of flowers that is usually given as a present","word":"POSY"},{"def":"a disdainful grimace","word":"POUT"},{"def":"preparatory school work done outside school (especially at home)","word":"PREP"},{"def":"profit from in an exploitatory manner","word":"PREY"},{"def":"dress primly","word":"PRIM"},{"def":"a pointed instrument that is used to prod into a state of motion","word":"PROD"},{"def":"someone who is a member of the faculty at a college or university","word":"PROF"},{"def":"a formal ball held for a school class toward the end of the academic year","word":"PROM"},{"def":"a propeller that rotates to push against air","word":"PROP"},{"def":"front part of a vessel or aircraft","word":"PROW"},{"def":"a vulcanized rubber disk 3 inches in diameter that is used instead of a ball in ice hockey","word":"PUCK"},{"def":"suck in or take (air)","word":"PUFF"},{"def":"a fence or wattle built across a stream to catch or retain fish","word":"WEIR"},{"def":"the matter ejected in vomiting","word":"PUKE"},{"def":"an inexpensive magazine printed on poor quality paper","word":"PULP"},{"def":"large American feline resembling a lion","word":"PUMA"},{"def":"rock music with deliberately offensive lyrics expressing anger and social alienation; in part a reaction against progressive rock","word":"PUNK"},{"def":"(football) a kick in which the football is dropped from the hands and kicked before it touches the ground","word":"PUNT"},{"def":"United States baseball player (born 1925)","word":"YOGI"},{"def":"(used especially of persons) of inferior size","word":"PUNY"},{"def":"make a soft swishing sound","word":"PURR"},{"def":"hitting a golf ball that is on the green using a putter","word":"PUTT"},{"def":"wood heaped for burning a dead body as a funeral rite","word":"PYRE"},{"def":"a rectangular area surrounded on all sides by buildings","word":"QUAD"},{"def":"wharf usually built parallel to the shoreline","word":"QUAY"},{"def":"make jokes or quips","word":"QUIP"},{"def":"put an end to a state or an activity","word":"QUIT"},{"def":"examine someone's knowledge of something","word":"QUIZ"},{"def":"an instrument of torture that stretches or disjoints or mutilates victims","word":"RACK"},{"def":"marked by richness and fullness of flavor","word":"RACY"},{"def":"(often followed by `of') a large number or amount or extent","word":"RAFT"},{"def":"something that is desired intensely","word":"RAGE"},{"def":"examine hastily","word":"RAKE"},{"def":"North American perennial having a slender bulb and whitish flowers","word":"RAMP"},{"def":"assign a rank or rating to","word":"RANK"},{"def":"talk in a noisy, excited, or declamatory manner","word":"RANT"},{"def":"feeling great rapture or delight","word":"RAPT"},{"def":"marked by defiant disregard for danger or consequences","word":"RASH"},{"def":"uttering in an irritated tone","word":"RASP"},{"def":"talk in a noisy, excited, or declamatory manner","word":"RAVE"},{"def":"tear down so as to make flat with the ground","word":"RAZE"},{"def":"harass with persistent criticism or carping","word":"RAZZ"},{"def":"a large quantity of written matter","word":"REAM"},{"def":"gather, as of natural products","word":"REAP"},{"def":"make new","word":"REDO"},{"def":"United States journalist who reported on the October Revolution from Petrograd in 1917; founded the Communist Labor Party in America in 1919; is buried in the Kremlin in Moscow (1887-1920)","word":"REED"},{"def":"a rocky region in the southern Transvaal in northeastern South Africa; contains rich gold deposits and coal and manganese","word":"REEF"},{"def":"be wet with sweat or blood, as of one's face","word":"REEK"},{"def":"an American country dance which starts with the couples facing each other in two lines","word":"REEL"},{"def":"stop or check by or as if by a pull at the reins","word":"REIN"},{"def":"have faith or confidence in","word":"RELY"},{"def":"tear or be torn violently","word":"REND"},{"def":"grant use or occupation of under a term of contract","word":"RENT"},{"def":"most frequent or common","word":"RIFE"},{"def":"a personal or social separation (as between opposing factions)","word":"RIFT"},{"def":"make turbid by stirring up the sediments of","word":"RILE"},{"def":"the natural outer covering of food (usually removed before eating)","word":"RIND"},{"def":"building that contains a surface for ice skating or roller skating","word":"RINK"},{"def":"far along in time","word":"RIPE"},{"def":"any customary observance or practice","word":"RITE"},{"def":"move about aimlessly or without any destination, often in search of food or employment","word":"ROAM"},{"def":"outerwear consisting of a long flowing garment used for official or ceremonial occasions","word":"ROBE"},{"def":"the actions and activities assigned to or required or expected of a person or group","word":"ROLE"},{"def":"gay or light-hearted recreational activity for diversion or amusement","word":"ROMP"},{"def":"common gregarious Old World bird about the size and color of the American crow","word":"ROOK"},{"def":"having the pinkish flush of health","word":"ROSY"},{"def":"memorization by repetition","word":"ROTE"},{"def":"defeat disastrously","word":"ROUT"},{"def":"of a color at the end of the color spectrum (next to orange); resembling the color of blood or cherries or tomatoes or rubies","word":"RUBY"},{"def":"socially incorrect in behavior","word":"RUDE"},{"def":"a feeling of sympathy and sorrow for the misfortunes of others","word":"RUTH"},{"def":"the part of an animal that corresponds to the human buttocks","word":"RUMP"},{"def":"one of the crosspieces that form the steps of a ladder","word":"RUNG"},{"def":"a deceptive maneuver (especially to avoid capture)","word":"RUSE"},{"def":"the formation of reddish-brown ferric oxides on iron by low-temperature oxidation in the presence of water","word":"RUST"},{"def":"an enclosed space","word":"SACK"},{"def":"a narrative telling the adventures of a hero or a family; originally (12th to 14th centuries) a story of the families that settled Iceland and their descendants but now any prose narrative that resembles such an account","word":"SAGA"},{"def":"of the grey-green color of sage leaves","word":"SAGE"},{"def":"marked by sound judgment","word":"SANE"},{"def":"a band of material around the waist that strengthens a skirt or trousers","word":"SASH"},{"def":"an impudent or insolent rejoinder","word":"SASS"},{"def":"someone who works (or provides workers) during a strike","word":"SCAB"},{"def":"a fraudulent business scheme","word":"SCAM"},{"def":"examine hastily","word":"SCAN"},{"def":"an indication of damage","word":"SCAR"},{"def":"worthless people","word":"SCUM"},{"def":"a member of a Naval Special Warfare unit who is trained for unconventional warfare","word":"SEAL"},{"def":"a slight depression or fold in the smoothness of a surface","word":"SEAM"},{"def":"cause to wither or parch from exposure to heat","word":"SEAR"},{"def":"a subdivision of a larger religious group","word":"SECT"},{"def":"make an effort or attempt","word":"SEEK"},{"def":"pass gradually or leak through or as if through small openings","word":"SEEP"},{"def":"fastened with stitches","word":"SEWN"},{"def":"stimulating sexual desire","word":"SEXY"},{"def":"adopted in order to deceive","word":"SHAM"},{"def":"cast off hair, skin, horn, or feathers","word":"SHED"},{"def":"a cut of meat from the lower part of the leg","word":"SHIN"},{"def":"obscene terms for feces","word":"SHIT"},{"def":"used of certain religious orders who wear shoes","word":"SHOD"},{"def":"drive away by crying `shoo!'","word":"SHOO"},{"def":"avoid and stay away from deliberately; stay clear of","word":"SHUN"},{"def":"distinguish and separate out","word":"SIFT"},{"def":"an utterance made by exhaling audibly","word":"SIGH"},{"def":"an adherent of Sikhism","word":"SIKH"},{"def":"(geology) a flat (usually horizontal) mass of igneous rock between two layers of older sedimentary rock","word":"SILL"},{"def":"a cylindrical tower used for storing silage","word":"SILO"},{"def":"become chocked with silt","word":"SILT"},{"def":"the founder of a family","word":"SIRE"},{"def":"assign a location to","word":"SITE"},{"def":"having an oblique or slanting direction or position","word":"SKEW"},{"def":"move obliquely or sideways, usually in an uncontrolled manner","word":"SKID"},{"def":"used of milk and milk products from which the cream has been removed","word":"SKIM"},{"def":"jump lightly","word":"SKIP"},{"def":"a short theatrical episode","word":"SKIT"},{"def":"block consisting of a thick piece of something","word":"SLAB"},{"def":"an aggressive remark directed at a person like a missile and intended to have a telling effect","word":"SLAM"},{"def":"the act of smacking something; a blow delivered with an open hand","word":"SLAP"},{"def":"a thin strip (wood or metal)","word":"SLAT"},{"def":"kill intentionally and with premeditation","word":"SLAY"},{"def":"ride (on) a sled","word":"SLED"},{"def":"move obliquely or sideways, usually in an uncontrolled manner","word":"SLEW"},{"def":"take off weight","word":"SLIM"},{"def":"a depression scratched or carved into a surface","word":"SLIT"},{"def":"a coarse obnoxious person","word":"SLOB"},{"def":"work doggedly or persistently","word":"SLOG"},{"def":"writing or music that is excessively sweet and sentimental","word":"SLOP"},{"def":"a slot machine that is used for gambling","word":"SLOT"},{"def":"a strip of type metal used for spacing","word":"SLUG"},{"def":"a district of a city marked by poverty and inferior living conditions","word":"SLUM"},{"def":"a blemish made by dirt","word":"SLUR"},{"def":"a woman adulterer","word":"SLUT"},{"def":"air pollution by a mixture of smoke and fog","word":"SMOG"},{"def":"marked by excessive complacency or self-satisfaction","word":"SMUG"},{"def":"an offensive or indecent word or phrase","word":"SMUT"},{"def":"an unforeseen obstacle","word":"SNAG"},{"def":"move or strike with a noise","word":"SNAP"},{"def":"cultivate, tend, and cut back the growth of","word":"SNIP"},{"def":"a state of agitated irritation","word":"SNIT"},{"def":"a person regarded as arrogant and annoying","word":"SNOB"},{"def":"a person regarded as arrogant and annoying","word":"SNOT"},{"def":"an instance of driving away or warding off","word":"SNUB"},{"def":"a small secluded room","word":"SNUG"},{"def":"make drunk (with alcoholic drinks)","word":"SOAK"},{"def":"rise rapidly","word":"SOAR"},{"def":"a sodium salt of carbonic acid; used in making soap powders and glass and paper","word":"SODA"},{"def":"an upholstered seat for more than one person","word":"SOFA"},{"def":"not divided or shared with others","word":"SOLE"},{"def":"without anybody else or anything else","word":"SOLO"},{"def":"a black colloidal substance consisting wholly or principally of amorphous carbon and used to make pigments and ink","word":"SOOT"},{"def":"roused to anger","word":"SORE"},{"def":"inaccurate in pitch","word":"SOUR"},{"def":"sprinkled with seed","word":"SOWN"},{"def":"to cover or extend over an area or time period","word":"SPAN"},{"def":"making the motions of attack and defense with the fists and arms; a part of training for a boxer","word":"SPAR"},{"def":"a quarrel about petty points","word":"SPAT"},{"def":"expel or eject (saliva or phlegm or sputum) from the mouth","word":"SPEW"},{"def":"expel or eject (saliva or phlegm or sputum) from the mouth","word":"SPIT"},{"def":"moving quickly and lightly","word":"SPRY"},{"def":"an edible tuber native to South America; a staple food of Ireland","word":"SPUD"},{"def":"give heart or courage to","word":"SPUR"},{"def":"a male deer, especially an adult male red deer","word":"STAG"},{"def":"be in a huff; be silent or sullen","word":"STEW"},{"def":"summon into action or bring into existence, often as if by magic","word":"STIR"},{"def":"fill by packing tightly","word":"STOW"},{"def":"a torn part of a ticket returned to the holder as a receipt","word":"STUB"},{"def":"adult male horse kept for breeding","word":"STUD"},{"def":"hit something or somebody as if with a sandbag","word":"STUN"},{"def":"give suck to","word":"SUCK"},{"def":"make froth or foam and become bubbly","word":"SUDS"},{"def":"a mood or display of sullen aloofness or withdrawal","word":"SULK"},{"def":"the imperial dynasty of China from 960 to 1279; noted for art and literature and philosophy","word":"SUNG"},{"def":"doomed to extinction","word":"SUNK"},{"def":"waves breaking on the shore","word":"SURF"},{"def":"wash with a swab or a mop","word":"SWAB"},{"def":"move about aimlessly or without any destination, often in search of food or employment","word":"SWAN"},{"def":"an equal exchange","word":"SWAP"},{"def":"a sharp blow","word":"SWAT"},{"def":"move back and forth or sideways","word":"SWAY"},{"def":"make synchronous and adjust in time or manner","word":"SYNC"},{"def":"gear for a horse","word":"TACK"},{"def":"(ethnic slur) offensive term for a person of Mexican descent","word":"TACO"},{"def":"consideration in dealing with others and avoiding giving offense","word":"TACT"},{"def":"a trivial lie","word":"TALE"},{"def":"correct by punishment or discipline","word":"TAME"},{"def":"(military) signal to turn the lights out","word":"TAPS"},{"def":"waterproofed canvas","word":"TARP"},{"def":"a woman who engages in sexual intercourse for money","word":"TART"},{"def":"pulled or drawn tight","word":"TAUT"},{"def":"a car driven by a person whose job is to take passengers where they want to go in exchange for money","word":"TAXI"},{"def":"hard strong durable yellowish-brown wood of teak trees; resistant to insects and to warping; used for furniture and in shipbuilding","word":"TEAK"},{"def":"the small projection of a mammary gland","word":"TEAT"},{"def":"be teeming, be abuzz","word":"TEEM"},{"def":"being of the age 13 through 19","word":"TEEN"},{"def":"a worker (especially in an office) hired on a temporary basis","word":"TEMP"},{"def":"have a tendency or disposition to do or be something; be inclined","word":"TEND"},{"def":"a book prepared for use in schools or colleges","word":"TEXT"},{"def":"the process whereby heat changes something from a solid to a liquid","word":"THAW"},{"def":"make a noise typical of an engine lacking lubricants","word":"THUD"},{"def":"an aggressive and violent young criminal","word":"THUG"},{"def":"a metallic tapping sound","word":"TICK"},{"def":"put (things or places) in order","word":"TIDY"},{"def":"a worker who ties something","word":"TIER"},{"def":"a quarrel about petty points","word":"TIFF"},{"def":"a thin flat slab of fired clay used for roofing","word":"TILE"},{"def":"a combat between two mounted knights tilting against each other with blunted lances","word":"TILT"},{"def":"a quality of a given color that differs slightly from another color","word":"TINT"},{"def":"exhaust or get tired through overuse or great strain or stress","word":"TIRE"},{"def":"any of various tailless stout-bodied amphibians with long hind limbs for leaping; semiaquatic and terrestrial species","word":"TOAD"},{"def":"cheeselike food made of curdled soybean milk","word":"TOFU"},{"def":"a one-piece cloak worn by men in ancient Rome","word":"TOGA"},{"def":"informal terms for clothing","word":"TOGS"},{"def":"productive work (especially physical work done for wages)","word":"TOIL"},{"def":"value measured by what must be given or done or undergone to obtain something","word":"TOLL"},{"def":"a place for the burial of a corpse (especially beneath the ground and marked by a tombstone)","word":"TOMB"},{"def":"a (usually) large and scholarly book","word":"TOME"},{"def":"a large number or amount","word":"TONS"},{"def":"make a loud noise","word":"TOOT"},{"def":"commonly the lowest molding at the base of a column","word":"TORE"},{"def":"(law) any wrongdoing for which an action for damages may be brought","word":"TORT"},{"def":"the act of flipping a coin","word":"TOSS"},{"def":"carry with difficulty","word":"TOTE"},{"def":"a period of time spent in military service","word":"TOUR"},{"def":"one who sells advice about gambling or speculation (especially at the racetrack)","word":"TOUT"},{"def":"a journey by ox wagon (especially an organized migration by a group of settlers)","word":"TREK"},{"def":"cut down on; make a reduction in","word":"TRIM"},{"def":"a set of three similar things considered as a unit","word":"TRIO"},{"def":"run at a moderately swift pace","word":"TROT"},{"def":"the lowest brass wind instrument","word":"TUBA"},{"def":"fit snugly into","word":"TUCK"},{"def":"a bunch of hair or feathers or growing grass","word":"TUFT"},{"def":"tropical American prickly pear of Jamaica","word":"TUNA"},{"def":"obscene terms for feces","word":"TURD"},{"def":"surface layer of ground containing a mat of grass and grass roots","word":"TURF"},{"def":"the fleshy part of the human body that you sit on","word":"TUSH"},{"def":"remove the tusks of animals","word":"TUSK"},{"def":"understand, usually after some initial difficulty","word":"TWIG"},{"def":"being two identical","word":"TWIN"},{"def":"aggravation by deriding or mocking or criticizing","word":"TWIT"},{"def":"a crude uncouth ill-bred person lacking culture or refinement","word":"TYKE"},{"def":"a mistake in printed matter resulting from mechanical failures of some kind","word":"TYPO"},{"def":"inclined to anger or bad feelings with overtones of menace","word":"UGLY"},{"def":"deprive of certain characteristics","word":"UNDO"},{"def":"a person who uses something or someone selfishly or unethically","word":"USER"},{"def":"unproductive of success","word":"VAIN"},{"def":"become different in some particular way, without permanently losing one's or its former characteristics or essence","word":"VARY"},{"def":"an open jar of glass or porcelain used as an ornament or to hold flowers","word":"VASE"},{"def":"meat from a calf","word":"VEAL"},{"def":"turn sharply; change direction abruptly","word":"VEER"},{"def":"make undecipherable or imperceptible by obscuring or concealing","word":"VEIL"},{"def":"a blood vessel that carries blood from the capillaries toward the heart","word":"VEIN"},{"def":"activity that frees or expresses creative energy or emotion","word":"VENT"},{"def":"provide with power and authority","word":"VEST"},{"def":"a small bottle that contains a drug (especially a sealed sterile container for injection by needle)","word":"VIAL"},{"def":"moral weakness","word":"VICE"},{"def":"causing or able to cause nausea","word":"VILE"},{"def":"a plant with a weak stem that derives support from climbing, twining, or creeping along a surface","word":"VINE"},{"def":"a holding device attached to a workbench; has two jaws to hold workpiece firmly in place","word":"VISE"},{"def":"lacking any legal or binding force","word":"VOID"},{"def":"a unit of potential equal to the potential difference between two points on a conductor carrying a current of 1 ampere when the power dissipated between the two points is 1 watt; equivalent to the potential difference across a resistance of 1 ohm when 1 ampere of current flows through it","word":"VOLT"},{"def":"English tennis player who won many women's singles titles (born in 1945)","word":"WADE"},{"def":"a long flag; often tapering","word":"WAFT"},{"def":"carry on (wars, battles, or campaigns)","word":"WAGE"},{"def":"a homeless child especially one forsaken or orphaned","word":"WAIF"},{"def":"emit long loud cries","word":"WAIL"},{"def":"the consequences of an event (especially a catastrophic event)","word":"WAKE"},{"def":"a ceremonial or emblematic staff","word":"WAND"},{"def":"a gradual decline (in size or strength or power or number)","word":"WANE"},{"def":"watch over or shield from danger or harm; protect","word":"WARD"},{"def":"spend extravagantly","word":"WARE"},{"def":"a shape distorted by twisting or folding","word":"WARP"},{"def":"(pathology) a firm abnormal elevated blemish on the skin; caused by a virus","word":"WART"},{"def":"openly distrustful and unwilling to confide","word":"WARY"},{"def":"a white person of Anglo-Saxon ancestry who belongs to a Protestant denomination","word":"WASP"},{"def":"a unit of power equal to 1 joule per second; the power dissipated by a current of 1 ampere flowing across a resistance of 1 ohm","word":"WATT"},{"def":"uneven by virtue of having wrinkles or waves","word":"WAVY"},{"def":"easily impressed or influenced","word":"WAXY"},{"def":"gradually deprive (infants and young mammals) of mother's milk","word":"WEAN"},{"def":"street names for marijuana","word":"WEED"},{"def":"shed tears because of sadness, rage, or pain","word":"WEEP"},{"def":"European mignonette cultivated as a source of yellow dye; naturalized in North America","word":"WELD"},{"def":"beat severely with a whip or rod","word":"WELT"},{"def":"hit hard","word":"WHAM"},{"def":"make keen or more acute","word":"WHET"},{"def":"a sudden desire","word":"WHIM"},{"def":"make a soft swishing sound","word":"WHIR"},{"def":"make a soft swishing sound","word":"WHIZ"},{"def":"a loosely woven cord (in a candle or oil lamp) that draws fuel by capillary action up into the flame","word":"WICK"},{"def":"become limp","word":"WILT"},{"def":"marked by skill in deception","word":"WILY"},{"def":"a hypothetical subatomic particle of large mass that interacts weakly with ordinary matter through gravitation; postulated as a constituent of the dark matter of the universe","word":"WIMP"},{"def":"a very short time (as the time it takes the eye to blink or the heart to beat)","word":"WINK"},{"def":"a chronic drinker","word":"WINO"},{"def":"rub with a circular motion","word":"WIPE"},{"def":"lean and sinewy","word":"WIRY"},{"def":"a flock of snipe","word":"WISP"},{"def":"the basic human power of intelligent thought and perception","word":"WITS"},{"def":"a hollow muscular organ in the pelvic cavity of females; contains the developing fetus","word":"WOMB"},{"def":"an established custom","word":"WONT"},{"def":"the yarn woven across the warp yarn in weaving","word":"WOOF"},{"def":"showing the wearing effects of overwork or care or suffering","word":"WORN"},{"def":"arrange or fold as a cover or protection","word":"WRAP"},{"def":"English architect who designed more than fifty London churches (1632-1723)","word":"WREN"},{"def":"(law) a legal document issued by a court or judicial officer","word":"WRIT"},{"def":"pull, or move with a sudden movement","word":"YANK"},{"def":"a fine cord of twisted fibers (of cotton or silk or wool or nylon etc.) used in sewing and weaving","word":"YARN"},{"def":"an involuntary intake of breath through a wide open mouth; usually triggered by fatigue or boredom","word":"YAWN"},{"def":"not only so, but","word":"YEAH"},{"def":"utter a sudden loud cry","word":"YELL"},{"def":"a sharp high-pitched cry (especially by a dog)","word":"YELP"},{"def":"a system of physical, breathing and meditation exercises practiced to promote control of the body and mind","word":"YOGA"},{"def":"link with or as with a yoke","word":"YOKE"},{"def":"nutritive material of an ovum stored for the nutrition of an embryo (especially the yellow mass of a bird or reptile egg)","word":"YOLK"},{"def":"a man who is a stupid incompetent fool","word":"ZANY"},{"def":"prompt willingness","word":"ZEAL"},{"def":"a tart spicy quality","word":"ZEST"},{"def":"a bluish-white lustrous metallic element; brittle at ordinary temperatures but malleable when heated; used in a wide variety of alloys and in galvanizing iron; it occurs naturally as zinc sulphide in zinc blende","word":"ZINC"},{"def":"regulate housing in; of certain areas of towns","word":"ZONE"},{"def":"rise rapidly","word":"ZOOM"},{"def":"a sandal attached to the foot by a thong over the toes","word":"ZORI"},{"def":"a film made by photographing a series of cartoon drawings to give the illusion of movement when projected in rapid sequence","word":"TOON"},{"def":"a shared on-line journal where people can post diary entries about their personal experiences and hobbies","word":"BLOG"},{"def":"a coarse durable twill-weave cotton fabric","word":"JEAN"},{"def":"closed with a lace","word":"TIED"}];
    // console.log('allWords ' + $scope.allWords.length);
    // var tempArray = [];
    // for (var i = 0; i < $scope.allWords.length; i++) {
    //     if($scope.allWords[i].indexOf(".") == -1 && $scope.allWords[i].indexOf(",") == -1 && $scope.allWords[i].indexOf("'") == -1)
    //         tempArray.push("'"+$scope.allWords[i]+"'");
    // }
    // //console.log('allWords without .'+tempArray);
    // console.log('allWords without .'+tempArray.toString());
    // console.log('allWords without .'+tempArray.length); 

    // for (var i = 0; i < $scope.allWordsDetails.length; i++) {
    //     console.log("def --> "+$scope.allWordsDetails[i].def);
    //     console.log("pos --> "+$scope.allWordsDetails[i].pos);
    //     console.log("prn --> "+$scope.allWordsDetails[i].prn);
    // }   
    var scoreForBreak = 50;
    var currentIndex = 0;
    $scope.selectedletters = [];
    $scope.letters = [];
    $scope.currentWord = {};
    $scope.currentscore = 0;
    $scope.showletters = true;
    $scope.showwrong = false;
    $scope.showright = false;

    $scope.extraTime = 10; // 5 seconds

    // Round Progress settings start
    $scope.max = 60; //30 seconds
    $scope.seconds = $scope.max;
    $scope.offset = 'inherit';
    $scope.timerCurrent = 0;
    $scope.uploadCurrent = 0;
    $scope.stroke = 5;
    $scope.radius = 90;
    $scope.exitconfirmradius = 30;
    $scope.isSemi = false;
    $scope.rounded = true;
    $scope.responsive = 'responsive';
    $scope.clockwise = true;
    $scope.currentColor = '#01DF01';
    $scope.bgColor = '#000000';
    $scope.duration = 1000;
    $scope.currentAnimation = 'easeOutCubic';
    $scope.animationDelay = 0;
    $scope.delayToShowWord = 500; // 0.5 second
    // Round Progress settings end 

    //Ad placement

    $scope.bestscore = LocalStorageService.getBest();

    var vibrateShort = function() {
        VibrateService.short();
    };

    var vibrateMedium = function() {
        VibrateService.medium();
    };

    //$scope.gradient = true;
    // $scope.increment = function(amount) {
    //     $scope.current += (amount || 1);
    // };
    // $scope.decrement = function(amount) {
    //     $scope.current -= (amount || 1);
    // };
    //$scope.animations = [];
    // angular.forEach(roundProgressService.animations, function(value, key) {
    //     $scope.animations.push(key);
    // });

    ///// MOVING this to CSS to improve performance
    $scope.getStyle = function() {
        var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
        return {
            'top': $scope.isSemi ? 'auto' : '50%',
            'bottom': $scope.isSemi ? '5%' : 'auto',
            'left': '50%',
            'transform': transform,
            '-moz-transform': transform,
            '-webkit-transform': transform,
            'font-size': $scope.radius / 3.5 + 'px'
        };
    };

    $scope.getGameOverStyle = function() {
        var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
        var reduceAmount = 1;
        if ($scope.currentscore > 100 && $scope.currentscore < 1000)
            reduceAmount = 1.5;
        else if ($scope.currentscore > 999)
            reduceAmount = 1.75;
        return {
            'top': $scope.isSemi ? 'auto' : '50%',
            'bottom': $scope.isSemi ? '5%' : 'auto',
            'left': '50%',
            'transform': transform,
            '-moz-transform': transform,
            '-webkit-transform': transform,
            'font-size': $scope.radius / reduceAmount + 'px'
        };
    };

    $scope.getColor = function() {
        return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
    };
    // $scope.showPreciseCurrent = function(amount) {
    //     $timeout(function() {
    //         if (amount <= 0) {
    //             $scope.preciseCurrent = $scope.current;
    //         } else {
    //             var math = $window.Math;
    //             $scope.preciseCurrent = math.min(math.round(amount), $scope.max);
    //         }
    //     });
    // };
    // var getPadded = function(val) {
    //     return val < 10 ? ('0' + val) : val;
    // };


    var gameLoop;

    var triggerTimer = function() {
        // console.log('triggerTimer called');
        return $interval(function() {
            //console.log('triggerTimer interval called');
            if ($scope.seconds === 0) {
                $scope.stopTheGame();
                $scope.seconds = $scope.max;
            } else {
                $scope.seconds = $scope.seconds - 1;
            }
            if ($scope.seconds <= 30 && $scope.seconds > 15) {
                $scope.currentColor = '#FE9A2E';
            } else if ($scope.seconds <= 15) {
                $scope.currentColor = '#FE2E2E';
            } else {
                $scope.currentColor = '#01DF01';
            }

        }, 500);
    };

    // $ionicPopover.fromTemplateUrl('templates/break.html', {
    //     scope: $scope
    //   }).then(function(popover) {
    //     $scope.popover = popover;
    //   });


    gameLoop = triggerTimer();
    var gamePauseLoop;
    var gamePauseTimer;
    $scope.countDown = 60;
    var delayTime = 60;
    var _pauseTheGame = function(){
        showGamePauseAlert();
        if (gameLoop)
            $interval.cancel(gameLoop);
        //var countDown = 10;
        $scope.countDown = 60;
        gamePauseLoop = $interval(function(){
           // console.log('update time' + $scope.countDown--);
           $scope.countDown--;
        }, 1000, delayTime);
        gamePauseTimer = $timeout(function() {
                _resumeTheGame();
            }, delayTime*1000);
    };
    var gamePausePopup;
    var _resumeTheGame = function(){
       // console.log('_resumeTheGame called');
        if(gamePausePopup){
            gamePausePopup.close(false);
        }
        gameLoop = triggerTimer();
    };

    var resumeTheGameFromUser = function(){  
        //console.log('resumeTheGameFromUser called');      
        if(gamePauseLoop){
            $interval.cancel(gamePauseLoop);
        }
        if(gamePauseTimer){
            $timeout.cancel(gamePauseTimer);
        }
        gameLoop = triggerTimer();
    };


     var showGamePauseAlert = function() {
        gamePausePopup = $ionicPopup.alert({
         title: 'Break!',
         //template: 'It might taste good',
         templateUrl: 'break.html',
         okText: 'Let\'s Play',
          scope: $scope
       });
        var backButtonCallback = $ionicPlatform.registerBackButtonAction(function(event) {
 
        }, 401);
       gamePausePopup.then(function(res) {
        backButtonCallback();
        if(res === true){// true - user closed , false - auto closed
            resumeTheGameFromUser();
        }         
        // console.log('Thank you for not eating my delicious ice cream cone'+ res);
       });
     };  

    $scope.stopTheGame = function() {        
        if (gameLoop)
            $interval.cancel(gameLoop);
        $scope.currentColor = '#01DF01';
        if ($scope.currentscore !== 0 && $scope.bestscore == $scope.currentscore) {
            LocalStorageService.setBest($scope.bestscore);
        }
        $scope.gameOver();
    };

    $scope.letterclicked = function(letter) {
        // vibrateShort();
        if (letter.selected) {
            $scope.selectedletters.splice($scope.selectedletters.indexOf(letter), 1);
        } else {
            $scope.selectedletters.push(letter);
        }
        letter.selected = !letter.selected;
        // console.log("letter clicked..." + letter.letter + ' ' + letter.selected);
        if ($scope.selectedletters.length == 4) {
            checkWordValidity();
        }

    };

    $scope.selectedletterclicked = function(selectedletter) {
        if (selectedletter) {
            // vibrateShort();
            $scope.selectedletters.splice($scope.selectedletters.indexOf(selectedletter), 1);
            $scope.letters[$scope.letters.indexOf(selectedletter)].selected = false;
        }

    };


    var checkWordValidity = function() {
        var currentWord = $scope.currentWord.word;
        var wordToCheck = $scope.selectedletters[0].letter + $scope.selectedletters[1].letter + $scope.selectedletters[2].letter + $scope.selectedletters[3].letter;
        if (currentWord == wordToCheck || $scope.allWords.indexOf(wordToCheck) > -1) {
            _showRight();
            incrementSeconds();
            incrementScore();
            if($scope.currentscore%scoreForBreak ===0 ){
                _pauseTheGame();
            }
            $timeout(function() {
                $scope.selectedletters = [];
                _showNewLetters();
            }, $scope.delayToShowWord);

        } else {
            _showWrong();
            vibrateMedium();            

            $timeout(function() {
                angular.forEach($scope.letters, function(value, index) {
                    value.selected = false;
                });
                $scope.selectedletters = [];
                _showLetters();
            }, $scope.delayToShowWord);

        }
    };

    var incrementScore = function() {
        $scope.currentscore += 1;
        if ($scope.currentscore > $scope.bestscore) {
            $scope.bestscore = $scope.currentscore;
        }
    };

    var incrementSeconds = function() {
        var newSeconds = $scope.seconds + $scope.extraTime;
        if (newSeconds >= $scope.max) {
            $scope.seconds = $scope.max; // extra 3 seconds for right word
        } else {
            $scope.seconds = newSeconds;
        }
    };

    var _showRight = function() {
        $scope.showwrong = false;
        $scope.showletters = false;
        $scope.showright = true;
    };

    var _showWrong = function() {
        $scope.showletters = false;
        $scope.showright = false;
        $scope.showwrong = true;
    };

    var _showLetters = function() {
        $scope.showright = false;
        $scope.showwrong = false;
        $scope.showletters = true;
    };

    var _showNewLetters = function() {
        $scope.letters = getNewLetters();
        _showLetters();
    };

    var constructLettersArray = function(newWord){
        var letters = [];
        var newWordLen = newWord.length;
        for (var i = 0; i < newWordLen; i++) {
            letters[i] = {
                'letter': newWord[i],
                'selected': false
            };
        }
        return letters;
    };

    var getNewLetters = function() {
        
        var newWord = getRandomSuffledWord();
        // log('newWord ' + newWord);
        return constructLettersArray(newWord);
    };

    $scope.shuffleWordLetters = function(){
        vibrateShort();
        var newWord = shuffleLetters($scope.currentWord.word);
        $scope.letters = constructLettersArray(newWord);
    };

    function fisherYatesSuffleWordList()
    {
        var wordListlen = $scope.allWordsDetails.length;
        for (i = wordListlen-1; i > 1  ; i--)
        {
            var r = Math.floor(Math.random()*i);
            var t = $scope.allWordsDetails[i];
            $scope.allWordsDetails[i] = $scope.allWordsDetails[r];
            $scope.allWordsDetails[r] = t;
        }

       //console.log($scope.allWords);
    }
    

    var getRandomSuffledWord = function() {
        var randomWordObject = getRandomWord();
        // var randomWord = randomWordObject.word;
        // var def = randomWordObject.def;
        $scope.currentWord = randomWordObject; // store this for comparision
        console.log('randomWord ' + $scope.currentWord.word +' def '+$scope.currentWord.def);
        return shuffleLetters($scope.currentWord.word);
    };

    var getRandomWord = function() {
        //var randomIndex = getRandomIndex();
        if(currentIndex == $scope.allWordsDetails.length){
            fisherYatesSuffleWordList();
            currentIndex = 0;
        }       
        return $scope.allWordsDetails[currentIndex++];
    };

    // var getRandomIndex = function() {
    //     return getRandomInt(0, $scope.allWords.length - 1);
    // };

    // function getRandomInt(min, max) {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // }

    var shuffleLetters = function(word) {
        var wrd = word.split(""),
            n = wrd.length;

        for (var i = n - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = wrd[i];
            wrd[i] = wrd[j];
            wrd[j] = tmp;
        }
        return wrd.join("");
    };

    // var log = function(message) {
    //     console.log('message ->' + message);
    // };

    $ionicModal.fromTemplateUrl('templates/gameover.html', {
        id: 1,
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });

    $scope.closeGameOver = function() {
        $scope.modal.hide();
    };

    var rateTheApp = function() {
        document.addEventListener("deviceready", function() {
            $cordovaAppRate.promptForRating(false).then(function(result) {
                // success
            });
        }, false);
    };

    $scope.gameOver = function() {
        $scope.modal.show();
        //show rate the app dialog
        rateTheApp();
        $cordovaNativeAudio.stop('music');
        // show the interstitial later, e.g. at end of game level 
        // if(AdMob) {AdMob.showInterstitial();
        // 	//console.log("*******showing ad*************");
        // }
        // if(AdMob) {AdMob.prepareInterstitial( {adId:admobid.interstitial, isTesting: false, autoShow:false} ); 
        if(FacebookAds) FacebookAds.showInterstitial();
        if(FacebookAds) FacebookAds.prepareInterstitial( {adId:facebookid.interstitial, autoShow:false} );       
        // console.log("*******preparing ad*************");
    //}
        //StartAppAds.getBanner('myBannerLocation1');
        // setTimeout(function(){ Ads.getBanner('myBannerLocation1'); }, 2000);
    };

    $scope.playAgain = function() {
        $scope.closeGameOver();
        // log('play again');
        vibrateShort();
        //resetGame(); no need of this. because modal 1 hide event will trigger resetGame() :)        
    };

    $scope.showMeaning = function(){
        vibrateShort();
        var meaningPopup = $ionicPopup.alert({
         title: $scope.currentWord.word,
         //template: 'It might taste good',
         templateUrl: 'meaning.html',
         okText: 'Got it',
          scope: $scope
       });      

    };

    $scope.exitGame = function() {
        vibrateShort();
        // log('exit game');
        $scope.showexitconfirmmodal();
    };

    fisherYatesSuffleWordList();
    
    $scope.letters = getNewLetters();

    // $scope.letters = [{
    //             'letter': 'W',
    //             'selected': false
    //         },
    //         {
    //             'letter': 'O',
    //             'selected': false
    //         },
    //         {
    //             'letter': 'R',
    //             'selected': false
    //         },
    //         {
    //             'letter': 'D',
    //             'selected': false
    //         }];

    var resetGame = function() {
        $scope.selectedletters = [];
        fisherYatesSuffleWordList();
        currentIndex = 0;
        $scope.letters = getNewLetters();
        $scope.currentscore = 0;
        $scope.bestscore = LocalStorageService.getBest();
        $scope.showletters = true;
        $scope.showwrong = false;
        $scope.showright = false;
        $scope.seconds = $scope.max;
        gameLoop = triggerTimer();
        if (LocalStorageService.getMusicSetting()) {
            $cordovaNativeAudio.loop('music');            
        }
    };


    $ionicModal.fromTemplateUrl('templates/exitconfirm.html', {
        id: 2,
        scope: $scope
    }).then(function(modal) {
        $scope.exitconfirmmodal = modal;
    });

    $scope.showexitconfirmmodal = function() {
        $scope.exitconfirmmodal.show();
    };

    $scope.closeexitconfirmmodal = function() {
        $scope.exitconfirmmodal.hide();
    };

    $scope.finishTheGame = function() {
        vibrateShort();
        // log('finishTheGame');
        ionic.Platform.exitApp(); // finish the game
    };

    $scope.closeExitGameModal = function() {
        vibrateShort();
        $scope.closeexitconfirmmodal();
    };

    $scope.goHome = function() {
        vibrateShort();
        // Show the action sheet
        $ionicActionSheet.show({
            titleText: 'Go to Home?',
            buttons: [{
                text: '<b>Yes</b>'
            }],
            cancelText: 'No',
            cancel: function() {
                // log('canceled');
            },
            buttonClicked: function(index) {
                // console.log('BUTTON CLICKED', index);
                if (index === 0) {
                    $state.go('app.home');
                }
                return true;
            }
        });
    };




    $scope.musicOn = LocalStorageService.getMusicSetting();

    $scope.toggleMusic = function() {
        vibrateShort();
        $scope.musicOn = !$scope.musicOn;
        if ($scope.musicOn) {
            $cordovaNativeAudio.loop('music');
            // log('music On');
        } else {
            $cordovaNativeAudio.stop('music');
            // log('music Off');
        }
        LocalStorageService.setMusicSetting($scope.musicOn);
    };

    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        if (gameLoop){
            $interval.cancel(gameLoop);
        }
        if(gamePauseLoop){
            $interval.cancel(gamePauseLoop);
        }
        if(gamePauseTimer){
            $timeout.cancel(gamePauseTimer);
        }
        $cordovaNativeAudio.stop('music');
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function(event, modal) {
        // console.log('Modal ' + modal.id + ' is hidden!');
        if (modal.id == 1) {
            resetGame();
        }
    });

    $ionicModal.fromTemplateUrl('templates/rank.html', {
        id: 4,
        scope: $scope
    }).then(function(modal) {
        $scope.rankmodal = modal;
    });

    $scope.showrankmodal = function() {
        // if(AdMob) AdMob.hideBanner();
        $scope.rankmodal.show();
    };

    $scope.closerankmodal = function() {
        // if(AdMob) AdMob.showBanner(AdMob.AD_POSITION.BOTTOM_CENTER);
        $scope.rankmodal.hide();
    };

    $scope.goBack = function() {
        vibrateShort();
        $scope.closerankmodal();
    };



    $scope.showRank = function() {
        vibrateShort();
        if ($scope.rankmodal.isShown())
            return;
        $scope.showrankmodal();

        $scope.isOnline = NetworkService.isOnline();
        // $scope.isOnline = true;

        if ($scope.isOnline) {
            //Loader.showLoading();
            Loader.toggleLoadingWithMessage();
            if (!LocalStorageService.isBestScoreSubmitted()) {
                RankService.submitScore(LocalStorageService.getBest());
            }
            var FirebaseDB = new Firebase('https://wordrush.firebaseio.com/');
            FirebaseDB.orderByPriority().limitToLast(APP_CONSTANT.TOTAL_RANK_TO_SHOW).once('value', function(snapshot) {
                var rankList = [];

                snapshot.forEach(function(childSnapshot) {
                    //var childData = childSnapshot.val();
                    rankList.push({
                        'rank': 1,
                        'name': childSnapshot.val().name,
                        'score': childSnapshot.val().score
                    });
                    // console.log('childData ', childData);
                });

                rankList = rankList.reverse();

                rankList = RankService.rankThem(rankList);

                // Loader.hideLoading();
                $scope.$apply(function() {
                    $scope.rankList = rankList;
                });
                // console.log(rankList);
            });

            //var ref = new Firebase(storageService.getDatafromLS(APP_CONSTANT.FB_CHILD_LS_KEY));
            FirebaseDB.orderByPriority().startAt($scope.bestscore + 1).once("value", function(snapshot) {
                // console.log('numChildren ', snapshot.numChildren());
                $scope.$apply(function() {
                    $scope.myRank = snapshot.numChildren() + 1;
                });
            });
        }

    };



    if (LocalStorageService.getMusicSetting()) {
        $cordovaNativeAudio.loop('music');
    }


    // $timeout(function() {
    //                 $cordovaNativeAudio.stop('music');
    //             },  2000); 



})


.controller('HomeCtrl', function($scope, $timeout, storageService, $cordovaVibration, $ionicPopup, NetworkService, $cordovaSocialSharing, Loader, $ionicModal, VibrateService, $state, $cordovaNativeAudio, LocalStorageService, APP_CONSTANT, $ionicPlatform, RankService) {

    $scope.max = 60;
    $scope.offset = 'inherit';
    $scope.timerCurrent = 0;
    $scope.uploadCurrent = 0;
    $scope.stroke = 5;
    $scope.radius = 90;
    $scope.exitconfirmradius = 30;
    $scope.isSemi = false;
    $scope.rounded = true;
    $scope.responsive = 'responsive';
    $scope.clockwise = true;
    $scope.currentColor = '#01DF01';
    $scope.bgColor = '#000000';
    $scope.duration = 1000;
    $scope.currentAnimation = 'easeOutCubic';
    $scope.animationDelay = 0;
    $scope.seconds = $scope.max;

    $scope.bestscore = LocalStorageService.getBest();    

    $scope.getStyle = function() {
        var transform = ($scope.isSemi ? '' : 'translateY(-50%) ') + 'translateX(-50%)';
        var reduceAmount = 1;
        if ($scope.bestscore > 100 && $scope.bestscore < 1000)
            reduceAmount = 1.25;
        else if ($scope.bestscore > 999)
            reduceAmount = 1.5;
        return {
            'top': $scope.isSemi ? 'auto' : '50%',
            'bottom': $scope.isSemi ? '5%' : 'auto',
            'left': '50%',
            'transform': transform,
            '-moz-transform': transform,
            '-webkit-transform': transform,
            'font-size': $scope.radius / reduceAmount + 'px'
        };
    };

    $scope.getColor = function() {
        return $scope.gradient ? 'url(#gradient)' : $scope.currentColor;
    };

    $scope.play = function() {
        vibrateShort();

        $state.go('app.browse');
    };




    $scope.showRank = function() {
        vibrateShort();
        if ($scope.rankmodal.isShown())
            return;
        $scope.showrankmodal();

        $scope.isOnline = NetworkService.isOnline();
        // $scope.isOnline = true;
        if ($scope.isOnline) {
            //Loader.showLoading();
            Loader.toggleLoadingWithMessage();
            if (!LocalStorageService.isBestScoreSubmitted()) {
                RankService.submitScore(LocalStorageService.getBest());
            }
            var FirebaseDB = new Firebase('https://wordrush.firebaseio.com/');
            FirebaseDB.orderByPriority().limitToLast(APP_CONSTANT.TOTAL_RANK_TO_SHOW).once('value', function(snapshot) {
                var rankList = [];
                snapshot.forEach(function(childSnapshot) {
                    //var childData = childSnapshot.val();
                    rankList.push({
                        'rank': 1,
                        'name': childSnapshot.val().name,
                        'score': childSnapshot.val().score
                    });
                    //console.log('childData ', childData);
                });

                Loader.hideLoading();
                // for (var i = 0; i < 20; i++) {
                //     rankList.push({
                //         'name': 'dummydummy',
                //         'score': i
                //     });
                // }
                rankList = rankList.reverse();
                rankList = RankService.rankThem(rankList);
                $scope.$apply(function() {
                    $scope.rankList = rankList;
                });
                // console.log(rankList);
            });

            //var ref = new Firebase(storageService.getDatafromLS(APP_CONSTANT.FB_CHILD_LS_KEY));
            FirebaseDB.orderByPriority().startAt($scope.bestscore + 1).once("value", function(snapshot) {
                // console.log('numChildren ', snapshot.numChildren());
                $scope.$apply(function() {
                    $scope.myRank = snapshot.numChildren() + 1;
                });
            });
        }

    };

    $scope.shareApp = function() {
        vibrateShort();
        var message = "An interesting word game to kill your time. Give it a try.";
        var subject = "Word Rush";
        var link = "https://play.google.com/store/apps/details?id=com.word.rush";
        $cordovaSocialSharing
            .share(message, subject, null, link) // Share via native share sheet
        .then(function(result) {
            // Success!
        }, function(err) {
            // An error occured. Show a message to the user
        });
    };

    $ionicModal.fromTemplateUrl('templates/rank.html', {
        id: 3,
        scope: $scope
    }).then(function(modal) {
        $scope.rankmodal = modal;
    });

    $scope.showrankmodal = function() {
        $scope.rankmodal.show();
    };

    $scope.closerankmodal = function() {
        vibrateShort();
        $scope.rankmodal.hide();
    };

    $scope.goBack = function() {
        $scope.closerankmodal();
    };

    $ionicPlatform.ready(function() {
        $cordovaNativeAudio
            .preloadComplex('music', 'audio/ocean-drift_background.mp3', 1, 1)
            .then(function(msg) {
                console.log(msg);
            }, function(error) {
                console.error(error);
            });
    });

    var vibrateShort = function() {
        VibrateService.short();
    };

    var _changeName = function() {

        var username = RankService.getUserName();
        $scope.user = {
            'name': username
        };

        
        var myPopup = $ionicPopup.show({
            template: '<input type="text"  maxlength="15" ng-model="user.name">',
            title: 'Enter Your Name',
            subTitle: 'To show in rank list (max-15 chars)',
            scope: $scope,
            buttons: [{
                text: 'Cancel'
            }, {
                text: '<b>Save</b>',
                type: 'button-balanced',
                onTap: function(e) {
                    if (!$scope.user.name) {
                        //don't allow the user to close unless he enters name
                        e.preventDefault();
                    } else {
                        return $scope.user.name;
                    }
                }
            }, ]
        });
        myPopup.then(function(res) {
            // console.log('Tapped!', res);
            if (res && res.length > 0)
                storageService.setDataToLS(APP_CONSTANT.USERNAME_LS_KEY, res.trim().substring(0, 15));
                storageService.setDataToLS(APP_CONSTANT.BEST_CHECK_LS_KEY, { // so that name will be synced with firebase before getting Rank
                    'bestscore_submitted': false
                });
        });

    };

    $scope.changeName = function() {
        vibrateShort();
        _changeName();
    };

    if (!LocalStorageService.isNameChanged()) {
        _changeName();
    }


// var admobid = {};
     
//       admobid = {            
//             interstitial: 'ca-app-pub-1204262321700562/9653073534'
//         };
         
//          $timeout(function() {
//                $ionicPlatform.ready(function() {
//        if(AdMob) AdMob.prepareInterstitial( {adId:admobid.interstitial, isTesting: false, autoShow:false} );
// });
//             }, 5000);

   

});