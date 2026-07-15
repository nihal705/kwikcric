// frontend/src/pages/Games/CricketMastermind/data/questions/fillTheTableData.ts
import { FillTableChallenge } from '../../types/quiz.types';

export const fillTableChallenges: FillTableChallenge[] = [
    // Type 1: Complete Table (with scores and countries)
    {
        id: 1,
        title: 'Top ODI Run Scorers of All Time',
        category: 'Records',
        type: 'complete',
        columns: ['Rank', 'Player Name', 'Runs', 'Country'],
        rows: [
            { rank: 1, playerName: '', runs: 18426, country: 'India' },
            { rank: 2, playerName: '', runs: 14234, country: 'Sri Lanka' },
            { rank: 3, playerName: 'Ricky Ponting', runs: '', country: 'Australia' },
            { rank: 4, playerName: '', runs: 14378, country: 'India' },
            { rank: 5, playerName: 'Mahela Jayawardene', runs: '', country: 'Sri Lanka' },
        ],
        timeLimit: 120,
        hints: [
            'Rank 1 is known as "The Master Blaster"',
            'Rank 2 is known for his elegant batting style',
            'Rank 4 holds the record for most double centuries in ODIs'
        ]
    },
    {
        id: 2,
        title: 'Top ODI Wicket Takers',
        category: 'Records',
        type: 'complete',
        columns: ['Rank', 'Player Name', 'Wickets', 'Country'],
        rows: [
            { rank: 1, playerName: '', wickets: 534, country: 'Sri Lanka' },
            { rank: 2, playerName: '', wickets: 563, country: 'Sri Lanka' },
            { rank: 3, playerName: 'Wasim Akram', wickets: '', country: 'Pakistan' },
            { rank: 4, playerName: '', wickets: 380, country: 'Australia' },
            { rank: 5, playerName: 'Shane Warne', wickets: '', country: 'Australia' },
        ],
        timeLimit: 120,
        hints: [
            'Rank 1 is known for his "Doosra" delivery',
            'Rank 2 is also a left-arm spinner',
            'Rank 4 is nicknamed "Pigeon"'
        ]
    },
    {
        id: 3,
        title: 'Most Test Runs',
        category: 'Test Cricket',
        type: 'complete',
        columns: ['Rank', 'Player Name', 'Runs', 'Country'],
        rows: [
            { rank: 1, playerName: '', runs: 15921, country: 'India' },
            { rank: 2, playerName: '', runs: 13378, country: 'Australia' },
            { rank: 3, playerName: 'Jacques Kallis', runs: '', country: 'South Africa' },
            { rank: 4, playerName: '', runs: 12400, country: 'Sri Lanka' },
            { rank: 5, playerName: 'Brian Lara', runs: '', country: 'West Indies' },
        ],
        timeLimit: 120,
        hints: [
            'Rank 1 has 100 international centuries',
            'Rank 2 is called "Punter"',
            'Rank 4 is a left-handed batsman'
        ]
    },
    // Type 2: Guess the Player (No scores/countries)
    {
        id: 4,
        title: 'IPL 2024 Top Run Scorers',
        category: 'IPL',
        type: 'guess',
        columns: ['Rank', 'Player Name'],
        rows: [
            { rank: 1, playerName: '' },
            { rank: 2, playerName: '' },
            { rank: 3, playerName: '' },
            { rank: 4, playerName: '' },
            { rank: 5, playerName: '' },
        ],
        timeLimit: 90,
        hints: [
            'Rank 1 scored 741 runs in the season (SRH)',
            'Rank 2 scored 583 runs and plays for RCB',
            'Rank 3 scored 531 runs and plays for RR',
            'Rank 4 scored 516 runs in 15 matches (DC)',
            'Rank 5 scored 500 runs and plays for CSK'
        ]
    },
    {
        id: 5,
        title: 'Most Centuries in International Cricket',
        category: 'Records',
        type: 'guess',
        columns: ['Rank', 'Player Name'],
        rows: [
            { rank: 1, playerName: '' },
            { rank: 2, playerName: '' },
            { rank: 3, playerName: '' },
            { rank: 4, playerName: '' },
            { rank: 5, playerName: '' },
        ],
        timeLimit: 90,
        hints: [
            'Rank 1 has 100 international centuries (India)',
            'Rank 2 has 71 international centuries (Australia)',
            'Rank 3 has 63 international centuries (India)',
            'Rank 4 has 62 international centuries (Sri Lanka)',
            'Rank 5 has 61 international centuries (South Africa)'
        ]
    },
    {
        id: 6,
        title: 'Most T20I Runs',
        category: 'T20 World Cup',
        type: 'guess',
        columns: ['Rank', 'Player Name'],
        rows: [
            { rank: 1, playerName: '' },
            { rank: 2, playerName: '' },
            { rank: 3, playerName: '' },
            { rank: 4, playerName: '' },
            { rank: 5, playerName: '' },
        ],
        timeLimit: 90,
        hints: [
            'Rank 1 has over 4000 T20I runs (India)',
            'Rank 2 is from New Zealand',
            'Rank 3 is from India (Captain)',
            'Rank 4 is from Pakistan',
            'Rank 5 is from Australia'
        ]
    },
    {
        id: 7,
        title: 'Most Wickets in T20Is',
        category: 'T20 World Cup',
        type: 'guess',
        columns: ['Rank', 'Player Name'],
        rows: [
            { rank: 1, playerName: '' },
            { rank: 2, playerName: '' },
            { rank: 3, playerName: '' },
            { rank: 4, playerName: '' },
            { rank: 5, playerName: '' },
        ],
        timeLimit: 90,
        hints: [
            'Rank 1 is from Bangladesh (All-rounder)',
            'Rank 2 is from Sri Lanka (Slinga)',
            'Rank 3 is from Afghanistan (Spin wizard)',
            'Rank 4 is from New Zealand',
            'Rank 5 is from Pakistan'
        ]
    },
    {
        id: 8,
        title: 'World Cup Winning Captains',
        category: 'ODI World Cup',
        type: 'guess',
        columns: ['Year', 'Captain Name', 'Country'],
        rows: [
            { year: 1975, captainName: '', country: 'West Indies' },
            { year: 1983, captainName: '', country: 'India' },
            { year: 1992, captainName: '', country: 'Pakistan' },
            { year: 1996, captainName: '', country: 'Sri Lanka' },
            { year: 2011, captainName: '', country: 'India' },
        ],
        timeLimit: 90,
        hints: [
            '1975 captain was known for his powerful batting',
            '1983 captain is called "Haryana Hurricane"',
            '1992 captain was a legendary all-rounder',
            '1996 captain scored a century in the final',
            '2011 captain is known as "Captain Cool"'
        ]
    },
    {
        id: 9,
        title: 'Orange Cap Winners (IPL)',
        category: 'IPL',
        type: 'guess',
        columns: ['Year', 'Player Name', 'Team', 'Runs'],
        rows: [
            { year: 2008, playerName: '', team: '', runs: 616 },
            { year: 2011, playerName: '', team: 'RCB', runs: 557 },
            { year: 2016, playerName: '', team: 'RCB', runs: 973 },
            { year: 2019, playerName: '', team: 'DC', runs: 521 },
            { year: 2023, playerName: '', team: 'RCB', runs: 639 },
        ],
        timeLimit: 120,
        hints: [
            '2008 player is called "Mr. IPL"',
            '2011 player won Orange Cap for RCB',
            '2016 player scored 973 runs in a season',
            '2019 player is a left-handed opener',
            '2023 player scored 639 runs for RCB'
        ]
    },
    {
        id: 10,
        title: 'Purple Cap Winners (IPL)',
        category: 'IPL',
        type: 'guess',
        columns: ['Year', 'Player Name', 'Team', 'Wickets'],
        rows: [
            { year: 2008, playerName: '', team: 'KXIP', wickets: 23 },
            { year: 2013, playerName: '', team: 'CSK', wickets: 32 },
            { year: 2017, playerName: '', team: 'MI', wickets: 30 },
            { year: 2019, playerName: '', team: 'DC', wickets: 25 },
            { year: 2023, playerName: '', team: 'GT', wickets: 27 },
        ],
        timeLimit: 120,
        hints: [
            '2008 player is a Pakistani fast bowler',
            '2013 player is a Jamaican spinner',
            '2017 player is a Sri Lankan slinger',
            '2019 player is a South African pacer',
            '2023 player is a Afghan spin wizard'
        ]
    }
];

// Get random challenge
export const getRandomChallenge = (): FillTableChallenge => {
    const randomIndex = Math.floor(Math.random() * fillTableChallenges.length);
    return { ...fillTableChallenges[randomIndex] };
};

// Get challenges by type
export const getChallengesByType = (type: 'complete' | 'guess'): FillTableChallenge[] => {
    return fillTableChallenges.filter(c => c.type === type);
};

// Get challenges by category
export const getChallengesByCategory = (category: string): FillTableChallenge[] => {
    if (category === 'All-Mode') return fillTableChallenges;
    return fillTableChallenges.filter(c => c.category === category);
};