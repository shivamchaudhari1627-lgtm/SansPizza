import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LoginPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const LoginPromptModal: React.FC<LoginPromptModalProps> = ({ 
  isOpen, 
  onClose, 
  title = "Sign Up Required", 
  message = "Please sign up to continue." 
}) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl text-center"
          >
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>
            <div className="w-20 h-20 bg-[#F4EBD0] rounded-full flex items-center justify-center mx-auto mb-6 text-[#8B4513]">
              <UserCircle size={40} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-[#8B4513] mb-3">{title}</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">{message}</p>
            <button
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className="w-full bg-[#DAA520] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#8B4513] transition-colors shadow-lg"
            >
              Sign Up / Login
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
