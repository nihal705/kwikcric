// frontend/src/pages/Games/KwikCricket/data/playersData.ts

export interface Player {
    id: number;
    name: string;
    country: string;
    role: 'batsman' | 'bowler' | 'allrounder' | 'wicketkeeper';
    battingAbility: number;
    bowlingAbility: number;
    battingStyle: 'aggressive' | 'normal' | 'defensive';
    bowlingStyle: 'fast' | 'medium' | 'spin';
    iplTeam?: string;
}

// frontend/src/pages/Games/KwikCricket/data/playersData.ts

// Add this function to get players by team name (works for both international and IPL)
export const getPlayersByTeam = (teamName: string): Player[] => {
    // First check for IPL teams
    switch (teamName) {
        case 'Mumbai Indians':
            return mumbaiIndiansPlayers;
        case 'Chennai Super Kings':
            return chennaiSuperKingsPlayers;
        case 'Royal Challengers Bangalore':
            return rcbPlayers;
        case 'Kolkata Knight Riders':
            return kkrPlayers;
        case 'Delhi Capitals':
            return delhiCapitalsPlayers;
        case 'Sunrisers Hyderabad':
            return sunrisersHyderabadPlayers;
        case 'Punjab Kings':
            return punjabKingsPlayers;
        case 'Gujarat Titans':
            return gujaratTitansPlayers;
        case 'Lucknow Super Giants':
            return lucknowSuperGiantsPlayers;
        case 'Rajasthan Royals':
            return rajasthanRoyalsPlayers;
        default:
            // Then check for international teams
            return getPlayersByCountry(teamName);
    }
};



// ============ INDIAN PLAYERS (30 Players - International + IPL) ============
export const indianPlayers: Player[] = [
    // Batsmen
    { id: 1, name: 'Rohit Sharma', country: 'India', role: 'batsman', battingAbility: 95, bowlingAbility: 20, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 2, name: 'Shubman Gill', country: 'India', role: 'batsman', battingAbility: 88, bowlingAbility: 15, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Gujarat Titans' },
    { id: 3, name: 'Virat Kohli', country: 'India', role: 'batsman', battingAbility: 98, bowlingAbility: 25, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 4, name: 'KL Rahul', country: 'India', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Lucknow Super Giants' },
    { id: 5, name: 'Suryakumar Yadav', country: 'India', role: 'batsman', battingAbility: 92, bowlingAbility: 15, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 6, name: 'Shreyas Iyer', country: 'India', role: 'batsman', battingAbility: 84, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 7, name: 'Rishabh Pant', country: 'India', role: 'wicketkeeper', battingAbility: 86, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 8, name: 'Yashasvi Jaiswal', country: 'India', role: 'batsman', battingAbility: 82, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 9, name: 'Sanju Samson', country: 'India', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10, name: 'Ishan Kishan', country: 'India', role: 'wicketkeeper', battingAbility: 78, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    // All-rounders
    { id: 11, name: 'Hardik Pandya', country: 'India', role: 'allrounder', battingAbility: 88, bowlingAbility: 80, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 12, name: 'Ravindra Jadeja', country: 'India', role: 'allrounder', battingAbility: 82, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 13, name: 'Axar Patel', country: 'India', role: 'allrounder', battingAbility: 78, bowlingAbility: 82, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 14, name: 'Washington Sundar', country: 'India', role: 'allrounder', battingAbility: 70, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 15, name: 'Shivam Dube', country: 'India', role: 'allrounder', battingAbility: 75, bowlingAbility: 65, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 16, name: 'Venkatesh Iyer', country: 'India', role: 'allrounder', battingAbility: 76, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    // Bowlers
    { id: 17, name: 'Jasprit Bumrah', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 98, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 18, name: 'Mohammed Shami', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 95, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 19, name: 'Mohammed Siraj', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 20, name: 'Bhuvneshwar Kumar', country: 'India', role: 'bowler', battingAbility: 25, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 21, name: 'Arshdeep Singh', country: 'India', role: 'bowler', battingAbility: 18, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 22, name: 'Kuldeep Yadav', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 87, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 23, name: 'Ravi Bishnoi', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 24, name: 'Yuzvendra Chahal', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 25, name: 'Deepak Chahar', country: 'India', role: 'bowler', battingAbility: 28, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 26, name: 'Shardul Thakur', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 27, name: 'Prasidh Krishna', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 28, name: 'Umran Malik', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 29, name: 'Avesh Khan', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 30, name: 'T Natarajan', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 79, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
];

// ============ AUSTRALIA (20 Players) ============
export const australianPlayers: Player[] = [
    // Batsmen
    { id: 101, name: 'David Warner', country: 'Australia', role: 'batsman', battingAbility: 92, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 102, name: 'Travis Head', country: 'Australia', role: 'batsman', battingAbility: 89, bowlingAbility: 20, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 103, name: 'Steve Smith', country: 'Australia', role: 'batsman', battingAbility: 94, bowlingAbility: 15, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 104, name: 'Marnus Labuschagne', country: 'Australia', role: 'batsman', battingAbility: 88, bowlingAbility: 20, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 105, name: 'Usman Khawaja', country: 'Australia', role: 'batsman', battingAbility: 85, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 106, name: 'Mitchell Marsh', country: 'Australia', role: 'allrounder', battingAbility: 86, bowlingAbility: 78, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 107, name: 'Glenn Maxwell', country: 'Australia', role: 'allrounder', battingAbility: 90, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 108, name: 'Marcus Stoinis', country: 'Australia', role: 'allrounder', battingAbility: 82, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 109, name: 'Cameron Green', country: 'Australia', role: 'allrounder', battingAbility: 83, bowlingAbility: 82, battingStyle: 'normal', bowlingStyle: 'fast' },
    // Wicketkeepers
    { id: 110, name: 'Alex Carey', country: 'Australia', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 111, name: 'Josh Inglis', country: 'Australia', role: 'wicketkeeper', battingAbility: 78, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    // Bowlers
    { id: 112, name: 'Pat Cummins', country: 'Australia', role: 'bowler', battingAbility: 35, bowlingAbility: 96, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 113, name: 'Mitchell Starc', country: 'Australia', role: 'bowler', battingAbility: 30, bowlingAbility: 94, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 114, name: 'Josh Hazlewood', country: 'Australia', role: 'bowler', battingAbility: 18, bowlingAbility: 93, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 115, name: 'Adam Zampa', country: 'Australia', role: 'bowler', battingAbility: 20, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 116, name: 'Nathan Lyon', country: 'Australia', role: 'bowler', battingAbility: 25, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 117, name: 'Sean Abbott', country: 'Australia', role: 'bowler', battingAbility: 28, bowlingAbility: 82, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 118, name: 'Kane Richardson', country: 'Australia', role: 'bowler', battingAbility: 22, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 119, name: 'Ashton Agar', country: 'Australia', role: 'allrounder', battingAbility: 65, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 120, name: 'Nathan Ellis', country: 'Australia', role: 'bowler', battingAbility: 15, bowlingAbility: 83, battingStyle: 'defensive', bowlingStyle: 'fast' },
];

// ============ ENGLAND (20 Players) ============
export const englandPlayers: Player[] = [
    // Batsmen
    { id: 201, name: 'Jos Buttler', country: 'England', role: 'wicketkeeper', battingAbility: 91, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 202, name: 'Jonny Bairstow', country: 'England', role: 'wicketkeeper', battingAbility: 88, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 203, name: 'Joe Root', country: 'England', role: 'batsman', battingAbility: 93, bowlingAbility: 40, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 204, name: 'Ben Stokes', country: 'England', role: 'allrounder', battingAbility: 90, bowlingAbility: 85, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 205, name: 'Harry Brook', country: 'England', role: 'batsman', battingAbility: 87, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 206, name: 'Dawid Malan', country: 'England', role: 'batsman', battingAbility: 84, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 207, name: 'Liam Livingstone', country: 'England', role: 'allrounder', battingAbility: 85, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 208, name: 'Moeen Ali', country: 'England', role: 'allrounder', battingAbility: 82, bowlingAbility: 80, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 209, name: 'Sam Curran', country: 'England', role: 'allrounder', battingAbility: 78, bowlingAbility: 82, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 210, name: 'Chris Woakes', country: 'England', role: 'allrounder', battingAbility: 75, bowlingAbility: 84, battingStyle: 'normal', bowlingStyle: 'fast' },
    // Bowlers
    { id: 211, name: 'Jofra Archer', country: 'England', role: 'bowler', battingAbility: 25, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 212, name: 'Mark Wood', country: 'England', role: 'bowler', battingAbility: 20, bowlingAbility: 90, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 213, name: 'Adil Rashid', country: 'England', role: 'bowler', battingAbility: 22, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 214, name: 'Reece Topley', country: 'England', role: 'bowler', battingAbility: 15, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 215, name: 'David Willey', country: 'England', role: 'bowler', battingAbility: 30, bowlingAbility: 82, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 216, name: 'Chris Jordan', country: 'England', role: 'bowler', battingAbility: 25, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 217, name: 'Tom Curran', country: 'England', role: 'bowler', battingAbility: 28, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 218, name: 'Matt Parkinson', country: 'England', role: 'bowler', battingAbility: 12, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 219, name: 'Tymal Mills', country: 'England', role: 'bowler', battingAbility: 10, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 220, name: 'Brydon Carse', country: 'England', role: 'bowler', battingAbility: 20, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast' },
];

// ============ SOUTH AFRICA (20 Players) ============
export const southAfricaPlayers: Player[] = [
    // Batsmen
    { id: 301, name: 'Quinton de Kock', country: 'South Africa', role: 'wicketkeeper', battingAbility: 89, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 302, name: 'Temba Bavuma', country: 'South Africa', role: 'batsman', battingAbility: 82, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 303, name: 'Aiden Markram', country: 'South Africa', role: 'batsman', battingAbility: 86, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 304, name: 'Rassie van der Dussen', country: 'South Africa', role: 'batsman', battingAbility: 84, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 305, name: 'David Miller', country: 'South Africa', role: 'batsman', battingAbility: 88, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 306, name: 'Heinrich Klaasen', country: 'South Africa', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    // All-rounders
    { id: 307, name: 'Marco Jansen', country: 'South Africa', role: 'allrounder', battingAbility: 75, bowlingAbility: 82, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 308, name: 'Andile Phehlukwayo', country: 'South Africa', role: 'allrounder', battingAbility: 72, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 309, name: 'Dwaine Pretorius', country: 'South Africa', role: 'allrounder', battingAbility: 70, bowlingAbility: 76, battingStyle: 'normal', bowlingStyle: 'fast' },
    // Bowlers
    { id: 310, name: 'Kagiso Rabada', country: 'South Africa', role: 'bowler', battingAbility: 25, bowlingAbility: 94, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 311, name: 'Anrich Nortje', country: 'South Africa', role: 'bowler', battingAbility: 18, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 312, name: 'Lungi Ngidi', country: 'South Africa', role: 'bowler', battingAbility: 15, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 313, name: 'Tabraiz Shamsi', country: 'South Africa', role: 'bowler', battingAbility: 12, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 314, name: 'Keshav Maharaj', country: 'South Africa', role: 'bowler', battingAbility: 20, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 315, name: 'Wayne Parnell', country: 'South Africa', role: 'bowler', battingAbility: 28, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 316, name: 'Gerald Coetzee', country: 'South Africa', role: 'bowler', battingAbility: 22, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 317, name: 'Bjorn Fortuin', country: 'South Africa', role: 'bowler', battingAbility: 15, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 318, name: 'Lizaad Williams', country: 'South Africa', role: 'bowler', battingAbility: 10, bowlingStyle: 'fast', battingStyle: 'defensive', bowlingAbility: 78 },
    { id: 319, name: 'Sisanda Magala', country: 'South Africa', role: 'bowler', battingAbility: 18, bowlingAbility: 79, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 320, name: 'Corbin Bosch', country: 'South Africa', role: 'allrounder', battingAbility: 65, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'fast' },
];

// ============ PAKISTAN (20 Players) ============
export const pakistanPlayers: Player[] = [
    // Batsmen
    { id: 401, name: 'Babar Azam', country: 'Pakistan', role: 'batsman', battingAbility: 94, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 402, name: 'Mohammad Rizwan', country: 'Pakistan', role: 'wicketkeeper', battingAbility: 88, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 403, name: 'Fakhar Zaman', country: 'Pakistan', role: 'batsman', battingAbility: 86, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 404, name: 'Imam-ul-Haq', country: 'Pakistan', role: 'batsman', battingAbility: 83, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 405, name: 'Saud Shakeel', country: 'Pakistan', role: 'batsman', battingAbility: 82, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin' },
    // All-rounders
    { id: 406, name: 'Shadab Khan', country: 'Pakistan', role: 'allrounder', battingAbility: 80, bowlingAbility: 84, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 407, name: 'Mohammad Nawaz', country: 'Pakistan', role: 'allrounder', battingAbility: 75, bowlingAbility: 80, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 408, name: 'Iftikhar Ahmed', country: 'Pakistan', role: 'allrounder', battingAbility: 78, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 409, name: 'Faheem Ashraf', country: 'Pakistan', role: 'allrounder', battingAbility: 72, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'fast' },
    // Bowlers
    { id: 410, name: 'Shaheen Afridi', country: 'Pakistan', role: 'bowler', battingAbility: 25, bowlingAbility: 96, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 411, name: 'Haris Rauf', country: 'Pakistan', role: 'bowler', battingAbility: 18, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 412, name: 'Naseem Shah', country: 'Pakistan', role: 'bowler', battingAbility: 15, bowlingAbility: 90, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 413, name: 'Mohammad Wasim Jr', country: 'Pakistan', role: 'bowler', battingAbility: 20, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 414, name: 'Usman Qadir', country: 'Pakistan', role: 'bowler', battingAbility: 12, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 415, name: 'Zaman Khan', country: 'Pakistan', role: 'bowler', battingAbility: 10, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 416, name: 'Hasan Ali', country: 'Pakistan', role: 'bowler', battingAbility: 28, bowlingAbility: 83, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 417, name: 'Mohammad Hasnain', country: 'Pakistan', role: 'bowler', battingAbility: 15, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 418, name: 'Abrar Ahmed', country: 'Pakistan', role: 'bowler', battingAbility: 10, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 419, name: 'Ihsanullah', country: 'Pakistan', role: 'bowler', battingAbility: 12, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 420, name: 'Sufiyan Muqeem', country: 'Pakistan', role: 'bowler', battingAbility: 8, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin' },
];

// ============ NEW ZEALAND (20 Players) ============
export const newZealandPlayers: Player[] = [
    { id: 501, name: 'Kane Williamson', country: 'New Zealand', role: 'batsman', battingAbility: 91, bowlingAbility: 30, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 502, name: 'Devon Conway', country: 'New Zealand', role: 'wicketkeeper', battingAbility: 87, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 503, name: 'Glenn Phillips', country: 'New Zealand', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 60, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 504, name: 'Daryl Mitchell', country: 'New Zealand', role: 'allrounder', battingAbility: 84, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 505, name: 'Tom Latham', country: 'New Zealand', role: 'wicketkeeper', battingAbility: 82, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 506, name: 'Mitchell Santner', country: 'New Zealand', role: 'allrounder', battingAbility: 75, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 507, name: 'Jimmy Neesham', country: 'New Zealand', role: 'allrounder', battingAbility: 78, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 508, name: 'Rachin Ravindra', country: 'New Zealand', role: 'allrounder', battingAbility: 80, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 509, name: 'Trent Boult', country: 'New Zealand', role: 'bowler', battingAbility: 20, bowlingAbility: 95, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 510, name: 'Tim Southee', country: 'New Zealand', role: 'bowler', battingAbility: 25, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 511, name: 'Lockie Ferguson', country: 'New Zealand', role: 'bowler', battingAbility: 15, bowlingAbility: 90, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 512, name: 'Matt Henry', country: 'New Zealand', role: 'bowler', battingAbility: 18, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 513, name: 'Ish Sodhi', country: 'New Zealand', role: 'bowler', battingAbility: 20, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 514, name: 'Kyle Jamieson', country: 'New Zealand', role: 'bowler', battingAbility: 30, bowlingAbility: 87, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 515, name: 'Ben Sears', country: 'New Zealand', role: 'bowler', battingAbility: 12, bowlingAbility: 83, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 516, name: 'Adam Milne', country: 'New Zealand', role: 'bowler', battingAbility: 18, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 517, name: 'Blair Tickner', country: 'New Zealand', role: 'bowler', battingAbility: 15, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 518, name: 'Jacob Duffy', country: 'New Zealand', role: 'bowler', battingAbility: 10, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 519, name: 'Cole McConchie', country: 'New Zealand', role: 'allrounder', battingAbility: 65, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 520, name: 'Will Young', country: 'New Zealand', role: 'batsman', battingAbility: 80, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
];

// ============ IPL TEAMS SQUADS ============

// Mumbai Indians (25 players)
export const mumbaiIndiansPlayers: Player[] = [
    { id: 1001, name: 'Rohit Sharma', country: 'India', role: 'batsman', battingAbility: 95, bowlingAbility: 20, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1002, name: 'Ishan Kishan', country: 'India', role: 'wicketkeeper', battingAbility: 78, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1003, name: 'Suryakumar Yadav', country: 'India', role: 'batsman', battingAbility: 92, bowlingAbility: 15, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1004, name: 'Tilak Varma', country: 'India', role: 'batsman', battingAbility: 75, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1005, name: 'Tim David', country: 'Australia', role: 'batsman', battingAbility: 82, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1006, name: 'Cameron Green', country: 'Australia', role: 'allrounder', battingAbility: 83, bowlingAbility: 82, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1007, name: 'Hardik Pandya', country: 'India', role: 'allrounder', battingAbility: 88, bowlingAbility: 80, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1008, name: 'Kieron Pollard', country: 'West Indies', role: 'allrounder', battingAbility: 85, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1009, name: 'Nehal Wadhera', country: 'India', role: 'batsman', battingAbility: 70, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1010, name: 'Jasprit Bumrah', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 98, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1011, name: 'Jason Behrendorff', country: 'Australia', role: 'bowler', battingAbility: 15, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1012, name: 'Piyush Chawla', country: 'India', role: 'bowler', battingAbility: 25, bowlingAbility: 75, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1013, name: 'Akash Madhwal', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1014, name: 'Kumar Kartikeya', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 75, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1015, name: 'Riley Meredith', country: 'Australia', role: 'bowler', battingAbility: 12, bowlingAbility: 79, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1016, name: 'Dewald Brevis', country: 'South Africa', role: 'batsman', battingAbility: 76, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1017, name: 'Ramandeep Singh', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1018, name: 'Hrithik Shokeen', country: 'India', role: 'allrounder', battingAbility: 60, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1019, name: 'Arjun Tendulkar', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1020, name: 'Vishnu Vinod', country: 'India', role: 'wicketkeeper', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Mumbai Indians' },
    { id: 1021, name: 'Shams Mulani', country: 'India', role: 'allrounder', battingAbility: 62, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1022, name: 'Raghav Goyal', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Mumbai Indians' },
    { id: 1023, name: 'Mohammad Arshad Khan', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1024, name: 'Sandeep Warrier', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
    { id: 1025, name: 'Jofra Archer', country: 'England', role: 'bowler', battingAbility: 25, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Mumbai Indians' },
];

// Chennai Super Kings (25 players)
export const chennaiSuperKingsPlayers: Player[] = [
    { id: 2001, name: 'MS Dhoni', country: 'India', role: 'wicketkeeper', battingAbility: 88, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2002, name: 'Ruturaj Gaikwad', country: 'India', role: 'batsman', battingAbility: 84, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2003, name: 'Devon Conway', country: 'New Zealand', role: 'wicketkeeper', battingAbility: 87, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2004, name: 'Shivam Dube', country: 'India', role: 'allrounder', battingAbility: 75, bowlingAbility: 65, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2005, name: 'Ambati Rayudu', country: 'India', role: 'batsman', battingAbility: 80, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2006, name: 'Moeen Ali', country: 'England', role: 'allrounder', battingAbility: 82, bowlingAbility: 80, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2007, name: 'Ravindra Jadeja', country: 'India', role: 'allrounder', battingAbility: 82, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2008, name: 'Ben Stokes', country: 'England', role: 'allrounder', battingAbility: 90, bowlingAbility: 85, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2009, name: 'Deepak Chahar', country: 'India', role: 'bowler', battingAbility: 28, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2010, name: 'Shardul Thakur', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2011, name: 'Tushar Deshpande', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2012, name: 'Maheesh Theekshana', country: 'Sri Lanka', role: 'bowler', battingAbility: 15, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2013, name: 'Matheesha Pathirana', country: 'Sri Lanka', role: 'bowler', battingAbility: 10, bowlingAbility: 81, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2014, name: 'Rajvardhan Hangargekar', country: 'India', role: 'allrounder', battingAbility: 60, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2015, name: 'Mitchell Santner', country: 'New Zealand', role: 'allrounder', battingAbility: 75, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2016, name: 'Dwaine Pretorius', country: 'South Africa', role: 'allrounder', battingAbility: 70, bowlingAbility: 76, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2017, name: 'Simarjeet Singh', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2018, name: 'Mukesh Choudhary', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 73, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
    { id: 2019, name: 'Prashant Solanki', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2020, name: 'Bhagath Varma', country: 'India', role: 'allrounder', battingAbility: 58, bowlingAbility: 62, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2021, name: 'Ajay Mandal', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2022, name: 'Shaik Rasheed', country: 'India', role: 'batsman', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2023, name: 'Subhranshu Senapati', country: 'India', role: 'batsman', battingAbility: 62, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Chennai Super Kings' },
    { id: 2024, name: 'Nishant Sindhu', country: 'India', role: 'allrounder', battingAbility: 60, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Chennai Super Kings' },
    { id: 2025, name: 'Kyle Jamieson', country: 'New Zealand', role: 'bowler', battingAbility: 30, bowlingAbility: 87, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Chennai Super Kings' },
];

// Royal Challengers Bangalore (25 players)
export const rcbPlayers: Player[] = [
    { id: 3001, name: 'Virat Kohli', country: 'India', role: 'batsman', battingAbility: 98, bowlingAbility: 25, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3002, name: 'Faf du Plessis', country: 'South Africa', role: 'batsman', battingAbility: 86, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3003, name: 'Glenn Maxwell', country: 'Australia', role: 'allrounder', battingAbility: 90, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3004, name: 'Dinesh Karthik', country: 'India', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3005, name: 'Rajat Patidar', country: 'India', role: 'batsman', battingAbility: 76, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3006, name: 'Mahipal Lomror', country: 'India', role: 'allrounder', battingAbility: 68, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3007, name: 'Shahbaz Ahmed', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3008, name: 'Anuj Rawat', country: 'India', role: 'wicketkeeper', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3009, name: 'Finn Allen', country: 'New Zealand', role: 'wicketkeeper', battingAbility: 78, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3010, name: 'Mohammed Siraj', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3011, name: 'Josh Hazlewood', country: 'Australia', role: 'bowler', battingAbility: 18, bowlingAbility: 93, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3012, name: 'Wanindu Hasaranga', country: 'Sri Lanka', role: 'allrounder', battingAbility: 75, bowlingAbility: 86, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3013, name: 'Harshal Patel', country: 'India', role: 'bowler', battingAbility: 25, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3014, name: 'Karn Sharma', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 75, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3015, name: 'Akash Deep', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3016, name: 'Siddarth Kaul', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3017, name: 'David Willey', country: 'England', role: 'allrounder', battingAbility: 70, bowlingAbility: 80, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3018, name: 'Wayne Parnell', country: 'South Africa', role: 'bowler', battingAbility: 28, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3019, name: 'Reece Topley', country: 'England', role: 'bowler', battingAbility: 15, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3020, name: 'Manoj Bhandage', country: 'India', role: 'allrounder', battingAbility: 58, bowlingAbility: 62, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3021, name: 'Avinash Singh', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3022, name: 'Sonu Yadav', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3023, name: 'Himanshu Sharma', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3024, name: 'Kedar Jadhav', country: 'India', role: 'allrounder', battingAbility: 72, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
    { id: 3025, name: 'Michael Bracewell', country: 'New Zealand', role: 'allrounder', battingAbility: 74, bowlingAbility: 72, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Royal Challengers Bangalore' },
];

// Kolkata Knight Riders (25 players)
export const kkrPlayers: Player[] = [
    { id: 4001, name: 'Nitish Rana', country: 'India', role: 'batsman', battingAbility: 82, bowlingAbility: 60, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4002, name: 'Andre Russell', country: 'West Indies', role: 'allrounder', battingAbility: 92, bowlingAbility: 85, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4003, name: 'Shreyas Iyer', country: 'India', role: 'batsman', battingAbility: 84, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4004, name: 'Venkatesh Iyer', country: 'India', role: 'allrounder', battingAbility: 76, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4005, name: 'Rinku Singh', country: 'India', role: 'batsman', battingAbility: 78, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4006, name: 'Rahmanullah Gurbaz', country: 'Afghanistan', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4007, name: 'Sunil Narine', country: 'West Indies', role: 'allrounder', battingAbility: 70, bowlingAbility: 92, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4008, name: 'Shakib Al Hasan', country: 'Bangladesh', role: 'allrounder', battingAbility: 82, bowlingAbility: 84, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4009, name: 'David Wiese', country: 'Namibia', role: 'allrounder', battingAbility: 72, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4010, name: 'Lockie Ferguson', country: 'New Zealand', role: 'bowler', battingAbility: 15, bowlingAbility: 90, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4011, name: 'Umesh Yadav', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4012, name: 'Tim Southee', country: 'New Zealand', role: 'bowler', battingAbility: 25, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4013, name: 'Varun Chakravarthy', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4014, name: 'Shardul Thakur', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4015, name: 'Anukul Roy', country: 'India', role: 'allrounder', battingAbility: 60, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4016, name: 'Harshit Rana', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4017, name: 'Vaibhav Arora', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4018, name: 'Suyash Sharma', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4019, name: 'Narayan Jagadeesan', country: 'India', role: 'wicketkeeper', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4020, name: 'Mandeep Singh', country: 'India', role: 'batsman', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4021, name: 'Johnson Charles', country: 'West Indies', role: 'wicketkeeper', battingAbility: 75, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Kolkata Knight Riders' },
    { id: 4022, name: 'Kulwant Khejroliya', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4023, name: 'Sikandar Raza', country: 'Zimbabwe', role: 'allrounder', battingAbility: 78, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Kolkata Knight Riders' },
    { id: 4024, name: 'Josh Little', country: 'Ireland', role: 'bowler', battingAbility: 12, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
    { id: 4025, name: 'Arshad Khan', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Kolkata Knight Riders' },
];

// Delhi Capitals (25 players)
export const delhiCapitalsPlayers: Player[] = [
    { id: 5001, name: 'David Warner', country: 'Australia', role: 'batsman', battingAbility: 92, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5002, name: 'Rishabh Pant', country: 'India', role: 'wicketkeeper', battingAbility: 86, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5003, name: 'Prithvi Shaw', country: 'India', role: 'batsman', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5004, name: 'Mitchell Marsh', country: 'Australia', role: 'allrounder', battingAbility: 86, bowlingAbility: 78, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5005, name: 'Axar Patel', country: 'India', role: 'allrounder', battingAbility: 78, bowlingAbility: 82, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5006, name: 'Rovman Powell', country: 'West Indies', role: 'batsman', battingAbility: 82, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5007, name: 'Sarfaraz Khan', country: 'India', role: 'batsman', battingAbility: 72, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5008, name: 'Manish Pandey', country: 'India', role: 'batsman', battingAbility: 75, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5009, name: 'Abhishek Porel', country: 'India', role: 'wicketkeeper', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5010, name: 'Kuldeep Yadav', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 87, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5011, name: 'Anrich Nortje', country: 'South Africa', role: 'bowler', battingAbility: 18, bowlingAbility: 92, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5012, name: 'Khaleel Ahmed', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5013, name: 'Lungi Ngidi', country: 'South Africa', role: 'bowler', battingAbility: 15, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5014, name: 'Mukesh Kumar', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5015, name: 'Chetan Sakariya', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5016, name: 'Kamlesh Nagarkoti', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5017, name: 'Mustafizur Rahman', country: 'Bangladesh', role: 'bowler', battingAbility: 12, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5018, name: 'Tushar Deshpande', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
    { id: 5019, name: 'Lalit Yadav', country: 'India', role: 'allrounder', battingAbility: 62, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5020, name: 'Ripal Patel', country: 'India', role: 'allrounder', battingAbility: 60, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5021, name: 'Yash Dhull', country: 'India', role: 'batsman', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5022, name: 'Vicky Ostwal', country: 'India', role: 'bowler', battingAbility: 5, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5023, name: 'Praveen Dubey', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Delhi Capitals' },
    { id: 5024, name: 'Philip Salt', country: 'England', role: 'wicketkeeper', battingAbility: 76, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Delhi Capitals' },
    { id: 5025, name: 'Ben Dwarshuis', country: 'Australia', role: 'bowler', battingAbility: 12, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Delhi Capitals' },
];

// Sunrisers Hyderabad (25 players)
export const sunrisersHyderabadPlayers: Player[] = [
    { id: 6001, name: 'Aiden Markram', country: 'South Africa', role: 'batsman', battingAbility: 86, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6002, name: 'Mayank Agarwal', country: 'India', role: 'batsman', battingAbility: 82, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6003, name: 'Rahul Tripathi', country: 'India', role: 'batsman', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6004, name: 'Abhishek Sharma', country: 'India', role: 'allrounder', battingAbility: 75, bowlingAbility: 65, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6005, name: 'Heinrich Klaasen', country: 'South Africa', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6006, name: 'Glenn Phillips', country: 'New Zealand', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 60, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6007, name: 'Harry Brook', country: 'England', role: 'batsman', battingAbility: 87, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6008, name: 'Washington Sundar', country: 'India', role: 'allrounder', battingAbility: 70, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6009, name: 'Marco Jansen', country: 'South Africa', role: 'allrounder', battingAbility: 75, bowlingAbility: 82, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6010, name: 'Bhuvneshwar Kumar', country: 'India', role: 'bowler', battingAbility: 25, bowlingAbility: 85, battingStyle: 'defensive', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6011, name: 'Umran Malik', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6012, name: 'T Natarajan', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 79, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6013, name: 'Adil Rashid', country: 'England', role: 'bowler', battingAbility: 22, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6014, name: 'Kartik Tyagi', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6015, name: 'Fazalhaq Farooqi', country: 'Afghanistan', role: 'bowler', battingAbility: 10, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6016, name: 'Mayank Markande', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6017, name: 'J Suchith', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6018, name: 'Abdul Samad', country: 'India', role: 'batsman', battingAbility: 68, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6019, name: 'Upendra Singh Yadav', country: 'India', role: 'wicketkeeper', battingAbility: 60, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6020, name: 'Anmolpreet Singh', country: 'India', role: 'batsman', battingAbility: 62, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6021, name: 'Samarth Vyas', country: 'India', role: 'batsman', battingAbility: 60, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6022, name: 'Nitish Kumar Reddy', country: 'India', role: 'allrounder', battingAbility: 58, bowlingAbility: 62, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6023, name: 'Sanvir Singh', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6024, name: 'Akeal Hosein', country: 'West Indies', role: 'allrounder', battingAbility: 65, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Sunrisers Hyderabad' },
    { id: 6025, name: 'Chris Jordan', country: 'England', role: 'bowler', battingAbility: 25, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Sunrisers Hyderabad' },
];

// Punjab Kings (25 players)
export const punjabKingsPlayers: Player[] = [
    { id: 7001, name: 'Shikhar Dhawan', country: 'India', role: 'batsman', battingAbility: 88, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7002, name: 'Jonny Bairstow', country: 'England', role: 'wicketkeeper', battingAbility: 88, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Punjab Kings' },
    { id: 7003, name: 'Liam Livingstone', country: 'England', role: 'allrounder', battingAbility: 85, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7004, name: 'Bhanuka Rajapaksa', country: 'Sri Lanka', role: 'batsman', battingAbility: 76, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Punjab Kings' },
    { id: 7005, name: 'Jitesh Sharma', country: 'India', role: 'wicketkeeper', battingAbility: 74, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Punjab Kings' },
    { id: 7006, name: 'Shahrukh Khan', country: 'India', role: 'batsman', battingAbility: 70, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7007, name: 'Prabhsimran Singh', country: 'India', role: 'wicketkeeper', battingAbility: 68, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Punjab Kings' },
    { id: 7008, name: 'Sam Curran', country: 'England', role: 'allrounder', battingAbility: 78, bowlingAbility: 82, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7009, name: 'Sikandar Raza', country: 'Zimbabwe', role: 'allrounder', battingAbility: 78, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7010, name: 'Harpreet Brar', country: 'India', role: 'allrounder', battingAbility: 62, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7011, name: 'Arshdeep Singh', country: 'India', role: 'bowler', battingAbility: 18, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7012, name: 'Kagiso Rabada', country: 'South Africa', role: 'bowler', battingAbility: 25, bowlingAbility: 94, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7013, name: 'Rahul Chahar', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7014, name: 'Nathan Ellis', country: 'Australia', role: 'bowler', battingAbility: 15, bowlingAbility: 83, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7015, name: 'Baltej Singh', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7016, name: 'Mohit Rathee', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7017, name: 'Vidwath Kaverappa', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7018, name: 'Gurnoor Brar', country: 'India', role: 'bowler', battingAbility: 6, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7019, name: 'Atharva Taide', country: 'India', role: 'batsman', battingAbility: 62, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7020, name: 'Matthew Short', country: 'Australia', role: 'allrounder', battingAbility: 72, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7021, name: 'Rishi Dhawan', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
    { id: 7022, name: 'Mohammad Kaif', country: 'India', role: 'wicketkeeper', battingAbility: 55, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Punjab Kings' },
    { id: 7023, name: 'Shivam Singh', country: 'India', role: 'batsman', battingAbility: 58, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Punjab Kings' },
    { id: 7024, name: 'Tanay Thyagarajann', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Punjab Kings' },
    { id: 7025, name: 'Chris Woakes', country: 'England', role: 'allrounder', battingAbility: 75, bowlingAbility: 84, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Punjab Kings' },
];

// Gujarat Titans (25 players)
export const gujaratTitansPlayers: Player[] = [
    { id: 8001, name: 'Hardik Pandya', country: 'India', role: 'allrounder', battingAbility: 88, bowlingAbility: 80, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8002, name: 'Shubman Gill', country: 'India', role: 'batsman', battingAbility: 88, bowlingAbility: 15, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Gujarat Titans' },
    { id: 8003, name: 'David Miller', country: 'South Africa', role: 'batsman', battingAbility: 88, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Gujarat Titans' },
    { id: 8004, name: 'Matthew Wade', country: 'Australia', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Gujarat Titans' },
    { id: 8005, name: 'Wriddhiman Saha', country: 'India', role: 'wicketkeeper', battingAbility: 75, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Gujarat Titans' },
    { id: 8006, name: 'Vijay Shankar', country: 'India', role: 'allrounder', battingAbility: 70, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8007, name: 'Abhinav Manohar', country: 'India', role: 'batsman', battingAbility: 72, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8008, name: 'Sai Sudharsan', country: 'India', role: 'batsman', battingAbility: 74, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8009, name: 'Rahul Tewatia', country: 'India', role: 'allrounder', battingAbility: 76, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8010, name: 'Rashid Khan', country: 'Afghanistan', role: 'bowler', battingAbility: 70, bowlingAbility: 96, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8011, name: 'Mohammed Shami', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 95, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8012, name: 'Alzarri Joseph', country: 'West Indies', role: 'bowler', battingAbility: 15, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8013, name: 'Josh Little', country: 'Ireland', role: 'bowler', battingAbility: 12, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8014, name: 'Yash Dayal', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8015, name: 'Darshan Nalkande', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8016, name: 'Pradeep Sangwan', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8017, name: 'Ravisrinivasan Sai Kishore', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8018, name: 'Noor Ahmad', country: 'Afghanistan', role: 'bowler', battingAbility: 10, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8019, name: 'Jayant Yadav', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 72, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8020, name: 'Odean Smith', country: 'West Indies', role: 'allrounder', battingAbility: 72, bowlingAbility: 74, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8021, name: 'Shivam Mavi', country: 'India', role: 'bowler', battingAbility: 18, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8022, name: 'Kane Williamson', country: 'New Zealand', role: 'batsman', battingAbility: 91, bowlingAbility: 30, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Gujarat Titans' },
    { id: 8023, name: 'Mohammad Shami', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 95, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8024, name: 'Dasun Shanaka', country: 'Sri Lanka', role: 'allrounder', battingAbility: 76, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Gujarat Titans' },
    { id: 8025, name: 'Urvil Patel', country: 'India', role: 'wicketkeeper', battingAbility: 60, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Gujarat Titans' },
];

// Lucknow Super Giants (25 players)
export const lucknowSuperGiantsPlayers: Player[] = [
    { id: 9001, name: 'KL Rahul', country: 'India', role: 'wicketkeeper', battingAbility: 85, bowlingAbility: 10, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Lucknow Super Giants' },
    { id: 9002, name: 'Quinton de Kock', country: 'South Africa', role: 'wicketkeeper', battingAbility: 89, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Lucknow Super Giants' },
    { id: 9003, name: 'Marcus Stoinis', country: 'Australia', role: 'allrounder', battingAbility: 82, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9004, name: 'Nicholas Pooran', country: 'West Indies', role: 'wicketkeeper', battingAbility: 86, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Lucknow Super Giants' },
    { id: 9005, name: 'Deepak Hooda', country: 'India', role: 'batsman', battingAbility: 78, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9006, name: 'Ayush Badoni', country: 'India', role: 'batsman', battingAbility: 72, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9007, name: 'Krunal Pandya', country: 'India', role: 'allrounder', battingAbility: 74, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9008, name: 'Kyle Mayers', country: 'West Indies', role: 'allrounder', battingAbility: 80, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9009, name: 'Karan Sharma', country: 'India', role: 'allrounder', battingAbility: 62, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9010, name: 'Ravi Bishnoi', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9011, name: 'Avesh Khan', country: 'India', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9012, name: 'Mark Wood', country: 'England', role: 'bowler', battingAbility: 20, bowlingAbility: 90, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9013, name: 'Mohsin Khan', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9014, name: 'Yash Thakur', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9015, name: 'Naveen-ul-Haq', country: 'Afghanistan', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9016, name: 'Amit Mishra', country: 'India', role: 'bowler', battingAbility: 20, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9017, name: 'Krishnappa Gowtham', country: 'India', role: 'allrounder', battingAbility: 65, bowlingAbility: 72, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9018, name: 'Daniel Sams', country: 'Australia', role: 'allrounder', battingAbility: 72, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9019, name: 'Jaydev Unadkat', country: 'India', role: 'bowler', battingAbility: 25, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9020, name: 'Manan Vohra', country: 'India', role: 'batsman', battingAbility: 68, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Lucknow Super Giants' },
    { id: 9021, name: 'Prerak Mankad', country: 'India', role: 'allrounder', battingAbility: 60, bowlingAbility: 62, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9022, name: 'Mayank Yadav', country: 'India', role: 'bowler', battingAbility: 6, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9023, name: 'Swapnil Singh', country: 'India', role: 'allrounder', battingAbility: 58, bowlingAbility: 65, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Lucknow Super Giants' },
    { id: 9024, name: 'Yudhvir Singh', country: 'India', role: 'allrounder', battingAbility: 55, bowlingAbility: 64, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
    { id: 9025, name: 'Romario Shepherd', country: 'West Indies', role: 'allrounder', battingAbility: 74, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast', iplTeam: 'Lucknow Super Giants' },
];

// Rajasthan Royals (25 players)
export const rajasthanRoyalsPlayers: Player[] = [
    { id: 10001, name: 'Sanju Samson', country: 'India', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10002, name: 'Jos Buttler', country: 'England', role: 'wicketkeeper', battingAbility: 91, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10003, name: 'Yashasvi Jaiswal', country: 'India', role: 'batsman', battingAbility: 82, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10004, name: 'Devdutt Padikkal', country: 'India', role: 'batsman', battingAbility: 78, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10005, name: 'Shimron Hetmyer', country: 'West Indies', role: 'batsman', battingAbility: 84, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10006, name: 'Riyan Parag', country: 'India', role: 'allrounder', battingAbility: 70, bowlingAbility: 65, battingStyle: 'aggressive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10007, name: 'Dhruv Jurel', country: 'India', role: 'wicketkeeper', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10008, name: 'Ravichandran Ashwin', country: 'India', role: 'allrounder', battingAbility: 75, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10009, name: 'Jason Holder', country: 'West Indies', role: 'allrounder', battingAbility: 75, bowlingAbility: 85, battingStyle: 'normal', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10010, name: 'Trent Boult', country: 'New Zealand', role: 'bowler', battingAbility: 20, bowlingAbility: 95, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10011, name: 'Yuzvendra Chahal', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10012, name: 'Prasidh Krishna', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10013, name: 'Navdeep Saini', country: 'India', role: 'bowler', battingAbility: 18, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10014, name: 'Kuldip Yadav', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10015, name: 'Kuldeep Sen', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10016, name: 'Obed McCoy', country: 'West Indies', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10017, name: 'KM Asif', country: 'India', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
    { id: 10018, name: 'Murugan Ashwin', country: 'India', role: 'bowler', battingAbility: 15, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10019, name: 'KC Cariappa', country: 'India', role: 'bowler', battingAbility: 10, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10020, name: 'Adam Zampa', country: 'Australia', role: 'bowler', battingAbility: 20, bowlingAbility: 88, battingStyle: 'defensive', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10021, name: 'Donovan Ferreira', country: 'South Africa', role: 'wicketkeeper', battingAbility: 70, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10022, name: 'Joe Root', country: 'England', role: 'batsman', battingAbility: 93, bowlingAbility: 40, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10023, name: 'Kunal Singh Rathore', country: 'India', role: 'wicketkeeper', battingAbility: 60, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium', iplTeam: 'Rajasthan Royals' },
    { id: 10024, name: 'Abdul Basith', country: 'India', role: 'allrounder', battingAbility: 58, bowlingAbility: 60, battingStyle: 'normal', bowlingStyle: 'spin', iplTeam: 'Rajasthan Royals' },
    { id: 10025, name: 'Sandeep Sharma', country: 'India', role: 'bowler', battingAbility: 22, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast', iplTeam: 'Rajasthan Royals' },
];

// ============ ADDITIONAL INTERNATIONAL TEAMS ============

// West Indies (20 players)
export const westIndiesPlayers: Player[] = [
    { id: 11001, name: 'Shai Hope', country: 'West Indies', role: 'wicketkeeper', battingAbility: 84, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 11002, name: 'Nicholas Pooran', country: 'West Indies', role: 'wicketkeeper', battingAbility: 86, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 11003, name: 'Shimron Hetmyer', country: 'West Indies', role: 'batsman', battingAbility: 84, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 11004, name: 'Rovman Powell', country: 'West Indies', role: 'batsman', battingAbility: 82, bowlingAbility: 10, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 11005, name: 'Brandon King', country: 'West Indies', role: 'batsman', battingAbility: 78, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 11006, name: 'Kyle Mayers', country: 'West Indies', role: 'allrounder', battingAbility: 80, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 11007, name: 'Jason Holder', country: 'West Indies', role: 'allrounder', battingAbility: 75, bowlingAbility: 85, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 11008, name: 'Andre Russell', country: 'West Indies', role: 'allrounder', battingAbility: 92, bowlingAbility: 85, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 11009, name: 'Romario Shepherd', country: 'West Indies', role: 'allrounder', battingAbility: 74, bowlingAbility: 76, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 11010, name: 'Odean Smith', country: 'West Indies', role: 'allrounder', battingAbility: 72, bowlingAbility: 74, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 11011, name: 'Akeal Hosein', country: 'West Indies', role: 'allrounder', battingAbility: 65, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 11012, name: 'Alzarri Joseph', country: 'West Indies', role: 'bowler', battingAbility: 15, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 11013, name: 'Obed McCoy', country: 'West Indies', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 11014, name: 'Sheldon Cottrell', country: 'West Indies', role: 'bowler', battingAbility: 18, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 11015, name: 'Jayden Seales', country: 'West Indies', role: 'bowler', battingAbility: 8, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 11016, name: 'Gudakesh Motie', country: 'West Indies', role: 'bowler', battingAbility: 10, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 11017, name: 'Hayden Walsh Jr', country: 'West Indies', role: 'bowler', battingAbility: 15, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 11018, name: 'Yannic Cariah', country: 'West Indies', role: 'allrounder', battingAbility: 60, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 11019, name: 'Keacy Carty', country: 'West Indies', role: 'batsman', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 11020, name: 'Johnson Charles', country: 'West Indies', role: 'wicketkeeper', battingAbility: 75, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
];

// Sri Lanka (20 players)
export const sriLankaPlayers: Player[] = [
    { id: 12001, name: 'Pathum Nissanka', country: 'Sri Lanka', role: 'batsman', battingAbility: 78, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 12002, name: 'Kusal Mendis', country: 'Sri Lanka', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 12003, name: 'Charith Asalanka', country: 'Sri Lanka', role: 'batsman', battingAbility: 76, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 12004, name: 'Dhananjaya de Silva', country: 'Sri Lanka', role: 'allrounder', battingAbility: 75, bowlingAbility: 72, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 12005, name: 'Dasun Shanaka', country: 'Sri Lanka', role: 'allrounder', battingAbility: 76, bowlingAbility: 70, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 12006, name: 'Wanindu Hasaranga', country: 'Sri Lanka', role: 'allrounder', battingAbility: 75, bowlingAbility: 86, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 12007, name: 'Maheesh Theekshana', country: 'Sri Lanka', role: 'bowler', battingAbility: 15, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 12008, name: 'Matheesha Pathirana', country: 'Sri Lanka', role: 'bowler', battingAbility: 10, bowlingAbility: 81, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 12009, name: 'Dushmantha Chameera', country: 'Sri Lanka', role: 'bowler', battingAbility: 15, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 12010, name: 'Lahiru Kumara', country: 'Sri Lanka', role: 'bowler', battingAbility: 8, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 12011, name: 'Kasun Rajitha', country: 'Sri Lanka', role: 'bowler', battingAbility: 10, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 12012, name: 'Dilshan Madushanka', country: 'Sri Lanka', role: 'bowler', battingAbility: 8, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 12013, name: 'Jeffrey Vandersay', country: 'Sri Lanka', role: 'bowler', battingAbility: 12, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 12014, name: 'Pramod Madushan', country: 'Sri Lanka', role: 'bowler', battingAbility: 8, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 12015, name: 'Chamika Karunaratne', country: 'Sri Lanka', role: 'allrounder', battingAbility: 65, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 12016, name: 'Sadeera Samarawickrama', country: 'Sri Lanka', role: 'wicketkeeper', battingAbility: 72, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 12017, name: 'Dimuth Karunaratne', country: 'Sri Lanka', role: 'batsman', battingAbility: 74, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 12018, name: 'Angelo Mathews', country: 'Sri Lanka', role: 'allrounder', battingAbility: 78, bowlingAbility: 75, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 12019, name: 'Nuwanidu Fernando', country: 'Sri Lanka', role: 'batsman', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 12020, name: 'Lahiru Madushanka', country: 'Sri Lanka', role: 'bowler', battingAbility: 8, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'fast' },
];

// Bangladesh (20 players)
export const bangladeshPlayers: Player[] = [
    { id: 13001, name: 'Shakib Al Hasan', country: 'Bangladesh', role: 'allrounder', battingAbility: 82, bowlingAbility: 84, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 13002, name: 'Liton Das', country: 'Bangladesh', role: 'wicketkeeper', battingAbility: 78, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 13003, name: 'Najmul Hossain Shanto', country: 'Bangladesh', role: 'batsman', battingAbility: 76, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 13004, name: 'Towhid Hridoy', country: 'Bangladesh', role: 'batsman', battingAbility: 74, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 13005, name: 'Mushfiqur Rahim', country: 'Bangladesh', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 13006, name: 'Mahmudullah', country: 'Bangladesh', role: 'allrounder', battingAbility: 75, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 13007, name: 'Mehidy Hasan Miraz', country: 'Bangladesh', role: 'allrounder', battingAbility: 70, bowlingAbility: 78, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 13008, name: 'Afif Hossain', country: 'Bangladesh', role: 'allrounder', battingAbility: 72, bowlingAbility: 65, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 13009, name: 'Mustafizur Rahman', country: 'Bangladesh', role: 'bowler', battingAbility: 12, bowlingAbility: 84, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 13010, name: 'Taskin Ahmed', country: 'Bangladesh', role: 'bowler', battingAbility: 15, bowlingAbility: 82, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 13011, name: 'Hasan Mahmud', country: 'Bangladesh', role: 'bowler', battingAbility: 8, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 13012, name: 'Shoriful Islam', country: 'Bangladesh', role: 'bowler', battingAbility: 8, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 13013, name: 'Ebadot Hossain', country: 'Bangladesh', role: 'bowler', battingAbility: 6, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 13014, name: 'Nasum Ahmed', country: 'Bangladesh', role: 'bowler', battingAbility: 12, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 13015, name: 'Taijul Islam', country: 'Bangladesh', role: 'bowler', battingAbility: 10, bowlingAbility: 70, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 13016, name: 'Mahedi Hasan', country: 'Bangladesh', role: 'allrounder', battingAbility: 65, bowlingAbility: 68, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 13017, name: 'Mohammad Naim', country: 'Bangladesh', role: 'batsman', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 13018, name: 'Soumya Sarkar', country: 'Bangladesh', role: 'allrounder', battingAbility: 70, bowlingAbility: 65, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 13019, name: 'Anamul Haque', country: 'Bangladesh', role: 'wicketkeeper', battingAbility: 66, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 13020, name: 'Rishad Hossain', country: 'Bangladesh', role: 'bowler', battingAbility: 8, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'spin' },
];

// Afghanistan (20 players)
export const afghanistanPlayers: Player[] = [
    { id: 14001, name: 'Rashid Khan', country: 'Afghanistan', role: 'bowler', battingAbility: 70, bowlingAbility: 96, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 14002, name: 'Rahmanullah Gurbaz', country: 'Afghanistan', role: 'wicketkeeper', battingAbility: 80, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 14003, name: 'Ibrahim Zadran', country: 'Afghanistan', role: 'batsman', battingAbility: 78, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 14004, name: 'Hashmatullah Shahidi', country: 'Afghanistan', role: 'batsman', battingAbility: 74, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 14005, name: 'Najibullah Zadran', country: 'Afghanistan', role: 'batsman', battingAbility: 76, bowlingAbility: 5, battingStyle: 'aggressive', bowlingStyle: 'medium' },
    { id: 14006, name: 'Mohammad Nabi', country: 'Afghanistan', role: 'allrounder', battingAbility: 78, bowlingAbility: 80, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 14007, name: 'Gulbadin Naib', country: 'Afghanistan', role: 'allrounder', battingAbility: 70, bowlingAbility: 72, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 14008, name: 'Azmatullah Omarzai', country: 'Afghanistan', role: 'allrounder', battingAbility: 72, bowlingAbility: 74, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 14009, name: 'Mujeeb Ur Rahman', country: 'Afghanistan', role: 'bowler', battingAbility: 12, bowlingAbility: 86, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 14010, name: 'Fazalhaq Farooqi', country: 'Afghanistan', role: 'bowler', battingAbility: 10, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 14011, name: 'Naveen-ul-Haq', country: 'Afghanistan', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 14012, name: 'Mohammad Saleem', country: 'Afghanistan', role: 'bowler', battingAbility: 8, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 14013, name: 'Noor Ahmad', country: 'Afghanistan', role: 'bowler', battingAbility: 10, bowlingAbility: 80, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 14014, name: 'Qais Ahmad', country: 'Afghanistan', role: 'bowler', battingAbility: 15, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 14015, name: 'Rahmat Shah', country: 'Afghanistan', role: 'batsman', battingAbility: 72, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 14016, name: 'Karim Janat', country: 'Afghanistan', role: 'allrounder', battingAbility: 65, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 14017, name: 'Darwish Rasooli', country: 'Afghanistan', role: 'batsman', battingAbility: 70, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 14018, name: 'Shahidullah Kamal', country: 'Afghanistan', role: 'batsman', battingAbility: 68, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 14019, name: 'Zia-ur-Rehman', country: 'Afghanistan', role: 'bowler', battingAbility: 8, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 14020, name: 'Ikram Alikhil', country: 'Afghanistan', role: 'wicketkeeper', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
];

// Zimbabwe (20 players)
export const zimbabwePlayers: Player[] = [
    { id: 15001, name: 'Sikandar Raza', country: 'Zimbabwe', role: 'allrounder', battingAbility: 78, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 15002, name: 'Sean Williams', country: 'Zimbabwe', role: 'allrounder', battingAbility: 76, bowlingAbility: 72, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 15003, name: 'Craig Ervine', country: 'Zimbabwe', role: 'batsman', battingAbility: 74, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 15004, name: 'Ryan Burl', country: 'Zimbabwe', role: 'allrounder', battingAbility: 70, bowlingAbility: 68, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 15005, name: 'Wesley Madhevere', country: 'Zimbabwe', role: 'allrounder', battingAbility: 72, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 15006, name: 'Sikandar Raza', country: 'Zimbabwe', role: 'allrounder', battingAbility: 78, bowlingAbility: 75, battingStyle: 'aggressive', bowlingStyle: 'spin' },
    { id: 15007, name: 'Blessing Muzarabani', country: 'Zimbabwe', role: 'bowler', battingAbility: 12, bowlingAbility: 78, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 15008, name: 'Richard Ngarava', country: 'Zimbabwe', role: 'bowler', battingAbility: 10, bowlingAbility: 76, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 15009, name: 'Tendai Chatara', country: 'Zimbabwe', role: 'bowler', battingAbility: 10, bowlingAbility: 74, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 15010, name: 'Wellington Masakadza', country: 'Zimbabwe', role: 'bowler', battingAbility: 12, bowlingAbility: 72, battingStyle: 'defensive', bowlingStyle: 'spin' },
    { id: 15011, name: 'Brad Evans', country: 'Zimbabwe', role: 'allrounder', battingAbility: 65, bowlingAbility: 70, battingStyle: 'normal', bowlingStyle: 'fast' },
    { id: 15012, name: 'Clive Madande', country: 'Zimbabwe', role: 'wicketkeeper', battingAbility: 65, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 15013, name: 'Innocent Kaia', country: 'Zimbabwe', role: 'batsman', battingAbility: 66, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 15014, name: 'Gary Ballance', country: 'Zimbabwe', role: 'batsman', battingAbility: 72, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 15015, name: 'Luke Jongwe', country: 'Zimbabwe', role: 'allrounder', battingAbility: 62, bowlingAbility: 68, battingStyle: 'aggressive', bowlingStyle: 'fast' },
    { id: 15016, name: 'Tadiwanashe Marumani', country: 'Zimbabwe', role: 'wicketkeeper', battingAbility: 60, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 15017, name: 'Milton Shumba', country: 'Zimbabwe', role: 'allrounder', battingAbility: 60, bowlingAbility: 62, battingStyle: 'normal', bowlingStyle: 'spin' },
    { id: 15018, name: 'Tony Munyonga', country: 'Zimbabwe', role: 'batsman', battingAbility: 62, bowlingAbility: 5, battingStyle: 'normal', bowlingStyle: 'medium' },
    { id: 15019, name: 'Victor Nyauchi', country: 'Zimbabwe', role: 'bowler', battingAbility: 8, bowlingAbility: 68, battingStyle: 'defensive', bowlingStyle: 'fast' },
    { id: 15020, name: 'Tasumbe Chikowero', country: 'Zimbabwe', role: 'bowler', battingAbility: 6, bowlingAbility: 66, battingStyle: 'defensive', bowlingStyle: 'fast' },
];

// ============ EXPORT ALL TEAMS ============

export const getPlayersByCountry = (country: string): Player[] => {
    switch (country) {
        case 'India': return indianPlayers;
        case 'Australia': return australianPlayers;
        case 'England': return englandPlayers;
        case 'South Africa': return southAfricaPlayers;
        case 'Pakistan': return pakistanPlayers;
        case 'New Zealand': return newZealandPlayers;
        case 'West Indies': return westIndiesPlayers;
        case 'Sri Lanka': return sriLankaPlayers;
        case 'Bangladesh': return bangladeshPlayers;
        case 'Afghanistan': return afghanistanPlayers;
        case 'Zimbabwe': return zimbabwePlayers;
        default: return indianPlayers;
    }
};

export const getPlayersByIPLTeam = (iplTeam: string): Player[] => {
    switch (iplTeam) {
        case 'Mumbai Indians': return mumbaiIndiansPlayers;
        case 'Chennai Super Kings': return chennaiSuperKingsPlayers;
        case 'Royal Challengers Bangalore': return rcbPlayers;
        case 'Kolkata Knight Riders': return kkrPlayers;
        case 'Delhi Capitals': return delhiCapitalsPlayers;
        case 'Sunrisers Hyderabad': return sunrisersHyderabadPlayers;
        case 'Punjab Kings': return punjabKingsPlayers;
        case 'Gujarat Titans': return gujaratTitansPlayers;
        case 'Lucknow Super Giants': return lucknowSuperGiantsPlayers;
        case 'Rajasthan Royals': return rajasthanRoyalsPlayers;
        default: return [];
    }
};

// Update getBalancedSquad to work with any team
export const getBalancedSquad = (teamName: string): Player[] => {
    const allPlayers = getPlayersByTeam(teamName);
    
    // If no players found, return empty array
    if (!allPlayers || allPlayers.length === 0) {
        console.warn(`No players found for team: ${teamName}`);
        return [];
    }
    
    const batsmen = allPlayers.filter(p => p.role === 'batsman');
    const allrounders = allPlayers.filter(p => p.role === 'allrounder');
    const wicketkeepers = allPlayers.filter(p => p.role === 'wicketkeeper');
    const bowlers = allPlayers.filter(p => p.role === 'bowler');
    
    const selectedBatsmen = [...batsmen].sort((a, b) => b.battingAbility - a.battingAbility).slice(0, 4);
    const selectedAllrounders = [...allrounders].sort((a, b) => (b.battingAbility + b.bowlingAbility) - (a.battingAbility + a.bowlingAbility)).slice(0, 2);
    const selectedWK = wicketkeepers.slice(0, 1);
    const selectedBowlers = [...bowlers].sort((a, b) => b.bowlingAbility - a.bowlingAbility).slice(0, 4);
    
    const squad = [...selectedBatsmen, ...selectedAllrounders, ...selectedWK, ...selectedBowlers];
    
    // Shuffle for randomness
    for (let i = squad.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [squad[i], squad[j]] = [squad[j], squad[i]];
    }
    
    return squad;
};

export const getRandomOpponentSquad = (teamName: string): Player[] => {
    const allPlayers = getPlayersByTeam(teamName);
    
    if (!allPlayers || allPlayers.length === 0) {
        console.warn(`No players found for team: ${teamName}`);
        return [];
    }
    
    const shuffled = [...allPlayers];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 11);
};