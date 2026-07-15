// frontend/src/pages/Games/KwikCricket/data/teamsData.ts

export interface Team {
    id: number;
    name: string;
    shortName: string;
    flag: string;
    strength: number;
    battingStrength: number;
    bowlingStrength: number;
    isIPL?: boolean;
}

export const teamsData: Team[] = [
    // International Teams
    { id: 1, name: "India", shortName: "IND", flag: "🇮🇳", strength: 95, battingStrength: 95, bowlingStrength: 90 },
    { id: 2, name: "Australia", shortName: "AUS", flag: "🇦🇺", strength: 93, battingStrength: 92, bowlingStrength: 94 },
    { id: 3, name: "England", shortName: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", strength: 90, battingStrength: 88, bowlingStrength: 89 },
    { id: 4, name: "South Africa", shortName: "SA", flag: "🇿🇦", strength: 88, battingStrength: 86, bowlingStrength: 90 },
    { id: 5, name: "New Zealand", shortName: "NZ", flag: "🇳🇿", strength: 87, battingStrength: 85, bowlingStrength: 88 },
    { id: 6, name: "Pakistan", shortName: "PAK", flag: "🇵🇰", strength: 86, battingStrength: 87, bowlingStrength: 85 },
    { id: 7, name: "Sri Lanka", shortName: "SL", flag: "🇱🇰", strength: 80, battingStrength: 78, bowlingStrength: 82 },
    { id: 8, name: "West Indies", shortName: "WI", flag: "🌴", strength: 78, battingStrength: 82, bowlingStrength: 74 },
    { id: 9, name: "Bangladesh", shortName: "BAN", flag: "🇧🇩", strength: 75, battingStrength: 74, bowlingStrength: 76 },
    { id: 10, name: "Afghanistan", shortName: "AFG", flag: "🇦🇫", strength: 72, battingStrength: 68, bowlingStrength: 78 },
    { id: 11, name: "Zimbabwe", shortName: "ZIM", flag: "🇿🇼", strength: 65, battingStrength: 64, bowlingStrength: 66 },
];

// IPL Teams
export const iplTeamsData: Team[] = [
    { id: 101, name: "Mumbai Indians", shortName: "MI", flag: "🔵", strength: 90, battingStrength: 92, bowlingStrength: 88, isIPL: true },
    { id: 102, name: "Chennai Super Kings", shortName: "CSK", flag: "💛", strength: 89, battingStrength: 88, bowlingStrength: 87, isIPL: true },
    { id: 103, name: "Royal Challengers Bangalore", shortName: "RCB", flag: "🔴", strength: 87, battingStrength: 92, bowlingStrength: 82, isIPL: true },
    { id: 104, name: "Kolkata Knight Riders", shortName: "KKR", flag: "💜", strength: 85, battingStrength: 84, bowlingStrength: 86, isIPL: true },
    { id: 105, name: "Delhi Capitals", shortName: "DC", flag: "💙", strength: 84, battingStrength: 86, bowlingStrength: 82, isIPL: true },
    { id: 106, name: "Rajasthan Royals", shortName: "RR", flag: "💗", strength: 83, battingStrength: 85, bowlingStrength: 81, isIPL: true },
    { id: 107, name: "Sunrisers Hyderabad", shortName: "SRH", flag: "🧡", strength: 82, battingStrength: 80, bowlingStrength: 84, isIPL: true },
    { id: 108, name: "Punjab Kings", shortName: "PBKS", flag: "❤️", strength: 80, battingStrength: 82, bowlingStrength: 78, isIPL: true },
    { id: 109, name: "Lucknow Super Giants", shortName: "LSG", flag: "🟡", strength: 81, battingStrength: 83, bowlingStrength: 79, isIPL: true },
    { id: 110, name: "Gujarat Titans", shortName: "GT", flag: "🔷", strength: 84, battingStrength: 82, bowlingStrength: 86, isIPL: true },
];