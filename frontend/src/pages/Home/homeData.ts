// frontend/src/pages/Home/homeData.ts

export const timelineData = [
  { year: 1877, event: "First Test Match", description: "England vs Australia at Melbourne", icon: "🏏" },
  { year: 1900, event: "Cricket in Olympics", description: "First and only appearance until 2028", icon: "🥇" },
  { year: 1930, event: "Bradman Era", description: "Don Bradman averages 99.94", icon: "🐐" },
  { year: 1948, event: "The Invincibles", description: "Australia unbeaten tour of England", icon: "🇦🇺" },
  { year: 1950, event: "West Indies Rise", description: "First Test win in England", icon: "🌴" },
  { year: 1960, event: "First Tied Test", description: "Australia vs West Indies, Brisbane", icon: "🤝" },
  { year: 1971, event: "First ODI", description: "Australia vs England at MCG", icon: "📺" },
  { year: 1975, event: "First World Cup", description: "West Indies vs Australia at Lord's", icon: "🏆" },
  { year: 1981, event: "Botham's Ashes", description: "Headingley miracle", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { year: 1983, event: "India's First WC", description: "Kapil's Devils stun the world", icon: "🇮🇳" },
  { year: 1992, event: "Day-Night Cricket", description: "First day-night Test", icon: "🌙" },
  { year: 1996, event: "Sri Lanka Win WC", description: "Aravinda's masterclass", icon: "🇱🇰" },
  { year: 2000, event: "Match Fixing Scandal", description: "Cricket's darkest hour", icon: "⚠️" },
  { year: 2005, event: "First T20I", description: "Australia vs New Zealand", icon: "⚡" },
  { year: 2007, event: "First T20 WC", description: "India win inaugural title", icon: "🏆" },
  { year: 2011, event: "India's Home WC", description: "Dhoni's six finishes it", icon: "🇮🇳" },
  { year: 2019, event: "Super Over Final", description: "England win on boundary count", icon: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { year: 2023, event: "Australia Win WC", description: "6th title for Aussies", icon: "🇦🇺" },
  { year: 2026, event: "Future Champion", description: "Next World Cup awaits", icon: "⭐" },
];

export const flipFactsData = [
  {
    front: { icon: "⚡", title: "Fastest Century" },
    back: { fact: "AB de Villiers scored 100 off 31 balls vs West Indies (2015)", year: 2015, player: "AB de Villiers" }
  },
  {
    front: { icon: "🏏", title: "Most Sixes in Match" },
    back: { fact: "Afghanistan hit 22 sixes vs Ireland (2019)", year: 2019, player: "Team Afghanistan" }
  },
  {
    front: { icon: "🎯", title: "Best Economy in Over" },
    back: { fact: "Saqlain Mushtaq: 1 run, 1 wicket, 5 maidens in an over (1999)", year: 1999, player: "Saqlain Mushtaq" }
  },
  {
    front: { icon: "🏆", title: "Most World Cups" },
    back: { fact: "Australia has won 6 ODI World Cups (1987,1999,2003,2007,2015,2023)", year: 2023, player: "Australia" }
  },
  {
    front: { icon: "👑", title: "Longest Test Career" },
    back: { fact: "Sachin Tendulkar played 200 Tests over 24 years (1989-2013)", year: 2013, player: "Sachin Tendulkar" }
  },
  {
    front: { icon: "🎯", title: "Most Wickets in WC" },
    back: { fact: "Glenn McGrath took 71 wickets in 4 World Cups", year: 2007, player: "Glenn McGrath" }
  },
];

export const championTeams = [
  { year: 1975, winner: "West Indies", runnerUp: "Australia", venue: "Lord's, London", captain: "Clive Lloyd" },
  { year: 1979, winner: "West Indies", runnerUp: "England", venue: "Lord's, London", captain: "Clive Lloyd" },
  { year: 1983, winner: "India", runnerUp: "West Indies", venue: "Lord's, London", captain: "Kapil Dev" },
  { year: 1987, winner: "Australia", runnerUp: "England", venue: "Eden Gardens, Kolkata", captain: "Allan Border" },
  { year: 1992, winner: "Pakistan", runnerUp: "England", venue: "MCG, Melbourne", captain: "Imran Khan" },
  { year: 1996, winner: "Sri Lanka", runnerUp: "Australia", venue: "Gaddafi Stadium, Lahore", captain: "Arjuna Ranatunga" },
  { year: 1999, winner: "Australia", runnerUp: "Pakistan", venue: "Lord's, London", captain: "Steve Waugh" },
  { year: 2003, winner: "Australia", runnerUp: "India", venue: "Wanderers, Johannesburg", captain: "Ricky Ponting" },
  { year: 2007, winner: "Australia", runnerUp: "Sri Lanka", venue: "Kensington Oval, Barbados", captain: "Ricky Ponting" },
  { year: 2011, winner: "India", runnerUp: "Sri Lanka", venue: "Wankhede, Mumbai", captain: "MS Dhoni" },
  { year: 2015, winner: "Australia", runnerUp: "New Zealand", venue: "MCG, Melbourne", captain: "Michael Clarke" },
  { year: 2019, winner: "England", runnerUp: "New Zealand", venue: "Lord's, London", captain: "Eoin Morgan" },
  { year: 2023, winner: "Australia", runnerUp: "India", venue: "Narendra Modi Stadium", captain: "Pat Cummins" },
];

export const recordCategories = [
  { type: "runs", title: "Most Runs - ODI", data: [
    { player: "Sachin Tendulkar", value: "18,426", country: "India", matches: 463 },
    { player: "Virat Kohli", value: "13,848", country: "India", matches: 292 },
    { player: "Kumar Sangakkara", value: "14,234", country: "Sri Lanka", matches: 404 },
    { player: "Ricky Ponting", value: "13,704", country: "Australia", matches: 375 },
    { player: "Sanath Jayasuriya", value: "13,430", country: "Sri Lanka", matches: 445 },
  ]},
  { type: "wickets", title: "Most Wickets - ODI", data: [
    { player: "Muttiah Muralitharan", value: "534", country: "Sri Lanka", matches: 350 },
    { player: "Wasim Akram", value: "502", country: "Pakistan", matches: 356 },
    { player: "Waqar Younis", value: "416", country: "Pakistan", matches: 262 },
    { player: "Chaminda Vaas", value: "400", country: "Sri Lanka", matches: 322 },
    { player: "Shaun Pollock", value: "393", country: "South Africa", matches: 303 },
  ]},
  { type: "sixes", title: "Most Sixes", data: [
    { player: "Rohit Sharma", value: "553", country: "India", matches: 262 },
    { player: "Chris Gayle", value: "553", country: "West Indies", matches: 301 },
    { player: "Shahid Afridi", value: "476", country: "Pakistan", matches: 398 },
    { player: "Brendon McCullum", value: "398", country: "New Zealand", matches: 260 },
    { player: "MS Dhoni", value: "359", country: "India", matches: 350 },
  ]},
];

export const statsData = [
  { label: "Total Runs", value: 2456789, icon: "🏏", suffix: "runs", description: "Across all formats" },
  { label: "Total Wickets", value: 98765, icon: "🎯", suffix: "wickets", description: "In international cricket" },
  { label: "Total Matches", value: 12345, icon: "📊", suffix: "matches", description: "Test + ODI + T20I" },
  { label: "Total Players", value: 5432, icon: "👥", suffix: "players", description: "Who played internationals" },
  { label: "Centuries", value: 11234, icon: "💯", suffix: "100s", description: "In all formats" },
  { label: "Sixes Hit", value: 34567, icon: "💥", suffix: "sixes", description: "In international cricket" },
];