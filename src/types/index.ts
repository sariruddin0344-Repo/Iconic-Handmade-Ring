export type MetalType = 'gold' | 'platinum' | 'rosegold' | 'black';

export type GemType = 'diamond' | 'sapphire' | 'emerald' | 'onyx' | 'ruby' | 'none';

export type RingStyle = 'solitaire' | 'signet' | 'eternity' | 'wave';

export interface RingProduct {
  id: string;
  name: string;
  subtitle: string;
  tagline: string;
  style: RingStyle;
  priceUSD: number;
  availableMetals: MetalType[];
  defaultMetal: MetalType;
  availableGems: GemType[];
  defaultGem: GemType;
  image: string;
  secondaryImage?: string;
  description: string;
  craftDetails: {
    metalPurity: string;
    bandWidth: string;
    finish: string;
    caratWeight?: string;
    origin: string;
  };
  features: string[];
  inStock: boolean;
  leadTime: string;
  badge?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  style: RingStyle;
  metal: MetalType;
  gem: GemType;
  size: number;
  engraving?: string;
  priceUSD: number;
  quantity: number;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  location: string;
  ringPurchased: string;
  rating: number;
  date: string;
  content: string;
  verified: boolean;
}
