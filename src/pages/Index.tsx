
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import { checkCameraPermission, requestCameraPermission } from '@/utils/permissions';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [permissionChecked, setPermissionChecked] = useState(false);
  
  // Check permissions and redirect after splash
  useEffect(() => {
    const checkPermissionsAndRedirect = async () => {
      // Check and request camera permission if needed
      const hasCameraPermission = await checkCameraPermission();
      
      if (!hasCameraPermission) {
        await requestCameraPermission();
      }
      
      setPermissionChecked(true);
      
      // Redirect after splash animation
      const timer = setTimeout(() => {
        navigate(isAuthenticated ? '/dashboard' : '/login');
      }, 2500);
      
      return () => clearTimeout(timer);
    };
    
    checkPermissionsAndRedirect();
  }, [navigate, isAuthenticated]);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-app-blue-light/10 to-app-green-light/10"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 100, 
          damping: 15,
          delay: 0.2
        }}
        className="flex flex-col items-center"
      >
        <Logo size="xl" animated={true} />
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-2xl font-semibold bg-clip-text text-transparent bg-gradient-blue-green animate-gradient-shift"
          style={{ backgroundSize: '200% 200%' }}
        >
          Flutter Connectivity Hub
        </motion.h1>
        
        <motion.div 
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 relative"
        >
          <div className="w-10 h-1 rounded-full bg-gradient-blue animate-pulse"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Index;
