import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store, RootState } from './features/store';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { setUser } from './features/authSlice';
import { doc, getDoc } from 'firebase/firestore';
import PizzaLoader from './components/PizzaLoader';

// Lazy loaded routes for faster initial page load
const CustomerHome = lazy(() => import('./pages/customer/Home'));
const Profile = lazy(() => import('./pages/customer/Profile'));
const Login = lazy(() => import('./pages/auth/Login'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));

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
            phoneNumber: firebaseUser.phoneNumber,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: role
          }));
        } catch (error) {
          console.error("Error fetching user role:", error);
          dispatch(setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            phoneNumber: firebaseUser.phoneNumber,
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2] overflow-hidden">
        <PizzaLoader size="large" />
      </div>
    );
  }

  return (
    <Router>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#FCF9F2] overflow-hidden">
          <PizzaLoader size="large" />
        </div>
      }>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          
          {/* Role-based routing */}
          <Route path="/admin/*" element={user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          <Route path="/delivery/*" element={user?.role === 'delivery' ? <DeliveryLayout /> : <Navigate to="/login" />} />
          
          {/* Default to customer app */}
          <Route path="/*" element={<CustomerHome />} />
        </Routes>
      </Suspense>
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


