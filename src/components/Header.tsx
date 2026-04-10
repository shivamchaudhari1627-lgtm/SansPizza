import React from 'react';
import { ShoppingCart, User, Menu as MenuIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../features/store';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onOpenCart: () => void;
  onOpenLocation: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenLocation }) => {
  const { items, totalAmount, orderType, address } = useSelector((state: RootState) => state.cart);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-[#DAA520]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Mobile Menu */}
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-600 hover:text-[#8B4513]">
              <MenuIcon size={24} />
            </button>
            <Link to="/" className="flex flex-col">
              <span className="text-2xl md:text-3xl font-serif font-bold text-[#8B4513] leading-none tracking-tighter">
                Sanskriti's
              </span>
              <span className="text-[#DAA520] font-bold tracking-widest uppercase text-xs">
                Pizza
              </span>
            </Link>
          </div>

          {/* Center - Order Type & Location (Domino's Style) */}
          <div className="hidden md:flex flex-col items-center cursor-pointer group" onClick={onOpenLocation}>
            <div className="flex bg-gray-100 p-1 rounded-full mb-1">
              <div className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${orderType === 'Delivery' ? 'bg-[#8B4513] text-white' : 'text-gray-500 group-hover:text-gray-800'}`}>
                Delivery
              </div>
              <div className={`px-4 py-1 rounded-full text-xs font-bold transition-colors ${orderType === 'Carryout' ? 'bg-[#8B4513] text-white' : 'text-gray-500 group-hover:text-gray-800'}`}>
                Carryout
              </div>
            </div>
            <div className="text-sm font-medium text-gray-600 flex items-center gap-1 group-hover:text-[#DAA520] transition-colors">
              {address ? <span className="truncate max-w-[250px]">{address}</span> : <span>Select Location</span>}
              <span className="text-xs text-[#DAA520]">▼</span>
            </div>
          </div>

          {/* Right - User & Cart */}
          <div className="flex items-center gap-4 md:gap-6">
            <Link to="/login" className="hidden md:flex flex-col items-center text-gray-600 hover:text-[#8B4513] transition-colors">
              <User size={20} />
              <span className="text-xs font-bold mt-1">Sign In</span>
            </Link>
            
            <button 
              onClick={onOpenCart}
              className="flex items-center gap-3 bg-[#FCF9F2] border-2 border-[#DAA520] px-4 py-2 rounded-xl hover:bg-[#F4EBD0] transition-colors group"
            >
              <div className="relative">
                <ShoppingCart size={24} className="text-[#8B4513]" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {cartItemCount}
                  </span>
                )}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-[10px] font-bold text-gray-500 uppercase leading-none">Total</span>
                <span className="text-sm font-bold text-[#8B4513] leading-none mt-1">${totalAmount.toFixed(2)}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
