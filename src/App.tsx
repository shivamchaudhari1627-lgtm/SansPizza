import React, { useState, useEffect } from 'react';
import DoshaSelector from './components/DoshaSelector';
import CheckoutModal from './components/CheckoutModal';
import { MapPin, ShoppingBag, Leaf, Flame, Wind } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  doshaRecommendation: string;
}

const App = () => {
  const [location, setLocation] = useState('Detecting location...');
  const [cart, setCart] = useState<MenuItem[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [selectedCrust, setSelectedCrust] = useState('Classic Hand-Tossed');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    // Fetch menu from our Express backend
    fetch('/api/menu')
      .then(res => res.json())
      .then(data => setMenu(data))
      .catch(err => console.error("Failed to load menu", err));

    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(2)}, Lng: ${position.coords.longitude.toFixed(2)}`);
        },
        () => {
          setLocation('Location access denied');
        }
      );
    } else {
      setLocation('Geolocation not supported');
    }
  }, []);

  const addToCart = (item: MenuItem) => {
    setCart([...cart, item]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  const handleConfirmOrder = async (address: string, paymentMethod: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total: cartTotal,
          address,
          doshaCrust: selectedCrust,
          paymentMethod
        })
      });
      if (response.ok) {
        setCart([]);
        setIsCheckoutOpen(false);
        alert("Order placed successfully! Your Sanskriti Pizza is on its way.");
      }
    } catch (error) {
      console.error("Order failed", error);
    }
  };

  const getDoshaIcon = (dosha: string) => {
    switch(dosha) {
      case 'Vata': return <Wind size={16} className="text-blue-400" />;
      case 'Pitta': return <Flame size={16} className="text-red-400" />;
      case 'Kapha': return <Leaf size={16} className="text-green-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F2] text-[#4A2C2A] font-sans selection:bg-[#DAA520] selection:text-white pb-20">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 flex justify-between items-center px-6 md:px-10 py-4 bg-white/90 backdrop-blur-md shadow-sm border-b border-[#DAA520]/20">
        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#8B4513] tracking-tighter">
          SANSKRITI'S <span className="text-[#DAA520]">PIZZA</span>
        </h1>
        <div className="flex items-center gap-4 md:gap-6">
          <div className="hidden md:flex items-center gap-2 text-sm italic text-gray-600 bg-[#F4EBD0] px-3 py-1.5 rounded-full">
            <MapPin size={16} className="text-[#8B4513]" />
            <span className="truncate max-w-[200px]">{location}</span>
          </div>
          <button 
            onClick={() => cart.length > 0 && setIsCheckoutOpen(true)}
            className="flex items-center gap-2 bg-[#8B4513] text-white px-5 py-2.5 rounded-full hover:bg-[#DAA520] transition-colors shadow-md hover:shadow-lg"
          >
            <ShoppingBag size={18} />
            <span className="font-medium">Cart ({cart.length})</span>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative text-center py-24 md:py-32 bg-[#F4EBD0] overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="relative z-10 px-4">
          <h2 className="text-4xl md:text-6xl font-serif mb-6 text-[#4A2C2A] leading-tight">
            Artisanal Pizzas, <br/>Rooted in Tradition.
          </h2>
          <p className="text-lg md:text-xl opacity-80 max-w-2xl mx-auto font-medium text-[#8B4513]">
            Experience the warmth of a homegrown kitchen. Premium ingredients, Vedic wisdom, and a whole lot of love.
          </p>
        </div>
      </section>

      {/* Unique Feature Section */}
      <section className="max-w-4xl mx-auto -mt-12 mb-16 px-4 relative z-20">
        <DoshaSelector onSelectCrust={setSelectedCrust} />
      </section>

      {/* Menu Header */}
      <div className="max-w-6xl mx-auto px-6 mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-serif text-[#8B4513]">The Kitchen's Offerings</h2>
          <p className="text-gray-600 mt-2">Currently pairing with: <span className="font-semibold text-[#DAA520]">{selectedCrust}</span></p>
        </div>
      </div>

      {/* Menu Grid */}
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {menu.map((item) => (
          <div key={item.id} className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#DAA520]/10 flex flex-col">
            <div className="h-56 relative overflow-hidden group">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#8B4513] shadow-sm flex items-center gap-1">
                {getDoshaIcon(item.doshaRecommendation)}
                {item.doshaRecommendation} Friendly
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-[#4A2C2A] font-serif">{item.name}</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#DAA520] bg-[#F4EBD0] px-2 py-1 rounded-md">{item.category}</span>
              </div>
              <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{item.description}</p>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                <span className="text-2xl font-serif text-[#8B4513]">${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => addToCart(item)}
                  className="border-2 border-[#DAA520] text-[#8B4513] px-5 py-2 rounded-xl hover:bg-[#DAA520] hover:text-white transition-colors font-medium shadow-sm"
                >
                  Bring it Home
                </button>
              </div>
            </div>
          </div>
        ))}
      </main>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        cartTotal={cartTotal}
        location={location}
        onConfirmOrder={handleConfirmOrder}
      />
    </div>
  );
};

export default App;
