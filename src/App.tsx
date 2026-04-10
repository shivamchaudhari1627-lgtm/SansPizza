import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './features/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { setUser } from './features/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import CustomerHome from './pages/customer/Home';

// Placeholder Components for other roles
const AdminLayout = () => <div className="p-4">Admin Dashboard</div>;
const DeliveryLayout = () => <div className="p-4">Delivery Partner App</div>;
const Login = () => <div className="p-4">Login Page</div>;

const AppContent = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user role from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const role = userDoc.exists() ? userDoc.data().role : 'customer';
          
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            role: role
          }));
        } catch (error) {
          console.error("Error fetching user role:", error);
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
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
        
        {/* Role-based routing */}
        <Route path="/admin/*" element={user?.role === 'admin' ? <AdminLayout /> : <Navigate to="/login" />} />
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


