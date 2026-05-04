// frontend/src/pages/Games/KwikCricket/logic/shotOutcomes.ts

export type ShotType = 'aggressive' | 'normal' | 'defensive';

interface ShotResult {
    runs: number;
    isWicket: boolean;
    message: string;
    animation: string;
}

const aggressiveMessages = [
    "💥 SMASHED! Huge six over long-on!",
    "🎯 BANG! Four through covers!",
    "⚡ Big swing! Six over mid-wicket!",
    "🔥 Hammered! Four past point!",
    "💪 Massive hit! Six into the stands!",
    "🏏 Crunched! Four down the ground!",
    "😱 Oops! Mis-hit!",
    "🎯 OUT! Bowled trying to hit big!",
    "🧤 OUT! Caught at deep mid-wicket!",
];

const normalMessages = [
    "🏏 Well played! Four through covers!",
    "⚡ Clean strike! Six over long-on!",
    "🎯 Good timing! Two runs!",
    "👍 Quick single! Good running!",
    "💪 Solid shot! One run!",
    "🛡️ Blocked! No run!",
    "😔 OUT! Edged to slip!",
    "🎯 OUT! LBW!",
];

const defensiveMessages = [
    "🛡️ Solid defense! No run!",
    "👍 Nudged for one!",
    "🎯 Worked into the gap! Two runs!",
    "🏏 Defended well!",
    "💪 Patient block!",
    "😔 OUT! Playing defensively!",
    "🎯 OUT! Caught at short leg!",
];

export const getShotOutcome = (shotType: ShotType): ShotResult => {
    let outcomes: ShotResult[];
    let messages: string[];
    
    switch (shotType) {
        case 'aggressive':
            messages = aggressiveMessages;
            outcomes = [
                { runs: 6, isWicket: false, message: "", animation: "six" },
                { runs: 4, isWicket: false, message: "", animation: "boundary" },
                { runs: 1, isWicket: false, message: "", animation: "single" },
                { runs: 0, isWicket: true, message: "", animation: "wicket" },
            ];
            break;
        case 'defensive':
            messages = defensiveMessages;
            outcomes = [
                { runs: 1, isWicket: false, message: "", animation: "single" },
                { runs: 2, isWicket: false, message: "", animation: "double" },
                { runs: 0, isWicket: false, message: "", animation: "dot" },
                { runs: 0, isWicket: true, message: "", animation: "wicket" },
            ];
            break;
        default:
            messages = normalMessages;
            outcomes = [
                { runs: 4, isWicket: false, message: "", animation: "boundary" },
                { runs: 6, isWicket: false, message: "", animation: "six" },
                { runs: 2, isWicket: false, message: "", animation: "double" },
                { runs: 1, isWicket: false, message: "", animation: "single" },
                { runs: 0, isWicket: false, message: "", animation: "dot" },
                { runs: 0, isWicket: true, message: "", animation: "wicket" },
            ];
    }
    
    const randomIndex = Math.floor(Math.random() * outcomes.length);
    const outcome = outcomes[randomIndex];
    const messageIndex = Math.floor(Math.random() * messages.length);
    
    return {
        ...outcome,
        message: messages[messageIndex].replace(/[^💥🎯⚡💪🏏🔥🛡️👍😔😱🧤]/g, '') || outcome.animation === "six" ? "SIX!" : outcome.animation === "boundary" ? "FOUR!" : outcome.isWicket ? "OUT!" : `${outcome.runs} run${outcome.runs > 1 ? 's' : ''}`
    };
};