import React, { useState } from 'react';
import { auth, db } from '../../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pizza, LogIn, ShieldCheck } from 'lucide-react';

const Login: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create them
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          role: 'customer',
          createdAt: new Date().toISOString()
        });
      }

      navigate('/');
    } catch (err: any) {
      console.error("Login Error:", err);
      setError(err.message || "An error occurred during sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2] relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#DAA520]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#8B4513]/10 rounded-full blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-[#DAA520]/20 z-10 mx-4"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-[#F4EBD0] rounded-2xl mb-6 shadow-inner"
          >
            <Pizza size={40} className="text-[#8B4513]" />
          </motion.div>
          <h1 className="text-4xl font-serif font-bold text-[#8B4513] mb-2 tracking-tight">Sanskriti's Pizza</h1>
          <p className="text-gray-500 font-medium">Vedic Wisdom, Modern Craft</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Welcome Back</span>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg"
            >
              {error}
            </motion.div>
          )}

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-4 bg-white border-2 border-gray-100 p-4 rounded-2xl font-bold text-gray-700 hover:border-[#DAA520] hover:bg-gray-50 transition-all shadow-sm group disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-6 h-6" />
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <div className="text-center space-y-4">
            <p className="text-xs text-gray-400 leading-relaxed px-8">
              By signing in, you agree to our <span className="text-[#8B4513] font-bold cursor-pointer hover:underline">Terms of Service</span> and <span className="text-[#8B4513] font-bold cursor-pointer hover:underline">Privacy Policy</span>.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-[#DAA520]">
              <ShieldCheck size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Secure Authentication</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Decorative Pizza Image */}
      <motion.img 
        initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
        animate={{ opacity: 0.15, rotate: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80"
        alt="Decorative Pizza"
        className="absolute -bottom-20 -left-20 w-80 h-80 object-cover rounded-full pointer-events-none"
        referrerPolicy="no-referrer"
      />
      
      <motion.img 
        initial={{ opacity: 0, rotate: 20, scale: 0.8 }}
        animate={{ opacity: 0.15, rotate: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.4 }}
        src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80"
        alt="Decorative Pizza"
        className="absolute -top-20 -right-20 w-80 h-80 object-cover rounded-full pointer-events-none"
        referrerPolicy="no-referrer"
      />
    </div>
  );
};

export default Login;
