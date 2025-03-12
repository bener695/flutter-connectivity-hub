
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-b from-app-blue-light/10 to-app-green-light/10 px-4"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="glass-card p-8 max-w-md w-full text-center"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-blue-green mb-4">
            404
          </h1>
          
          <h2 className="text-2xl font-medium mb-4">Page Not Found</h2>
          
          <p className="text-app-text-secondary mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <Button 
            onClick={() => navigate('/')}
            className="button-primary"
          >
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default NotFound;
