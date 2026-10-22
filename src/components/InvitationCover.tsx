import { invitationConfig as config } from '../config';
import { FloralDecoration, Flourish } from './Ornaments';

export function EnvelopeDoor({ side }: { side: 'left' | 'right' }) {
  return <div className={`envelope-door envelope-door--${side}`}>
    <div className="door-frame"><div/></div>
    <FloralDecoration placement={`door-${side}`}/>
    <div className="door-gold-line"/>
  </div>;
}
export function MonogramSeal({ onOpen, disabled }: { onOpen: () => void; disabled: boolean }) {
  return <button className="monogram-seal" onClick={onOpen} disabled={disabled} aria-label="Open your engagement invitation">
    <span className="seal-inner"><svg viewBox="0 0 100 40" className="seal-sprig" fill="none" aria-hidden="true">
      <path d="M20 35C37 34 45 23 50 6c5 17 13 28 30 29M50 10c-13-4-15 5-6 9m6-9c13-4 15 5 6 9M42 22c-13-3-15 7-5 7m21-7c13-3 15 7 5 7" stroke="currentColor" strokeWidth="1"/>
    </svg><span className="monogram"><span>{config.person1.initial}</span><i>&amp;</i><span>{config.person2.initial}</span></span>
    <span className="seal-word">with love</span></span>
  </button>;
}
export function InvitationCover({ onOpen, phase }: { onOpen: () => void; phase: 'closed' | 'opening' | 'open' }) {
  return <div className={`invitation-cover ${phase === 'open' ? 'cover--gone' : ''}`} aria-hidden={phase === 'open'}>
    <EnvelopeDoor side="left"/><EnvelopeDoor side="right"/>
    <div className="cover-top cover-copy"><span className="eyebrow">A BEAUTIFUL BEGINNING</span><Flourish/></div>
    <div className="seal-position"><MonogramSeal onOpen={onOpen} disabled={phase !== 'closed'}/></div>
    <div className="cover-bottom cover-copy"><p>Touch the seal to open</p><span className="cover-caption">An engagement invitation</span><span className="cover-little-line"/></div>
  </div>;
}
