// frontend/src/pages/Games/KwikCricket/components/Commentary.tsx
import React, { useRef, useEffect } from 'react';

interface CommentaryProps {
    messages: string[];
    maxMessages?: number;
}

export const Commentary: React.FC<CommentaryProps> = ({ messages, maxMessages = 8 }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);
    
    const displayMessages = messages.slice(-maxMessages);
    
    return (
        <div className="bg-gray-900 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-2 flex items-center gap-2">
                <span>📝</span>
                <span>COMMENTARY</span>
            </div>
            <div 
                ref={containerRef}
                className="space-y-1 h-32 overflow-y-auto"
            >
                {displayMessages.map((msg, idx) => (
                    <div key={idx} className="text-white text-sm py-0.5 border-b border-gray-800 last:border-0">
                        {msg}
                    </div>
                ))}
                {messages.length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-4">
                        Commentary will appear here...
                    </div>
                )}
            </div>
        </div>
    );
};