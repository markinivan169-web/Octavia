import { car } from '../config';
export default function Specifications() {
  const labels: Record<string, string> = { engine: 'Двигатель', transmission: 'Коробка передач', drive: 'Привод', power: 'Мощность', mileage: 'Пробег' };
  return <section id="specs" className="specifications" aria-labelledby="specs-title">
    <div className="specs-intro" data-reveal><p className="eyebrow">Ничего лишнего</p><h2 id="specs-title">ХАРАКТЕР<br />В ЧИСТОМ ВИДЕ<span>.</span></h2><p className="specs-prose">Глубокий чёрный. Чистые линии лифтбека.<br />Octavia, у которой есть своя история.</p></div>
    <dl className="specs-list"><div className="spec-year" data-reveal><dt>Год выпуска</dt><dd>{car.year}</dd></div><div data-reveal><dt>Модель</dt><dd>{car.model}</dd></div><div data-reveal><dt>Кузов</dt><dd>{car.body}</dd></div><div data-reveal><dt>Цвет</dt><dd>{car.color}</dd></div>{Object.entries(car.specs).filter(([,v]) => v?.trim()).map(([key,value]) => <div data-reveal key={key}><dt>{labels[key] || key}</dt><dd>{value}</dd></div>)}</dl>
  </section>;
}
