
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { loginUser, isAuthenticated, isLoading, rememberMe: storedRememberMe } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    
    // Set remember me from stored value
    setRememberMe(storedRememberMe);
    
    // If remember me is checked, fill in the username if available
    if (storedRememberMe) {
      const savedUser = localStorage.getItem('user_data');
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          if (userData.username) {
            setUsername(userData.username);
          }
        } catch (e) {
          console.error('Error parsing saved user data', e);
        }
      }
    }
  }, [isAuthenticated, navigate, storedRememberMe]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(username, password, rememberMe);
  };
  
  // Variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 10 }
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-6 sm:px-12 bg-gradient-to-b from-app-blue-light/10 to-app-green-light/10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-8"
      >
        <Logo size="lg" />
      </motion.div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-card w-full max-w-md mx-auto p-8"
      >
        <motion.div variants={itemVariants}>
          <h2 className="text-2xl font-bold text-center mb-8 text-app-text">
            Welcome Back
          </h2>
        </motion.div>
        
        <form onSubmit={handleSubmit}>
          <motion.div 
            variants={itemVariants}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label 
                htmlFor="username" 
                className="block text-sm font-medium text-app-text-secondary"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="glass-input w-full"
                placeholder="Enter your username"
              />
            </div>
            
            <div className="space-y-2">
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-app-text-secondary"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="glass-input w-full"
                placeholder="Enter your password"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox 
                id="rememberMe" 
                checked={rememberMe} 
                onCheckedChange={(checked) => {
                  setRememberMe(checked === true);
                }} 
              />
              <label 
                htmlFor="rememberMe" 
                className="text-sm font-medium text-app-text-secondary cursor-pointer"
              >
                Remember me
              </label>
            </div>
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            className="mt-8"
          >
            <button
              type="submit"
              disabled={isLoading}
              className="button-primary w-full flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
