import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  cartItemId: string; // Unique ID for the cart entry
  id: string;
  name: string;
  basePrice: number;
  totalPrice: number;
  quantity: number;
  size: string;
  crust: string;
  toppings: string[];
  image: string;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
  orderType: 'Delivery' | 'Carryout' | null;
  address: string | null;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
  orderType: null,
  address: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setOrderDetails: (state, action: PayloadAction<{ type: 'Delivery' | 'Carryout'; address: string }>) => {
      state.orderType = action.payload.type;
      state.address = action.payload.address;
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => 
          item.id === action.payload.id && 
          item.size === action.payload.size && 
          item.crust === action.payload.crust &&
          JSON.stringify(item.toppings) === JSON.stringify(action.payload.toppings)
      );
      
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.cartItemId !== action.payload);
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
    },
    updateQuantity: (state, action: PayloadAction<{ cartItemId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.cartItemId === action.payload.cartItemId);
      if (item) {
        item.quantity = action.payload.quantity;
      }
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice * item.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { setOrderDetails, addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

