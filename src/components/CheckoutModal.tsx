import React, { useState } from 'react';
import { X, CreditCard, MapPin, CheckCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartTotal: number;
  location: string;
  onConfirmOrder: (address: string, paymentMethod: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, cartTotal, location, onConfirmOrder }) => {
  const [address, setAddress] = useState(location !== 'Detecting location...' ? location : '');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        onConfirmOrder(address, paymentMethod);
        setIsSuccess(false);
      }, 2000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#FCF9F2] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-[#DAA520]/20 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif text-[#8B4513]">Checkout</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#8B4513] transition-colors">
            <X size={24} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <CheckCircle size={64} className="text-green-600 mb-4" />
            <h3 className="text-2xl font-serif text-[#4A2C2A] mb-2">Order Confirmed!</h3>
            <p className="text-gray-600">Your Sanskriti Pizza is being prepared with love.</p>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2 flex items-center gap-2">
                <MapPin size={16} /> Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#DAA520]/30 bg-white focus:outline-none focus:ring-2 focus:ring-[#DAA520] resize-none"
                rows={3}
                placeholder="Enter your full address..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8B4513] mb-2 flex items-center gap-2">
                <CreditCard size={16} /> Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                    paymentMethod === 'card' ? 'border-[#8B4513] bg-[#F4EBD0] text-[#8B4513]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#DAA520]/50'
                  }`}
                >
                  Credit/Debit Card
                </button>
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                    paymentMethod === 'cash' ? 'border-[#8B4513] bg-[#F4EBD0] text-[#8B4513]' : 'border-gray-200 bg-white text-gray-600 hover:border-[#DAA520]/50'
                  }`}
                >
                  Cash on Delivery
                </button>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-100">
                <input type="text" placeholder="Card Number" className="w-full p-2 border-b border-gray-200 focus:outline-none focus:border-[#DAA520]" />
                <div className="flex gap-3">
                  <input type="text" placeholder="MM/YY" className="w-1/2 p-2 border-b border-gray-200 focus:outline-none focus:border-[#DAA520]" />
                  <input type="text" placeholder="CVC" className="w-1/2 p-2 border-b border-gray-200 focus:outline-none focus:border-[#DAA520]" />
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-[#DAA520]/20">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total to pay</span>
                <span className="text-2xl font-serif text-[#8B4513]">₹{cartTotal.toFixed(2)}</span>
              </div>
              <button
                onClick={handleConfirm}
                disabled={isProcessing || !address}
                className="w-full bg-[#8B4513] text-white py-3 rounded-xl font-medium hover:bg-[#DAA520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              >
                {isProcessing ? (
                  <span className="animate-pulse">Processing...</span>
                ) : (
                  `Pay ₹{cartTotal.toFixed(2)}`
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
