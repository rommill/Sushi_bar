export type SushiItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  ingredients: string[];
  weight: number;
  calories: number;
  category: 'nigiri' | 'maki' | 'sashimi' | 'rolls' | 'sets';
  spicy: boolean;
  vegetarian: boolean;
  popular: boolean;
};

export type CartItem = SushiItem & {
  quantity: number;
};

export type CartStore = {
  items: CartItem[];
  addItem: (item: SushiItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  total: number;
  itemCount: number;
};

export type SpherePosition = {
  theta: number;
  phi: number;
  x: number;
  y: number;
  z: number;
};