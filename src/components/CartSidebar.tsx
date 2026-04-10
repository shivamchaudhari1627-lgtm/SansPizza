import React, { useState } from 'react';
import { X, Trash2, CreditCard, MapPin, ShoppingCart } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../features/store';
import { removeFromCart, updateQuantity } from '../features/cartSlice';
import PaymentModal from './PaymentModal';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { items, totalAmount, orderType, address } = useSelector((state: RootState) => state.cart);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = () => {
    if (items.length === 0) return;
    setIsPaymentModalOpen(true);
  };

  const finalTotal = totalAmount * 1.08; // Including 8% tax

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-full md:w-[400px] bg-white shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#FCF9F2]">
          <h2 className="text-2xl font-serif font-bold text-[#8B4513]">Your Order</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#8B4513] transition-colors bg-white rounded-full p-2 shadow-sm">
            <X size={20} />
          </button>
        </div>

        {/* Order Info */}
        <div className="p-4 bg-[#F4EBD0]/30 border-b border-[#DAA520]/20 flex items-start gap-3">
          <MapPin className="text-[#DAA520] shrink-0 mt-1" size={20} />
          <div>
            <p className="font-bold text-[#4A2C2A] text-sm">{orderType || 'Delivery'}</p>
            <p className="text-xs text-gray-600 truncate max-w-[280px]">{address || 'No address selected'}</p>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <ShoppingCart size={48} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium">Your cart is empty</p>
              <button onClick={onClose} className="text-[#DAA520] font-bold hover:text-[#8B4513]">
                Browse Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartItemId} className="flex gap-4 border-b border-gray-100 pb-6 last:border-0">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shadow-sm" referrerPolicy="no-referrer" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-[#4A2C2A] text-sm leading-tight pr-4">{item.name}</h4>
                    <button 
                      onClick={() => dispatch(removeFromCart(item.cartItemId))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                    <p>{item.size} • {item.crust}</p>
                    {item.toppings.length > 0 && (
                      <p className="text-[#DAA520]">+{item.toppings.length} Toppings</p>
                    )}
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: Math.max(1, item.quantity - 1) }))}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                      >-</button>
                      <span className="px-3 py-1 text-sm font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => dispatch(updateQuantity({ cartItemId: item.cartItemId, quantity: item.quantity + 1 }))}
                        className="px-2 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600"
                      >+</button>
                    </div>
                    <span className="font-bold text-[#8B4513]">${(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / Checkout */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxes & Fees</span>
                <span>${(totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-[#4A2C2A] pt-3 border-t border-gray-100">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#DAA520] transition-colors shadow-md flex justify-center items-center gap-2"
            >
              <CreditCard size={20} />
              Proceed to Payment
            </button>
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => {
          setIsPaymentModalOpen(false);
          onClose(); // Close cart as well after successful payment
        }} 
        totalAmount={finalTotal} 
      />
    </>
  );
};

export default CartSidebar;


