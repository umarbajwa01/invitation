import { invitationConfig } from '../config';

export function FloralDecoration({ placement }: { placement: string }) {
  return <span className={`floral floral--${placement}`} aria-hidden="true">
    <img src={invitationConfig.design.floralReference} alt="" width="941" height="1672"
      draggable="false" onError={e => { e.currentTarget.style.visibility = 'hidden'; }} />
  </span>;
}
export function Flourish({ className = '' }: { className?: string }) {
  return <svg className={`flourish ${className}`} viewBox="0 0 160 28" fill="none" aria-hidden="true">
    <path d="M7 14h42c13 0 18-9 26-9-5 1-5 8 5 9-10 1-10 8-5 9-8 0-13-9-26-9m104 0h-42c-13 0-18-9-26-9 5 1 5 8-5 9 10 1 10 8 5 9 8 0 13-9 26-9" stroke="currentColor" strokeWidth=".8"/>
    <path d="m80 9 5 5-5 5-5-5z" fill="currentColor"/>
    <circle cx="5" cy="14" r="1.2" fill="currentColor"/><circle cx="155" cy="14" r="1.2" fill="currentColor"/>
  </svg>;
}
export function OrnamentalFrame() {
  return <div className="ornamental-frame" aria-hidden="true"><span/><i className="frame-gem"/></div>;
}
export function Rings() {
  return <svg className="rings" viewBox="0 0 100 74" fill="none" aria-hidden="true">
    <circle cx="39" cy="44" r="22" stroke="currentColor" strokeWidth="1.15"/>
    <circle cx="61" cy="44" r="22" stroke="currentColor" strokeWidth="1.15"/>
    <path d="m50 7 7 7-7 9-7-9 7-7Zm-7 7h14M48 7l-2 7 4 9 4-9-2-7" stroke="currentColor" strokeWidth=".9"/>
    <path d="M50 1v3M38 6l3 3m21-3-3 3M31 16l4 1m34-1-4 1" stroke="currentColor" strokeWidth=".8"/>
  </svg>;
}
export function Arrow({ up = false }: { up?: boolean }) {
  return <svg className={up ? 'arrow arrow--up' : 'arrow'} width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden="true">
    <path d="M7 1v15m-5-5 5 5 5-5" stroke="currentColor" strokeWidth="1"/>
  </svg>;
}
