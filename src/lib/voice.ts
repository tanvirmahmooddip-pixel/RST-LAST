/**
 * Free Web Speech API Engine for Voice AI, Speech-to-Text & Text-to-Speech
 */
export interface VoiceCommandResult {
  transcript: string;
  isFinal: boolean;
}

export class VoiceEngine {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static voices: SpeechSynthesisVoice[] = [];

  public static isSpeechRecognitionSupported(): boolean {
    return typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  }

  public static isSpeechSynthesisSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public static getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSpeechSynthesisSupported()) return [];
    if (this.voices.length === 0) {
      this.voices = window.speechSynthesis.getVoices();
    }
    return this.voices;
  }

  // Text-To-Speech (Speech Synthesis)
  public static speak(text: string, lang: string = 'en-US', onEnd?: () => void) {
    if (!this.isSpeechSynthesisSupported()) {
      return;
    }

    try {
      window.speechSynthesis.cancel(); // stop previous utterance
      const cleanText = text.replace(/[*_#`]/g, ''); // strip markdown
      const utterance = new SpeechSynthesisUtterance(cleanText);
      
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.lang = lang;

      const available = this.getVoices();
      const preferred = available.find(v => v.lang.startsWith(lang.slice(0, 2)));
      if (preferred) {
        utterance.voice = preferred;
      }

      if (onEnd) {
        utterance.onend = onEnd;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Voice synthesis error:', e);
    }
  }

  public static stopSpeaking() {
    if (this.isSpeechSynthesisSupported()) {
      window.speechSynthesis.cancel();
    }
  }

  // Speech-To-Text (Speech Recognition)
  public static startListening(
    onResult: (result: VoiceCommandResult) => void,
    onError: (err: string) => void,
    onStop: () => void,
    lang: string = 'en-US'
  ): boolean {
    if (!this.isSpeechRecognitionSupported()) {
      onError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or a modern browser.');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = lang;

      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event: any) => {
        let transcript = '';
        let isFinal = false;
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            isFinal = true;
          }
        }
        onResult({ transcript, isFinal });
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        onError(event.error || 'Speech recognition error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        onStop();
      };

      this.recognition.start();
      return true;
    } catch (e: any) {
      this.isListening = false;
      onError(e.message || 'Could not start microphone');
      return false;
    }
  }

  public static stopListening() {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.isListening = false;
    }
  }

  public static get listening(): boolean {
    return this.isListening;
  }
}
