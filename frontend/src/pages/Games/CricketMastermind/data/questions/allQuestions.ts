// frontend/src/pages/Games/CricketMastermind/data/questions/allQuestions.ts
import { Question } from '../../types/quiz.types';

// ============ ODI WORLD CUP QUESTIONS (40+) ============
const odiWorldCupQuestions: Question[] = [
    {
        id: 1,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the first Cricket World Cup in 1975?',
        options: ['Australia', 'England', 'West Indies', 'India'],
        correctAnswer: 'West Indies',
        explanation: 'West Indies defeated Australia by 17 runs in the final at Lord\'s.',
        points: 10,
        hint: 'Clive Lloyd was the captain'
    },
    {
        id: 2,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 1983 Cricket World Cup?',
        options: ['West Indies', 'India', 'Pakistan', 'England'],
        correctAnswer: 'India',
        explanation: 'India defeated West Indies by 43 runs at Lord\'s.',
        points: 10,
        hint: 'Kapil Dev was the captain'
    },
    {
        id: 3,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 1992 Cricket World Cup?',
        options: ['New Zealand', 'England', 'Pakistan', 'South Africa'],
        correctAnswer: 'Pakistan',
        explanation: 'Pakistan defeated England by 22 runs in the final at Melbourne.',
        points: 10,
        hint: 'Imran Khan was the captain'
    },
    {
        id: 4,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 1996 Cricket World Cup?',
        options: ['Australia', 'Sri Lanka', 'India', 'West Indies'],
        correctAnswer: 'Sri Lanka',
        explanation: 'Sri Lanka defeated Australia by 7 wickets in the final at Lahore.',
        points: 10,
        hint: 'Arjuna Ranatunga was the captain'
    },
    {
        id: 5,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2011 Cricket World Cup?',
        options: ['Sri Lanka', 'India', 'Pakistan', 'Australia'],
        correctAnswer: 'India',
        explanation: 'India defeated Sri Lanka by 6 wickets in the final at Mumbai.',
        points: 10,
        hint: 'MS Dhoni was the captain'
    },
    {
        id: 6,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2019 Cricket World Cup?',
        options: ['New Zealand', 'England', 'Australia', 'India'],
        correctAnswer: 'England',
        explanation: 'England defeated New Zealand in the Super Over after the final was tied.',
        points: 10,
        hint: 'It was decided by boundary countback'
    },
    {
        id: 7,
        category: 'ODI World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2023 Cricket World Cup?',
        options: ['India', 'Australia', 'England', 'South Africa'],
        correctAnswer: 'Australia',
        explanation: 'Australia defeated India by 6 wickets in the final at Ahmedabad.',
        points: 10,
        hint: 'Pat Cummins was the captain'
    },
    {
        id: 8,
        category: 'ODI World Cup',
        subCategory: 'Players',
        difficulty: 'medium',
        type: 'mcq',
        text: 'Who scored the winning runs in the 2011 World Cup final?',
        options: ['Sachin Tendulkar', 'Gautam Gambhir', 'MS Dhoni', 'Virat Kohli'],
        correctAnswer: 'MS Dhoni',
        explanation: 'MS Dhoni hit a massive six to seal India\'s victory.',
        points: 20,
        hint: 'He is known as "Captain Cool"'
    },
    {
        id: 9,
        category: 'ODI World Cup',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Which country has won the most World Cup titles?',
        options: ['India', 'Australia', 'West Indies', 'England'],
        correctAnswer: 'Australia',
        explanation: 'Australia has won 5 World Cups (1987, 1999, 2003, 2007, 2015)',
        points: 50,
        hint: 'They have won 3 consecutive World Cups (1999-2007)'
    },
    {
        id: 10,
        category: 'ODI World Cup',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Who holds the record for most runs in World Cup history?',
        options: ['Sachin Tendulkar', 'Ricky Ponting', 'Virat Kohli', 'Rohit Sharma'],
        correctAnswer: 'Sachin Tendulkar',
        explanation: 'Sachin Tendulkar scored 2278 runs in 6 World Cups.',
        points: 50,
        hint: 'He is called "The Master Blaster"'
    }
];

// ============ T20 WORLD CUP QUESTIONS ============
const t20WorldCupQuestions: Question[] = [
    {
        id: 101,
        category: 'T20 World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the first T20 World Cup in 2007?',
        options: ['Pakistan', 'India', 'Sri Lanka', 'Australia'],
        correctAnswer: 'India',
        explanation: 'India defeated Pakistan by 5 runs in the final at Johannesburg.',
        points: 10,
        hint: 'MS Dhoni was the captain'
    },
    {
        id: 102,
        category: 'T20 World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2016 T20 World Cup?',
        options: ['West Indies', 'England', 'India', 'South Africa'],
        correctAnswer: 'West Indies',
        explanation: 'West Indies defeated England by 4 wickets in the final.',
        points: 10,
        hint: 'Carlos Brathwaite hit 4 sixes in the final over'
    },
    {
        id: 103,
        category: 'T20 World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2021 T20 World Cup?',
        options: ['Australia', 'New Zealand', 'England', 'Pakistan'],
        correctAnswer: 'Australia',
        explanation: 'Australia defeated New Zealand by 8 wickets in the final.',
        points: 10,
        hint: 'Aaron Finch was the captain'
    },
    {
        id: 104,
        category: 'T20 World Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2022 T20 World Cup?',
        options: ['England', 'Pakistan', 'New Zealand', 'India'],
        correctAnswer: 'England',
        explanation: 'England defeated Pakistan by 5 wickets in the final.',
        points: 10,
        hint: 'Jos Buttler was the captain'
    },
    {
        id: 105,
        category: 'T20 World Cup',
        subCategory: 'Players',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Who hit 4 consecutive sixes in the 2016 T20 World Cup final?',
        options: ['Carlos Brathwaite', 'Chris Gayle', 'Marlon Samuels', 'Kieron Pollard'],
        correctAnswer: 'Carlos Brathwaite',
        explanation: 'Carlos Brathwaite hit 4 sixes in the final over to win the match.',
        points: 50,
        hint: 'Ben Stokes was the bowler'
    },
    {
        id: 106,
        category: 'T20 World Cup',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Who holds the record for most runs in T20 World Cup history?',
        options: ['Virat Kohli', 'Rohit Sharma', 'David Warner', 'Mahela Jayawardene'],
        correctAnswer: 'Virat Kohli',
        explanation: 'Virat Kohli has over 1200 runs in T20 World Cups.',
        points: 50,
        hint: 'He is the leading run-scorer in T20Is overall'
    }
];

// ============ TEST CRICKET QUESTIONS ============
const testCricketQuestions: Question[] = [
    {
        id: 201,
        category: 'Test Cricket',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Who has scored the most runs in Test cricket history?',
        options: ['Sachin Tendulkar', 'Ricky Ponting', 'Jacques Kallis', 'Kumar Sangakkara'],
        correctAnswer: 'Sachin Tendulkar',
        explanation: 'Sachin Tendulkar scored 15,921 runs in 200 Tests.',
        points: 50,
        hint: 'He is called "The Master Blaster"'
    },
    {
        id: 202,
        category: 'Test Cricket',
        subCategory: 'Records',
        difficulty: 'medium',
        type: 'mcq',
        text: 'Which bowler has taken the most wickets in Test cricket?',
        options: ['Muttiah Muralitharan', 'Shane Warne', 'Anil Kumble', 'James Anderson'],
        correctAnswer: 'Muttiah Muralitharan',
        explanation: 'Muralitharan took 800 wickets in 133 Tests.',
        points: 20,
        hint: 'He is from Sri Lanka'
    },
    {
        id: 203,
        category: 'Test Cricket',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Which country holds the record for the highest team total in Tests?',
        options: ['Sri Lanka', 'India', 'England', 'Australia'],
        correctAnswer: 'Sri Lanka',
        explanation: 'Sri Lanka scored 952/6 against India in 1997.',
        points: 10,
        hint: 'They are from the island nation'
    },
    {
        id: 204,
        category: 'Test Cricket',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'What is the highest individual score in Test cricket?',
        options: ['400*', '410', '400', '380'],
        correctAnswer: '400*',
        explanation: 'Brian Lara scored 400* for West Indies against England in 2004.',
        points: 50,
        hint: 'Set by a West Indian batsman'
    }
];

// ============ IPL QUESTIONS ============
const iplQuestions: Question[] = [
    {
        id: 301,
        category: 'IPL',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the first IPL season in 2008?',
        options: ['Chennai Super Kings', 'Mumbai Indians', 'Rajasthan Royals', 'Kolkata Knight Riders'],
        correctAnswer: 'Rajasthan Royals',
        explanation: 'Rajasthan Royals defeated Chennai Super Kings in the final.',
        points: 10,
        hint: 'They were led by Shane Warne'
    },
    {
        id: 302,
        category: 'IPL',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Which team has won the most IPL titles?',
        options: ['Chennai Super Kings', 'Mumbai Indians', 'Kolkata Knight Riders', 'Royal Challengers Bangalore'],
        correctAnswer: 'Mumbai Indians',
        explanation: 'Mumbai Indians have won 5 IPL titles.',
        points: 10,
        hint: 'They are owned by Reliance Industries'
    },
    {
        id: 303,
        category: 'IPL',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Which player has scored the most runs in IPL history?',
        options: ['Virat Kohli', 'Rohit Sharma', 'David Warner', 'Suresh Raina'],
        correctAnswer: 'Virat Kohli',
        explanation: 'Virat Kohli has over 7000 runs in IPL.',
        points: 50,
        hint: 'He plays for RCB'
    },
    {
        id: 304,
        category: 'IPL',
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'What is the highest individual score in IPL history?',
        options: ['117', '128', '132', '175'],
        correctAnswer: '175',
        explanation: 'Chris Gayle scored 175* off 66 balls for RCB.',
        points: 50,
        hint: 'Set by a West Indian batsman for RCB'
    }
];

// ============ WOMEN'S CRICKET QUESTIONS ============
const womensCricketQuestions: Question[] = [
    {
        id: 501,
        category: "Women's Cricket",
        subCategory: 'World Cup',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the first Women\'s World Cup in 1973?',
        options: ['Australia', 'England', 'India', 'New Zealand'],
        correctAnswer: 'England',
        explanation: 'England defeated Australia in the final.',
        points: 10,
        hint: 'They are the hosts of that tournament'
    },
    {
        id: 502,
        category: "Women's Cricket",
        subCategory: 'Players',
        difficulty: 'medium',
        type: 'mcq',
        text: 'Who has scored the most runs in Women\'s ODIs?',
        options: ['Mithali Raj', 'Charlotte Edwards', 'Suzie Bates', 'Meg Lanning'],
        correctAnswer: 'Mithali Raj',
        explanation: 'Mithali Raj has over 7000 runs in Women\'s ODIs.',
        points: 20,
        hint: 'She is from India'
    },
    {
        id: 503,
        category: "Women's Cricket",
        subCategory: 'Records',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Which bowler has taken the most wickets in Women\'s ODIs?',
        options: ['Jhulan Goswami', 'Katherine Brunt', 'Anisa Mohammed', 'Shabnim Ismail'],
        correctAnswer: 'Jhulan Goswami',
        explanation: 'Jhulan Goswami has over 250 wickets in Women\'s ODIs.',
        points: 50,
        hint: 'She is from India'
    }
];

// ============ CHAMPIONS TROPHY QUESTIONS ============
const championsTrophyQuestions: Question[] = [
    {
        id: 601,
        category: 'Champions Trophy',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the first Champions Trophy in 1998?',
        options: ['South Africa', 'India', 'Australia', 'West Indies'],
        correctAnswer: 'South Africa',
        explanation: 'South Africa defeated West Indies in the final.',
        points: 10,
        hint: 'Hansie Cronje was the captain'
    },
    {
        id: 602,
        category: 'Champions Trophy',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2013 Champions Trophy?',
        options: ['India', 'England', 'Sri Lanka', 'Pakistan'],
        correctAnswer: 'India',
        explanation: 'India defeated England by 5 runs in the final.',
        points: 10,
        hint: 'MS Dhoni was the captain'
    },
    {
        id: 603,
        category: 'Champions Trophy',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2017 Champions Trophy?',
        options: ['Pakistan', 'India', 'England', 'Bangladesh'],
        correctAnswer: 'Pakistan',
        explanation: 'Pakistan defeated India by 180 runs in the final.',
        points: 10,
        hint: 'Sarfaraz Ahmed was the captain'
    }
];

// ============ ASIA CUP QUESTIONS ============
const asiaCupQuestions: Question[] = [
    {
        id: 701,
        category: 'Asia Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the first Asia Cup in 1984?',
        options: ['India', 'Pakistan', 'Sri Lanka', 'Bangladesh'],
        correctAnswer: 'India',
        explanation: 'India defeated Sri Lanka in the final.',
        points: 10,
        hint: 'Kapil Dev was the captain'
    },
    {
        id: 702,
        category: 'Asia Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Which country has won the most Asia Cup titles?',
        options: ['India', 'Sri Lanka', 'Pakistan', 'Bangladesh'],
        correctAnswer: 'India',
        explanation: 'India has won the Asia Cup 7 times.',
        points: 10,
        hint: 'They won in 1984, 1988, 1990, 1995, 2010, 2016, 2018'
    },
    {
        id: 703,
        category: 'Asia Cup',
        subCategory: 'History',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who won the 2018 Asia Cup?',
        options: ['India', 'Bangladesh', 'Pakistan', 'Sri Lanka'],
        correctAnswer: 'India',
        explanation: 'India defeated Bangladesh in the final.',
        points: 10,
        hint: 'Rohit Sharma was the captain'
    }
];

// ============ RECORDS QUESTIONS ============
const recordsQuestions: Question[] = [
    {
        id: 801,
        category: 'Records',
        subCategory: 'Batting',
        difficulty: 'medium',
        type: 'mcq',
        text: 'Who holds the record for most international centuries?',
        options: ['Sachin Tendulkar', 'Virat Kohli', 'Ricky Ponting', 'Kumar Sangakkara'],
        correctAnswer: 'Sachin Tendulkar',
        explanation: 'Sachin Tendulkar has 100 international centuries.',
        points: 20,
        hint: 'He has 51 Test and 49 ODI centuries'
    },
    {
        id: 802,
        category: 'Records',
        subCategory: 'Bowling',
        difficulty: 'medium',
        type: 'mcq',
        text: 'Who holds the record for most wickets in international cricket?',
        options: ['Muttiah Muralitharan', 'Shane Warne', 'James Anderson', 'Anil Kumble'],
        correctAnswer: 'Muttiah Muralitharan',
        explanation: 'Muralitharan took 1347 international wickets.',
        points: 20,
        hint: 'He is from Sri Lanka'
    },
    {
        id: 803,
        category: 'Records',
        subCategory: 'Batting',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Who scored the fastest century in ODI cricket?',
        options: ['AB de Villiers', 'Shahid Afridi', 'Corey Anderson', 'Glenn Maxwell'],
        correctAnswer: 'AB de Villiers',
        explanation: 'AB de Villiers scored a 31-ball century against West Indies in 2015.',
        points: 50,
        hint: 'He scored 149 off 44 balls in that innings'
    },
    {
        id: 804,
        category: 'Records',
        subCategory: 'Batting',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who scored the first double century in ODI cricket?',
        options: ['Sachin Tendulkar', 'Virender Sehwag', 'Rohit Sharma', 'Martin Guptill'],
        correctAnswer: 'Sachin Tendulkar',
        explanation: 'Sachin Tendulkar scored 200* against South Africa in 2010.',
        points: 10,
        hint: 'He is called "The Master Blaster"'
    }
];

// ============ PLAYERS QUESTIONS ============
const playersQuestions: Question[] = [
    {
        id: 901,
        category: 'Players',
        subCategory: 'Legends',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Which player is known as "The Master Blaster"?',
        options: ['Sachin Tendulkar', 'Viv Richards', 'Ricky Ponting', 'Brian Lara'],
        correctAnswer: 'Sachin Tendulkar',
        explanation: 'Sachin Tendulkar is widely known as "The Master Blaster".',
        points: 10,
        hint: 'He scored 100 international centuries'
    },
    {
        id: 902,
        category: 'Players',
        subCategory: 'Legends',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who is known as "The King" of cricket?',
        options: ['Virat Kohli', 'Sachin Tendulkar', 'Brian Lara', 'Ricky Ponting'],
        correctAnswer: 'Virat Kohli',
        explanation: 'Virat Kohli is often referred to as "The King" for his dominance.',
        points: 10,
        hint: 'He is the fastest to 50 ODI centuries'
    },
    {
        id: 903,
        category: 'Players',
        subCategory: 'Legends',
        difficulty: 'easy',
        type: 'mcq',
        text: 'Who is called "Captain Cool"?',
        options: ['MS Dhoni', 'Ricky Ponting', 'Clive Lloyd', 'Imran Khan'],
        correctAnswer: 'MS Dhoni',
        explanation: 'MS Dhoni earned the nickname "Captain Cool" for his calm demeanor.',
        points: 10,
        hint: 'He won the 2011 World Cup as captain'
    },
    {
        id: 904,
        category: 'Players',
        subCategory: 'Legends',
        difficulty: 'hard',
        type: 'mcq',
        text: 'Who is known as "The Don" of cricket?',
        options: ['Don Bradman', 'Sachin Tendulkar', 'Brian Lara', 'Ricky Ponting'],
        correctAnswer: 'Don Bradman',
        explanation: 'Sir Donald Bradman is statistically the greatest batsman of all time.',
        points: 50,
        hint: 'He has a Test average of 99.94'
    }
];

// Combine all questions
export const allQuestions: Question[] = [
    ...odiWorldCupQuestions,
    ...t20WorldCupQuestions,
    ...testCricketQuestions,
    ...iplQuestions,
    ...womensCricketQuestions,
    ...championsTrophyQuestions,
    ...asiaCupQuestions,
    ...recordsQuestions,
    ...playersQuestions
];

// Helper functions
export const getQuestionsByCategory = (category: string): Question[] => {
    if (category === 'All-Mode') return allQuestions;
    return allQuestions.filter(q => q.category === category);
};

export const getRandomQuestions = (count: number, category?: string): Question[] => {
    let pool = category && category !== 'All-Mode' 
        ? getQuestionsByCategory(category) 
        : allQuestions;
    
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
};