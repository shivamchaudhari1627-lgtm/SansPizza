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
  { id: 'd2', name: 'Pepsi', description: 'Chilled 500ml bottle.', price: 45, image: 'https://www.pepsi.com/prod/s3fs-public/2026-01/product_image_pepsi_zero_0.png', category: 'Drinks', type: 'veg' },
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
  { id: 'ic2', name: 'Chocolate Ice Cream', description: 'Rich dark chocolate scoop.', price: 79, image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-uTWMrKm6P2B6L1YOISMJnrHgr1re0YN2ykWluWdVkZnl4hsrL3f3CXAsg9Jb9Ya4bm2H5s-B9IOIlwvo7o4DQYaLlaofcmRTsZiVWYaRamHgWmCTMhby0H5WY9_Owh1S&s=10&ec=121630504', category: 'Ice Creams', type: 'veg' },
  { id: 'ic3', name: 'Strawberry Ice Cream', description: 'Made with real strawberries.', price: 79, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic4', name: 'Butterscotch Ice Cream', description: 'Caramelized nuts in creamy butterscotch.', price: 89, image: 'https://images.unsplash.com/photo-1580915411954-282cb1b0d780?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic5', name: 'Black Currant Ice Cream', description: 'Tangy and sweet black currant.', price: 99, image: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic6', name: 'Belgian Chocolate', description: 'Premium Belgian chocolate chunks.', price: 129, image: 'https://media-cdn2.greatbritishchefs.com/media/5t2bqaen/history-of-belgian-chocolate-guylian.whqc_1426x713q80.jpg', category: 'Ice Creams', type: 'veg' },
  { id: 'ic7', name: 'Cookies and Cream', description: 'Vanilla ice cream loaded with cookie bits.', price: 129, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic8', name: 'Ice Cream Sundae', description: 'Mixed scoops with chocolate syrup and nuts.', price: 199, image: 'data:image/jpeg;base64,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', category: 'Ice Creams', type: 'veg' },
  { id: 'ic9', name: 'Chocolate Brownie with Ice Cream', description: 'Warm brownie topped with vanilla ice cream.', price: 249, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=500&q=80', category: 'Ice Creams', type: 'veg' },
  { id: 'ic10', name: 'Waffle Cone Ice Cream', description: 'Your choice of scoop in a crispy waffle cone.', price: 149, image: 'https://www.puratos.in/content/dam/india/images/Copy-of-Copy-of-Untitled.png/jcr:content/renditions/cq5dam.web.1600.1600.webp', category: 'Ice Creams', type: 'veg' },
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


