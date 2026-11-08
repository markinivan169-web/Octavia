export type View = 'front' | 'side' | 'rear' | 'detail';
export type Hotspot = { id: string; title: string; text: string; x: number; y: number };
export type CarPhoto = {
  id: string; src: string; alt: string; title: string; view: View;
  objectPosition?: string;
  /** Coordinates are percentages of the original image, never of a cropped container. */
  hotspots?: Hotspot[];
  /** Supply a real matching photograph with headlights on. No fabricated light overlay. */
  headlightsSrc?: string;
};

export const car = {
  brand: 'Škoda', model: 'Octavia A5 Facelift', year: 2010,
  body: 'Лифтбек', color: 'Глубокий чёрный', plate: 'Р770УВ', region: '64 RUS',
  // Unconfirmed values are omitted from the public page until filled in here.
  specs: { engine: null, transmission: null, drive: null, power: null, mileage: null } as Record<string, string | null>,
  // Only photographs of this car. Put files into public/images and add entries here.
  // Example: { id: 'front', src: '/images/front.webp', alt: 'Чёрная Octavia A5, вид спереди', title: 'Передний ракурс', view: 'front' }
  photos: [] as CarPhoto[],
};
