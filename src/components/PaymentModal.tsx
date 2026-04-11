import React, { useState } from 'react';
import { X, CreditCard, QrCode, Banknote, CheckCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cartSlice';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        dispatch(clearCart());
        setIsSuccess(false);
        onClose();
      }, 2500);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-[#FCF9F2] w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        <div className="p-6 border-b border-[#DAA520]/20 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif font-bold text-[#8B4513]">Complete Payment</h2>
          {!isProcessing && !isSuccess && (
            <button onClick={onClose} className="text-gray-500 hover:text-[#8B4513] transition-colors">
              <X size={24} />
            </button>
          )}
        </div>

        {isSuccess ? (
          <div className="p-10 text-center flex flex-col items-center bg-white">
            <CheckCircle size={80} className="text-green-500 mb-6" />
            <h3 className="text-3xl font-serif font-bold text-[#4A2C2A] mb-2">Payment Successful!</h3>
            <p className="text-gray-600 mb-6">Your Sanskriti Pizza order has been placed.</p>
            <p className="text-sm font-bold text-[#DAA520]">Redirecting to tracking...</p>
          </div>
        ) : (
          <div className="p-6 space-y-6 bg-white">
            <div className="text-center mb-6">
              <p className="text-gray-500 text-sm">Amount to Pay</p>
              <p className="text-4xl font-serif font-bold text-[#8B4513]">₹{totalAmount.toFixed(2)}</p>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-gray-800 text-sm">Select Payment Method</p>
              
              {/* UPI / QR Option */}
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#8B4513] bg-[#F4EBD0]/30' : 'border-gray-200 hover:border-[#DAA520]/50'}`}>
                <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="hidden" />
                <QrCode className={`mr-4 ${paymentMethod === 'upi' ? 'text-[#8B4513]' : 'text-gray-400'}`} size={24} />
                <div className="flex-1">
                  <p className={`font-bold ${paymentMethod === 'upi' ? 'text-[#8B4513]' : 'text-gray-700'}`}>UPI / QR Code</p>
                  <p className="text-xs text-gray-500">Google Pay, PhonePe, Paytm</p>
                </div>
              </label>

              {/* Card Option */}
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#8B4513] bg-[#F4EBD0]/30' : 'border-gray-200 hover:border-[#DAA520]/50'}`}>
                <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="hidden" />
                <CreditCard className={`mr-4 ${paymentMethod === 'card' ? 'text-[#8B4513]' : 'text-gray-400'}`} size={24} />
                <div className="flex-1">
                  <p className={`font-bold ${paymentMethod === 'card' ? 'text-[#8B4513]' : 'text-gray-700'}`}>Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                </div>
              </label>

              {/* COD Option */}
              <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#8B4513] bg-[#F4EBD0]/30' : 'border-gray-200 hover:border-[#DAA520]/50'}`}>
                <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="hidden" />
                <Banknote className={`mr-4 ${paymentMethod === 'cod' ? 'text-[#8B4513]' : 'text-gray-400'}`} size={24} />
                <div className="flex-1">
                  <p className={`font-bold ${paymentMethod === 'cod' ? 'text-[#8B4513]' : 'text-gray-700'}`}>Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay at your doorstep</p>
                </div>
              </label>
            </div>

            {/* Dynamic Payment Content */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
              {paymentMethod === 'upi' && (
                <div className="text-center">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=sanskriti@upi&pn=SanskritiPizza&am=100" alt="UPI QR Code" className="mx-auto mb-3 rounded-lg shadow-sm" />
                  <p className="text-sm font-bold text-gray-700">Scan to Pay</p>
                  <p className="text-xs text-gray-500 mt-1">or enter UPI ID below</p>
                  <input type="text" placeholder="username@upi" className="mt-3 w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#DAA520]" />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-3">
                  <input type="text" placeholder="Card Number" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#DAA520]" />
                  <div className="flex gap-3">
                    <input type="text" placeholder="MM/YY" className="w-1/2 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#DAA520]" />
                    <input type="text" placeholder="CVV" className="w-1/2 p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#DAA520]" />
                  </div>
                  <input type="text" placeholder="Name on Card" className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#DAA520]" />
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-600">Please keep exact change ready to help our delivery partners.</p>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#DAA520] transition-colors shadow-md flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
            >
              {isProcessing ? (
                <span className="animate-pulse">Processing Payment...</span>
              ) : (
                `Pay ₹{totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;
