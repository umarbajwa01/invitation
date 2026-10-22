import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InvitationCover } from './components/InvitationCover';
import { InvitationMessage, CoupleNames, EngagementDate, ThankYouScene, SceneNavigation, scenes } from './components/Scenes';
import { invitationConfig } from './config';
import { MusicButton, useInvitationMusic } from './components/BackgroundMusic';

gsap.registerPlugin(ScrollTrigger);
type Phase = 'closed' | 'opening' | 'open';
export default function App() {
  const music = useInvitationMusic();
  const root = useRef<HTMLDivElement>(null);
  const main = useRef<HTMLElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const fallback = useRef<ReturnType<typeof setTimeout> | null>(null);
  const opening = useRef(false);
  const [phase,setPhase] = useState<Phase>('closed');
  const [active,setActive] = useState(0);
  const [reduceMotion,setReduceMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => setReduceMotion(query.matches);
    query.addEventListener('change',change);
    return () => query.removeEventListener('change',change);
  }, []);
  useEffect(() => {
    const previous = document.body.style.overflow;
    if(phase !== 'open') document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [phase]);
  useEffect(() => {
    if(!main.current) return;
    main.current.inert = phase !== 'open';
  },[phase]);
  useEffect(() => {
    const names = `${invitationConfig.person1.name} & ${invitationConfig.person2.name}`;
    document.title = names.includes('[') ? 'A Beautiful Beginning | Engagement Invitation' : `${names} | Engagement Invitation`;
  },[]);
  const finishOpening = () => {
    if(fallback.current) clearTimeout(fallback.current);
    fallback.current = null;
    setPhase('open');
    opening.current = false;
    requestAnimationFrame(() => {
      if(main.current) main.current.inert = false;
      document.getElementById('invitation-heading')?.focus({preventScroll:true});
      ScrollTrigger.refresh();
    });
  };
  const openInvitation = () => {
    if(opening.current || phase !== 'closed') return;
    music.start();
    opening.current = true;
    setPhase('opening');
    // Never leave the reading experience dependent on a timeline finishing.
    fallback.current = setTimeout(finishOpening, 3000);
    if(reduceMotion) { finishOpening(); return; }
    const el=root.current!;
    const tl = gsap.timeline({onComplete:finishOpening});
    timeline.current = tl;
    tl.to(el.querySelector('.monogram-seal'), {y:-6,scale:1.05,duration:.25,ease:'power2.out'})
      .to(el.querySelector('.seal-position'), {autoAlpha:0,scale:.96,duration:.35,ease:'power2.in'},.26)
      .to(el.querySelectorAll('.cover-copy'), {opacity:0,duration:.3},.28)
      .to(el.querySelector('.envelope-door--left'), {xPercent:-105,duration:1.5,ease:'power3.inOut'},.42)
      .to(el.querySelector('.envelope-door--right'), {xPercent:105,duration:1.5,ease:'power3.inOut'},.42)
      .fromTo(el.querySelector('#invitation .scene-content'),{opacity:0,y:12},{opacity:1,y:0,duration:.6,ease:'power2.out',clearProps:'all'},1.48);
  };
  const goTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior:reduceMotion?'instant':'smooth',block:'start'});
    document.getElementById(`${id}-heading`)?.focus({preventScroll:true});
  };
  const replay = () => {
    timeline.current?.kill();
    if(fallback.current) clearTimeout(fallback.current);
    fallback.current = null;
    window.scrollTo({top:0,behavior:'instant'});
    gsap.set(root.current!.querySelectorAll('.envelope-door,.cover-copy,.seal-position,.monogram-seal'),{clearProps:'all'});
    setActive(0); opening.current = false; setPhase('closed');
    requestAnimationFrame(() => root.current?.querySelector<HTMLButtonElement>('.monogram-seal')?.focus({preventScroll:true}));
  };
  useLayoutEffect(() => {
    if(phase !== 'open') return;
    const ctx = gsap.context(() => {
      scenes.forEach(({id},i) => {
        const el = document.getElementById(id)!;
        ScrollTrigger.create({trigger:el,start:'top 52%',end:'bottom 52%',onEnter:()=>setActive(i),onEnterBack:()=>setActive(i)});
        if(!reduceMotion && i > 0) {
          // Content remains visible even if animation initialization fails.
          gsap.from(el.querySelectorAll('.reveal'),{y:16,duration:.8,stagger:.07,ease:'power2.out',clearProps:'transform',scrollTrigger:{trigger:el,start:'top 85%',once:true}});
        }
      });
    },root);
    return () => ctx.revert();
  },[phase,reduceMotion]);
  useEffect(() => () => { timeline.current?.kill(); if(fallback.current)clearTimeout(fallback.current); },[]);
  return <div className={`invitation-canvas phase-${phase}`} ref={root}>
    <a className="skip-link" href="#invitation" onClick={e=>{e.preventDefault();if(phase==='closed') openInvitation();else goTo('invitation');}}>Read the invitation</a>
    <main ref={main} aria-hidden={phase !== 'open'}>
      <InvitationMessage goTo={goTo}/><CoupleNames/><EngagementDate/><ThankYouScene goTo={goTo}/>
    </main>
    <InvitationCover onOpen={openInvitation} phase={phase}/>
    {music.activated && <MusicButton muted={music.muted} onToggle={music.toggle}/>}
    {phase === 'open' && <SceneNavigation active={active} goTo={goTo} replay={replay}/>}
  </div>;
}
