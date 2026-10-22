"""Original piano/strings composition; no recordings, samples or quoted melodies."""
from pathlib import Path
import wave
import numpy as np

RATE = 32000
SECONDS = 32
N = RATE * SECONDS
rng = np.random.default_rng(24102026)
piano = np.zeros(N, dtype=np.float64)
strings = np.zeros(N, dtype=np.float64)

def hz(midi):
    return 440 * 2 ** ((midi - 69) / 12)

def add_wrap(track, signal, start):
    indices = (np.arange(len(signal)) + round(start * RATE)) % N
    np.add.at(track, indices, signal)

def note(midi, start, level, length=4.8):
    t = np.arange(round(length * RATE)) / RATE
    f = hz(midi)
    y = np.zeros_like(t)
    for harmonic, weight in [(1, 1), (2, .32), (3, .14), (4, .065), (5, .025)]:
        # Higher piano partials decay faster; low notes retain a warm body.
        decay = np.exp(-t * (.8 + harmonic * .22))
        y += weight * np.sin(2 * np.pi * f * harmonic * t) * decay
    envelope = (1 - np.exp(-t * 230)) * np.minimum(1, (length - t) / .22)
    add_wrap(piano, y * envelope * level, start)

def pad(chord, start):
    length = 6.4
    t = np.arange(round(length * RATE)) / RATE
    attack = np.minimum(t / 1.3, 1)
    release = np.minimum((length - t) / 2.4, 1)
    envelope = np.sin(np.pi * np.clip(attack, 0, 1) / 2) ** 2 * np.sin(np.pi * np.clip(release, 0, 1) / 2) ** 2
    y = np.zeros_like(t)
    for midi in chord:
        f = hz(midi)
        for detune in [-.0008, .0008]:
            y += (np.sin(2*np.pi*f*(1+detune)*t) + .17*np.sin(4*np.pi*f*(1+detune)*t) + .045*np.sin(6*np.pi*f*(1+detune)*t)) / (len(chord)*2)
    add_wrap(strings, y * envelope * .14, start)

# Eight slow 4/4 bars at 60 BPM; Cmaj7, Am7, Fmaj7, Gadd9.
chords = [[48,55,59,64], [45,52,55,60], [41,48,52,57], [43,50,57,62]] * 2
melody = [76,79, 76,72, 72,76, 74,71, 76,79, 81,76, 77,76, 74,71]
for bar, chord in enumerate(chords):
    start = bar * 4
    pad([m + 12 for m in chord[:3]], start)
    for beat, index in enumerate([0,2,1,3]):
        note(chord[index]+12, start+beat, .10 if beat else .13)
    for half in range(2):
        note(melody[bar*2+half], start+half*2+.035, .075, 5.2)

# Circular reverberation retains tails through the sample-accurate loop boundary.
mono = piano + strings
left = mono.copy()
right = mono.copy()
for delay, amount in [(.127,.16),(.293,.12),(.491,.085),(.773,.05), (1.113,.03)]:
    left += np.roll(mono, round(delay*RATE)) * amount
    right += np.roll(mono, round((delay+.019)*RATE)) * amount
stereo = np.stack([left, right], axis=1)
stereo *= .68 / np.max(np.abs(stereo))
pcm = np.round(stereo * 32767).astype('<i2')
out = Path(__file__).resolve().parent.parent / 'public/audio/a-beautiful-beginning.wav'
with wave.open(str(out), 'wb') as file:
    file.setnchannels(2)
    file.setsampwidth(2)
    file.setframerate(RATE)
    file.writeframes(pcm.tobytes())
print(f'{out.name}: {SECONDS}s, stereo {RATE}Hz PCM; peak={np.max(np.abs(stereo)):.3f}; boundary step={np.max(np.abs(stereo[0]-stereo[-1])):.6f}')
