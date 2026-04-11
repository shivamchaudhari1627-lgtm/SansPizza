import React, { useState } from 'react';
import { X, CreditCard, QrCode, Banknote, CheckCircle, LogIn } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../features/cartSlice';
import { QRCodeSVG } from 'qrcode.react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const [step, setStep] = useState<'select' | 'details' | 'success'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'qr' | 'upi' | 'card' | 'cod' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      setTimeout(() => {
        dispatch(clearCart());
        setStep('select');
        setPaymentMethod(null);
        onClose();
      }, 2500);
    }, 2000);
  };

  const handleSelectMethod = (method: 'qr' | 'upi' | 'card' | 'cod') => {
    setPaymentMethod(method);
    setStep('details');
  };

  const renderStep = () => {
    switch (step) {
      case 'select':
        return (
          <div className="p-6 space-y-4 bg-white">
            <div className="text-center mb-8">
              <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Total Amount</p>
              <p className="text-4xl font-serif font-bold text-[#8B4513]">₹{totalAmount.toFixed(2)}</p>
            </div>

            <p className="font-bold text-gray-800 text-sm mb-2">Choose Payment Method</p>
            
            <div className="grid gap-3">
              <button 
                onClick={() => handleSelectMethod('qr')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-[#DAA520] hover:bg-[#F4EBD0]/20 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <QrCode size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-800">Scan QR Code</p>
                  <p className="text-xs text-gray-500">Fastest way to pay</p>
                </div>
              </button>

              <button 
                onClick={() => handleSelectMethod('upi')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-[#DAA520] hover:bg-[#F4EBD0]/20 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600 group-hover:bg-purple-100 transition-colors">
                  <LogIn size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-800">UPI ID / VPA</p>
                  <p className="text-xs text-gray-500">Pay using your UPI ID</p>
                </div>
              </button>

              <button 
                onClick={() => handleSelectMethod('card')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-[#DAA520] hover:bg-[#F4EBD0]/20 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                  <CreditCard size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-800">Card Payment</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, RuPay</p>
                </div>
              </button>

              <button 
                onClick={() => handleSelectMethod('cod')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-[#DAA520] hover:bg-[#F4EBD0]/20 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600 group-hover:bg-green-100 transition-colors">
                  <Banknote size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-800">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you get it</p>
                </div>
              </button>
            </div>
          </div>
        );

      case 'details':
        return (
          <div className="p-6 bg-white">
            <button 
              onClick={() => setStep('select')}
              className="text-[#8B4513] font-bold text-sm mb-6 flex items-center gap-1 hover:underline"
            >
              ← Back to methods
            </button>

            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
              {paymentMethod === 'qr' && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4 border border-gray-100">
                    <QRCodeSVG 
                      value={`upi://pay?pa=8963938656@ibl&pn=SANSKRITI%20DIXIT&mc=0000&mode=02&purpose=00&am=${totalAmount.toFixed(2)}&cu=INR`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Scan & Pay with any UPI App</p>
                  <p className="text-xs text-gray-500 mt-1">Amount: ₹{totalAmount.toFixed(2)}</p>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div className="text-center mb-4">
                    <p className="font-bold text-gray-800">Enter your UPI ID</p>
                    <p className="text-xs text-gray-500">A payment request will be sent to your app</p>
                  </div>
                  <input 
                    type="text" 
                    placeholder="e.g., mobile-number@upi" 
                    className="w-full p-4 border-2 border-gray-200 rounded-xl text-lg focus:outline-none focus:border-[#DAA520] text-center font-medium" 
                  />
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <input type="text" placeholder="Card Number" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DAA520]" />
                  <div className="flex gap-4">
                    <input type="text" placeholder="MM/YY" className="w-1/2 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DAA520]" />
                    <input type="password" placeholder="CVV" className="w-1/2 p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DAA520]" />
                  </div>
                  <input type="text" placeholder="Cardholder Name" className="w-full p-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#DAA520]" />
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                    <Banknote size={40} />
                  </div>
                  <p className="font-bold text-gray-800">Cash on Delivery Selected</p>
                  <p className="text-sm text-gray-500 mt-2 px-4">Please keep exact change ready for a smooth delivery experience.</p>
                </div>
              )}
            </div>

            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#DAA520] transition-all shadow-lg flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                paymentMethod === 'cod' ? 'Confirm Order' : `Pay ₹${totalAmount.toFixed(2)}`
              )}
            </button>
          </div>
        );

      case 'success':
        return (
          <div className="p-12 text-center flex flex-col items-center bg-white">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-8 animate-bounce">
              <CheckCircle size={60} />
            </div>
            <h3 className="text-3xl font-serif font-bold text-[#4A2C2A] mb-3">Order Placed!</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Your payment was successful and your delicious pizza is being prepared.
            </p>
            <div className="w-full bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Status</p>
              <p className="text-[#DAA520] font-bold mt-1">Preparing your meal...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-[#FCF9F2] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
        <div className="p-6 border-b border-[#DAA520]/10 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif font-bold text-[#8B4513]">
            {step === 'select' ? 'Payment' : step === 'details' ? 'Payment Details' : 'Success'}
          </h2>
          {step !== 'success' && (
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all">
              <X size={20} />
            </button>
          )}
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default PaymentModal;
