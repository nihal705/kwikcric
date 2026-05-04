// frontend/src/pages/Games/CricketMastermind/logic/smartRecognition.ts

// Common misspellings and aliases
export const playerMappings: Record<string, string> = {
    // Misspellings
    'Sachin Tendulker': 'Sachin Tendulkar',
    'Sachin Tendulkar': 'Sachin Tendulkar',
    'Virat Kohlii': 'Virat Kohli',
    'Virat Kohli': 'Virat Kohli',
    'Kholi': 'Virat Kohli',
    'Kohli': 'Virat Kohli',
    'MSD': 'MS Dhoni',
    'Dhoni': 'MS Dhoni',
    'M S Dhoni': 'MS Dhoni',
    'ABD': 'AB de Villiers',
    'AB de Villiers': 'AB de Villiers',
    'Rohit': 'Rohit Sharma',
    'Sharma': 'Rohit Sharma',
    'VK': 'Virat Kohli',
    'RS': 'Rohit Sharma',
    'SKY': 'Suryakumar Yadav',
    'SKY Yadav': 'Suryakumar Yadav',
    'JB': 'Jasprit Bumrah',
    'Boom': 'Jasprit Bumrah',
    'Hitman': 'Rohit Sharma',
    'King Kohli': 'Virat Kohli',
    'Captain Cool': 'MS Dhoni',
    'Mr. IPL': 'Suresh Raina',
    'Universal Boss': 'Chris Gayle',
    'Gayle': 'Chris Gayle',
    'Warner': 'David Warner',
    'Kane': 'Kane Williamson',
    'Smith': 'Steve Smith',
    'Root': 'Joe Root',
    'Williamson': 'Kane Williamson',
    'Stokes': 'Ben Stokes',
    'Bumrah': 'Jasprit Bumrah',
    'Shami': 'Mohammed Shami',
    'Jadeja': 'Ravindra Jadeja',
    'Ashwin': 'Ravichandran Ashwin',
    'Pant': 'Rishabh Pant',
    'Rahul': 'KL Rahul',
    'Gill': 'Shubman Gill',
    'Iyer': 'Shreyas Iyer',
    'Kishan': 'Ishan Kishan',
    'Pandya': 'Hardik Pandya',
    'Samson': 'Sanju Samson',
    'Dube': 'Shivam Dube',
    'Thakur': 'Shardul Thakur',
    'Chahar': 'Deepak Chahar',
    'Siraj': 'Mohammed Siraj',
    'Malik': 'Umran Malik',
    'Khan': 'Rashid Khan',
    'Narine': 'Sunil Narine',
    'Russell': 'Andre Russell',
    'Pollard': 'Kieron Pollard',
    'Bravo': 'Dwayne Bravo',
    'Malinga': 'Lasith Malinga',
    'Steyn': 'Dale Steyn',
    'Boult': 'Trent Boult',
    'Rabada': 'Kagiso Rabada',
    'Cummins': 'Pat Cummins',
    'Starc': 'Mitchell Starc',
    'Hazlewood': 'Josh Hazlewood',
    'Warne': 'Shane Warne',
    'Lara': 'Brian Lara',
    'Ponting': 'Ricky Ponting',
    'Kallis': 'Jacques Kallis',
    'Sangakkara': 'Kumar Sangakkara',
    'Jayawardene': 'Mahela Jayawardene',
    'Muralitharan': 'Muttiah Muralitharan',
    'Akram': 'Wasim Akram',
    'Waqar': 'Waqar Younis',
    'Imran': 'Imran Khan',
    'Miandad': 'Javed Miandad'
};

// Team name mappings
export const teamMappings: Record<string, string> = {
    'RCB': 'Royal Challengers Bangalore',
    'Royal Challengers': 'Royal Challengers Bangalore',
    'Bangalore': 'Royal Challengers Bangalore',
    'MI': 'Mumbai Indians',
    'Mumbai': 'Mumbai Indians',
    'CSK': 'Chennai Super Kings',
    'Chennai': 'Chennai Super Kings',
    'KKR': 'Kolkata Knight Riders',
    'Kolkata': 'Kolkata Knight Riders',
    'SRH': 'Sunrisers Hyderabad',
    'Hyderabad': 'Sunrisers Hyderabad',
    'DC': 'Delhi Capitals',
    'Delhi': 'Delhi Capitals',
    'RR': 'Rajasthan Royals',
    'Rajasthan': 'Rajasthan Royals',
    'PBKS': 'Punjab Kings',
    'Punjab': 'Punjab Kings',
    'KXIP': 'Punjab Kings',
    'LSG': 'Lucknow Super Giants',
    'Lucknow': 'Lucknow Super Giants',
    'GT': 'Gujarat Titans',
    'Gujarat': 'Gujarat Titans',
    'RPS': 'Rising Pune Supergiants',
    'GL': 'Gujarat Lions'
};

// Country name mappings
export const countryMappings: Record<string, string> = {
    'IND': 'India',
    'AUS': 'Australia',
    'ENG': 'England',
    'SA': 'South Africa',
    'NZ': 'New Zealand',
    'PAK': 'Pakistan',
    'SL': 'Sri Lanka',
    'WI': 'West Indies',
    'BAN': 'Bangladesh',
    'AFG': 'Afghanistan',
    'ZIM': 'Zimbabwe',
    'IRE': 'Ireland',
    'UAE': 'United Arab Emirates',
    'NEP': 'Nepal',
    'NAM': 'Namibia',
    'SCOT': 'Scotland',
    'NED': 'Netherlands'
};

export const normalizeText = (input: string): string => {
    if (!input) return '';
    let normalized = input.trim().toLowerCase();
    normalized = normalized.replace(/[^\w\s]/g, '');
    normalized = normalized.replace(/\s+/g, ' ');
    return normalized;
};

export const fuzzyMatch = (input: string, target: string): boolean => {
    if (!input || !target) return false;
    
    const normalizedInput = normalizeText(input);
    const normalizedTarget = normalizeText(target);
    
    // Exact match
    if (normalizedInput === normalizedTarget) return true;
    
    // Check if input contains target or vice versa
    if (normalizedTarget.includes(normalizedInput) || normalizedInput.includes(normalizedTarget)) {
        // For very short inputs, require longer match
        if (normalizedInput.length < 3 && !normalizedTarget.includes(normalizedInput)) {
            return false;
        }
        return true;
    }
    
    return false;
};

export const checkAnswer = (userInput: string, correctAnswer: string): boolean => {
    if (!userInput || !correctAnswer) return false;
    
    // Trim and normalize
    userInput = userInput.trim();
    correctAnswer = correctAnswer.trim();
    
    // Try direct match
    if (fuzzyMatch(userInput, correctAnswer)) return true;
    
    // Try with player mappings
    for (const [key, value] of Object.entries(playerMappings)) {
        if (fuzzyMatch(userInput, key) && fuzzyMatch(value, correctAnswer)) {
            return true;
        }
        if (fuzzyMatch(userInput, value) && fuzzyMatch(key, correctAnswer)) {
            return true;
        }
    }
    
    // Try team mappings
    for (const [key, value] of Object.entries(teamMappings)) {
        if (fuzzyMatch(userInput, key) && fuzzyMatch(value, correctAnswer)) {
            return true;
        }
    }
    
    // Try country mappings
    for (const [key, value] of Object.entries(countryMappings)) {
        if (fuzzyMatch(userInput, key) && fuzzyMatch(value, correctAnswer)) {
            return true;
        }
    }
    
    // Try partial matching for numbers (runs, wickets)
    if (/^\d+$/.test(userInput) && /^\d+$/.test(correctAnswer)) {
        return userInput === correctAnswer;
    }
    
    return false;
};

export const getTeamFromInput = (input: string): string | null => {
    for (const [key, value] of Object.entries(teamMappings)) {
        if (fuzzyMatch(input, key) || fuzzyMatch(input, value)) {
            return value;
        }
    }
    return null;
};

export const getCountryFromInput = (input: string): string | null => {
    for (const [key, value] of Object.entries(countryMappings)) {
        if (fuzzyMatch(input, key) || fuzzyMatch(input, value)) {
            return value;
        }
    }
    return null;
};