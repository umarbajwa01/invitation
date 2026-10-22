import type { ReactNode } from 'react';
import { invitationConfig as config, defaultInvitation, defaultThankYou, messageParagraphs, eventDisplay } from '../config';
import { FloralDecoration, OrnamentalFrame, Flourish, Rings, Arrow } from './Ornaments';

export const scenes = [
  { id: 'invitation', label: 'Invitation' }, { id: 'couple', label: 'Our names' },
  { id: 'date', label: 'The date' }, { id: 'thanks', label: 'With gratitude' }
];

function Scene({ id, children, className = '', number }: { id: string; children: ReactNode; className?: string; number: string }) {
  return <section id={id} className={`scene scene--${id} ${className}`} aria-labelledby={`${id}-heading`}>
    <OrnamentalFrame/><FloralDecoration placement="upper"/><FloralDecoration placement="lower"/>
    <div className="scene-content">{children}</div>
    <span className="scene-number" aria-hidden="true">{number} <span>/</span> IV</span>
  </section>;
}
function Paragraphs({ lines }: { lines: string[] }) { return <div className="message reveal">{lines.map((line,i) => <p key={i}>{line}</p>)}</div>; }
export function InvitationMessage({ goTo }: { goTo: (id: string) => void }) {
  return <Scene id="invitation" number="I">
    <span className="eyebrow reveal">WITH LOVE &amp; JOY</span>
    <h1 id="invitation-heading" tabIndex={-1} className="reveal">You Are<br/><em>Cordially Invited</em></h1>
    <Flourish className="reveal"/>
    <Paragraphs lines={messageParagraphs(config.content.invitationMessage, defaultInvitation)}/>
    <p className="sentiment reveal">Your presence will make our<br className="wide-break"/> celebration even more special.</p>
    <button className="text-button scroll-down reveal" onClick={() => goTo('couple')}>Scroll Down <Arrow/></button>
  </Scene>;
}
export function CoupleNames() {
  return <Scene id="couple" number="II">
    <span className="eyebrow reveal">TWO HEARTS,<br/>ONE BEAUTIFUL BEGINNING</span>
    <Rings/>
    <h2 id="couple-heading" className="couple-names reveal" tabIndex={-1}><span>{config.person1.name}</span><i>and</i><span>{config.person2.name}</span></h2>
    <Flourish className="reveal"/>
    <p className="sentiment reveal">Together, a beautiful<br/>new chapter begins.</p>
  </Scene>;
}
export function EngagementDate() {
  const date = eventDisplay();
  return <Scene id="date" number="III">
    <span className="eyebrow reveal">A DAY TO REMEMBER</span>
    <h2 id="date-heading" tabIndex={-1} className="reveal">The <em>Date</em></h2>
    <div className="date-plaque reveal" aria-label={`${date.weekday}, ${date.month} ${date.day}, ${date.year}`}>
      <div className="date-plaque-inner"><Flourish/><span className="date-month">{date.month}</span><span className={`date-day ${config.event.date ? '' : 'date-day--empty'}`}>{date.day}</span><span className="date-year">{date.year}</span><Flourish/></div>
    </div>
    <div className="date-details reveal"><span className="weekday">{date.weekday}</span><span className="event-time">{date.time}</span><span className="timezone">{date.zone}</span><span className="event-location">{config.event.location}</span></div>
    <p className="sentiment reveal">A beautiful moment,<br/>a memory to treasure.</p>
  </Scene>;
}
export function ThankYouScene({ goTo }: { goTo: (id: string) => void }) {
  return <Scene id="thanks" number="IV">
    <span className="eyebrow reveal">WITH HEARTFELT GRATITUDE</span>
    <h2 id="thanks-heading" tabIndex={-1} className="reveal">Thank You<br/><em>for Coming</em></h2>
    <Flourish className="reveal"/>
    <Paragraphs lines={messageParagraphs(config.content.thankYouMessage, defaultThankYou)}/>
    <div className="signature reveal"><span>With Love,</span><p>{config.person1.name}<i>&amp;</i>{config.person2.name}</p></div>
    <p className="sentiment final-line reveal">Forever grateful for your<br/>love and blessings.</p>
    <button className="text-button reveal" onClick={() => goTo('invitation')}>Back to Beginning <Arrow up/></button>
  </Scene>;
}
export function SceneNavigation({ active, goTo, replay }: { active: number; goTo: (id: string) => void; replay: () => void }) {
  return <nav className="scene-navigation" aria-label="Invitation navigation"><div className="nav-dots">
    {scenes.map((scene,index) => <button key={scene.id} aria-label={`Go to ${scene.label}`} aria-current={index === active ? 'step' : undefined}
      className={index === active ? 'dot-button is-active' : 'dot-button'} onClick={() => goTo(scene.id)}><span/></button>)}
    </div><span className="nav-divider"/><button className="replay-button" onClick={replay} aria-label="Replay the envelope opening">
      <svg width="15" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 6a5.5 5.5 0 1 1-.3 4M2 2v4h4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg><span>Replay</span>
    </button></nav>;
}
