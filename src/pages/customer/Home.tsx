import React, { useState, useEffect, Suspense } from 'react';
import Header from '../../components/Header';
import LocationModal from '../../components/LocationModal';
import CustomizeModal from '../../components/CustomizeModal';
import CartSidebar from '../../components/CartSidebar';
import Pizza3D from '../../components/Pizza3D';
import LoginPromptModal from '../../components/LoginPromptModal';
import FloatingCartButton from '../../components/FloatingCartButton';
import { menuItems, menuCategories, MenuItem } from '../../data/menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { Link } from 'react-router-dom';

const CustomerHome = () => {
  const [activeCategory, setActiveCategory] = useState<typeof menuCategories[number]>(menuCategories[0]);
  const [vegOnly, setVegOnly] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInitialLoginPromptOpen, setIsInitialLoginPromptOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { orderType } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);

  // Open location modal on first load if no order type is set
  useEffect(() => {
    if (!orderType) {
      setIsLocationModalOpen(true);
    }
  }, [orderType]);

  // Show initial login prompt if not logged in
  useEffect(() => {
    const hasSeenPrompt = sessionStorage.getItem('hasSeenLoginPrompt');
    if (!user && !hasSeenPrompt) {
      const timer = setTimeout(() => {
        setIsInitialLoginPromptOpen(true);
        sessionStorage.setItem('hasSeenLoginPrompt', 'true');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleCustomize = (item: MenuItem) => {
    setSelectedItem(item);
    setIsCustomizeModalOpen(true);
  };

  const filteredMenu = menuItems.filter(item => 
    item.category === activeCategory && (!vegOnly || item.type === 'veg')
  );

  const handleOrderNow = () => {
    const menuElement = document.getElementById('menu-section');
    if (menuElement) {
      menuElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCF9F2] font-sans text-[#4A2C2A] pb-24">
      <Header 
        onOpenCart={() => setIsCartOpen(true)} 
        onOpenLocation={() => setIsLocationModalOpen(true)} 
      />

      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#7f1d1d] via-[#991b1b] to-[#b91c1c] relative overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <motion.div 
          style={{ y: y1 }}
          className="absolute inset-0 opacity-20 bg-black/20"
        ></motion.div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10 flex flex-col md:flex-row items-center w-full">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ opacity, scale }}
            className="md:w-1/2 text-center md:text-left mb-8 md:mb-0"
          >
            <motion.h2 
              className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block"
              >
                Premium Taste.
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="block text-[#DAA520]"
              >
                Homegrown Vibe.
              </motion.span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-xl text-red-50 mb-8 max-w-md"
            >
              Experience the perfect blend of Vedic wisdom and modern pizza crafting. Try our new Ashwagandha-infused crust!
            </motion.p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: "#8B4513", boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOrderNow}
                className="bg-[#DAA520] text-white px-10 py-4 rounded-full font-bold text-xl hover:bg-[#8B4513] transition-all shadow-xl border-b-4 border-[#B8860B] active:border-b-0"
              >
                Order Now
              </motion.button>
              
              {!user && (
                <Link to="/login">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#8B4513] px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-xl border-2 border-white"
                  >
                    Sign Up
                  </motion.button>
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div 
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "backOut" }}
            style={{ y: y2 }}
            className="md:w-1/2 flex justify-center relative min-h-[400px]"
          >
            <Pizza3D />
            
            {/* Floating Badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 hidden md:block"
            >
              <p className="text-[#DAA520] font-black text-xs uppercase tracking-tighter">New Arrival</p>
              <p className="font-serif font-bold text-[#8B4513]">Vedic Crust</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Category Tabs (Domino's Style) */}
      <div id="menu-section" className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex overflow-x-auto hide-scrollbar py-4 gap-8 flex-grow">
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

          {/* Veg Only Toggle */}
          <div className="flex items-center gap-3 ml-4 py-4 border-l pl-6 border-gray-100">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Filter</span>
              <span className={`text-xs font-bold whitespace-nowrap transition-colors ${vegOnly ? 'text-green-600' : 'text-gray-500'}`}>
                VEG ONLY
              </span>
            </div>
            <button 
              onClick={() => setVegOnly(!vegOnly)}
              className={`relative inline-flex h-6 w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
                vegOnly ? 'bg-green-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 shadow-md ${
                  vegOnly ? 'translate-x-6' : 'translate-x-1'
                } flex items-center justify-center`}
              >
                <div className={`w-2 h-2 rounded-full ${vegOnly ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.h3 
          layout
          className="text-3xl font-serif font-bold text-[#8B4513] mb-8"
        >
          {activeCategory}
        </motion.h3>
        
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredMenu.map(item => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden">
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg shadow-sm">
                    <div className={`w-4 h-4 border-2 flex items-center justify-center ${item.type === 'veg' ? 'border-green-600' : 'border-red-600'}`}>
                      <div className={`w-2 h-2 rounded-full ${item.type === 'veg' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#DAA520] transition-colors">{item.name}</h4>
                  <p className="text-sm text-gray-600 mb-6 flex-grow leading-relaxed">{item.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
                    <span className="text-2xl font-black text-[#8B4513]">₹{item.price}</span>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleCustomize(item)}
                      className="bg-[#DAA520] text-white px-8 py-2.5 rounded-xl font-bold hover:bg-[#8B4513] transition-colors shadow-lg flex items-center gap-2"
                    >
                      Buy
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
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

      <LoginPromptModal 
        isOpen={isInitialLoginPromptOpen} 
        onClose={() => setIsInitialLoginPromptOpen(false)} 
        title="Welcome to Sanskriti's Pizza!" 
        message="Sign up to save your favorite orders and earn rewards. You can also sign up later before checkout." 
      />

      <FloatingCartButton 
        onClick={() => setIsCartOpen(true)} 
        isSidebarOpen={isCartOpen}
      />
    </div>
  );
};

export default CustomerHome;

