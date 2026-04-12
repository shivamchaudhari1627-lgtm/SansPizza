import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { User, MapPin, Calendar, Mail, ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2] font-sans text-[#4A2C2A]">
      <Header onOpenCart={() => {}} onOpenLocation={() => {}} />
      
      <div className="max-w-3xl mx-auto px-4 py-12">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-[#8B4513] hover:text-[#DAA520] transition-colors mb-8 font-bold"
        >
          <ArrowLeft size={20} /> Back to Menu
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl border border-[#DAA520]/20 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-[#7f1d1d] to-[#b91c1c] h-32 relative">
            <div className="absolute -bottom-12 left-8">
              <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                <div className="w-full h-full bg-red-100 rounded-full flex items-center justify-center text-[#8B4513] text-3xl font-bold border-2 border-[#DAA520]/20">
                  {userData?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-16 pb-8 px-8">
            <h1 className="text-3xl font-serif font-bold text-[#8B4513] mb-1">
              {userData?.displayName || 'User'}
            </h1>
            <p className="text-gray-500 font-medium mb-8">Customer Profile</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-[#DAA520]">
                  <User size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Name</p>
                  <p className="font-bold text-gray-800">{userData?.displayName || 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-[#DAA520]">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email</p>
                  <p className="font-bold text-gray-800">{userData?.email || user?.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-[#DAA520]">
                  <Calendar size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Age</p>
                  <p className="font-bold text-gray-800">{userData?.age ? `${userData.age} years old` : 'Not provided'}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="bg-white p-3 rounded-xl shadow-sm text-[#DAA520]">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-bold text-gray-800 line-clamp-2">
                    {userData?.location || 'Location not available'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
