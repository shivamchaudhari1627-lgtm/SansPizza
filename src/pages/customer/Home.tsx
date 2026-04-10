import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import LocationModal from '../../components/LocationModal';
import CustomizeModal from '../../components/CustomizeModal';
import CartSidebar from '../../components/CartSidebar';
import { menuItems, menuCategories, MenuItem } from '../../data/menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';

const CustomerHome = () => {
  const [activeCategory, setActiveCategory] = useState(menuCategories[0]);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { orderType } = useSelector((state: RootState) => state.cart);

  // Open location modal on first load if no order type is set
  useEffect(() => {
    if (!orderType) {
      setIsLocationModalOpen(true);
    }
  }, [orderType]);

  const handleCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setIsCustomizeModalOpen(true);
  };

  const filteredMenu = menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FCF9F2] font-sans text-[#4A2C2A] pb-24">
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenLocation={() => setIsLocationModalOpen(true)} 
      />

      {/* Hero Banner */}
      <div className="bg-[#F4EBD0] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/food.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#8B4513] leading-tight mb-4">
              Premium Taste.<br/>Homegrown Vibe.
            </h2>
            <p className="text-lg text-gray-700 mb-6 max-w-md">
              Experience the perfect blend of Vedic wisdom and modern pizza crafting. Try our new Ashwagandha-infused crust!
            </p>
            <button className="bg-[#DAA520] text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-[#8B4513] transition-colors shadow-lg">
              Order Now
            </button>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80" 
              alt="Featured Pizza" 
              className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-full border-8 border-white shadow-2xl"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs (Domino's Style) */}
      <div className="bg-white shadow-sm sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-8">
            {menuCategories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`whitespace-nowrap font-bold text-lg pb-2 border-b-4 transition-colors ${
                  activeCategory === category 
                    ? 'border-[#DAA520] text-[#8B4513]' 
                    : 'border-transparent text-gray-500 hover:text-[#DAA520]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h3 className="text-3xl font-serif font-bold text-[#8B4513] mb-8">{activeCategory}</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredMenu.map(item => (
            <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-100 flex flex-col">
              <div className="relative h-48">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 right-4 bg-white p-1 rounded-sm shadow-sm">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                    <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                  </div>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h4>
                <p className="text-sm text-gray-600 mb-6 flex-grow">{item.description}</p>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                  <span className="text-xl font-bold text-[#8B4513]">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={() => handleCustomize(item)}
                    className="bg-[#DAA520] text-white px-6 py-2 rounded-xl font-bold hover:bg-[#8B4513] transition-colors shadow-md flex items-center gap-2"
                  >
                    Buy
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />
      
      <CustomizeModal 
        item={selectedItem} 
        isOpen={isCustomizeModalOpen} 
        onClose={() => setIsCustomizeModalOpen(false)} 
      />

      <CartSidebar 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />
    </div>
  );
};

export default CustomerHome;

