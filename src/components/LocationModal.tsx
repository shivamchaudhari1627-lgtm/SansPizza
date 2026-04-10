import React, { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setOrderDetails } from '../features/cartSlice';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const [orderType, setOrderType] = useState<'Delivery' | 'Carryout'>('Delivery');
  const [address, setAddress] = useState('');
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderType === 'Delivery' && !address) {
      alert('Please enter a delivery address');
      return;
    }
    dispatch(setOrderDetails({ type: orderType, address: orderType === 'Carryout' ? 'Store Pickup' : address }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#FCF9F2] w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-[#8B4513] z-10">
          <X size={24} />
        </button>
        
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-2/5 bg-[#F4EBD0] p-8 flex flex-col justify-center items-center text-center border-r border-[#DAA520]/20">
            <h2 className="text-3xl font-serif font-bold text-[#8B4513] mb-2">Sanskriti's</h2>
            <p className="text-[#DAA520] font-bold tracking-widest uppercase text-sm mb-6">Pizza</p>
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80" 
              alt="Pizza" 
              className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Right side - Form */}
          <div className="md:w-3/5 p-8 bg-white">
            <h3 className="text-2xl font-bold text-[#4A2C2A] mb-6">Start Your Order</h3>
            
            <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => setOrderType('Delivery')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                  orderType === 'Delivery' 
                    ? 'bg-[#8B4513] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Delivery
              </button>
              <button
                type="button"
                onClick={() => setOrderType('Carryout')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                  orderType === 'Carryout' 
                    ? 'bg-[#8B4513] text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                Carryout
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {orderType === 'Delivery' ? (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Enter your street address or zip code"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#DAA520] focus:ring-0 outline-none transition-colors"
                    />
                  </div>
                  <button type="button" className="flex items-center gap-2 text-[#DAA520] font-bold text-sm mt-3 hover:text-[#8B4513] transition-colors">
                    <Navigation size={16} /> Use current location
                  </button>
                </div>
              ) : (
                <div className="bg-[#F4EBD0]/50 p-4 rounded-xl border border-[#DAA520]/30">
                  <p className="font-bold text-[#8B4513] mb-1">Sanskriti's Main Kitchen</p>
                  <p className="text-sm text-gray-600">123 Heritage Lane, Culinary District</p>
                  <p className="text-sm text-green-600 font-bold mt-2">Open until 11:00 PM</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-[#DAA520] text-white font-bold text-lg py-4 rounded-xl hover:bg-[#8B4513] transition-colors mt-8 shadow-md"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
