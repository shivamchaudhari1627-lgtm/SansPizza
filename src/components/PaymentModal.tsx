import React, { useState, useEffect } from 'react';
import { X, CreditCard, Banknote, CheckCircle, Smartphone, QrCode, LogIn, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../features/cartSlice';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { RootState } from '../features/store';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
}

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, totalAmount }) => {
  const [step, setStep] = useState<'select' | 'details' | 'success' | 'rating'>('select');
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod' | 'upi' | 'qr' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const dispatch = useDispatch();
  
  const { items, orderType, address } = useSelector((state: RootState) => state.cart);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isOpen) {
      loadRazorpayScript();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const saveOrderToFirestore = async (method: string, paymentId?: string) => {
    const orderData = {
      userId: user?.uid || 'guest',
      customerName: user?.displayName || 'Guest',
      customerEmail: user?.email || 'N/A',
      items: items,
      totalAmount: totalAmount,
      orderType: orderType,
      address: address || 'N/A',
      paymentMethod: method,
      paymentId: paymentId || null,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await addDoc(collection(db, 'orders'), orderData);
  };

  const submitRating = async () => {
    if (rating === 0) return;
    setIsSubmittingRating(true);
    try {
      await addDoc(collection(db, 'ratings'), {
        userId: user?.uid || 'anonymous',
        userName: user?.displayName || 'Anonymous',
        rating,
        comment,
        createdAt: new Date().toISOString()
      });
      onClose();
      // Reset for next time
      setStep('select');
      setRating(0);
      setComment('');
    } catch (error) {
      console.error("Error submitting rating:", error);
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const handleRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalAmount })
      });
      
      const data = await res.json();
      
      if (!data.id) {
        throw new Error('Failed to create Razorpay order');
      }

      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: data.currency,
        name: "Sanskriti's Pizza",
        description: "Pizza Order Payment",
        order_id: data.id,
        handler: async function (response: any) {
          try {
            await saveOrderToFirestore('razorpay', response.razorpay_payment_id);
            setIsProcessing(false);
            setStep('success');
            setTimeout(() => {
              dispatch(clearCart());
            }, 1000);
          } catch (err) {
            console.error("Error saving order:", err);
            alert("Payment successful, but failed to save order. Please contact support.");
          }
        },
        prefill: {
          name: user?.displayName || '',
          email: user?.email || '',
        },
        theme: {
          color: "#8B4513"
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error("Payment failed:", response.error);
        alert("Payment failed. Please try again.");
        setIsProcessing(false);
      });
      rzp.open();
    } catch (error) {
      console.error("Razorpay Error:", error);
      setIsProcessing(false);
      alert("Failed to initialize payment. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'razorpay') {
      await handleRazorpayPayment();
      return;
    }

    if (paymentMethod === 'qr' || paymentMethod === 'upi') {
      const upiUrl = `upi://pay?pa=8963938656@ibl&pn=SANSKRITI%20DIXIT&mc=0000&mode=02&purpose=00&am=${Math.round(totalAmount)}&cu=INR`;
      window.location.href = upiUrl;
    }

    // COD, QR, UPI Flow
    setIsProcessing(true);
    try {
      await saveOrderToFirestore(paymentMethod as string);
      setIsProcessing(false);
      setStep('success');
      setTimeout(() => {
        dispatch(clearCart());
      }, 1000);
    } catch (error) {
      console.error("Error saving order:", error);
      setIsProcessing(false);
      alert("Failed to process order. Please try again.");
    }
  };

  const handleSelectMethod = (method: 'razorpay' | 'cod' | 'upi' | 'qr') => {
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
                onClick={() => handleSelectMethod('razorpay')}
                className="flex items-center p-4 border-2 border-gray-100 rounded-2xl hover:border-[#DAA520] hover:bg-[#F4EBD0]/20 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Smartphone size={24} />
                </div>
                <div className="ml-4">
                  <p className="font-bold text-gray-800">Pay Online (Razorpay)</p>
                  <p className="text-xs text-gray-500">UPI, Cards, Netbanking, Wallets</p>
                </div>
              </button>

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
              {paymentMethod === 'razorpay' && (
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                    <CreditCard size={40} />
                  </div>
                  <p className="font-bold text-gray-800">Secure Online Payment</p>
                  <p className="text-sm text-gray-500 mt-2 px-4">You will be redirected to Razorpay to complete your payment securely via UPI, Card, or Netbanking.</p>
                </div>
              )}

              {paymentMethod === 'qr' && (
                <div className="text-center">
                  <div className="bg-white p-4 rounded-2xl shadow-sm inline-block mb-4 border border-gray-100">
                    <QRCodeSVG 
                      value={`upi://pay?pa=8963938656@ibl&pn=SANSKRITI%20DIXIT&mc=0000&mode=02&purpose=00&am=${Math.round(totalAmount)}&cu=INR`}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                  </div>
                  <p className="text-sm font-bold text-gray-700">Scan & Pay with any UPI App</p>
                  <p className="text-xs text-gray-500 mt-1">Amount: ₹{Math.round(totalAmount)}</p>
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
                paymentMethod === 'cod' ? 'Confirm Order' : 
                (paymentMethod === 'qr' || paymentMethod === 'upi') ? 'Pay via UPI App' : `Pay ₹${Math.round(totalAmount)}`
              )}
            </button>
            {(paymentMethod === 'qr' || paymentMethod === 'upi') && (
              <p className="text-[10px] text-center text-gray-400 mt-3">
                Clicking pay will redirect you to your preferred UPI app (PhonePe, GPay, etc.)
              </p>
            )}
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
            <div className="w-full bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order Status</p>
              <p className="text-[#DAA520] font-bold mt-1">Preparing your meal...</p>
            </div>
            <button
              onClick={() => setStep('rating')}
              className="w-full bg-[#DAA520] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8B4513] transition-all shadow-lg"
            >
              Rate Your Experience
            </button>
            <button
              onClick={onClose}
              className="mt-4 text-gray-500 font-bold hover:text-[#8B4513]"
            >
              Skip for now
            </button>
          </div>
        );

      case 'rating':
        return (
          <div className="p-8 text-center bg-white">
            <h3 className="text-2xl font-serif font-bold text-[#4A2C2A] mb-2">Rate Your Experience</h3>
            <p className="text-sm text-gray-500 mb-8">How was your ordering experience today?</p>
            
            <div className="flex justify-center gap-2 mb-8">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    size={40}
                    className={`${
                      star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>

            <textarea
              placeholder="Tell us more (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-4 border-2 border-gray-100 rounded-2xl mb-8 focus:outline-none focus:border-[#DAA520] min-h-[100px] resize-none text-sm"
            />

            <button
              onClick={submitRating}
              disabled={rating === 0 || isSubmittingRating}
              className="w-full bg-[#8B4513] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#DAA520] transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[60] flex items-center justify-center p-4">
      <div className="bg-[#FCF9F2] w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white">
        <div className="p-6 border-b border-[#DAA520]/10 flex justify-between items-center bg-white">
          <h2 className="text-2xl font-serif font-bold text-[#8B4513]">
            {step === 'select' ? 'Payment' : step === 'details' ? 'Payment Details' : step === 'success' ? 'Success' : 'Rate Us'}
          </h2>
          {step !== 'success' && step !== 'rating' && (
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
