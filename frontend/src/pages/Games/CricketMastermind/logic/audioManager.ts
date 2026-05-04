// frontend/src/pages/Games/CricketMastermind/logic/audioManager.ts

export class AudioManager {
    private synthesis: SpeechSynthesis | null = null;
    private audio: HTMLAudioElement | null = null;
    private isSpeaking: boolean = false;
    
    constructor() {
        if (typeof window !== 'undefined' && window.speechSynthesis) {
            this.synthesis = window.speechSynthesis;
        }
    }
    
    speak(text: string): void {
        if (!this.synthesis) {
            console.warn('Speech synthesis not supported');
            return;
        }
        
        // Cancel any ongoing speech
        this.stopSpeaking();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        // Try to use an English voice if available
        const voices = this.synthesis.getVoices();
        const englishVoice = voices.find(voice => voice.lang.startsWith('en'));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        utterance.onstart = () => {
            this.isSpeaking = true;
        };
        
        utterance.onend = () => {
            this.isSpeaking = false;
        };
        
        utterance.onerror = () => {
            this.isSpeaking = false;
            console.warn('Speech synthesis error');
        };
        
        this.synthesis.speak(utterance);
    }
    
    stopSpeaking(): void {
        if (this.synthesis && this.isSpeaking) {
            this.synthesis.cancel();
            this.isSpeaking = false;
        }
    }
    
    playSound(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.audio) {
                this.audio.pause();
                this.audio = null;
            }
            
            this.audio = new Audio(url);
            this.audio.onended = () => {
                this.audio = null;
                resolve();
            };
            this.audio.onerror = () => {
                this.audio = null;
                reject(new Error(`Failed to play sound: ${url}`));
            };
            
            this.audio.play().catch(reject);
        });
    }
    
    playCorrectSound(): void {
        this.playSound('/audio/quiz/correct.mp3').catch(() => {
            // Fallback: speak "Correct!"
            this.speak('Correct!');
        });
    }
    
    playWrongSound(): void {
        this.playSound('/audio/quiz/wrong.mp3').catch(() => {
            // Fallback: speak "Wrong!"
            this.speak('Wrong answer!');
        });
    }
    
    playTimeoutSound(): void {
        this.playSound('/audio/quiz/timeout.mp3').catch(() => {
            this.speak('Time is up!');
        });
    }
    
    playVictorySound(): void {
        this.playSound('/audio/quiz/victory.mp3').catch(() => {
            this.speak('Congratulations!');
        });
    }
    
    stop(): void {
        this.stopSpeaking();
        if (this.audio) {
            this.audio.pause();
            this.audio = null;
        }
    }
}

// Create a singleton instance
export const audioManager = new AudioManager();