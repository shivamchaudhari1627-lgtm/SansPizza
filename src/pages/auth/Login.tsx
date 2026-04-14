import React, { useState, useEffect } from 'react';
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Pizza, ShieldCheck, Phone, Mail } from 'lucide-react';

const Login: React.FC = () => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (authMethod === 'phone' && !(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  }, [authMethod]);

  const handleUserPostAuth = async (user: any, isNewUser: boolean = false) => {
    const ADMIN_EMAIL = 'shivamchaudhari1627@gmail.com';
    let finalRole = 'customer';

    if (isNewUser) {
      finalRole = user.email === ADMIN_EMAIL ? 'admin' : 'customer';
      const userData: any = {
        uid: user.uid,
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        displayName: name || user.displayName || 'User',
        role: finalRole,
        createdAt: new Date().toISOString()
      };
      if (age) userData.age = parseInt(age);
      await setDoc(doc(db, 'users', user.uid), userData);
    } else {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        finalRole = userDoc.data().role;
        if (user.email === ADMIN_EMAIL && finalRole !== 'admin') {
          finalRole = 'admin';
          await setDoc(doc(db, 'users', user.uid), { role: 'admin' }, { merge: true });
        } else if (user.email !== ADMIN_EMAIL && finalRole === 'admin') {
          finalRole = 'customer';
          await setDoc(doc(db, 'users', user.uid), { role: 'customer' }, { merge: true });
        }
      } else {
        finalRole = user.email === ADMIN_EMAIL ? 'admin' : 'customer';
        const userData: any = {
          uid: user.uid,
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          displayName: name || user.displayName || 'User',
          role: finalRole,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'users', user.uid), userData);
      }
    }

    if (finalRole === 'admin') {
      navigate('/admin');
      return;
    }

    setStatusText('Getting location...');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const locationName = data.display_name || `${latitude}, ${longitude}`;
          await setDoc(doc(db, 'users', user.uid), {
            location: locationName,
            lat: latitude,
            lng: longitude
          }, { merge: true });
        } catch (locErr) {
          await setDoc(doc(db, 'users', user.uid), {
            location: `${latitude}, ${longitude}`,
            lat: latitude,
            lng: longitude
          }, { merge: true });
        }
        navigate('/profile');
      },
      () => {
        navigate('/profile');
      }
    );
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    setStatusText('Signing in with Google...');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await handleUserPostAuth(result.user, false);
    } catch (err: any) {
      setError(err.message || "An error occurred during Google authentication.");
      setIsLoading(false);
      setStatusText('');
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isSignUp) {
        setStatusText('Creating account...');
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(result.user, { displayName: name });
        await handleUserPostAuth(result.user, true);
      } else {
        setStatusText('Signing in...');
        const result = await signInWithEmailAndPassword(auth, email, password);
        await handleUserPostAuth(result.user, false);
      }
    } catch (err: any) {
      if (err.code === 'auth/operation-not-allowed') {
        setError("Email/Password authentication is not enabled. Please Continue with Google below.");
      } else if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (err.code === 'auth/email-already-in-use') {
        setError("This email is already registered. Please sign in instead.");
      } else if (err.code === 'auth/weak-password') {
        setError("Password should be at least 6 characters.");
      } else {
        setError(err.message || "An error occurred during authentication.");
      }
      setIsLoading(false);
      setStatusText('');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setStatusText('Sending OTP...');
    try {
      const formattedPhone = phoneNumber.startsWith('+') ? phoneNumber : `+91${phoneNumber}`;
      const appVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(confirmation);
      setStatusText('');
    } catch (err: any) {
      setError(err.message || "Failed to send OTP.");
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) return;
    setIsLoading(true);
    setError(null);
    setStatusText('Verifying OTP...');
    try {
      const result = await confirmationResult.confirm(otp);
      if (isSignUp && name) {
        await updateProfile(result.user, { displayName: name });
      }
      await handleUserPostAuth(result.user, isSignUp);
    } catch (err: any) {
      setError(err.message || "Invalid OTP.");
      setIsLoading(false);
      setStatusText('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2] relative overflow-hidden py-12">
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-[#DAA520]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-[#8B4513]/10 rounded-full blur-3xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md p-8 bg-white rounded-3xl shadow-2xl border border-[#DAA520]/20 z-10 mx-4"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-[#F4EBD0] rounded-2xl mb-4 shadow-inner"
          >
            <Pizza size={32} className="text-[#8B4513]" />
          </motion.div>
          <h1 className="text-3xl font-serif font-bold text-[#8B4513] mb-2 tracking-tight">
            Sanskriti's Pizza
          </h1>
          <p className="text-gray-500 font-medium text-sm">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <div className="flex bg-gray-100 p-1 rounded-xl mb-6">
          <button
            onClick={() => setAuthMethod('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'email' ? 'bg-white text-[#8B4513] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Mail size={16} /> Email
          </button>
          <button
            onClick={() => setAuthMethod('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all ${authMethod === 'phone' ? 'bg-white text-[#8B4513] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Phone size={16} /> Phone
          </button>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-r-lg"
          >
            {error}
          </motion.div>
        )}

        {authMethod === 'email' ? (
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Age</label>
                  <input 
                    type="number" 
                    required 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                    placeholder="25"
                  />
                </div>
              </>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Email</label>
              <input 
                type="email" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Password</label>
              <input 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 text-white p-4 rounded-xl font-bold transition-all shadow-md disabled:opacity-70 mt-6 bg-[#DAA520] hover:bg-[#8B4513]`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{statusText}</span>
                </>
              ) : (
                <span>{isSignUp ? 'Sign Up' : 'Sign In'}</span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={confirmationResult ? handleVerifyOtp : handleSendOtp} className="space-y-4">
            {isSignUp && !confirmationResult && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Age</label>
                  <input 
                    type="number" 
                    required 
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                    placeholder="25"
                  />
                </div>
              </>
            )}
            
            {!confirmationResult ? (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Mobile Number</label>
                <input 
                  type="tel" 
                  required 
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all"
                  placeholder="9876543210"
                />
                <div id="recaptcha-container" className="mt-2"></div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Enter OTP</label>
                <input 
                  type="text" 
                  required 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#DAA520] focus:ring-2 focus:ring-[#DAA520]/20 outline-none transition-all text-center tracking-widest text-xl"
                  placeholder="------"
                  maxLength={6}
                />
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 text-white p-4 rounded-xl font-bold transition-all shadow-md disabled:opacity-70 mt-6 bg-[#DAA520] hover:bg-[#8B4513]`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{statusText}</span>
                </>
              ) : (
                <span>{!confirmationResult ? 'Send OTP' : 'Verify & Continue'}</span>
              )}
            </button>
            
            {confirmationResult && (
              <button
                type="button"
                onClick={() => {
                  setConfirmationResult(null);
                  setOtp('');
                }}
                className="w-full text-sm text-gray-500 hover:text-[#8B4513] font-medium transition-colors mt-2"
              >
                Change Mobile Number
              </button>
            )}
          </form>
        )}

        <div className="mt-6 flex items-center justify-between">
          <hr className="w-full border-gray-200" />
          <span className="px-4 text-xs text-gray-400 font-bold uppercase">OR</span>
          <hr className="w-full border-gray-200" />
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 p-4 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm disabled:opacity-70 mt-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Continue with Google
        </button>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-500 hover:text-[#8B4513] font-medium transition-colors"
          >
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-[#DAA520]">
            <ShieldCheck size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Secure Authentication</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
