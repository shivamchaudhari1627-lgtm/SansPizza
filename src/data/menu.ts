export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Pizza Mania' | 'Veg Pizzas' | 'Non-Veg Pizzas' | 'Sides' | 'Desserts' | 'Drinks' | 'Meals & Combos';
  type: 'veg' | 'non-veg';
}

export const menuCategories = [
  'Pizza Mania',
  'Veg Pizzas',
  'Non-Veg Pizzas',
  'Sides',
  'Desserts',
  'Drinks',
  'Meals & Combos'
] as const;

export const menuItems: MenuItem[] = [
  // --- Pizza Mania (Budget Range) ---
  { id: 'pm1', name: 'Margherita', description: 'Classic delight with 100% real mozzarella cheese.', price: 99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', category: 'Pizza Mania', type: 'veg' },
  { id: 'pm2', name: 'Tomato Pizza', description: 'Juicy tomatoes on a cheesy base.', price: 109, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Pizza Mania', type: 'veg' },
  { id: 'pm3', name: 'Capsicum Pizza', description: 'Fresh capsicum with mozzarella cheese.', price: 109, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=80', category: 'Pizza Mania', type: 'veg' },
  { id: 'pm4', name: 'Onion Pizza', description: 'Crunchy onions on a delicious cheesy base.', price: 109, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Pizza Mania', type: 'veg' },
  { id: 'pm5', name: 'Golden Corn Pizza', description: 'Sweet corn with extra cheese.', price: 119, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Pizza Mania', type: 'veg' },
  { id: 'pm6', name: 'Cheese Pizza', description: 'Simple, cheesy, and delicious.', price: 119, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Pizza Mania', type: 'veg' },

  // --- Veg Pizzas ---
  { id: 'vp1', name: 'Margherita', description: 'Classic delight with 100% real mozzarella cheese.', price: 99, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },
  { id: 'vp2', name: 'Farmhouse', description: 'Delightful combination of onion, capsicum, tomato & mushroom.', price: 259, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },
  { id: 'vp3', name: 'Peppy Paneer', description: 'Flavorful paneer, capsicum and spicy red paprika.', price: 259, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },
  { id: 'vp4', name: 'Veg Extravaganza', description: 'Black olives, capsicum, onion, corn, tomato, mushroom & jalapeño.', price: 309, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },
  { id: 'vp5', name: 'Mexican Green Wave', description: 'Mexican herbs, onion, capsicum, tomato & jalapeño.', price: 279, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },
  { id: 'vp6', name: 'Deluxe Veggie', description: 'Onion, capsicum, mushroom, corn & paneer.', price: 259, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },
  { id: 'vp7', name: 'Indi Tandoori Paneer', description: 'It is hot. It is spicy. It is Oh-So-Indian.', price: 319, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'Veg Pizzas', type: 'veg' },

  // --- Non-Veg Pizzas ---
  { id: 'nv1', name: 'Pepper Barbecue Chicken', description: 'Pepper barbecue chicken for that extra zing.', price: 319, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80', category: 'Non-Veg Pizzas', type: 'non-veg' },
  { id: 'nv2', name: 'Chicken Sausage', description: 'American classic chicken sausage with mozzarella.', price: 279, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80', category: 'Non-Veg Pizzas', type: 'non-veg' },
  { id: 'nv3', name: 'Chicken Dominator', description: 'Loaded with double pepper barbecue chicken, peri-peri chicken, chicken tikka & grilled chicken rashers.', price: 359, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80', category: 'Non-Veg Pizzas', type: 'non-veg' },
  { id: 'nv4', name: 'Non-Veg Supreme', description: 'Black olives, onion, capsicum, mushroom, pepper barbecue chicken, peri-peri chicken & grilled chicken rashers.', price: 359, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80', category: 'Non-Veg Pizzas', type: 'non-veg' },

  // --- Sides ---
  { id: 's1', name: 'Garlic Breadsticks', description: 'Baked to perfection. Your perfect pizza partner!', price: 99, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's2', name: 'Stuffed Garlic Breadsticks', description: 'Freshly baked garlic bread with cheese, sweet corn and jalapeño.', price: 145, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's3', name: 'Burger Pizza Veg', description: 'The goodness of burger and pizza in one.', price: 105, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's4', name: 'Burger Pizza Non-Veg', description: 'Chicken burger pizza with juicy toppings.', price: 145, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'non-veg' },
  { id: 's5', name: 'Burger Pizza Premium Veg', description: 'Premium veg burger pizza with extra toppings.', price: 135, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's6', name: 'Taco Mexicana Veg', description: 'Crispy taco with veg filling.', price: 118, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's7', name: 'Taco Mexicana Non-Veg', description: 'Crispy taco with chicken filling.', price: 135, image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'non-veg' },
  { id: 's8', name: 'Chicken Parcel', description: 'Snack with chicken and creamy sauce.', price: 45, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'non-veg' },
  { id: 's9', name: 'Veg Parcel', description: 'Snack with veg and creamy sauce.', price: 39, image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's10', name: 'Potato Cheese Shots', description: 'Crispy potato shots with cheese.', price: 59, image: 'https://images.unsplash.com/photo-1573014133633-569d37329d27?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's11', name: 'Crinkle Fries', description: 'Classic crinkle cut fries.', price: 59, image: 'https://images.unsplash.com/photo-1573014133633-569d37329d27?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's12', name: 'Cheesy Dip', description: 'Rich and creamy cheesy dip.', price: 25, image: 'https://images.unsplash.com/photo-1541533375320-fd80c57df10d?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },
  { id: 's13', name: 'Jalapeno Dip', description: 'Spicy and creamy jalapeno dip.', price: 25, image: 'https://images.unsplash.com/photo-1541533375320-fd80c57df10d?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },

  // --- Desserts ---
  { id: 'ds1', name: 'Choco Lava Cake', description: 'Chocolate cake with a molten chocolate center.', price: 99, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80', category: 'Desserts', type: 'veg' },
  { id: 'ds2', name: 'Butterscotch Mousse Cake', description: 'Creamy butterscotch mousse cake.', price: 99, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=500&q=80', category: 'Desserts', type: 'veg' },
  { id: 'ds3', name: 'Brownie Fantasy', description: 'Rich chocolate brownie.', price: 59, image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80', category: 'Desserts', type: 'veg' },

  // --- Drinks ---
  { id: 'dr1', name: 'Pepsi Black Can', description: 'Chilled 330ml can.', price: 60, image: 'https://www.pepsi.com/prod/s3fs-public/2026-01/product_image_pepsi_zero_0.png', category: 'Drinks', type: 'veg' },
  { id: 'dr2', name: 'Coca-Cola', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'dr3', name: 'Sprite', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'dr4', name: 'Fanta', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },

  // --- Meals & Combos ---
  { id: 'mc1', name: '2 Medium Veg Premium Combo', description: 'Everyday Value: 2 Medium Veg Premium Pizzas.', price: 819, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Meals & Combos', type: 'veg' },
  { id: 'mc2', name: '2 Medium Non-Veg Combo', description: 'Everyday Value: 2 Medium Non-Veg Pizzas.', price: 719, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80', category: 'Meals & Combos', type: 'non-veg' },
];

export const crustOptions = [
  { id: 'hand-tossed', name: 'New Hand Tossed', price: 0 },
  { id: 'wheat', name: '100% Wheat Thin Crust', price: 50 },
  { id: 'cheese-burst', name: 'Cheese Burst', price: 99 },
];

export const sizeOptions = [
  { id: 'regular', name: 'Regular', multiplier: 1 },
  { id: 'medium', name: 'Medium', multiplier: 1.4 },
  { id: 'large', name: 'Large', multiplier: 1.8 },
];

export const toppingOptions = [
  // Veg Toppings
  { id: 'mushroom', name: 'Mushroom', price: 45, type: 'veg' },
  { id: 'olives', name: 'Olives', price: 45, type: 'veg' },
  { id: 'capsicum', name: 'Capsicum', price: 35, type: 'veg' },
  { id: 'onion', name: 'Onion', price: 35, type: 'veg' },
  { id: 'sweet-corn', name: 'Sweet Corn', price: 35, type: 'veg' },
  { id: 'jalapeno', name: 'Jalapeno', price: 45, type: 'veg' },
  { id: 'tomato', name: 'Tomato', price: 30, type: 'veg' },
  
  // Non-Veg Toppings
  { id: 'chicken-sausage', name: 'Chicken Sausage', price: 65, type: 'non-veg' },
  { id: 'grilled-chicken', name: 'Grilled Chicken', price: 75, type: 'non-veg' },
  { id: 'pepperoni', name: 'Pepperoni', price: 99, type: 'non-veg' },
  { id: 'ham', name: 'Ham', price: 85, type: 'non-veg' },

  // Extra Add-ons
  { id: 'mozzarella', name: 'Mozzarella Cheese', price: 60, type: 'veg' },
  { id: 'cheddar', name: 'Cheddar Cheese', price: 60, type: 'veg' },
  { id: 'peri-peri', name: 'Peri Peri Sauce', price: 20, type: 'veg' },
  { id: 'garlic-sauce', name: 'Garlic Sauce', price: 20, type: 'veg' },
];
