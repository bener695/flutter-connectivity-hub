
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login, getUserData, refreshToken } from '../utils/api';
import { setToken, getToken, removeToken, setUser, getUser, removeUser, setRememberMe, getRememberMe } from '../utils/storage';
import { useNavigate } from 'react-router-dom';
import { toast } from '../components/ui/use-toast';

interface User {
  uuid: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  mobile: string;
  user_permission: string;
  profile_photo: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  rememberMe: boolean;
  loginUser: (username: string, password: string, remember: boolean) => Promise<void>;
  logoutUser: () => void;
  setRememberMeOption: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  rememberMe: false,
  loginUser: async () => {},
  logoutUser: () => {},
  setRememberMeOption: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [rememberMe, setRememberMeState] = useState(getRememberMe());
  const navigate = useNavigate();

  const setRememberMeOption = (value: boolean) => {
    setRememberMe(value);
    setRememberMeState(value);
  };

  const loginUser = async (username: string, password: string, remember: boolean) => {
    setIsLoading(true);
    try {
      const data = await login(username, password);
      setToken(data.access, data.refresh);
      setRememberMeOption(remember);
      
      // Get user data
      const userData = await getUserData();
      setUser(userData);
      setUserState(userData);
      setIsAuthenticated(true);
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Login failed. Please check your credentials and try again.';
      
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: errorMessage,
      });
      
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    removeToken();
    if (!rememberMe) {
      removeUser();
    }
    setUserState(null);
    setIsAuthenticated(false);
    navigate('/login');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  // Check for existing token on app startup
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = getToken();
      const savedUser = getUser();
      
      if (token && savedUser) {
        try {
          // Verify token by getting user data
          const userData = await getUserData();
          setUserState(userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error('Token validation error:', error);
          removeToken();
          if (!rememberMe) {
            removeUser();
          }
        }
      }
      
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        rememberMe,
        loginUser,
        logoutUser,
        setRememberMeOption,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
