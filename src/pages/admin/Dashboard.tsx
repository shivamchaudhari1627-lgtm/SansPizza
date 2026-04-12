import React, { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Package, Clock, CheckCircle, XCircle, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  crust: string;
}

interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  orderType: string;
  address: string;
  paymentMethod: string;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData: Order[] = [];
      snapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(ordersData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus
      });
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'out_for_delivery': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCF9F2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#DAA520] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCF9F2] font-sans text-[#4A2C2A]">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-[#DAA520]/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4">
              <Link to="/" className="flex flex-col">
                <span className="text-2xl font-serif font-bold text-[#8B4513] leading-none tracking-tighter">
                  Sanskriti's
                </span>
                <span className="text-[#DAA520] font-bold tracking-widest uppercase text-xs">
                  Admin Dashboard
                </span>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/" className="text-sm font-bold text-gray-500 hover:text-[#8B4513] transition-colors">
                Back to Store
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-[#8B4513]">Order Management</h1>
          <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2">
            <Package size={20} className="text-[#DAA520]" />
            <span className="font-bold text-gray-700">{orders.length} Total Orders</span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
            <p className="text-gray-500">When customers place orders, they will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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

                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-xl focus:ring-[#DAA520] focus:border-[#DAA520] block w-full md:w-auto p-2.5 font-medium outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="preparing">Preparing</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Order Items</h4>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#F4EBD0] rounded-lg flex items-center justify-center text-[#8B4513] font-bold text-sm">
                              {item.quantity}x
                            </div>
                            <div>
                              <p className="font-bold text-gray-800">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.size} • {item.crust}</p>
                            </div>
                          </div>
                          <p className="font-bold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <span className="font-bold text-gray-600">Total Amount</span>
                      <span className="text-xl font-bold text-[#8B4513]">₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Customer Details</h4>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Name</p>
                        <p className="font-bold text-gray-800">{order.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Email</p>
                        <p className="font-bold text-gray-800">{order.customerEmail}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Order Type</p>
                        <p className="font-bold text-gray-800">{order.orderType}</p>
                      </div>
                      {order.orderType === 'Delivery' && (
                        <div>
                          <p className="text-gray-500 text-xs">Delivery Address</p>
                          <p className="font-bold text-gray-800">{order.address}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-500 text-xs">Payment Method</p>
                        <p className="font-bold text-gray-800 uppercase">{order.paymentMethod}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
