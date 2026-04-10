export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Pizzas' | 'Sides' | 'Desserts' | 'Drinks';
  type: 'veg' | 'non-veg';
}

export const menuCategories = ['Pizzas', 'Sides', 'Desserts', 'Drinks'] as const;

export const menuItems: MenuItem[] = [
  {
    id: 'p1',
    name: 'The Vedic Margherita',
    description: 'A hugely popular margherita, with a deliciously tangy single cheese topping and holy basil.',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80',
    category: 'Pizzas',
    type: 'veg'
  },
  {
    id: 'p2',
    name: 'Sanskriti Farmhouse',
    description: 'A pizza that goes ballistic on veggies! Overload of crunchy capsicum, succulent mushrooms and fresh tomatoes.',
    price: 15.99,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80',
    category: 'Pizzas',
    type: 'veg'
  },
  {
    id: 'p3',
    name: 'Golden Paneer Tikka',
    description: 'Turmeric-infused paneer, roasted bell peppers, and creamy makhani sauce on a golden crust.',
    price: 17.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
    category: 'Pizzas',
    type: 'veg'
  },
  {
    id: 'p4',
    name: 'Spicy Chicken Ayurveda',
    description: 'Pepper barbecue chicken, highly spiced with jalapeños and a hint of ashwagandha.',
    price: 18.99,
    image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80',
    category: 'Pizzas',
    type: 'non-veg'
  },
  {
    id: 's1',
    name: 'Garlic Breadsticks',
    description: 'Baked to perfection. Your perfect pizza partner! Tastes best with dip.',
    price: 4.99,
    image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80',
    category: 'Sides',
    type: 'veg'
  },
  {
    id: 'd1',
    name: 'Choco Lava Cake',
    description: 'Chocolate lovers delight! Indulgent, gooey molten lava inside chocolate cake.',
    price: 5.99,
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80',
    category: 'Desserts',
    type: 'veg'
  }
];

export const crustOptions = [
  { id: 'hand-tossed', name: 'New Hand Tossed', price: 0 },
  { id: 'wheat', name: '100% Wheat Thin Crust', price: 1.5 },
  { id: 'cheese-burst', name: 'Cheese Burst', price: 3.0 },
  { id: 'ashwagandha', name: 'Ashwagandha Infused (Calm)', price: 2.0 },
];

export const sizeOptions = [
  { id: 'regular', name: 'Regular', multiplier: 1 },
  { id: 'medium', name: 'Medium', multiplier: 1.5 },
  { id: 'large', name: 'Large', multiplier: 2.0 },
];

export const toppingOptions = [
  { id: 'onion', name: 'Onion', price: 1.0, type: 'veg' },
  { id: 'capsicum', name: 'Capsicum', price: 1.0, type: 'veg' },
  { id: 'mushroom', name: 'Mushroom', price: 1.5, type: 'veg' },
  { id: 'paneer', name: 'Paneer', price: 2.0, type: 'veg' },
  { id: 'jalapeno', name: 'Jalapeno', price: 1.5, type: 'veg' },
  { id: 'chicken', name: 'BBQ Chicken', price: 2.5, type: 'non-veg' },
];

