/**
 * Pulse Detection Utility
 * Camera-based photoplethysmography (PPG) for heart rate detection
 */

export interface PulseData {
  bpm: number;
  timestamp: number;
  confidence: number;
}

export interface PulseWaveform {
  samples: number[];
  timestamps: number[];
  sampleRate: number;
}

class PulseDetector {
  private videoElement: HTMLVideoElement | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  private animationFrame: number | null = null;
  private isRunning: boolean = false;
  
  // Signal processing
  private redValues: number[] = [];
  private greenValues: number[] = [];
  private blueValues: number[] = [];
  private timestamps: number[] = [];
  private readonly maxSamples = 300; // ~10 seconds at 30fps
  
  // Face detection region (forehead area)
  private detectionRegion: { x: number; y: number; width: number; height: number } | null = null;
  
  // Callbacks
  private onPulseUpdate: ((bpm: number, confidence: number) => void) | null = null;
  private onError: ((error: string) => void) | null = null;

  /**
   * Initialize pulse detection with video element
   */
  initialize(video: HTMLVideoElement, canvas: HTMLCanvasElement): void {
    this.videoElement = video;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    if (!this.ctx) {
      throw new Error('Failed to get canvas context');
    }
  }

  /**
   * Set detection region (forehead area)
   */
  setDetectionRegion(x: number, y: number, width: number, height: number): void {
    this.detectionRegion = { x, y, width, height };
  }

  /**
   * Start pulse detection
   */
  start(
    onPulseUpdate: (bpm: number, confidence: number) => void,
    onError?: (error: string) => void
  ): void {
    if (!this.videoElement || !this.canvas || !this.ctx) {
      throw new Error('Pulse detector not initialized');
    }

    this.onPulseUpdate = onPulseUpdate;
    this.onError = onError || null;
    this.isRunning = true;
    this.redValues = [];
    this.greenValues = [];
    this.blueValues = [];
    this.timestamps = [];

    // Default detection region (center-top of video, forehead area)
    if (!this.detectionRegion) {
      const videoWidth = this.videoElement.videoWidth || 640;
      const videoHeight = this.videoElement.videoHeight || 480;
      this.detectionRegion = {
        x: videoWidth * 0.3,
        y: videoHeight * 0.1,
        width: videoWidth * 0.4,
        height: videoHeight * 0.15
      };
    }

    this.processFrame();
  }

  /**
   * Stop pulse detection
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrame !== null) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  /**
   * Process video frame for pulse detection
   */
  private processFrame(): void {
    if (!this.isRunning || !this.videoElement || !this.canvas || !this.ctx) {
      return;
    }

    try {
      // Draw video frame to canvas
      this.canvas.width = this.videoElement.videoWidth || 640;
      this.canvas.height = this.videoElement.videoHeight || 480;
      this.ctx.drawImage(this.videoElement, 0, 0, this.canvas.width, this.canvas.height);

      if (this.detectionRegion) {
        // Extract pixel data from detection region
        const imageData = this.ctx.getImageData(
          this.detectionRegion.x,
          this.detectionRegion.y,
          this.detectionRegion.width,
          this.detectionRegion.height
        );

        // Calculate average RGB values
        let rSum = 0, gSum = 0, bSum = 0;
        const pixelCount = imageData.data.length / 4;

        for (let i = 0; i < imageData.data.length; i += 4) {
          rSum += imageData.data[i];     // Red
          gSum += imageData.data[i + 1]; // Green
          bSum += imageData.data[i + 2];  // Blue
        }

        const avgRed = rSum / pixelCount;
        const avgGreen = gSum / pixelCount;
        const avgBlue = bSum / pixelCount;

        // Store values
        const timestamp = Date.now();
        this.redValues.push(avgRed);
        this.greenValues.push(avgGreen);
        this.blueValues.push(avgBlue);
        this.timestamps.push(timestamp);

        // Keep only recent samples
        if (this.redValues.length > this.maxSamples) {
          this.redValues.shift();
          this.greenValues.shift();
          this.blueValues.shift();
          this.timestamps.shift();
        }

        // Calculate pulse when we have enough samples (at least 3 seconds)
        if (this.redValues.length >= 90) { // ~3 seconds at 30fps
          const bpm = this.calculateBPM(this.greenValues, this.timestamps);
          const confidence = this.calculateConfidence(this.greenValues);
          
          if (this.onPulseUpdate && bpm > 0) {
            this.onPulseUpdate(bpm, confidence);
          }
        }
      }
    } catch (error) {
      if (this.onError) {
        this.onError(`Pulse detection error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    this.animationFrame = requestAnimationFrame(() => this.processFrame());
  }

  /**
   * Calculate BPM from signal using FFT or peak detection
   */
  private calculateBPM(signal: number[], timestamps: number[]): number {
    if (signal.length < 60) return 0;

    // Remove DC component (mean)
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    const normalized = signal.map(v => v - mean);

    // Simple peak detection method
    const peaks = this.findPeaks(normalized);
    
    if (peaks.length < 2) return 0;

    // Calculate average time between peaks
    const intervals: number[] = [];
    for (let i = 1; i < peaks.length; i++) {
      const interval = timestamps[peaks[i]] - timestamps[peaks[i - 1]];
      intervals.push(interval);
    }

    if (intervals.length === 0) return 0;

    const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
    const bpm = (60000 / avgInterval); // Convert ms to BPM

    // Validate BPM range (30-200 BPM)
    return Math.max(30, Math.min(200, Math.round(bpm)));
  }

  /**
   * Find peaks in signal
   */
  private findPeaks(signal: number[]): number[] {
    const peaks: number[] = [];
    const threshold = 0.1 * Math.max(...signal.map(Math.abs));

    for (let i = 1; i < signal.length - 1; i++) {
      if (signal[i] > signal[i - 1] && signal[i] > signal[i + 1] && signal[i] > threshold) {
        peaks.push(i);
      }
    }

    return peaks;
  }

  /**
   * Calculate confidence score (0-1)
   */
  private calculateConfidence(signal: number[]): number {
    if (signal.length < 60) return 0;

    // Calculate signal-to-noise ratio
    const mean = signal.reduce((a, b) => a + b, 0) / signal.length;
    const variance = signal.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / signal.length;
    const stdDev = Math.sqrt(variance);

    // Higher variance = better signal (more variation = pulse visible)
    const confidence = Math.min(1, stdDev / 10); // Normalize

    return Math.round(confidence * 100) / 100;
  }

  /**
   * Get current waveform data
   */
  getWaveform(): PulseWaveform {
    return {
      samples: [...this.greenValues],
      timestamps: [...this.timestamps],
      sampleRate: 30 // Assuming 30fps
    };
  }

  /**
   * Reset detector
   */
  reset(): void {
    this.stop();
    this.redValues = [];
    this.greenValues = [];
    this.blueValues = [];
    this.timestamps = [];
    this.detectionRegion = null;
  }
}

export const pulseDetector = new PulseDetector();

