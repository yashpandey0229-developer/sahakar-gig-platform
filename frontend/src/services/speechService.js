// Hyper-Realistic Multilingual Speech & Web Audio Sound Engine (SIH26089)

class SpeechService {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.audioContext = null;
    this.initAudioContext();
    this.initRecognition();
  }

  initAudioContext() {
    if (typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.audioContext = new AudioCtx();
      }
    }
  }

  // Synthesizes pleasant acoustic chimes for mic activation & job alerts
  playChime(type = 'activate') {
    if (!this.audioContext) this.initAudioContext();
    if (!this.audioContext) return;

    try {
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume();
      }

      const now = this.audioContext.currentTime;
      const osc = this.audioContext.createOscillator();
      const gain = this.audioContext.createGain();

      osc.connect(gain);
      gain.connect(this.audioContext.destination);

      if (type === 'activate') {
        // Futuristic gentle high-tech chime (Siri/Gemini style)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880.00, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'alert') {
        // Warm double chime for new gig dispatch
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.24); // G5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'success') {
        // Harmonic celebratory chime
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.2);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      }
    } catch (e) {
      console.warn('Audio chime notice:', e.message);
    }
  }

  initRecognition() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true; // live interim transcription
        this.recognition.maxAlternatives = 1;
      }
    }
  }

  speak(text, lang = 'hi') {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech synthesis not supported on this device.');
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.98; // Natural, clear cadence
      utterance.pitch = 1.04; // Warm, friendly tone

      // Select natural voice (Hindi / Indian English)
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(v => 
        (lang === 'hi' && (v.lang.includes('hi') || v.name.includes('Hindi') || v.name.includes('Swara') || v.name.includes('Madhur'))) ||
        (lang === 'en' && (v.lang.includes('en-IN') || v.name.includes('India') || v.name.includes('Ravi') || v.name.includes('Heera')))
      );

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error('Speech synthesis error:', e);
    }
  }

  listen(onResult, onError, lang = 'hi') {
    this.playChime('activate');

    if (!this.recognition) {
      this.initRecognition();
    }
    if (!this.recognition) {
      if (onError) onError('Speech recognition is not supported in this browser. Please use Chrome/Edge or click below.');
      return;
    }

    try {
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      
      this.recognition.onstart = () => {
        this.isListening = true;
      };

      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const resultText = finalTranscript || interimTranscript;
        if (resultText && onResult) {
          onResult(resultText, !!finalTranscript);
        }
      };

      this.recognition.onerror = (event) => {
        this.isListening = false;
        if (onError) onError(event.error);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
    } catch (err) {
      this.isListening = false;
      if (onError) onError(err.message || 'Microphone access issue');
    }
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}

export const speechService = new SpeechService();
