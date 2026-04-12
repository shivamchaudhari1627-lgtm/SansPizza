import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './features/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { setUser } from './features/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import CustomerHome from './pages/customer/Home';
import Profile from './pages/customer/Profile';
import Login from './pages/auth/Login';
import AdminDashboard from './pages/admin/Dashboard';

// Placeholder Components for other roles
const DeliveryLayout = () => <div className="p-4">Delivery Partner App</div>;

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        try {
          const ADMIN_EMAIL = 'shivamchaudhari1627@gmail.com';
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          let role = userDoc.exists() ? userDoc.data().role : 'customer';
          
          // Enforce admin email rule
          if (firebaseUser.email === ADMIN_EMAIL && role !== 'admin') {
            role = 'admin';
          } else if (firebaseUser.email !== ADMIN_EMAIL && role === 'admin') {
            role = 'customer';
          }

          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role
          }));
        } catch (error) {
          console.error("Error fetching user role:", error);
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'customer' // Default fallback
          }));
        }
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2] text-[#8B4513] font-serif text-2xl">Loading Sanskriti's Pizza...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        
        {/* Role-based routing */}
        <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
        <Route path="/delivery/*" element={user?.role === 'delivery' ? <DeliveryLayout /> : <Navigate to="/login" />} />
        
        {/* Default to customer app */}
        <Route path="/*" element={<CustomerHome />} />
      </Routes>
    </Router>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}


