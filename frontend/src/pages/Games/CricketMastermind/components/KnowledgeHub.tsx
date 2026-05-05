// frontend/src/pages/Games/CricketMastermind/components/KnowledgeHub.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const cricketFacts = [
    "Sachin Tendulkar has 100 international centuries - the most by any player.",
    "MS Dhoni is the only captain to win all three ICC trophies (World Cup, T20 World Cup, Champions Trophy).",
    "The fastest ODI century is 31 balls by AB de Villiers.",
    "Muttiah Muralitharan has taken 800 Test wickets - the most in Test history.",
    "The first Cricket World Cup was held in 1975 in England.",
    "Don Bradman has the highest Test batting average of 99.94.",
    "India won their first World Cup in 1983 under Kapil Dev.",
    "West Indies won the first two World Cups (1975 and 1979).",
    "The 2019 World Cup final ended in a tie and England won on boundary countback.",
    "Virat Kohli is the fastest to 10,000, 20,000 and 25,000 international runs.",
    "James Anderson has taken over 700 Test wickets - the most by a fast bowler.",
    "Ricky Ponting has won the most World Cups as a player (3) and captain (2).",
    "The highest team total in ODIs is 498/4 by England against Netherlands.",
    "Chris Gayle has hit the most sixes in international cricket (over 550).",
    "Rohit Sharma has hit the most double centuries in ODIs (3)."
];

const cricketTips = [
    "In Test cricket, a team can declare their innings at any time.",
    "A 'googly' is a delivery bowled by a leg-spinner that turns the opposite way.",
    "The 'Yorker' is a delivery pitched right at the batsman's feet.",
    "A 'hat-trick' is when a bowler takes three wickets in three consecutive deliveries.",
    "The 'Powerplay' in ODIs refers to fielding restrictions in the first 10 overs.",
    "A 'Maiden over' is an over where no runs are scored.",
    "The 'Duckworth-Lewis-Stern' method is used to set targets in rain-affected matches.",
    "A 'Super Over' is used to break ties in T20 matches."
];

const documentaries = [
    { title: "The Test", platform: "Amazon Prime", description: "Follows Australian cricket team's journey" },
    { title: "Sachin: A Billion Dreams", platform: "Netflix", description: "Biography of Sachin Tendulkar" },
    { title: "Roar of the Lion", platform: "Hotstar", description: "CSK's comeback story" },
    { title: "Fire in Babylon", platform: "YouTube", description: "West Indies cricket dominance" },
    { title: "Death of a Gentleman", platform: "Netflix", description: "Cricket's governance issues" },
    { title: "The Edge", platform: "Amazon Prime", description: "England's 2019 World Cup win" }
];

export const KnowledgeHub: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'facts' | 'tips' | 'docs'>('facts');
    const [currentFactIndex, setCurrentFactIndex] = useState(0);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const nextFact = () => {
        setCurrentFactIndex((prev) => (prev + 1) % cricketFacts.length);
    };

    const nextTip = () => {
        setCurrentTipIndex((prev) => (prev + 1) % cricketTips.length);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
            {/* Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700">
                <button
                    onClick={() => setActiveTab('facts')}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === 'facts'
                            ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Did You Know?
                </button>
                <button
                    onClick={() => setActiveTab('tips')}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === 'tips'
                            ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Cricket Tips
                </button>
                <button
                    onClick={() => setActiveTab('docs')}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                        activeTab === 'docs'
                            ? 'text-green-600 dark:text-green-400 border-b-2 border-green-500'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                    }`}
                >
                    Documentaries
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                {activeTab === 'facts' && (
                    <div className="text-center">
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {cricketFacts[currentFactIndex]}
                        </div>
                        <button
                            onClick={nextFact}
                            className="text-[10px] text-green-600 hover:underline"
                        >
                            Next Fact →
                        </button>
                    </div>
                )}

                {activeTab === 'tips' && (
                    <div className="text-center">
                        <div className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                            {cricketTips[currentTipIndex]}
                        </div>
                        <button
                            onClick={nextTip}
                            className="text-[10px] text-green-600 hover:underline"
                        >
                            Next Tip →
                        </button>
                    </div>
                )}

                {activeTab === 'docs' && (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {documentaries.map((doc, idx) => (
                            <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                <div className="font-semibold text-xs text-gray-900 dark:text-white">
                                    {doc.title}
                                </div>
                                <div className="text-[10px] text-gray-500">{doc.platform}</div>
                                <div className="text-[10px] text-gray-600 dark:text-gray-400 mt-0.5">
                                    {doc.description}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick Facts Row */}
            <div className="bg-gray-50 dark:bg-gray-900/30 px-3 py-2 border-t border-gray-200 dark:border-gray-700">
                <div className="text-[10px] text-gray-500 text-center">
                    Did you know? "Cricket is the second most popular sport in the world after football!"
                </div>
            </div>
        </motion.div>
    );
};