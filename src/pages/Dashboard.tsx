
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  History, 
  User, 
  LogOut, 
  Menu,
  X
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'send' | 'profile'>('send');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  if (!user) {
    return null; // Loading state or redirect handled by AuthContext
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-blue-light/5 to-app-green-light/5">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold text-app-text bg-clip-text text-transparent bg-gradient-blue-green">
            Flutter Hub
          </h1>
          
          <div className="flex items-center gap-2">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="pr-0">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-4">
                  <div className="flex items-center p-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-blue flex items-center justify-center text-white font-medium text-lg">
                      {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                    </div>
                    <div className="ml-3">
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-app-text-secondary">{user.email}</p>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex flex-col px-2 space-y-1">
                    <Button 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => {
                        setActiveTab('send');
                        setIsMenuOpen(false);
                      }}
                    >
                      <Camera className="mr-2 h-5 w-5" />
                      Send Report
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => {
                        navigate('/logs');
                        setIsMenuOpen(false);
                      }}
                    >
                      <History className="mr-2 h-5 w-5" />
                      Log History
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      className="justify-start" 
                      onClick={() => {
                        setActiveTab('profile');
                        setIsMenuOpen(false);
                      }}
                    >
                      <User className="mr-2 h-5 w-5" />
                      My Profile
                    </Button>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <Button 
                    variant="ghost" 
                    className="justify-start text-app-error mx-2" 
                    onClick={() => {
                      logoutUser();
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-5 w-5" />
                    Log Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <AnimatePresence mode="wait">
          {activeTab === 'send' && (
            <motion.div
              key="send"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-lg font-medium mb-4">Send Report</h2>
                <p className="text-sm text-app-text-secondary mb-6">
                  Take photos or select images from your gallery to send a report.
                </p>
                
                <ImageUploader />
              </div>
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="glass-card p-6">
                <h2 className="text-lg font-medium mb-6">User Profile</h2>
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-blue flex items-center justify-center text-white font-bold text-2xl">
                    {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <p className="text-sm text-app-text-secondary">Full Name</p>
                      <p className="font-medium">{user.first_name} {user.last_name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-app-text-secondary">Username</p>
                      <p className="font-medium">{user.username}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-app-text-secondary">Email</p>
                      <p className="font-medium">{user.email}</p>
                    </div>
                    
                    {user.mobile && (
                      <div>
                        <p className="text-sm text-app-text-secondary">Mobile</p>
                        <p className="font-medium">{user.mobile}</p>
                      </div>
                    )}
                    
                    <div>
                      <p className="text-sm text-app-text-secondary">Role</p>
                      <p className="font-medium capitalize">{user.user_permission}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={logoutUser}
                  className="text-app-error border-app-error/30 hover:bg-app-error/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6">
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-2 h-auto ${activeTab === 'send' ? 'text-app-blue-dark' : ''}`}
            onClick={() => setActiveTab('send')}
          >
            <Camera className="h-5 w-5 mb-1" />
            <span className="text-xs">Send</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className="flex flex-col items-center py-2 h-auto"
            onClick={() => navigate('/logs')}
          >
            <History className="h-5 w-5 mb-1" />
            <span className="text-xs">Logs</span>
          </Button>
          
          <Button 
            variant="ghost" 
            className={`flex flex-col items-center py-2 h-auto ${activeTab === 'profile' ? 'text-app-blue-dark' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User className="h-5 w-5 mb-1" />
            <span className="text-xs">Profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
