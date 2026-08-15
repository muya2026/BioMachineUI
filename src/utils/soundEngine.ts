/**
 * Sound Engine for BioMachineUI
 * Uses Tone.js to create procedural audio feedback
 * - Ambient drone for background atmosphere
 * - Micro-clicks on hover interactions
 * - Synth pulses on successful compilation
 */

import * as Tone from 'tone';

class SoundEngine {
  private ambientDrone: Tone.Synth | null = null;
  private clickSynth: Tone.Synth | null = null;
  private pulseSynth: Tone.Synth | null = null;
  private reverb: Tone.Reverb | null = null;
  private isInitialized: boolean = false;

  /**
   * Initialize the audio engine (must be called after user interaction)
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await Tone.start();
      
      // Create reverb for spatial effect
      this.reverb = new Tone.Reverb({
        decay: 3,
        wet: 0.3,
      }).toDestination();

      // Ambient drone - low frequency background sound
      this.ambientDrone = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 2,
          decay: 1,
          sustain: 0.5,
          release: 2,
        },
      }).connect(this.reverb);

      // Micro-click synth for hover interactions
      this.clickSynth = new Tone.Synth({
        oscillator: { type: 'triangle' },
        envelope: {
          attack: 0.001,
          decay: 0.1,
          sustain: 0,
          release: 0.1,
        },
      }).toDestination();

      // Pulse synth for successful compilation
      this.pulseSynth = new Tone.Synth({
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.3,
          sustain: 0.3,
          release: 0.5,
        },
      }).toDestination();

      // Start ambient drone at very low volume
      if (this.ambientDrone) {
        this.ambientDrone.volume.value = -30;
        this.ambientDrone.triggerAttack('C2');
      }

      this.isInitialized = true;
      console.log('[SoundEngine] Initialized');
    } catch (error) {
      console.warn('[SoundEngine] Initialization failed:', error);
    }
  }

  /**
   * Play a micro-click sound for hover interactions
   */
  playHover(frequency: number = 800): void {
    if (!this.isInitialized || !this.clickSynth) return;
    
    const freq = frequency + Math.random() * 200 - 100;
    this.clickSynth.triggerAttackRelease(freq, '32n');
  }

  /**
   * Play a success pulse when code compiles successfully
   */
  playSuccess(): void {
    if (!this.isInitialized || !this.pulseSynth) return;

    // Play a ascending arpeggio
    const now = Tone.now();
    this.pulseSynth.triggerAttackRelease('C5', '16n', now);
    this.pulseSynth.triggerAttackRelease('E5', '16n', now + 0.1);
    this.pulseSynth.triggerAttackRelease('G5', '16n', now + 0.2);
  }

  /**
   * Play an error sound for compilation failures
   */
  playError(): void {
    if (!this.isInitialized || !this.pulseSynth) return;

    const now = Tone.now();
    this.pulseSynth.triggerAttackRelease('C3', '16n', now);
    this.pulseSynth.triggerAttackRelease('D#3', '16n', now + 0.1);
  }

  /**
   * Stop the ambient drone
   */
  stopAmbient(): void {
    if (this.ambientDrone) {
      this.ambientDrone.triggerRelease();
    }
  }

  /**
   * Check if the engine is initialized
   */
  getInitialized(): boolean {
    return this.isInitialized;
  }
}

// Export singleton instance
export const soundEngine = new SoundEngine();
