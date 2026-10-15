const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const EC = require('elliptic').ec;

const ec = new EC('secp256k1');
const PORT = 8080;
const HITS_FILE = path.join(__dirname, 'puzzle_hits.json');
const WALLETS_FILE = path.join(__dirname, 'found_wallets.json');

// ── BIP39 Wordlist ──

const WORDLIST = ["abandon","ability","able","about","above","absent","absorb","abstract","absurd","abuse","access","accident","account","accuse","achieve","acid","acoustic","acquire","across","act","action","actor","actress","actual","adapt","add","addict","address","adjust","admit","adult","advance","advice","aerobic","affair","afford","afraid","again","age","agent","agree","ahead","aim","air","airport","aisle","alarm","album","alcohol","alert","alien","all","alley","allow","almost","alone","alpha","already","also","alter","always","amateur","amazing","among","amount","amused","analyst","anchor","ancient","anger","angle","angry","animal","ankle","announce","annual","another","answer","antenna","antique","anxiety","any","apart","apology","appear","apple","approve","april","arch","arctic","area","arena","argue","arm","armed","armor","army","around","arrange","arrest","arrive","arrow","art","artefact","artist","artwork","ask","aspect","assault","asset","assist","assume","asthma","athlete","atom","attack","attend","attitude","attract","auction","audit","august","aunt","author","auto","autumn","average","avocado","avoid","awake","aware","away","awesome","awful","awkward","axis","baby","bachelor","bacon","badge","bag","balance","balcony","ball","bamboo","banana","banner","bar","barely","bargain","barrel","base","basic","basket","battle","beach","bean","beauty","because","become","beef","before","begin","behave","behind","believe","below","belt","bench","benefit","best","betray","better","between","beyond","bicycle","bid","bike","bind","biology","bird","birth","bitter","black","blade","blame","blanket","blast","bleak","bless","blind","blood","blossom","blouse","blue","blur","blush","board","boat","body","boil","bomb","bone","bonus","book","boost","border","boring","borrow","boss","bottom","bounce","box","boy","bracket","brain","brand","brass","brave","bread","breeze","brick","bridge","brief","bright","bring","brisk","broccoli","broken","bronze","broom","brother","brown","brush","bubble","buddy","budget","buffalo","build","bulb","bulk","bullet","bundle","bunker","burden","burger","burst","bus","business","busy","butter","buyer","buzz","cabbage","cabin","cable","cactus","cage","cake","call","calm","camera","camp","can","canal","cancel","candy","cannon","canoe","canvas","canyon","capable","capital","captain","car","carbon","card","cargo","carpet","carry","cart","case","cash","casino","castle","casual","cat","catalog","catch","category","cattle","caught","cause","caution","cave","ceiling","celery","cement","census","century","cereal","certain","chair","chalk","champion","change","chaos","chapter","charge","chase","chat","cheap","check","cheese","chef","cherry","chest","chicken","chief","child","chimney","choice","choose","chronic","chuckle","chunk","churn","cigar","cinnamon","circle","citizen","city","civil","claim","clap","clarify","claw","clay","clean","clerk","clever","click","client","cliff","climb","clinic","clip","clock","clog","close","cloth","cloud","clown","club","clump","cluster","clutch","coach","coast","coconut","code","coffee","coil","coin","collect","color","column","combine","come","comfort","comic","common","company","concert","conduct","confirm","congress","connect","consider","control","convince","cook","cool","copper","copy","coral","core","corn","correct","cost","cotton","couch","country","couple","course","cousin","cover","coyote","crack","cradle","craft","cram","crane","crash","crater","crawl","crazy","cream","credit","creek","crew","cricket","crime","crisp","critic","crop","cross","crouch","crowd","crucial","cruel","cruise","crumble","crunch","crush","cry","crystal","cube","culture","cup","cupboard","curious","current","curtain","curve","cushion","custom","cute","cycle","dad","damage","damp","dance","danger","daring","dash","daughter","dawn","day","deal","debate","debris","decade","december","decide","decline","decorate","decrease","deer","defense","define","defy","degree","delay","deliver","demand","demise","denial","dentist","deny","depart","depend","deposit","depth","deputy","derive","describe","desert","design","desk","despair","destroy","detail","detect","develop","device","devote","diagram","dial","diamond","diary","dice","diesel","diet","differ","digital","dignity","dilemma","dinner","dinosaur","direct","dirt","disagree","discover","disease","dish","dismiss","disorder","display","distance","divert","divide","divorce","dizzy","doctor","document","dog","doll","dolphin","domain","donate","donkey","donor","door","dose","double","dove","draft","dragon","drama","drastic","draw","dream","dress","drift","drill","drink","drip","drive","drop","drum","dry","duck","dumb","dune","during","dust","dutch","duty","dwarf","dynamic","eager","eagle","early","earn","earth","easily","east","easy","echo","ecology","economy","edge","edit","educate","effort","egg","eight","either","elbow","elder","electric","elegant","element","elephant","elevator","elite","else","embark","embody","embrace","emerge","emotion","employ","empower","empty","enable","enact","end","endless","endorse","enemy","energy","enforce","engage","engine","enhance","enjoy","enlist","enough","enrich","enroll","ensure","enter","entire","entry","envelope","episode","equal","equip","era","erase","erode","erosion","error","erupt","escape","essay","essence","estate","eternal","ethics","evidence","evil","evoke","evolve","exact","example","excess","exchange","excite","exclude","excuse","execute","exercise","exhaust","exhibit","exile","exist","exit","exotic","expand","expect","expire","explain","expose","express","extend","extra","eye","eyebrow","fabric","face","faculty","fade","faint","faith","fall","false","fame","family","famous","fan","fancy","fantasy","farm","fashion","fat","fatal","father","fatigue","fault","favorite","feature","february","federal","fee","feed","feel","female","fence","festival","fetch","fever","few","fiber","fiction","field","figure","file","film","filter","final","find","fine","finger","finish","fire","firm","first","fiscal","fish","fit","fitness","fix","flag","flame","flash","flat","flavor","flee","flight","flip","float","flock","floor","flower","fluid","flush","fly","foam","focus","fog","foil","fold","follow","food","foot","force","forest","forget","fork","fortune","forum","forward","fossil","foster","found","fox","fragile","frame","frequent","fresh","friend","fringe","frog","front","frost","frown","frozen","fruit","fuel","fun","funny","furnace","fury","future","gadget","gain","galaxy","gallery","game","gap","garage","garbage","garden","garlic","garment","gas","gasp","gate","gather","gauge","gaze","general","genius","genre","gentle","genuine","gesture","ghost","giant","gift","giggle","ginger","giraffe","girl","give","glad","glance","glare","glass","glide","glimpse","globe","gloom","glory","glove","glow","glue","goat","goddess","gold","good","goose","gorilla","gospel","gossip","govern","gown","grab","grace","grain","grant","grape","grass","gravity","great","green","grid","grief","grit","grocery","group","grow","grunt","guard","guess","guide","guilt","guitar","gun","gym","habit","hair","half","hammer","hamster","hand","happy","harbor","hard","harsh","harvest","hat","have","hawk","hazard","head","health","heart","heavy","hedgehog","height","hello","helmet","help","hen","hero","hidden","high","hill","hint","hip","hire","history","hobby","hockey","hold","hole","holiday","hollow","home","honey","hood","hope","horn","horror","horse","hospital","host","hotel","hour","hover","hub","huge","human","humble","humor","hundred","hungry","hunt","hurdle","hurry","hurt","husband","hybrid","ice","icon","idea","identify","idle","ignore","ill","illegal","illness","image","imitate","immense","immune","impact","impose","improve","impulse","inch","include","income","increase","index","indicate","indoor","industry","infant","inflict","inform","inhale","inherit","initial","inject","injury","inmate","inner","innocent","input","inquiry","insane","insect","inside","inspire","install","intact","interest","into","invest","invite","involve","iron","island","isolate","issue","item","ivory","jacket","jaguar","jar","jazz","jealous","jeans","jelly","jewel","job","join","joke","journey","joy","judge","juice","jump","jungle","junior","junk","just","kangaroo","keen","keep","ketchup","key","kick","kid","kidney","kind","kingdom","kiss","kit","kitchen","kite","kitten","kiwi","knee","knife","knock","know","lab","label","labor","ladder","lady","lake","lamp","language","laptop","large","later","latin","laugh","laundry","lava","law","lawn","lawsuit","layer","lazy","leader","leaf","learn","leave","lecture","left","leg","legal","legend","leisure","lemon","lend","length","lens","leopard","lesson","letter","level","liar","liberty","library","license","life","lift","light","like","limb","limit","link","lion","liquid","list","little","live","lizard","load","loan","lobster","local","lock","logic","lonely","long","loop","lottery","loud","lounge","love","loyal","lucky","luggage","lumber","lunar","lunch","luxury","lyrics","machine","mad","magic","magnet","maid","mail","main","major","make","mammal","man","manage","mandate","mango","mansion","manual","maple","marble","march","margin","marine","market","marriage","mask","mass","master","match","material","math","matrix","matter","maximum","maze","meadow","mean","measure","meat","mechanic","medal","media","melody","melt","member","memory","mention","menu","mercy","merge","merit","merry","mesh","message","metal","method","middle","midnight","milk","million","mimic","mind","minimum","minor","minute","miracle","mirror","misery","miss","mistake","mix","mixed","mixture","mobile","model","modify","mom","moment","monitor","monkey","monster","month","moon","moral","more","morning","mosquito","mother","motion","motor","mountain","mouse","move","movie","much","muffin","mule","multiply","muscle","museum","mushroom","music","must","mutual","myself","mystery","myth","naive","name","napkin","narrow","nasty","nation","nature","near","neck","need","negative","neglect","neither","nephew","nerve","nest","net","network","neutral","never","news","next","nice","night","noble","noise","nominee","noodle","normal","north","nose","notable","note","nothing","notice","novel","now","nuclear","number","nurse","nut","oak","obey","object","oblige","obscure","observe","obtain","obvious","occur","ocean","october","odor","off","offer","office","often","oil","okay","old","olive","olympic","omit","once","one","onion","online","only","open","opera","opinion","oppose","option","orange","orbit","orchard","order","ordinary","organ","orient","original","orphan","ostrich","other","outdoor","outer","output","outside","oval","oven","over","own","owner","oxygen","oyster","ozone","pact","paddle","page","pair","palace","palm","panda","panel","panic","panther","paper","parade","parent","park","parrot","party","pass","patch","path","patient","patrol","pattern","pause","pave","payment","peace","peanut","pear","peasant","pelican","pen","penalty","pencil","people","pepper","perfect","permit","person","pet","phone","photo","phrase","physical","piano","picnic","picture","piece","pig","pigeon","pill","pilot","pink","pioneer","pipe","pistol","pitch","pizza","place","planet","plastic","plate","play","please","pledge","pluck","plug","plunge","poem","poet","point","polar","pole","police","pond","pony","pool","popular","portion","position","possible","post","potato","pottery","poverty","powder","power","practice","praise","predict","prefer","prepare","present","pretty","prevent","price","pride","primary","print","priority","prison","private","prize","problem","process","produce","profit","program","project","promote","proof","property","prosper","protect","proud","provide","public","pudding","pull","pulp","pulse","pumpkin","punch","pupil","puppy","purchase","purity","purpose","purse","push","put","puzzle","pyramid","quality","quantum","quarter","question","quick","quit","quiz","quote","rabbit","raccoon","race","rack","radar","radio","rail","rain","raise","rally","ramp","ranch","random","range","rapid","rare","rate","rather","raven","raw","razor","ready","real","reason","rebel","rebuild","recall","receive","recipe","record","recycle","reduce","reflect","reform","refuse","region","regret","regular","reject","relax","release","relief","rely","remain","remember","remind","remove","render","renew","rent","reopen","repair","repeat","replace","report","require","rescue","resemble","resist","resource","response","result","retire","retreat","return","reunion","reveal","review","reward","rhythm","rib","ribbon","rice","rich","ride","ridge","rifle","right","rigid","ring","riot","ripple","risk","ritual","rival","river","road","roast","robot","robust","rocket","romance","roof","rookie","room","rose","rotate","rough","round","route","royal","rubber","rude","rug","rule","run","runway","rural","sad","saddle","sadness","safe","sail","salad","salmon","salon","salt","salute","same","sample","sand","satisfy","satoshi","sauce","sausage","save","say","scale","scan","scare","scatter","scene","scheme","school","science","scissors","scorpion","scout","scrap","screen","script","scrub","sea","search","season","seat","second","secret","section","security","seed","seek","segment","select","sell","seminar","senior","sense","sentence","series","service","session","settle","setup","seven","shadow","shaft","shallow","share","shed","shell","sheriff","shield","shift","shine","ship","shiver","shock","shoe","shoot","shop","short","shoulder","shove","shrimp","shrug","shuffle","shy","sibling","sick","side","siege","sight","sign","silent","silk","silly","silver","similar","simple","since","sing","siren","sister","situate","six","size","skate","sketch","ski","skill","skin","skirt","skull","slab","slam","sleep","slender","slice","slide","slight","slim","slogan","slot","slow","slush","small","smart","smile","smoke","smooth","snack","snake","snap","sniff","snow","soap","soccer","social","sock","soda","soft","solar","soldier","solid","solution","solve","someone","song","soon","sorry","sort","soul","sound","soup","source","south","space","spare","spatial","spawn","speak","special","speed","spell","spend","sphere","spice","spider","spike","spin","spirit","split","spoil","sponsor","spoon","sport","spot","spray","spread","spring","spy","square","squeeze","squirrel","stable","stadium","staff","stage","stairs","stamp","stand","start","state","stay","steak","steel","stem","step","stereo","stick","still","sting","stock","stomach","stone","stool","story","stove","strategy","street","strike","strong","struggle","student","stuff","stumble","style","subject","submit","subway","success","such","sudden","suffer","sugar","suggest","suit","summer","sun","sunny","sunset","super","supply","supreme","sure","surface","surge","surprise","surround","survey","suspect","sustain","swallow","swamp","swap","swarm","swear","sweet","swift","swim","swing","switch","sword","symbol","symptom","syrup","system","table","tackle","tag","tail","talent","talk","tank","tape","target","task","taste","tattoo","taxi","teach","team","tell","ten","tenant","tennis","tent","term","test","text","thank","that","theme","then","theory","there","they","thing","this","thought","three","thrive","throw","thumb","thunder","ticket","tide","tiger","tilt","timber","time","tiny","tip","tired","tissue","title","toast","tobacco","today","toddler","toe","together","toilet","token","tomato","tomorrow","tone","tongue","tonight","tool","tooth","top","topic","topple","torch","tornado","tortoise","toss","total","tourist","toward","tower","town","toy","track","trade","traffic","tragic","train","transfer","trap","trash","travel","tray","treat","tree","trend","trial","tribe","trick","trigger","trim","trip","trophy","trouble","truck","true","truly","trumpet","trust","truth","try","tube","tuition","tumble","tuna","tunnel","turkey","turn","turtle","twelve","twenty","twice","twin","twist","two","type","typical","ugly","umbrella","unable","unaware","uncle","uncover","under","undo","unfair","unfold","unhappy","uniform","unique","unit","universe","unknown","unlock","until","unusual","unveil","update","upgrade","uphold","upon","upper","upset","urban","urge","usage","use","used","useful","useless","usual","utility","vacant","vacuum","vague","valid","valley","valve","van","vanish","vapor","various","vast","vault","vehicle","velvet","vendor","venture","venue","verb","verify","version","very","vessel","veteran","viable","vibrant","vicious","victory","video","view","village","vintage","violin","virtual","virus","visa","visit","visual","vital","vivid","vocal","voice","void","volcano","volume","vote","voyage","wage","wagon","wait","walk","wall","walnut","want","warfare","warm","warrior","wash","wasp","waste","water","wave","way","wealth","weapon","wear","weasel","weather","web","wedding","weekend","weird","welcome","west","wet","whale","what","wheat","wheel","when","where","whip","whisper","wide","width","wife","wild","will","win","window","wine","wing","wink","winner","winter","wire","wisdom","wise","wish","witness","wolf","woman","wonder","wood","wool","word","work","world","worry","worth","wrap","wreck","wrestle","wrist","write","wrong","yard","year","yellow","you","young","youth","zebra","zero","zone","zoo"];

// ── Chain configs ──

const CHAINS = [
  { id:'btc',  sym:'BTC',  coinType:0,   type:'btc', ver:0x00, dec:8,  bal:'mempool', api:'https://blockstream.info/api' },
  { id:'ltc',  sym:'LTC',  coinType:2,   type:'btc', ver:0x30, dec:8,  bal:'mempool', api:'https://litecoinspace.org/api' },
  { id:'doge', sym:'DOGE', coinType:3,   type:'btc', ver:0x1e, dec:8,  bal:'blockchair', net:'dogecoin' },
  { id:'dash', sym:'DASH', coinType:5,   type:'btc', ver:0x4c, dec:8,  bal:'blockchair', net:'dash' },
  { id:'trx',  sym:'TRX',  coinType:195, type:'trx', dec:6,    bal:'trongrid' },
  { id:'eth',  sym:'ETH',  coinType:60,  type:'evm', dec:18, rpc:'https://ethereum-rpc.publicnode.com' },
  { id:'bsc',  sym:'BNB',  coinType:60,  type:'evm', dec:18, rpc:'https://bsc-dataseed.binance.org' },
  { id:'pol',  sym:'POL',  coinType:60,  type:'evm', dec:18, rpc:'https://polygon-bor-rpc.publicnode.com' },
  { id:'avax', sym:'AVAX', coinType:60,  type:'evm', dec:18, rpc:'https://api.avax.network/ext/bc/C/rpc' },
  { id:'arb',  sym:'ETH',  coinType:60,  type:'evm', dec:18, rpc:'https://arb1.arbitrum.io/rpc' },
  { id:'op',   sym:'ETH',  coinType:60,  type:'evm', dec:18, rpc:'https://mainnet.optimism.io' },
  { id:'base', sym:'ETH',  coinType:60,  type:'evm', dec:18, rpc:'https://mainnet.base.org' },
  { id:'ftm',  sym:'FTM',  coinType:60,  type:'evm', dec:18, rpc:'https://rpcapi.fantom.network' },
];

const TOKENS = [
  { sym:'USDT', contracts:{ eth:'0xdAC17F958D2ee523a2206206994597C13D831ec7', bsc:'0x55d398326f99059fF775485246999027B3197955', pol:'0xc2132D05D31c914a87C6611C10748AEb04B58e8F', avax:'0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7', arb:'0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9', op:'0x94b008aA00579c1307B0EF2c499aD98a8ce58e58', ftm:'0x049d68029688eAbF473097a2fC38ef61633A3C7A', trx:'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' }, decimals:{ bsc:18, _default:6 }},
  { sym:'USDC', contracts:{ eth:'0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', bsc:'0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d', pol:'0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359', avax:'0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E', arb:'0xaf88d065e77c8cC2239327C5EDb3A432268e5831', op:'0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85', base:'0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', ftm:'0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', trx:'TEkxiTehnzSmSe2XqrBj4w32RUN966rdz8' }, decimals:{ bsc:18, _default:6 }},
];

// ── Puzzle addresses ──

const PUZZLES = [
  {n:71,addr:'1PWo3JeB9jrGwfHDNpdGK54CRas7fsVzXU',btc:7.1},{n:72,addr:'1JTK7s9YVYywfm5XUH7RNhHJH1LshCaRFR',btc:7.2},{n:73,addr:'12VVRNPi4SJqUTsp6FmqDqY5sGosDtysn4',btc:7.3},{n:74,addr:'1FWGcVDK3JGzCC3WtkYetULPszMaK2Jksv',btc:7.4},{n:76,addr:'1DJh2eHFYQfACPmrvpyWc8MSTYKh7w9eRF',btc:7.6},{n:77,addr:'1Bxk4CQdqL9p22JEtDfdXMsng1XacifUtE',btc:7.7},{n:78,addr:'15qF6X51huDjqTmF9BJgxXdt1xcj46Jmhb',btc:7.8},{n:79,addr:'1ARk8HWJMn8js8tQmGUJeQHjSE7KRkn2t8',btc:7.9},{n:81,addr:'15qsCm78whspNQFydGJQk5rexzxTQopnHZ',btc:8.1},{n:82,addr:'13zYrYhhJxp6Ui1VV7pqa5WDhNWM45ARAC',btc:8.2},{n:83,addr:'14MdEb4eFcT3MVG5sPFG4jGLuHJSnt1Dk2',btc:8.3},{n:84,addr:'1CMq3SvFcVEcpLMuuH8PUcNiqsK1oicG2D',btc:8.4},{n:86,addr:'1K3x5L6G57Y494fDqBfrojD28UJv4s5JcK',btc:8.6},{n:87,addr:'1PxH3K1Shdjb7gSEoTX7UPDZ6SH4qGPrvq',btc:8.7},{n:88,addr:'16AbnZjZZipwHMkYKBSfswGWKDmXHjEpSf',btc:8.8},{n:89,addr:'19QciEHbGVNY4hrhfKXmcBBCrJSBZ6TaVt',btc:8.9},{n:91,addr:'1EzVHtmbN4fs4MiNk3ppEnKKhsmXYJ4s74',btc:9.1},{n:92,addr:'1AE8NzzgKE7Yhz7BWtAcAAxiFMbPo82NB5',btc:9.2},{n:93,addr:'17Q7tuG2JwFFU9rXVj3uZqRtioH3mx2Jad',btc:9.3},{n:94,addr:'1K6xGMUbs6ZTXBnhw1pippqwK6wjBWtNpL',btc:9.4},{n:96,addr:'15ANYzzCp5BFHcCnVFzXqyibpzgPLWaD8b',btc:9.6},{n:97,addr:'18ywPwj39nGjqBrQJSzZVq2izR12MDpDr8',btc:9.7},{n:98,addr:'1CaBVPrwUxbQYYswu32w7Mj4HR4maNoJSX',btc:9.8},{n:99,addr:'1JWnE6p6UN7ZJBN7TtcbNDoRcjFtuDWoNL',btc:9.9},{n:101,addr:'1CKCVdbDJasYmhswB6HKZHEAnNaDpK7W4n',btc:10.1},{n:102,addr:'1PXv28YxmYMaB8zxrKeZBW8dt2HK7RkRPX',btc:10.2},{n:103,addr:'1AcAmB6jmtU6AiEcXkmiNE9TNVPsj9DULf',btc:10.3},{n:104,addr:'1EQJvpsmhazYCcKX5Au6AZmZKRnzarMVZu',btc:10.4},{n:106,addr:'18KsfuHuzQaBTNLASyj15hy4LuqPUo1FNB',btc:10.6},{n:107,addr:'15EJFC5ZTs9nhsdvSUeBXjLAuYq3SWaxTc',btc:10.7},{n:108,addr:'1HB1iKUqeffnVsvQsbpC6dNi1XKbyNuqao',btc:10.8},{n:109,addr:'1GvgAXVCbA8FBjXfWiAms4ytFeJcKsoyhL',btc:10.9},{n:111,addr:'1824ZJQ7nKJ9QFTRBqn7z7dHV5EGpzUpH3',btc:11.1},{n:112,addr:'18A7NA9FTsnJxWgkoFfPAFbQzuQxpRtCos',btc:11.2},{n:113,addr:'1NeGn21dUDDeqFQ63xb2SpgUuXuBLA4WT4',btc:11.3},{n:114,addr:'174SNxfqpdMGYy5YQcfLbSTK3MRNZEePoy',btc:11.4},{n:116,addr:'1MnJ6hdhvK37VLmqcdEwqC3iFxyWH2PHUV',btc:11.6},{n:117,addr:'1KNRfGWw7Q9Rmwsc6NT5zsdvEb9M2Wkj5Z',btc:11.7},{n:118,addr:'1PJZPzvGX19a7twf5HyD2VvNiPdHLzm9F6',btc:11.8},{n:119,addr:'1GuBBhf61rnvRe4K8zu8vdQB3kHzwFqSy7',btc:11.9},{n:121,addr:'1GDSuiThEV64c166LUFC9uDcVdGjqkxKyh',btc:12.1},{n:122,addr:'1Me3ASYt5JCTAK2XaC32RMeH34PdprrfDx',btc:12.2},{n:123,addr:'1CdufMQL892A69KXgv6UNBD17ywWqYpKut',btc:12.3},{n:124,addr:'1BkkGsX9ZM6iwL3zbqs7HWBV7SvosR6m8N',btc:12.4},{n:126,addr:'1AWCLZAjKbV1P7AHvaPNCKiB7ZWVDMxFiz',btc:12.6},{n:127,addr:'1G6EFyBRU86sThN3SSt3GrHu1sA7w7nzi4',btc:12.7},{n:128,addr:'1MZ2L1gFrCtkkn6DnTT2e4PFUTHw9gNwaj',btc:12.8},{n:129,addr:'1Hz3uv3nNZzBVMXLGadCucgjiCs5W9vaGz',btc:12.9},{n:131,addr:'16zRPnT8znwq42q7XeMkZUhb1bKqgRogyy',btc:13.1},{n:132,addr:'1KrU4dHE5WrW8rhWDsTRjR21r8t3dsrS3R',btc:13.2},{n:133,addr:'17uDfp5r4n441xkgLFmhNoSW1KWp6xVLD',btc:13.3},{n:134,addr:'13A3JrvXmvg5w9XGvyyR4JEJqiLz8ZySY3',btc:13.4},{n:136,addr:'1UDHPdovvR985NrWSkdWQDEQ1xuRiTALq',btc:13.6},{n:137,addr:'15nf31J46iLuK1ZkTnqHo7WgN5cARFK3RA',btc:13.7},{n:138,addr:'1Ab4vzG6wEQBDNQM1B2bvUz4fqXXdFk2WT',btc:13.8},{n:139,addr:'1Fz63c775VV9fNyj25d9Xfw3YHE6sKCxbt',btc:13.9},{n:140,addr:'1QKBaU6WAeycb3DbKbLBkX7vJiaS8r42Xo',btc:14.0},{n:141,addr:'1CD91Vm97mLQvXhrnoMChhJx4TP9MaQkJo',btc:14.1},{n:142,addr:'15MnK2jXPqTMURX4xC3h4mAZxyCcaWWEDD',btc:14.2},{n:143,addr:'13N66gCzWWHEZBxhVxG18P8wyjEWF9Yoi1',btc:14.3},{n:144,addr:'1NevxKDYuDcCh1ZMMi6ftmWwGrZKC6j7Ux',btc:14.4},{n:145,addr:'19GpszRNUej5yYqxXoLnbZWKew3KdVLkXg',btc:14.5},{n:146,addr:'1M7ipcdYHey2Y5RZM34MBbpugghmjaV89P',btc:14.6},{n:147,addr:'18aNhurEAJsw6BAgtANpexk5ob1aGTwSeL',btc:14.7},{n:148,addr:'1FwZXt6EpRT7Fkndzv6K4b4DFoT4trbMrV',btc:14.8},{n:149,addr:'1CXvTzR6qv8wJ7eprzUKeWxyGcHwDYP1i2',btc:14.9},{n:150,addr:'1MUJSJYtGPVGkBCTqGspnxyHahpt5Te8jy',btc:15.0},{n:151,addr:'13Q84TNNvgcL3HJiqQPvyBb9m4hxjS3jkV',btc:15.1},{n:152,addr:'1LuUHyrQr8PKSvbcY1v1PiuGuqFjWpDumN',btc:15.2},{n:153,addr:'18192XpzzdDi2K11QVHR7td2HcPS6Qs5vg',btc:15.3},{n:154,addr:'1NgVmsCCJaKLzGyKLFJfVequnFW9ZvnMLN',btc:15.4},{n:155,addr:'1AoeP37TmHdFh8uN72fu9AqgtLrUwcv2wJ',btc:15.5},{n:156,addr:'1FTpAbQa4h8trvhQXjXnmNhqdiGBd1oraE',btc:15.6},{n:157,addr:'14JHoRAdmJg3XR4RjMDh6Wed6ft6hzbQe9',btc:15.7},{n:158,addr:'19z6waranEf8CcP8FqNgdwUe1QRxvUNKBG',btc:15.8},{n:159,addr:'14u4nA5sugaswb6SZgn5av2vuChdMnD9E5',btc:15.9},{n:160,addr:'1NBC8uXJy1GiJ6drkiZa1WuKn51ps7EPTv',btc:16.0},
];

const PUZZLE_ADDR_SET = new Set(PUZZLES.map(p => p.addr));
const PUZZLE_BY_ADDR = new Map(PUZZLES.map(p => [p.addr, p]));

// ── Funded address set (Hash160 hex Set for O(1) lookup) ──

const HASH160_FILE = path.join(__dirname, 'funded_hash160.bin');
let fundedBuf = null;
let fundedCount = 0;

function loadFundedAddresses() {
  try {
    if (!fs.existsSync(HASH160_FILE)) { console.log('funded_hash160.bin not found, skipping'); return; }
    fundedBuf = fs.readFileSync(HASH160_FILE);
    fundedCount = fundedBuf.length / 20;
    console.log(`Loaded ${fundedCount.toLocaleString()} funded address hash160s (${(fundedBuf.length / 1024 / 1024).toFixed(0)} MB, binary search)`);
  } catch (e) { console.error('Failed to load funded addresses:', e.message); }
}

function checkFundedHash160(h160) {
  if (!fundedBuf) return false;
  const needle = Buffer.isBuffer(h160) ? h160 : Buffer.from(h160, 'hex');
  let lo = 0, hi = fundedCount - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const off = mid * 20;
    let cmp = 0;
    for (let i = 0; i < 20; i++) {
      cmp = fundedBuf[off + i] - needle[i];
      if (cmp !== 0) break;
    }
    if (cmp === 0) return true;
    if (cmp < 0) lo = mid + 1;
    else hi = mid - 1;
  }
  return false;
}

loadFundedAddresses();

// ── Crypto helpers ──

const BASE58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

function base58Encode(buf) {
  const d = [0];
  for (let i = 0; i < buf.length; i++) {
    let c = buf[i];
    for (let j = 0; j < d.length; j++) { c += d[j] << 8; d[j] = c % 58; c = (c / 58) | 0; }
    while (c) { d.push(c % 58); c = (c / 58) | 0; }
  }
  let s = '';
  for (let i = 0; i < buf.length && buf[i] === 0; i++) s += BASE58[0];
  for (let i = d.length - 1; i >= 0; i--) s += BASE58[d[i]];
  return s;
}

function base58Check(ver, hash160) {
  const v = Buffer.alloc(21); v[0] = ver; hash160.copy(v, 1);
  const c = crypto.createHash('sha256').update(crypto.createHash('sha256').update(v).digest()).digest();
  return base58Encode(Buffer.concat([v, c.subarray(0, 4)]));
}

function pubToAddr(pubBuf, ver) {
  const sha = crypto.createHash('sha256').update(pubBuf).digest();
  const h160 = crypto.createHash('ripemd160').update(sha).digest();
  return base58Check(ver, h160);
}

function pubPointToAddr(point) {
  const pub = Buffer.from(point.encode('array', true));
  return pubToAddr(pub, 0x00);
}

function privateKeyToAddress(keyBuf) {
  const key = ec.keyFromPrivate(keyBuf);
  return pubPointToAddr(key.getPublic());
}

// ── BIP39 mnemonic generation ──

function entropyToMnemonic(entropy) {
  const hash = crypto.createHash('sha256').update(entropy).digest();
  const bits = Array.from(entropy).map(b => b.toString(2).padStart(8, '0')).join('');
  const checkBits = Array.from(hash).map(b => b.toString(2).padStart(8, '0')).join('').slice(0, entropy.length / 4);
  const all = bits + checkBits;
  const words = [];
  for (let i = 0; i < all.length; i += 11) words.push(WORDLIST[parseInt(all.slice(i, i + 11), 2)]);
  return words.join(' ');
}

function generateMnemonic() {
  return entropyToMnemonic(crypto.randomBytes(16));
}

// ── HD key derivation (BIP32/44) ──

function hmacSHA512(key, data) { return crypto.createHmac('sha512', key).update(data).digest(); }

function deriveMasterKey(seed) {
  const I = hmacSHA512('Bitcoin seed', seed);
  return { key: I.subarray(0, 32), chainCode: I.subarray(32) };
}

function deriveChild(parentKey, parentChain, index) {
  const hardened = index >= 0x80000000;
  let data;
  if (hardened) {
    data = Buffer.alloc(37); data[0] = 0; parentKey.copy(data, 1); data.writeUInt32BE(index, 33);
  } else {
    const pub = Buffer.from(ec.keyFromPrivate(parentKey).getPublic(true, 'array'));
    data = Buffer.alloc(37); pub.copy(data, 0); data.writeUInt32BE(index, 33);
  }
  const I = hmacSHA512(parentChain, data);
  const ki = ec.keyFromPrivate(I.subarray(0, 32)).getPrivate().add(ec.keyFromPrivate(parentKey).getPrivate()).umod(ec.n);
  return { key: Buffer.from(ki.toArray('be', 32)), chainCode: I.subarray(32) };
}

function derivePath(seed, pathStr) {
  let { key, chainCode } = deriveMasterKey(seed);
  for (const part of pathStr.replace('m/', '').split('/')) {
    const hardened = part.endsWith("'");
    const child = deriveChild(key, chainCode, parseInt(part) + (hardened ? 0x80000000 : 0));
    key = child.key; chainCode = child.chainCode;
  }
  return key;
}

function mnemonicToSeed(mnemonic) { return crypto.pbkdf2Sync(mnemonic, 'mnemonic', 2048, 64, 'sha512'); }

function deriveAddresses(mnemonic) {
  const seed = mnemonicToSeed(mnemonic);
  const addrs = {};
  for (const c of CHAINS.filter(c => c.type === 'btc')) {
    const key = derivePath(seed, `m/44'/${c.coinType}'/0'/0/0`);
    addrs[c.id] = pubToAddr(Buffer.from(ec.keyFromPrivate(key).getPublic(true, 'array')), c.ver);
  }
  const trxKey = derivePath(seed, "m/44'/195'/0'/0/0");
  const trxPub = Buffer.from(ec.keyFromPrivate(trxKey).getPublic(false, 'array')).subarray(1);
  addrs.trx = base58Check(0x41, crypto.createHash('sha3-256').update(trxPub).digest().subarray(12));
  const evmKey = derivePath(seed, "m/44'/60'/0'/0/0");
  const evmPub = Buffer.from(ec.keyFromPrivate(evmKey).getPublic(false, 'array')).subarray(1);
  const evmAddr = '0x' + crypto.createHash('sha3-256').update(evmPub).digest().subarray(12).toString('hex');
  for (const c of CHAINS.filter(c => c.type === 'evm')) addrs[c.id] = evmAddr;
  return addrs;
}

// ── HTTP fetch helper ──

function fetchJSON(url, opts = {}) {
  return new Promise((resolve, reject) => {
    const lib = url.startsWith('https') ? https : http;
    const req = lib.request(url, { method: opts.method || 'GET', headers: opts.headers || {}, timeout: 10000 }, res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => { try { resolve(JSON.parse(data)); } catch { reject(new Error('Bad JSON')); } });
    });
    req.on('error', reject);
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

// ── Balance checking ──

async function checkBtcBalance(address) {
  try {
    const d = await fetchJSON(`https://blockstream.info/api/address/${address}`);
    return ((d.chain_stats.funded_txo_sum || 0) - (d.chain_stats.spent_txo_sum || 0)) / 1e8;
  } catch { return 0; }
}

async function checkEvmBalance(rpc, address, dec) {
  try {
    const d = await fetchJSON(rpc, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_getBalance', params: [address, 'latest'] }) });
    return d.error ? 0 : Number(BigInt(d.result)) / (10 ** dec);
  } catch { return 0; }
}

async function checkMempoolBalance(api, address) {
  try {
    const d = await fetchJSON(`${api}/address/${address}`);
    return ((d.chain_stats.funded_txo_sum || 0) - (d.chain_stats.spent_txo_sum || 0)) / 1e8;
  } catch { return 0; }
}

async function checkBlockchairBalance(net, address) {
  try {
    const d = await fetchJSON(`https://api.blockchair.com/${net}/dashboards/address/${address}?limit=0`);
    return ((d.data && d.data[address] && d.data[address].address.balance) || 0) / 1e8;
  } catch { return 0; }
}

async function checkTronBalance(address) {
  try {
    const d = await fetchJSON(`https://api.trongrid.io/v1/accounts/${address}`);
    if (!d.data || !d.data.length) return { native: 0, tokens: {} };
    const tokens = {};
    if (d.data[0].trc20) for (const entry of d.data[0].trc20) for (const [c, b] of Object.entries(entry)) tokens[c] = Number(b);
    return { native: (d.data[0].balance || 0) / 1e6, tokens };
  } catch { return { native: 0, tokens: {} }; }
}

async function checkErc20(rpc, wallet, contract, dec) {
  try {
    const data = '0x70a08231' + wallet.slice(2).toLowerCase().padStart(64, '0');
    const d = await fetchJSON(rpc, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: contract, data }, 'latest'] }) });
    return Number(BigInt(d.result || '0x0')) / (10 ** dec);
  } catch { return 0; }
}

async function checkAllBalances(addrs) {
  const results = {};
  for (const chain of CHAINS) {
    const addr = addrs[chain.id];
    if (!addr) continue;
    await new Promise(r => setTimeout(r, 100));
    try {
      if (chain.type === 'trx') {
        const info = await checkTronBalance(addr);
        if (info.native > 0) results[chain.sym] = info.native;
        for (const token of TOKENS) {
          const contract = token.contracts.trx;
          if (contract && info.tokens[contract]) {
            const val = info.tokens[contract] / (10 ** token.decimals._default);
            if (val > 0) results[`${token.sym}(TRX)`] = val;
          }
        }
      } else if (chain.type === 'evm') {
        const bal = await checkEvmBalance(chain.rpc, addr, chain.dec);
        if (bal > 0) results[`${chain.sym}(${chain.id})`] = bal;
        for (const token of TOKENS) {
          const contract = token.contracts[chain.id];
          if (!contract) continue;
          const val = await checkErc20(chain.rpc, addr, contract, token.decimals[chain.id] || token.decimals._default);
          if (val > 0) results[`${token.sym}(${chain.id})`] = val;
        }
      } else if (chain.bal === 'mempool') {
        const bal = await checkMempoolBalance(chain.api, addr);
        if (bal > 0) results[chain.sym] = bal;
      } else if (chain.bal === 'blockchair') {
        const bal = await checkBlockchairBalance(chain.net, addr);
        if (bal > 0) results[chain.sym] = bal;
      }
    } catch {}
  }
  return results;
}

// ── SSE ──

const sseClients = new Set();
function broadcast(data) {
  const msg = `data: ${JSON.stringify(data)}\n\n`;
  for (const res of sseClients) { try { res.write(msg); } catch { sseClients.delete(res); } }
}

// ── State ──

let walletChecked = 0;
let puzzleHits = [];
let foundWallets = [];
try { puzzleHits = JSON.parse(fs.readFileSync(HITS_FILE, 'utf8')); } catch {}
try { foundWallets = JSON.parse(fs.readFileSync(WALLETS_FILE, 'utf8')); } catch {}

// ══════════════════════════════════════════
// ── PUZZLE SEARCH ──
// ══════════════════════════════════════════

const methods = {
  random: { name: 'Random Brute', checked: 0, speed: 0, _keysThisSec: 0, status: 'active', target: 'all 77 puzzles' },
};

function recordHit(method, puzzleNum, btc, privateKeyHex, address) {
  const hit = { method, puzzleNum, btc, privateKey: privateKeyHex, address, timestamp: Date.now() };
  puzzleHits.push(hit);
  fs.writeFileSync(HITS_FILE, JSON.stringify(puzzleHits, null, 2));
  broadcast({ type: 'puzzle_hit', ...hit });
  console.log(`\n!!! PUZZLE #${puzzleNum} SOLVED!!! ${btc} BTC — Key: ${privateKeyHex}\n`);
}

function randomKeyInRange(bits) {
  const key = Buffer.alloc(32);
  const rand = crypto.randomBytes(32);
  const fullBytes = Math.floor(bits / 8);
  const extraBits = bits % 8;
  const start = 32 - fullBytes - (extraBits ? 1 : 0);
  rand.copy(key, start, start, 32);
  if (extraBits) {
    key[start] = key[start] & ((1 << extraBits) - 1);
    key[start] = key[start] | (1 << (extraBits - 1));
  } else {
    key[32 - fullBytes] = key[32 - fullBytes] | 0x80;
  }
  return key;
}

function puzzleBatch() {
  const BATCH = 500;
  for (let i = 0; i < BATCH; i++) {
    const p = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    const key = randomKeyInRange(p.n);
    const pub = Buffer.from(ec.keyFromPrivate(key).getPublic(true, 'array'));
    const sha = crypto.createHash('sha256').update(pub).digest();
    const h160 = crypto.createHash('ripemd160').update(sha).digest();
    const addr = base58Check(0x00, h160);
    methods.random.checked++;
    methods.random._keysThisSec++;
    if (PUZZLE_ADDR_SET.has(addr)) {
      const pi = PUZZLE_BY_ADDR.get(addr);
      recordHit('random', pi.n, pi.btc, key.toString('hex'), addr);
    }
    if (fundedBuf && checkFundedHash160(h160)) {
      console.log(`\n!!! FUNDED ADDRESS HIT !!! Key: ${key.toString('hex')} Addr: ${addr}\n`);
      recordHit('random-funded', 0, 0, key.toString('hex'), addr);
    }
  }
  setImmediate(puzzleBatch);
}

// ── Stats ticker ──

setInterval(() => {
  for (const m of Object.values(methods)) {
    m.speed = m._keysThisSec;
    m._keysThisSec = 0;
  }

  broadcast({
    type: 'stats',
    puzzleChecked: methods.random.checked,
    puzzleSpeed: methods.random.speed,
    walletChecked,
    puzzleHits: puzzleHits.length,
    foundWallets: foundWallets.length,
    uptime: process.uptime() | 0,
    methods: Object.fromEntries(Object.entries(methods).map(([id, m]) => [id, {
      name: m.name, checked: m.checked, speed: m.speed, status: m.status, target: m.target
    }])),
  });
}, 1000);

// ── Start puzzle engine ──

console.log('Starting puzzle search (random brute force, 77 puzzles)...');
puzzleBatch();

// ── Wallet generation loop ──

async function walletLoop() {
  while (true) {
    try {
      const mnemonic = generateMnemonic();
      const addrs = deriveAddresses(mnemonic);
      walletChecked++;
      broadcast({ type: 'wallet_gen', num: walletChecked, mnemonic, addrs });
      const balances = await checkAllBalances(addrs);
      const hasFunds = Object.keys(balances).length > 0;
      broadcast({ type: 'wallet_checked', num: walletChecked, mnemonic, balances, hasFunds });
      if (hasFunds) {
        const entry = { mnemonic, addrs, balances, timestamp: Date.now() };
        foundWallets.push(entry);
        fs.writeFileSync(WALLETS_FILE, JSON.stringify(foundWallets, null, 2));
        broadcast({ type: 'wallet_found', ...entry });
        console.log(`\n!!! WALLET WITH BALANCE !!! ${mnemonic}\nBalances: ${JSON.stringify(balances)}\n`);
      }
    } catch (e) {
      console.error('Wallet loop error:', e.message);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

console.log('Starting wallet generator (13 chains + tokens)...');
walletLoop();

// ── HTTP server ──

const server = http.createServer((req, res) => {
  if (req.url === '/api/stream') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
    const totalChecked = Object.values(methods).reduce((s, m) => s + m.checked, 0);
    res.write(`data: ${JSON.stringify({
      type: 'init', puzzleChecked: totalChecked, puzzleSpeed: 0, walletChecked, puzzleHits, foundWallets,
      uptime: process.uptime() | 0,
      methods: Object.fromEntries(Object.entries(methods).map(([id, m]) => [id, { name: m.name, checked: m.checked, speed: m.speed, status: m.status, target: m.target }])),
    })}\n\n`);
    sseClients.add(res);
    req.on('close', () => sseClients.delete(res));
    return;
  }

  if (req.url === '/api/stats') {
    res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
    const totalChecked = Object.values(methods).reduce((s, m) => s + m.checked, 0);
    return res.end(JSON.stringify({ puzzleChecked: totalChecked, walletChecked, puzzleHits, foundWallets, uptime: process.uptime() | 0, methods, fundedAddrs: fundedCount }));
  }

  // Check hash160(s) against funded address set — POST {hash160s: ["hex",...]}
  if (req.url === '/api/check-addr' && req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      try {
        const { hash160s } = JSON.parse(body);
        if (!Array.isArray(hash160s) || hash160s.length > 100) {
          return res.end(JSON.stringify({ error: 'max 100 per request' }));
        }
        const hits = [];
        for (const hex of hash160s) {
          const buf = Buffer.from(hex, 'hex');
          if (buf.length === 20 && checkFundedHash160(buf)) {
            const addr = base58Check(0x00, buf);
            const puzzle = PUZZLE_BY_ADDR.get(addr);
            hits.push({ hash160: hex, address: addr, puzzle: puzzle || null });
          }
        }
        res.end(JSON.stringify({ hits, checked: hash160s.length }));
      } catch (e) {
        res.end(JSON.stringify({ error: e.message }));
      }
    });
    return;
  }

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' });
    return res.end();
  }

  let filePath = req.url === '/' ? '/bip39-generator.html' : req.url;
  filePath = path.join(__dirname, filePath);
  const ext = path.extname(filePath);
  const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json', '.bin': 'application/octet-stream' };
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
    res.end(data);
  });
});

server.listen(PORT, () => console.log(`Server live on port ${PORT}`));
