// One persistent, sample-looped player. Nothing here depends on the current scene.
export class InvitationMusic {
  private context: AudioContext | null = null;
  private gain: GainNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private bytes: Promise<ArrayBuffer | null> | null = null;
  private loading: Promise<void> | null = null;
  private muted = false;
  private requested = false;
  private hidden = false;
  private resumeOnVisible = false;
  private disposed = false;

  constructor(private url: string, private reportMuted: (muted: boolean) => void) {}

  preload() {
    if (!this.bytes) {
      this.bytes = fetch(this.url).then(response => {
        if (!response.ok) throw new Error('Audio unavailable');
        return response.arrayBuffer();
      }).catch(() => { this.bytes = null; return null; });
    }
    return this.bytes;
  }

  // Called directly inside the seal's click handler, before awaiting anything.
  startFromGesture() {
    if (this.disposed || (this.requested && this.muted)) return;
    this.requested = true;
    try {
      if (!this.context) {
        const Audio = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        this.context = new Audio({ latencyHint: 'playback' });
        this.gain = this.context.createGain();
        this.gain.gain.value = 0;
        this.gain.connect(this.context.destination);
      }
      // Reopening after Replay leaves the existing source and playhead intact.
      if (this.source && this.context.state === 'running') return;
      void this.play();
    } catch { this.blocked(); }
  }

  private async loadSource() {
    if (this.source || this.disposed) return;
    if (this.loading) return this.loading;
    this.loading = (async () => {
      const bytes = await this.preload();
      if (!bytes || this.disposed || !this.context) throw new Error('Audio unavailable');
      const buffer = await this.context.decodeAudioData(bytes.slice(0));
      if (this.disposed || !this.context || !this.gain) return;
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.loopStart = 0;
      source.loopEnd = buffer.duration;
      source.connect(this.gain);
      this.source = source;
      source.start();
    })().finally(() => { this.loading = null; });
    return this.loading;
  }

  private async play() {
    try {
      // resume() executes synchronously in the initiating gesture's call stack.
      await Promise.all([this.context!.resume(), this.loadSource()]);
      if (this.disposed) return;
      if (this.hidden) {
        this.resumeOnVisible = !this.muted;
        await this.context!.suspend();
        return;
      }
      this.fade(this.muted ? 0 : 0.2, 2);
      this.reportMuted(this.muted);
    } catch { this.blocked(); }
  }

  private fade(target: number, seconds: number) {
    if (!this.context || !this.gain || this.disposed) return;
    const t = this.context.currentTime;
    const volume = this.gain.gain;
    volume.cancelScheduledValues(t);
    volume.setValueAtTime(volume.value, t);
    volume.linearRampToValueAtTime(target, t + seconds);
  }

  private blocked() {
    if (this.disposed) return;
    this.muted = true;
    this.fade(0, 0.1);
    this.reportMuted(true);
  }

  toggleMute() {
    if (this.disposed) return;
    this.muted = !this.muted;
    this.reportMuted(this.muted);
    if (this.muted) this.fade(0, 0.15);
    else if (this.context) void this.play();
    else this.startFromGesture();
  }

  setHidden(hidden: boolean) {
    this.hidden = hidden;
    if (!this.context || !this.requested || this.disposed) return;
    if (hidden) {
      this.resumeOnVisible = this.context.state === 'running' && !this.muted;
      this.fade(0, 0);
      void this.context.suspend().catch(() => {});
    } else if (this.resumeOnVisible) {
      this.resumeOnVisible = false;
      void this.play();
    }
  }

  dispose() {
    this.disposed = true;
    this.source?.stop();
    this.source?.disconnect();
    this.gain?.disconnect();
    void this.context?.close().catch(() => {});
  }
}
