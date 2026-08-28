// Speech recognition & synthesis helper with robust browser support

type RecognitionCallback = (text: string, isFinal: boolean) => void;
type ErrorCallback = (error: string) => void;

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

class SpeechService {
  private recognition: any = null;
  private isListening: boolean = false;
  private audioStream: MediaStream | null = null;
  private audioAnalyser: AnalyserNode | null = null;
  private audioCtx: AudioContext | null = null;

  constructor() {
    const win = typeof window !== 'undefined' ? (window as IWindow) : null;
    if (win) {
      const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognitionClass) {
        try {
          this.recognition = new SpeechRecognitionClass();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.lang = 'en-US';
          this.recognition.maxAlternatives = 3;
        } catch {
          this.recognition = null;
        }
      }
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }

  // Speak text with Native SpeechSynthesis
  public speak(text: string, rate: number = 1.0, onEnd?: () => void): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'en-US';
      utterance.pitch = 1.05; // Slightly clear & friendly

      // Select natural English voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => (v.lang === 'en-US' || v.lang.startsWith('en')) && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Alex'))
      );
      if (preferred) {
        utterance.voice = preferred;
      }

      utterance.onend = () => {
        if (onEnd) onEnd();
        resolve();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // Start speech recognition
  public startListening(
    onResult: RecognitionCallback,
    onError?: ErrorCallback,
    onMicLevel?: (level: number) => void
  ): boolean {
    if (this.isListening) {
      this.stopListening();
    }

    // Try starting mic amplitude monitor
    this.startMicMonitor(onMicLevel);

    if (!this.recognition) {
      // Fallback: If Web Speech API not present in current browser environment,
      // simulate speech recognition after audio capture
      this.isListening = true;
      return false;
    }

    try {
      this.isListening = true;

      this.recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }

        if (final) {
          onResult(final.trim(), true);
        } else if (interim) {
          onResult(interim.trim(), false);
        }
      };

      this.recognition.onerror = (event: any) => {
        this.isListening = false;
        if (onError) onError(event.error || 'speech_recognition_error');
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      return true;
    } catch (err: any) {
      this.isListening = false;
      if (onError) onError(err.message || 'failed_to_start');
      return false;
    }
  }

  public stopListening() {
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
    }
    this.stopMicMonitor();
  }

  private async startMicMonitor(onMicLevel?: (level: number) => void) {
    if (!onMicLevel || typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      this.audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      this.audioCtx = new AudioCtx();
      const source = this.audioCtx.createMediaStreamSource(this.audioStream);
      this.audioAnalyser = this.audioCtx.createAnalyser();
      this.audioAnalyser.fftSize = 256;
      source.connect(this.audioAnalyser);

      const bufferLength = this.audioAnalyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkLevel = () => {
        if (!this.isListening || !this.audioAnalyser) return;
        this.audioAnalyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        onMicLevel(normalized);
        requestAnimationFrame(checkLevel);
      };

      requestAnimationFrame(checkLevel);
    } catch {
      // Permission denied or audio context blocked
    }
  }

  private stopMicMonitor() {
    if (this.audioStream) {
      this.audioStream.getTracks().forEach((t) => t.stop());
      this.audioStream = null;
    }
    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
    this.audioAnalyser = null;
  }
}

export const speechService = new SpeechService();
