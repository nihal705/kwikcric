// frontend/src/data/historyData.ts
export const eraData = {
  origins: {
    title: 'The Beginning (1550-1699)',
    icon: '📜',
    period: '1550-1699',
    color: 'from-amber-700 to-amber-900',
    description: 'The earliest roots of cricket, from rural England to the first recorded matches.',
    events: [
      { year: 1550, title: 'First Recorded Cricket Match', description: 'Played in Guildford, England', location: 'Guildford, England', image: '🏏' },
      { year: 1598, title: 'Cricket in Dictionary', description: 'First mention of "cricket" in Italian/English dictionary', location: 'London', image: '📖' },
      { year: 1611, title: 'First Inter-County Match', description: 'Sussex vs Surrey', location: 'England', image: '🏆' },
      { year: 1660, title: 'First County Teams', description: 'Kent, Surrey, Sussex established', location: 'England', image: '🗺️' },
    ]
  },
  rules: {
    title: 'Rules Are Born (1700-1799)',
    icon: '🏏',
    period: '1700-1799',
    color: 'from-blue-700 to-blue-900',
    description: 'The formalization of cricket rules and the establishment of MCC.',
    events: [
      { year: 1744, title: 'First Laws of Cricket', description: 'Written by the London Cricket Club', location: 'London', image: '📜' },
      { year: 1760, title: 'Hambledon Club', description: 'Cricket\'s first great club established', location: 'Hambledon, England', image: '🏏' },
      { year: 1787, title: 'MCC Formed', description: 'Marylebone Cricket Club becomes governing body', location: 'Lord\'s, London', image: '🏛️' },
    ]
  },
  global: {
    title: 'Cricket Goes Global (1800-1899)',
    icon: '🌍',
    period: '1800-1899',
    color: 'from-green-700 to-green-900',
    description: 'Cricket spreads beyond England to colonies and other nations.',
    events: [
      { year: 1844, title: 'First International Match', description: 'Canada vs USA at St George\'s Club', location: 'New York', image: '🇨🇦🇺🇸' },
      { year: 1877, title: 'First Test Match', description: 'Australia vs England at MCG', location: 'Melbourne', image: '🏆' },
      { year: 1882, title: 'The Ashes Born', description: 'England\'s first home loss to Australia', location: 'The Oval, London', image: '🏺' },
      { year: 1889, title: 'South Africa Joins', description: 'First Test match for South Africa', location: 'Port Elizabeth', image: '🇿🇦' },
    ]
  },
  golden: {
    title: 'Golden Era (1900-1949)',
    icon: '✨',
    period: '1900-1949',
    color: 'from-yellow-700 to-amber-800',
    description: 'The era of Don Bradman and cricket\'s golden age.',
    events: [
      { year: 1909, title: 'ICC Formed', description: 'Imperial Cricket Conference established', location: 'London', image: '🌍' },
      { year: 1928, title: 'Bradman Debuts', description: 'Don Bradman begins his legendary career', location: 'Australia', image: '🐐' },
      { year: 1930, title: 'Bodyline Series', description: 'Controversial bowling tactic in Ashes', location: 'Australia', image: '⚡' },
      { year: 1948, title: 'The Invincibles', description: 'Australia unbeaten in England', location: 'England', image: '🇦🇺' },
    ]
  },
  modern: {
    title: 'Modern Cricket (1950-1999)',
    icon: '⚡',
    period: '1950-1999',
    color: 'from-purple-700 to-pink-700',
    description: 'The birth of limited-overs cricket and World Cups.',
    events: [
      { year: 1971, title: 'First ODI', description: 'Australia vs England at MCG', location: 'Melbourne', image: '📺' },
      { year: 1975, title: 'First World Cup', description: 'West Indies vs Australia at Lord\'s', location: 'Lord\'s, London', image: '🏆' },
      { year: 1983, title: 'India\'s Historic Win', description: 'Kapil\'s Devils stun the world', location: 'Lord\'s, London', image: '🇮🇳' },
      { year: 1992, title: 'Day-Night Cricket', description: 'First day-night Test match', location: 'Australia', image: '🌙' },
    ]
  },
  t20: {
    title: 'T20 Revolution (2000-2026)',
    icon: '🚀',
    period: '2000-2026',
    color: 'from-red-700 to-orange-700',
    description: 'The fastest format takes over the world.',
    events: [
      { year: 2005, title: 'First T20I', description: 'Australia vs New Zealand', location: 'Auckland', image: '⚡' },
      { year: 2007, title: 'First T20 World Cup', description: 'India wins inaugural title', location: 'South Africa', image: '🇮🇳' },
      { year: 2008, title: 'IPL Launched', description: 'Cricket economics changed forever', location: 'India', image: '💪' },
      { year: 2019, title: 'World Test Championship', description: 'Test cricket gets a final', location: 'Lord\'s', image: '📋' },
      { year: 2023, title: 'Australia\'s 6th ODI WC', description: 'Pat Cummins leads Australia', location: 'Ahmedabad', image: '🇦🇺' },
      { year: 2024, title: 'India\'s T20 WC Win', description: 'Rohit Sharma lifts trophy', location: 'Barbados', image: '🇮🇳' },
      { year: 2026, title: 'India\'s Back-to-Back', description: 'Suryakumar Yadav leads India', location: 'Ahmedabad', image: '🇮🇳' },
    ]
  }
};

export const historyData = {
  timeline: eraData,
  milestones: Object.values(eraData).flatMap(era => era.events)
};