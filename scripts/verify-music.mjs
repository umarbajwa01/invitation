import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

fs.mkdirSync('.checks', { recursive: true });
const compiled = ts.transpileModule(fs.readFileSync('src/music.ts', 'utf8'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;
fs.writeFileSync('.checks/music.cjs', compiled);
const { InvitationMusic } = createRequire(import.meta.url)('../.checks/music.cjs');
const settle = async () => { for (let i=0;i<5;i++) await new Promise(resolve => setImmediate(resolve)); };
function setup() {
  const state = { contexts: [], muted: false, failResume: false, failFetch: false, fetches: 0 };
  globalThis.window = { AudioContext: class {
    state = 'suspended'; currentTime = 10; destination = {}; sources = []; ramps = [];
    resumes = 0; suspends = 0;
    constructor() { state.contexts.push(this); }
    createGain() { const c=this;return {gain:{value:0,cancelScheduledValues(){},setValueAtTime(v){this.value=v;},linearRampToValueAtTime(v,t){this.value=v;c.ramps.push([v,t]);}},connect(){},disconnect(){}}; }
    async resume() { this.resumes++;if(state.failResume)throw new Error('Blocked');this.state='running'; }
    async suspend() { this.suspends++;this.state='suspended'; }
    async close() { this.state='closed'; }
    async decodeAudioData() { return {duration:32}; }
    createBufferSource() { const source={starts:0,loop:false,connect(){},disconnect(){},start(){this.starts++;},stop(){}};this.sources.push(source);return source; }
  }};
  globalThis.fetch = async () => { state.fetches++;return {ok:!state.failFetch,arrayBuffer:async()=>new ArrayBuffer(8)}; };
  state.player = new InvitationMusic('/audio/test.wav', muted => state.muted=muted);
  return state;
}

const originalWindow=globalThis.window, originalFetch=globalThis.fetch;
try {
  const s=setup();
  await s.player.preload();
  assert.equal(s.contexts.length,0,'Preload must not create or start an audio context');
  s.player.startFromGesture();
  const c=s.contexts[0];
  assert.equal(c.resumes,1,'Unlock must happen synchronously in the seal interaction');
  await settle();
  assert.equal(c.sources.length,1);assert.equal(c.sources[0].starts,1);
  assert.equal(c.sources[0].loop,true);assert.equal(c.sources[0].loopEnd,32);
  assert.deepEqual(c.ramps.at(-1),[.2,12],'Fade to 20% over two seconds');
  s.player.startFromGesture(); await settle();
  assert.equal(c.sources.length,1,'Replay must reuse the existing source');
  s.player.toggleMute();assert.equal(c.ramps.at(-1)[0],0);assert.equal(s.muted,true);
  s.player.toggleMute();await settle();assert.equal(s.muted,false);
  assert.equal(c.sources[0].starts,1,'Mute/unmute must preserve the audio playhead');
  s.player.setHidden(true);await settle();assert.equal(c.state,'suspended');
  s.player.setHidden(false);await settle();assert.equal(c.state,'running');
  assert.equal(c.sources.length,1,'Visibility resume must not recreate the loop');
  s.player.toggleMute();s.player.setHidden(true);await settle();
  const resumes=c.resumes;s.player.setHidden(false);await settle();
  assert.equal(c.resumes,resumes,'Muted music must not auto-resume when visible');
  s.player.dispose();assert.equal(c.state,'closed');
  console.log('PASS Gesture unlock, 20% fade, persistent loop, Replay, mute and visibility lifecycle');

  const blocked=setup();blocked.failResume=true;
  assert.doesNotThrow(()=>blocked.player.startFromGesture());await settle();
  assert.equal(blocked.muted,true);
  blocked.failResume=false;blocked.player.toggleMute();await settle();
  assert.equal(blocked.muted,false);assert.equal(blocked.contexts[0].sources.length,1);
  blocked.player.dispose();
  console.log('PASS Blocked playback fails silently and recovers from the same mute control');

  const failed=setup();failed.failFetch=true;failed.player.startFromGesture();await settle();
  assert.equal(failed.muted,true);assert.equal(failed.contexts[0].sources.length,0);
  failed.failFetch=false;failed.player.toggleMute();await settle();
  assert.equal(failed.muted,false);assert.equal(failed.contexts[0].sources.length,1);
  failed.player.dispose();
  console.log('PASS Failed asset request recovers without affecting invitation controls');
} finally { globalThis.window=originalWindow;globalThis.fetch=originalFetch; }
console.log('Audio engine tests use a simulated Web Audio context; browser policies and audible output remain browser checks.');
