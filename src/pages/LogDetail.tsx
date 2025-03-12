
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLogDetail } from '@/utils/api';
import { 
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2,
  Download,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

interface LogEntry {
  uuid: string;
  subject: string;
  user: {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    mobile: string;
  };
  sent_at: string;
  send_time: string;
  status: 'pending' | 'sent' | 'failed';
  error_message: string | null;
  attachments: {
    image: string;
  }[];
}

const LogDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [log, setLog] = useState<LogEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    if (id) {
      fetchLogDetail(id);
    }
  }, [id]);
  
  const fetchLogDetail = async (uuid: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await getLogDetail(uuid);
      setLog(data);
    } catch (err) {
      console.error('Error fetching log detail:', err);
      setError('Failed to load log details. Please try again.');
      
      toast({
        variant: 'destructive',
        title: 'Failed to load log details',
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-500/10 text-green-700';
      case 'pending':
        return 'bg-amber-500/10 text-amber-700';
      case 'failed':
        return 'bg-red-500/10 text-red-700';
      default:
        return 'bg-gray-500/10 text-gray-700';
    }
  };
  
  const handleOpenImage = (image: string) => {
    setSelectedImage(image);
  };
  
  const handleCloseImage = () => {
    setSelectedImage(null);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-blue-light/5 to-app-green-light/5">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200/80">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/logs')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-bold">Log Detail</h1>
        </div>
      </header>
      
      {/* Content */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 text-app-blue-light animate-spin mb-4" />
          <p className="text-app-text-secondary">Loading details...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-app-error mb-4" />
          <p className="text-app-error">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => id && fetchLogDetail(id)} 
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      ) : log ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-6 pb-20"
        >
          <Card className="overflow-hidden mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-3">
                {getStatusIcon(log.status)}
                <span className={`text-sm font-medium capitalize px-2 py-0.5 rounded-full ${getStatusColor(log.status)}`}>
                  {log.status}
                </span>
              </div>
              
              <h2 className="text-xl font-semibold mb-4">{log.subject || 'Report'}</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-app-text-secondary" />
                  <span className="text-app-text-secondary">Sent at:</span>
                  <span className="ml-2">{formatDate(log.sent_at)}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-2 text-app-text-secondary" />
                  <span className="text-app-text-secondary">Processing time:</span>
                  <span className="ml-2">{formatDate(log.send_time)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <h3 className="font-medium mb-3">Sender Information</h3>
              <div className="space-y-2 mb-6">
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-app-text-secondary" />
                  <span className="text-app-text-secondary">Name:</span>
                  <span className="ml-2">{log.user.first_name} {log.user.last_name}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Mail className="h-4 w-4 mr-2 text-app-text-secondary" />
                  <span className="text-app-text-secondary">Email:</span>
                  <span className="ml-2">{log.user.email}</span>
                </div>
                
                {log.user.mobile && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-4 w-4 mr-2 text-app-text-secondary" />
                    <span className="text-app-text-secondary">Mobile:</span>
                    <span className="ml-2">{log.user.mobile}</span>
                  </div>
                )}
              </div>
              
              {log.error_message && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="bg-app-error/10 p-4 rounded-lg">
                    <h3 className="font-medium text-app-error mb-2">Error Message</h3>
                    <p className="text-sm text-app-error/80">{log.error_message}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          
          {log.attachments && log.attachments.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium mb-3">Attachments ({log.attachments.length})</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {log.attachments.map((attachment, index) => (
                  <div 
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 hover:border-app-blue-light transition-colors cursor-pointer hover-lift"
                    onClick={() => handleOpenImage(attachment.image)}
                  >
                    <img 
                      src={attachment.image} 
                      alt={`Attachment ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 hover:opacity-100">
                      <ExternalLink className="h-5 w-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-8 w-8 text-app-error mb-4" />
          <p className="text-app-error">Log not found</p>
          <Button 
            variant="outline" 
            onClick={() => navigate('/logs')} 
            className="mt-4"
          >
            Back to Logs
          </Button>
        </div>
      )}
      
      {/* Fullscreen Image Viewer */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={handleCloseImage}
        >
          <div className="absolute top-4 right-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseImage}
              className="text-white hover:bg-white/10"
            >
              <XCircle className="h-6 w-6" />
            </Button>
          </div>
          
          <img 
            src={selectedImage} 
            alt="Attachment" 
            className="max-w-full max-h-[80vh] object-contain"
          />
          
          <div className="absolute bottom-4 right-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={(e) => {
                e.stopPropagation();
                window.open(selectedImage, '_blank');
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogDetail;
