import { useRef, useState } from 'react';
import type { PointerEvent } from 'react';
import type { CarPhoto } from '../config';
import { Arrow, MagneticButton, Photo } from './Primitives';

export default function Garage({ photos, onChoose }: { photos: CarPhoto[]; onChoose: () => void }) {
  const [selected, setSelected] = useState(0), [zoom, setZoom] = useState(1), [studio, setStudio] = useState(true), [lights, setLights] = useState(false);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const photo = photos[Math.min(selected, photos.length - 1)];
  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setLights(false); };
  const changeZoom = (n: number) => { const next = Math.max(1, Math.min(2.5, n)); setZoom(next); if (next === 1) setPan({ x: 0, y: 0 }); };
  const pointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (zoom <= 1 || (e.target as HTMLElement).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const pointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || !stage.current) return;
    const maxX = stage.current.clientWidth * (zoom - 1) / 2, maxY = stage.current.clientHeight * (zoom - 1) / 2;
    setPan({ x: Math.max(-maxX, Math.min(maxX, drag.current.px + e.clientX - drag.current.x)), y: Math.max(-maxY, Math.min(maxY, drag.current.py + e.clientY - drag.current.y)) });
  };
  return <section className={`garage ${studio ? 'studio-on' : 'studio-off'}`} id="garage" aria-labelledby="garage-title">
    <div className="section-heading" data-reveal><div><p className="eyebrow">Ближе к характеру</p><h2 id="garage-title">THE GARAGE<span>.</span></h2></div><span className="small-note">Личный фотопросмотр</span></div>
    <div className={`garage-stage ${zoom > 1 ? 'can-pan' : ''}`} ref={stage} style={{ touchAction: zoom > 1 ? 'none' : 'pan-y' }} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }}>
      <div className="garage-light" aria-hidden="true" />
      {photo ? <div className="photo-plane" style={{ transform: `translate3d(${pan.x}px,${pan.y}px,0) scale(${zoom})` }}>
        <Photo photo={photo} lights={lights} />
        {photo.hotspots?.map(h => <button className="hotspot" key={h.id} style={{ left: `${h.x}%`, top: `${h.y}%` }} aria-label={`${h.title}: ${h.text}`}><span className="hotspot-dot" aria-hidden="true">+</span><span className="hotspot-info"><strong>{h.title}</strong>{h.text}</span></button>)}
      </div> : <div className="garage-invitation"><span className="garage-outline" aria-hidden="true">A5</span><div><p>Ваш автомобиль.<br />Ваш ракурс.</p><MagneticButton className="text-button" onClick={onChoose}>Выбрать фотографии <Arrow diagonal /></MagneticButton></div></div>}
      {photo && <span className="stage-caption">{zoom > 1 ? 'Перетащите, чтобы рассмотреть детали' : photo.title}</span>}
    </div>
    {photo && <div className="garage-controls">
      <div className="view-switch" role="group" aria-label="Выбор фотографии">{photos.map((p,i) => <button key={p.id} aria-pressed={selected === i} onClick={() => { setSelected(i); reset(); }}>{p.title}</button>)}</div>
      <div className="tool-row"><div className="zoom-control"><button aria-label="Отдалить" disabled={zoom <= 1} onClick={() => changeZoom(zoom - 0.25)}>−</button><label><span className="sr-only">Масштаб</span><input type="range" min="1" max="2.5" step="0.05" value={zoom} onChange={e => changeZoom(Number(e.target.value))} /></label><button aria-label="Приблизить" disabled={zoom >= 2.5} onClick={() => changeZoom(zoom + 0.25)}>+</button><output>{Math.round(zoom * 100)}%</output></div>
        <button aria-pressed={studio} onClick={() => setStudio(!studio)}>Свет студии <span>{studio ? 'Вкл' : 'Выкл'}</span></button>
        {photo.headlightsSrc && <button aria-pressed={lights} onClick={() => setLights(!lights)}>Фары <span>{lights ? 'Вкл' : 'Выкл'}</span></button>}
        <button onClick={() => { reset(); setStudio(true); }}>Сбросить</button><button onClick={onChoose}>Добавить фото +</button>
      </div>
    </div>}
  </section>;
}
