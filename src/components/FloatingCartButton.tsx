import React from 'react';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCartButtonProps {
  onClick: () => void;
  isSidebarOpen: boolean;
}

const FloatingCartButton: React.FC<FloatingCartButtonProps> = ({ onClick, isSidebarOpen }) => {
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {cartItemCount > 0 && !isSidebarOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 z-50 md:left-auto md:right-8 md:w-96"
        >
          <button
            onClick={onClick}
            className="w-full bg-[#8B4513] text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between group active:scale-95 transition-transform border-2 border-[#DAA520]/30 backdrop-blur-md bg-opacity-95"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-[#DAA520] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#8B4513]">
                  {cartItemCount}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">View Cart</span>
                <span className="text-lg font-bold">₹{totalAmount}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-bold">
              <span>Checkout</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCartButton;
