import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import type { CarPhoto } from '../config';
import { Photo, SplitText } from './Primitives';

type Scene = { title: string; caption: string; photo?: CarPhoto; kind: string };
export default function Story({ photos }: { photos: CarPhoto[] }) {
  const ref = useRef<HTMLElement>(null);
  const front = photos.find(p => p.view === 'front') || photos[0];
  const side = photos.find(p => p.view === 'side');
  const rear = photos.find(p => p.view === 'rear');
  const detail = photos.find(p => p.view === 'detail' && p.id !== front?.id);
  const scenes: Scene[] = [
    { title: 'THE PRESENCE.', caption: 'Характер, который не требует представления.', photo: front, kind: 'front' },
    ...(side ? [{ title: 'TIMELESS DESIGN.', caption: 'Чистые линии. Свой характер.', photo: side, kind: 'side' }] : []),
    ...(detail ? [{ title: 'IN THE DETAILS.', caption: 'Всё, что делает её вашей.', photo: detail, kind: 'detail' }] : []),
    ...(rear ? [{ title: 'BUILT TO BE REMEMBERED.', caption: 'Остаётся в памяти.', photo: rear, kind: 'rear' }] : []),
    { title: 'OCTAVIA.', caption: 'Р770УВ / 64 RUS', photo: front, kind: 'final' },
  ];
  const key = photos.map(p => p.id).join(',');
  useLayoutEffect(() => {
    const media = gsap.matchMedia();
    const ctx = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        const panels = gsap.utils.toArray<HTMLElement>('.story-panel');
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: () => `+=${window.innerHeight * panels.length * 0.9}`, pin: true, scrub: 1.1, anticipatePin: 1, invalidateOnRefresh: true } });
        panels.forEach((panel, i) => {
          const image = panel.querySelector('.story-photo');
          if (i) tl.to(panels[i - 1], { autoAlpha: 0, duration: 0.6 }, i * 2 - 0.6).to(panel, { autoAlpha: 1, duration: 0.6 }, i * 2 - 0.6);
          if (image) tl.fromTo(image, { scale: i === panels.length - 1 ? 1.12 : 1, xPercent: 0 }, { scale: i === panels.length - 1 ? 1 : 1.07, xPercent: scenes[i].kind === 'side' ? -2 : 0, duration: 1.8, ease: 'none' }, i * 2);
          else tl.to(panel.querySelector('.scene-number'), { yPercent: -10, duration: 1.8, ease: 'none' }, i * 2);
          tl.fromTo(panel.querySelector('.scene-copy'), { y: 16 }, { y: -12, duration: 1.8, ease: 'none' }, i * 2);
        });
        tl.to('.story-progress-fill', { scaleX: 1, duration: tl.duration(), ease: 'none' }, 0);
      });
    }, ref);
    return () => { media.revert(); ctx.revert(); };
    // Config/media identity controls scene rebuilding; no animation on ordinary UI updates.
  }, [key]);
  return <section id="story" ref={ref} className={`story ${front ? 'has-media' : 'type-story'}`} aria-label="История автомобиля">
    <div className="story-top"><span>Одна машина. Своя история.</span><span>BLACK / 2010</span></div>
    <div className="story-panels">{scenes.map((scene, i) => <article className={`story-panel scene-${scene.kind}`} key={scene.title}>
      {scene.photo && <div className="story-media"><Photo photo={scene.photo} className="story-photo" /></div>}
      <span className="scene-number" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
      <div className="scene-copy"><p className="scene-label">{String(i + 1).padStart(2,'0')} / {String(scenes.length).padStart(2,'0')}</p><h2><SplitText text={scene.title} /></h2><p>{scene.caption}</p></div>
    </article>)}</div>
    <div className="story-progress" aria-hidden="true"><div className="story-progress-fill" /></div>
  </section>;
}
