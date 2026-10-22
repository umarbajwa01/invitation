import { useEffect, useRef, useState } from 'react';
import { InvitationMusic } from '../music';

export function useInvitationMusic() {
  const player = useRef<InvitationMusic | null>(null);
  const [muted, setMuted] = useState(false);
  const [activated, setActivated] = useState(false);
  const getPlayer = () => player.current ??= new InvitationMusic('/audio/a-beautiful-beginning.wav', setMuted);
  useEffect(() => {
    const music = getPlayer();
    void music.preload();
    const visibility = () => music.setHidden(document.hidden);
    visibility();
    document.addEventListener('visibilitychange', visibility);
    return () => {
      document.removeEventListener('visibilitychange', visibility);
      music.dispose();
      if (player.current === music) player.current = null;
    };
  }, []);
  return {
    muted, activated,
    start: () => { getPlayer().startFromGesture(); setActivated(true); },
    toggle: () => getPlayer().toggleMute(),
  };
}

export function MusicButton({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return <button type="button" className="music-toggle" onClick={onToggle}
    aria-label={muted ? 'Unmute background music' : 'Mute background music'} aria-pressed={muted}
    title={muted ? 'Unmute music' : 'Mute music'}>
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
      {muted ? <path d="m16 9 6 6m0-6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        : <path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>}
    </svg>
  </button>;
}
