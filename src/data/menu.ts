export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'Classic Pizzas' | 'Indian Style Pizzas' | 'Premium Pizzas' | 'Sides' | 'Drinks' | 'Ice Creams';
  type: 'veg' | 'non-veg';
}

export const menuCategories = ['Classic Pizzas', 'Indian Style Pizzas', 'Premium Pizzas', 'Sides', 'Drinks', 'Ice Creams'] as const;

export const menuItems: MenuItem[] = [
  // --- Classic Pizzas ---
  { id: 'cp1', name: 'Margherita Pizza', description: 'Classic delight with 100% real mozzarella cheese.', price: 199, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', category: 'Classic Pizzas', type: 'veg' },
  { id: 'cp2', name: 'Pepperoni Pizza', description: 'American classic with spicy pepperoni and mozzarella.', price: 349, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=500&q=80', category: 'Classic Pizzas', type: 'non-veg' },
  { id: 'cp3', name: 'Cheese Pizza', description: 'Simple, cheesy, and delicious. A timeless favorite.', price: 179, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Classic Pizzas', type: 'veg' },
  { id: 'cp4', name: 'Veggie Pizza', description: 'Loaded with fresh onions, crisp capsicum, and tomatoes.', price: 249, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=80', category: 'Classic Pizzas', type: 'veg' },

  // --- Indian Style Pizzas ---
  { id: 'ip1', name: 'Paneer Tikka Pizza', description: 'Spiced paneer, crunchy onions, and capsicum on a tandoori sauce base.', price: 399, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'Indian Style Pizzas', type: 'veg' },
  { id: 'ip2', name: 'Tandoori Chicken Pizza', description: 'Juicy tandoori chicken chunks with jalapeños and red paprika.', price: 449, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=500&q=80', category: 'Indian Style Pizzas', type: 'non-veg' },
  { id: 'ip3', name: 'Butter Chicken Pizza', description: 'Rich makhani sauce topped with tender chicken and coriander.', price: 499, image: 'https://images.unsplash.com/photo-1576458088443-04a19bb13da6?auto=format&fit=crop&w=500&q=80', category: 'Indian Style Pizzas', type: 'non-veg' },
  { id: 'ip4', name: 'Masala Corn Pizza', description: 'Sweet corn marinated in Indian spices with a cheesy base.', price: 299, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Indian Style Pizzas', type: 'veg' },

  // --- Premium Pizzas ---
  { id: 'pp1', name: 'BBQ Chicken Pizza', description: 'Smoky BBQ sauce, grilled chicken, onions, and extra cheese.', price: 549, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=80', category: 'Premium Pizzas', type: 'non-veg' },
  { id: 'pp2', name: 'Four Cheese Pizza', description: 'A gourmet blend of Mozzarella, Cheddar, Parmesan, and Gouda.', price: 599, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80', category: 'Premium Pizzas', type: 'veg' },
  { id: 'pp3', name: 'Hawaiian Pizza', description: 'The controversial classic: Ham, pineapple, and extra cheese.', price: 499, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80', category: 'Premium Pizzas', type: 'non-veg' },
  { id: 'pp4', name: 'Mexican Green Wave', description: 'Crunchy onions, crisp capsicum, tomatoes, and jalapeños with Mexican herbs.', price: 449, image: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=500&q=80', category: 'Premium Pizzas', type: 'veg' },

  // --- Sides ---
  { id: 's1', name: 'Garlic Breadsticks', description: 'Baked to perfection. Your perfect pizza partner!', price: 99, image: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=500&q=80', category: 'Sides', type: 'veg' },

  // --- Drinks ---
  { id: 'd1', name: 'Coca-Cola', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd2', name: 'Pepsi', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1533007417778-5989276a0380?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd3', name: 'Sprite', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd4', name: 'Fanta', description: 'Chilled 500ml bottle.', price: 45, image: 'https://images.unsplash.com/photo-1624517452488-04869289c4ca?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd5', name: 'Orange Juice', description: 'Freshly squeezed orange juice.', price: 99, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd6', name: 'Mango Juice', description: 'Rich and thick mango refresher.', price: 99, image: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd7', name: 'Lemonade', description: 'Sweet and sour classic lemonade.', price: 79, image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd8', name: 'Iced Tea', description: 'Peach flavored iced tea.', price: 89, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd9', name: 'Cold Coffee', description: 'Creamy blended cold coffee.', price: 149, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd10', name: 'Chocolate Shake', description: 'Thick chocolate milkshake.', price: 179, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd11', name: 'Strawberry Shake', description: 'Fresh strawberry milkshake.', price: 179, image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },
  { id: 'd12', name: 'Oreo Shake', description: 'Crunchy Oreo blended milkshake.', price: 199, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=500&q=80', category: 'Drinks', type: 'veg' },

  // --- Ice Creams ---
  { id: 'ic1', name: 'Vanilla Ice Cream', description: 'Classic vanilla bean scoop.', price: 69, image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic2', name: 'Chocolate Ice Cream', description: 'Rich dark chocolate scoop.', price: 79, image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic3', name: 'Strawberry Ice Cream', description: 'Made with real strawberries.', price: 79, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic4', name: 'Butterscotch Ice Cream', description: 'Caramelized nuts in creamy butterscotch.', price: 89, image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic5', name: 'Black Currant Ice Cream', description: 'Tangy and sweet black currant.', price: 99, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic6', name: 'Belgian Chocolate', description: 'Premium Belgian chocolate chunks.', price: 129, image: 'https://images.unsplash.com/photo-1541920482244-51d1982846ac?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic7', name: 'Cookies and Cream', description: 'Vanilla ice cream loaded with cookie bits.', price: 129, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic8', name: 'Ice Cream Sundae', description: 'Mixed scoops with chocolate syrup and nuts.', price: 199, image: 'https://images.unsplash.com/photo-1563805042-7684c8a9e9ce?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic9', name: 'Chocolate Brownie with Ice Cream', description: 'Warm brownie topped with vanilla ice cream.', price: 249, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic10', name: 'Waffle Cone Ice Cream', description: 'Your choice of scoop in a crispy waffle cone.', price: 149, image: 'https://images.unsplash.com/photo-1558500468-b80b72761168?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
];

export const crustOptions = [
  { id: 'hand-tossed', name: 'New Hand Tossed', price: 0 },
  { id: 'wheat', name: '100% Wheat Thin Crust', price: 50 },
  { id: 'cheese-burst', name: 'Cheese Burst', price: 99 },
  { id: 'ashwagandha', name: 'Ashwagandha Infused (Calm)', price: 75 },
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


