// frontend/src/data/playerImageMapping.ts

/**
 * Mapping between player names in the database and image filenames
 * Key: Player name as stored in database (any variation)
 * Value: Image filename (without extension)
 */
export const playerImageMapping: Record<string, string> = {
  // ==================== INDIAN PLAYERS ====================
  'Virat Kohli': 'virat-kohli',
  'Sachin Tendulkar': 'sachin-tendulkar',
  'Sachin Ramesh Tendulkar': 'sachin-tendulkar',
  'Mahendra Singh Dhoni': 'ms-dhoni',
  'MS Dhoni': 'ms-dhoni',
  'M S Dhoni': 'ms-dhoni',
  'Rohit Sharma': 'rohit-sharma',
  'Rohit Gurunath Sharma': 'rohit-sharma',
  'Jasprit Bumrah': 'jasprit-bumrah',
  'Jasprit Jasbir Singh Bumrah': 'jasprit-bumrah',
  'Hardik Pandya': 'hardik-pandya',
  'Hardik Himanshu Pandya': 'hardik-pandya',
  'Ravindra Jadeja': 'ravindra-jadeja',
  'Ravindrasinh Anirudhsinh Jadeja': 'ravindra-jadeja',
  'KL Rahul': 'kl-rahul',
  'Kannaur Lokesh Rahul': 'kl-rahul',
  'Shubman Gill': 'shubman-gill',
  'Suryakumar Yadav': 'suryakumar-yadav',
  'Mohammed Shami': 'mohammed-shami',
  'Mohammed Shami Ahmed': 'mohammed-shami',
  'Rishabh Pant': 'rishabh-pant',
  'Rishabh Rajendra Pant': 'rishabh-pant',
  'Shreyas Iyer': 'shreyas-iyer',
  'Shreyas Santosh Iyer': 'shreyas-iyer',
  'Sanju Samson': 'sanju-samson',
  'Sanju Viswanath Samson': 'sanju-samson',
  'Yuzvendra Chahal': 'yuzvendra-chahal',
  'Kuldeep Yadav': 'kuldeep-yadav',
  'Kuldeep Singh Yadav': 'kuldeep-yadav',
  'Mohammed Siraj': 'mohammed-siraj',
  'Mohammed Siraj Anwar': 'mohammed-siraj',
  'Ishan Kishan': 'ishan-kishan',
  'Deepak Chahar': 'deepak-chahar',
  'Deepak Lokendr Singh Chahar': 'deepak-chahar',
  'Shardul Thakur': 'shardul-thakur',
  'Shardul Narendra Thakur': 'shardul-thakur',
  'Washington Sundar': 'washington-sundar',
  'Washington Sundar Varadarajan': 'washington-sundar',
  'Axar Patel': 'axar-patel',
  'Akshar Rajeshbhai Patel': 'axar-patel',
  
  // Indian Legends
  'Rahul Dravid': 'rahul-dravid',
  'Rahul Sharad Dravid': 'rahul-dravid',
  'Virender Sehwag': 'virender-sehwag',
  'Virender Singh Sehwag': 'virender-sehwag',
  'Sourav Ganguly': 'sourav-ganguly',
  'Sourav Chandidas Ganguly': 'sourav-ganguly',
  'Anil Kumble': 'anil-kumble',
  'Anil Radhakrishna Kumble': 'anil-kumble',
  'Harbhajan Singh': 'harbhajan-singh',
  'Harbhajan Singh Plaha': 'harbhajan-singh',
  'Kapil Dev': 'kapil-dev',
  'Kapil Dev Ramlal Nikhanj': 'kapil-dev',
  'Zaheer Khan': 'zaheer-khan',
  'Zaheer Khan Saheb': 'zaheer-khan',
  'Sunil Gavaskar': 'sunil-gavaskar',
  'Sunil Manohar Gavaskar': 'sunil-gavaskar',
  'Yuvraj Singh': 'yuvraj-singh',
  'Yuvraj Singh Yuvraj': 'yuvraj-singh',
  'VVS Laxman': 'vvs-laxman',
  'Vangipurapu Venkata Sai Laxman': 'vvs-laxman',
  'Gautam Gambhir': 'gautam-gambhir',
  'Gautam Vinod Gambhir': 'gautam-gambhir',

  // ==================== AUSTRALIAN PLAYERS ====================
  'David Warner': 'david-warner',
  'David Andrew Warner': 'david-warner',
  'Steve Smith': 'steve-smith',
  'Steven Peter Devereux Smith': 'steve-smith',
  'Pat Cummins': 'pat-cummins',
  'Patrick James Cummins': 'pat-cummins',
  'Mitchell Starc': 'mitchell-starc',
  'Mitchell Aaron Starc': 'mitchell-starc',
  'Glenn Maxwell': 'glenn-maxwell',
  'Glenn James Maxwell': 'glenn-maxwell',
  'Adam Zampa': 'adam-zampa',
  'Adam James Zampa': 'adam-zampa',
  'Josh Hazlewood': 'josh-hazlewood',
  'Joshua Reginald Hazlewood': 'josh-hazlewood',
  'Kane Williamson': 'kane-williamson',
  'Trent Boult': 'trent-boult',
  'Mitchell Marsh': 'mitchell-marsh',
  'Mitchell Ross Marsh': 'mitchell-marsh',
  'Marcus Stoinis': 'marcus-stoinis',
  'Marcus Thomas Stoinis': 'marcus-stoinis',
  'Tim David': 'tim-david',
  'Cameron Green': 'cameron-green',
  'Shane Watson': 'shane-watson',
  'Shane Robert Watson': 'shane-watson',
  'Ricky Ponting': 'ricky-ponting',
  'Adam Gilchrist': 'adam-gilchrist',
  'Shane Warne': 'shane-warne',
  'Brett Lee': 'brett-lee',
  'Glenn McGrath': 'glenn-mcgrath',

  // ==================== ENGLISH PLAYERS ====================
  'Joe Root': 'joe-root',
  'Joseph Edward Root': 'joe-root',
  'Ben Stokes': 'ben-stokes',
  'Benjamin Andrew Stokes': 'ben-stokes',
  'Jos Buttler': 'jos-buttler',
  'Joseph Charles Buttler': 'jos-buttler',
  'Jonny Bairstow': 'jonny-bairstow',
  'Jonathan Marc Bairstow': 'jonny-bairstow',
  'Liam Livingstone': 'liam-livingstone',
  'Liam Stephen Livingstone': 'liam-livingstone',
  'Sam Curran': 'sam-curran',
  'Samuel Matthew Curran': 'sam-curran',
  'Moeen Ali': 'moheen-ali',
  'Moeen Munir Ali': 'moheen-ali', 
  'James Anderson': 'james-anderson',
  'James Michael Anderson': 'james-anderson',
  'Stuart Broad': 'stuart-broad',
  'Stuart Christopher John Broad': 'stuart-broad',
  'Jofra Archer': 'jofra-archer',
  'Jofra Chioke Archer': 'jofra-archer',
  'Harry Brook': 'harry-brook',
  'Will Jacks': 'will-jacks',

  // ==================== SOUTH AFRICAN PLAYERS ====================
  'AB de Villiers': 'ab-de-villiers',
  'Abraham Benjamin de Villiers': 'ab-de-villiers',
  'Dale Steyn': 'dale-steyn',
  'Dale Willem Steyn': 'dale-steyn',
  'David Miller': 'david-miller',
  'David Andrew Miller': 'david-miller',
  'Quinton de Kock': 'quinton-de-kock',
  'Kagiso Rabada': 'kagiso-rabada',
  'Anrich Nortje': 'anrich-nortje',
  'Anrich Arno Nortje': 'anrich-nortje',
  'Heinrich Klaasen': 'heinrich-klaasen',
  'Marco Jansen': 'marco-jansen',
  'Jacques Kallis': 'jacques-kallis',
  'Jacques Henry Kallis': 'jacques-kallis',
  'Graeme Smith': 'graeme-smith',
  'Graeme Craig Smith': 'graeme-smith',
  'Herschelle Gibbs': 'herschelle-gibbs',
  'Hashim Amla': 'hashim-amla',

  // ==================== NEW ZEALAND PLAYERS ====================
  'Tim Southee': 'tim-southee',
  'Timothy Grant Southee': 'tim-southee',
  'Mitchell Santner': 'mitchell-santner',
  'Mitchell Josef Santner': 'mitchell-santner',
  'Daryl Mitchell': 'daryl-mitchell',
  'Daryl Joseph Mitchell': 'daryl-mitchell',
  'Jimmy Neesham': 'jimmy-neesham',
  'James David Neesham': 'jimmy-neesham',
  'Ross Taylor': 'ross-taylor',
  'Lockie Ferguson': 'lockie-ferguson',
  'Brendon McCullum': 'brendon-mccullum',
  'Martin Guptill': 'martin-guptill',

  // ==================== PAKISTANI PLAYERS ====================
  'Babar Azam': 'babar-azam',
  'Mohammad Rizwan': 'mohammad-rizwan',
  'Shaheen Afridi': 'shaheen-afridi',
  'Shadab Khan': 'shadab-khan',
  'Haris Rauf': 'haris-rauf',
  'Wasim Akram': 'wasim-akram',
  'Waqar Younis': 'waqar-younis',
  'Shoaib Akhtar': 'shoaib-akhtar',
  'Imran Khan': 'imran-khan',
  'Inzamam-ul-Haq': 'inzamam-ul-haq',
  'Shahid Afridi': 'shahid-afridi',

  // ==================== SRI LANKAN PLAYERS ====================
  'Kumar Sangakkara': 'kumar-sangakkara',
  'Lasith Malinga': 'lasith-malinga',
  'Angelo Mathews': 'angelo-mathews',
  'Mahela Jayawardene': 'mahela-jayawardene',
  'Muttiah Muralitharan': 'muttiah-muralitharan',
  'Sanath Jayasuriya': 'sanath-jayasuriya',
  'Chaminda Vaas': 'chaminda-vaas',
  'Dilshan Madushanka': 'dilshan-madushanka',
  'Matheesha Pathirana': 'matheesha-pathirana',

  // ==================== WEST INDIES PLAYERS ====================
  'Chris Gayle': 'chris-gayle',
  'Andre Russell': 'andre-russell',
  'Kieron Pollard': 'kieron-pollard',
  'Dwayne Bravo': 'dwayne-bravo',
  'Sunil Narine': 'sunil-narine',
  'Nicholas Pooran': 'nicholas-pooran',
  'Shimron Hetmyer': 'shimron-hetmyer',
  'Jason Holder': 'jason-holder',
  'Brian Lara': 'brian-lara',
  'Vivian Richards': 'vivian-richards',
  'Curtly Ambrose': 'curtly-ambrose',

  // ==================== BANGLADESH PLAYERS ====================
  'Shakib Al Hasan': 'shakib-al-hasan',
  'Mushfiqur Rahim': 'mushfiqur-rahim',
  'Mustafizur Rahman': 'mustafizur-rahman',
  'Taskin Ahmed': 'taskin-ahmed',
  'Mahmudullah Riyad': 'mahmudullah-riyad',
  'Litton Das': 'litton-das',
  'Najmul Hossain Shanto': 'najmul-shanto',

  // ==================== AFGHANISTAN PLAYERS ====================
  'Rashid Khan': 'rashid-khan',
  'Mohammad Nabi': 'mohammad-nabi',
  'Rahmanullah Gurbaz': 'rahmanullah-gurbaz',
  'Mujeeb Ur Rahman': 'mujeeb-ur-rahman',
  'Noor Ahmad': 'noor-ahmad',
  'Azmatullah Omarzai': 'azmatullah-omarzai',
  'Fazalhaq Farooqi': 'fazalhaq-farooqi',
};

/**
 * Get image filename for a player
 * @param playerName - Player name as stored in database
 * @returns Image filename (without extension)
 */
export const getPlayerImageFilename = (playerName: string): string => {
  if (!playerName) return 'default';
  
  // Check if there's a mapping for this player
  if (playerImageMapping[playerName]) {
    return playerImageMapping[playerName];
  }
  
  // Try case-insensitive matching
  const lowerName = playerName.toLowerCase();
  for (const [key, value] of Object.entries(playerImageMapping)) {
    if (key.toLowerCase() === lowerName) {
      return value;
    }
  }

  return playerName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/\./g, '')
    .replace(/[^a-z0-9-]/g, '');
};