import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';
import { doc, getDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import { User, MapPin, Calendar, Mail, ArrowLeft, Package, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Profile = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [userData, setUserData] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
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

    // Fetch user orders
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc') // Newest at the bottom
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: any[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setOrders(ordersData);
    });

    return () => unsubscribe();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'out_of_stock': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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
          className="bg-white rounded-3xl shadow-xl border border-[#DAA520]/20 overflow-hidden mb-8"
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
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Email / Phone</p>
                  <p className="font-bold text-gray-800">{userData?.email || userData?.phoneNumber || user?.email || user?.phoneNumber}</p>
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-serif font-bold text-[#8B4513] mb-6 flex items-center gap-2">
            <Package size={24} /> My Orders
          </h2>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
              <p className="text-gray-500">Your order history will appear here once you place an order.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Display newest order at the top AND bottom as requested */}
              {orders.length > 0 && (
                <div className="mb-8 relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#DAA520] rounded-r-md"></div>
                  <h3 className="text-sm font-bold text-[#DAA520] uppercase tracking-wider mb-2 ml-2">Latest Order</h3>
                  <OrderCard 
                    order={orders[orders.length - 1]} 
                    isExpanded={expandedOrder === 'latest-top'} 
                    onToggle={() => setExpandedOrder(expandedOrder === 'latest-top' ? null : 'latest-top')} 
                    getStatusColor={getStatusColor}
                  />
                </div>
              )}

              {orders.map((order) => (
                <OrderCard 
                  key={order.id} 
                  order={order} 
                  isExpanded={expandedOrder === order.id} 
                  onToggle={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)} 
                  getStatusColor={getStatusColor}
                />
              ))}
              
              {/* Display newest order at the bottom as requested */}
              {orders.length > 1 && (
                <div className="mt-8 relative">
                  <div className="absolute -left-4 top-0 bottom-0 w-1 bg-[#DAA520] rounded-r-md"></div>
                  <h3 className="text-sm font-bold text-[#DAA520] uppercase tracking-wider mb-2 ml-2">Latest Order (Repeated)</h3>
                  <OrderCard 
                    order={orders[orders.length - 1]} 
                    isExpanded={expandedOrder === 'latest-bottom'} 
                    onToggle={() => setExpandedOrder(expandedOrder === 'latest-bottom' ? null : 'latest-bottom')} 
                    getStatusColor={getStatusColor}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const OrderCard = ({ order, isExpanded, onToggle, getStatusColor }: { order: any, isExpanded: boolean, onToggle: () => void, getStatusColor: (status: string) => string }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        onClick={onToggle}
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-bold text-lg text-gray-800">Order #{order.id.slice(-6).toUpperCase()}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
              {order.status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Clock size={14} />
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>

        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
          <span className="text-xl font-bold text-[#8B4513]">₹{Math.round(order.totalAmount)}</span>
          <button className="text-[#DAA520] hover:text-[#8B4513] transition-colors flex items-center gap-1 font-bold text-sm">
            {isExpanded ? (
              <>Hide Details <ChevronUp size={16} /></>
            ) : (
              <>View Details <ChevronDown size={16} /></>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 bg-gray-50"
          >
            <div className="p-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h4>
              <div className="space-y-4">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F4EBD0] rounded-lg flex items-center justify-center text-[#8B4513] font-bold text-sm">
                        {item.quantity}x
                      </div>
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        {item.size && item.crust && <p className="text-xs text-gray-500">{item.size} • {item.crust}</p>}
                      </div>
                    </div>
                    <p className="font-bold text-gray-800">₹{Math.round(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Order Type</p>
                  <p className="font-bold text-gray-800">{order.orderType}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Payment Method</p>
                  <p className="font-bold text-gray-800 uppercase">{order.paymentMethod}</p>
                </div>
                {order.orderType === 'Delivery' && (
                  <div className="col-span-2">
                    <p className="text-gray-500 mb-1">Delivery Address</p>
                    <p className="font-bold text-gray-800">{order.address}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
