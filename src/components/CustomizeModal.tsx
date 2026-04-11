import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';
import { MenuItem, crustOptions, sizeOptions, toppingOptions } from '../data/menu';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';

interface CustomizeModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const CustomizeModal: React.FC<CustomizeModalProps> = ({ item, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState(sizeOptions[1]); // Default Medium
  const [selectedCrust, setSelectedCrust] = useState(crustOptions[0]);
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  if (!isOpen || !item) return null;

  const toggleTopping = (toppingId: string) => {
    setSelectedToppings(prev => 
      prev.includes(toppingId) 
        ? prev.filter(id => id !== toppingId)
        : [...prev, toppingId]
    );
  };

  const calculateTotal = () => {
    let total = item.price * selectedSize.multiplier;
    total += selectedCrust.price;
    
    const toppingsCost = selectedToppings.reduce((sum, toppingId) => {
      const topping = toppingOptions.find(t => t.id === toppingId);
      return sum + (topping ? topping.price : 0);
    }, 0);
    
    total += toppingsCost;
    return total;
  };

  const handleAddToCart = () => {
    const totalPrice = calculateTotal();
    dispatch(addToCart({
      cartItemId: Math.random().toString(36).substr(2, 9),
      id: item.id,
      name: item.name,
      basePrice: item.price,
      totalPrice: totalPrice,
      quantity: quantity,
      size: selectedSize.name,
      crust: selectedCrust.name,
      toppings: selectedToppings,
      image: item.image
    }));
    onClose();
    // Reset state for next time
    setSelectedSize(sizeOptions[1]);
    setSelectedCrust(crustOptions[0]);
    setSelectedToppings([]);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-[#8B4513] z-10 bg-white rounded-full p-1 shadow-sm">
          <X size={24} />
        </button>

        {/* Left Side - Image & Summary */}
        <div className="md:w-2/5 bg-[#FCF9F2] p-8 flex flex-col border-r border-[#DAA520]/20 overflow-y-auto">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-48 object-cover rounded-xl shadow-md mb-6"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-2xl font-serif font-bold text-[#4A2C2A] mb-2">{item.name}</h2>
          <p className="text-gray-600 text-sm mb-6">{item.description}</p>
          
          <div className="mt-auto bg-white p-4 rounded-xl border border-[#DAA520]/30 shadow-sm">
            <h4 className="font-bold text-[#8B4513] mb-2 border-b border-gray-100 pb-2">Your Selection</h4>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• {selectedSize.name} Size</li>
              <li>• {selectedCrust.name}</li>
              {selectedToppings.map(tId => {
                const t = toppingOptions.find(opt => opt.id === tId);
                return t ? <li key={tId}>• Add {t.name}</li> : null;
              })}
            </ul>
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <span className="font-bold text-gray-800">Item Total</span>
              <span className="text-xl font-serif font-bold text-[#DAA520]">₹{calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Right Side - Options */}
        <div className="md:w-3/5 p-8 overflow-y-auto bg-white">
          <h3 className="text-xl font-bold text-[#8B4513] mb-6 border-b-2 border-[#DAA520] inline-block pb-1">Build Your Pizza</h3>
          
          {/* Size */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-3">1. Choose Size</h4>
            <div className="grid grid-cols-3 gap-3">
              {sizeOptions.map(size => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
                    selectedSize.id === size.id 
                      ? 'border-[#8B4513] bg-[#F4EBD0] text-[#8B4513]' 
                      : 'border-gray-200 text-gray-600 hover:border-[#DAA520]/50'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Crust */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-3">2. Choose Crust</h4>
            <div className="space-y-2">
              {crustOptions.map(crust => (
                <button
                  key={crust.id}
                  onClick={() => setSelectedCrust(crust)}
                  className={`w-full flex justify-between items-center p-4 rounded-xl border-2 transition-all ${
                    selectedCrust.id === crust.id 
                      ? 'border-[#8B4513] bg-[#F4EBD0] text-[#8B4513]' 
                      : 'border-gray-200 text-gray-600 hover:border-[#DAA520]/50'
                  }`}
                >
                  <span className="font-bold">{crust.name}</span>
                  <span className="text-sm">{crust.price > 0 ? `+₹${crust.price.toFixed(2)}` : 'Included'}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toppings */}
          <div className="mb-8">
            <h4 className="font-bold text-gray-800 mb-3">3. Add Toppings</h4>
            <div className="grid grid-cols-2 gap-3">
              {toppingOptions.map(topping => {
                const isSelected = selectedToppings.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    onClick={() => toggleTopping(topping.id)}
                    className={`flex justify-between items-center p-3 rounded-xl border-2 transition-all ${
                      isSelected 
                        ? 'border-[#DAA520] bg-[#DAA520]/10 text-[#8B4513]' 
                        : 'border-gray-200 text-gray-600 hover:border-[#DAA520]/50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-sm border flex items-center justify-center ${isSelected ? 'bg-[#DAA520] border-[#DAA520]' : 'border-gray-300'}`}>
                        {isSelected && <X size={12} className="text-white" />}
                      </div>
                      <span className="font-medium text-sm">{topping.name}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-500">+₹{topping.price.toFixed(2)}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Add to Cart Bar */}
          <div className="sticky bottom-0 bg-white pt-4 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Minus size={20} />
              </button>
              <span className="w-12 text-center font-bold text-lg">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 text-gray-600 transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-[#8B4513] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#DAA520] transition-colors shadow-md flex justify-center items-center gap-2"
            >
              Add to Order - ₹{(calculateTotal() * quantity).toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;
