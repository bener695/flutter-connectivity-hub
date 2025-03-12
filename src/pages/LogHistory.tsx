
import React, { useState, useEffect } from 'react';
import { getLogs } from '@/utils/api';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  Calendar,
  Filter,
  Search,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

interface LogsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: LogEntry[];
}

const LogHistory = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Fetch logs on mount
  useEffect(() => {
    fetchLogs();
  }, []);
  
  const fetchLogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await getLogs();
      setLogs(response.results);
      setNextPageUrl(response.next);
    } catch (err) {
      console.error('Error fetching logs:', err);
      setError('Failed to load logs. Please try again.');
      
      toast({
        variant: 'destructive',
        title: 'Failed to load logs',
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchMoreLogs = async () => {
    if (!nextPageUrl || isLoadingMore) return;
    
    setIsLoadingMore(true);
    
    try {
      // Extract page number from URL
      const url = new URL(nextPageUrl);
      const page = url.searchParams.get('page');
      
      if (page) {
        const response = await getLogs(parseInt(page));
        setLogs(prev => [...prev, ...response.results]);
        setNextPageUrl(response.next);
      }
    } catch (err) {
      console.error('Error fetching more logs:', err);
      toast({
        variant: 'destructive',
        title: 'Failed to load more',
        description: 'Please check your connection and try again.',
      });
    } finally {
      setIsLoadingMore(false);
    }
  };
  
  const handleViewLogDetail = (uuid: string) => {
    navigate(`/logs/${uuid}`);
  };
  
  const filteredLogs = logs.filter(log => 
    log.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.status.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-app-blue-light/5 to-app-green-light/5 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 border-b border-gray-200/80">
        <div className="container mx-auto px-4 py-4 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-bold">Log History</h1>
        </div>
      </header>
      
      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Log List */}
      <div className="container mx-auto px-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-app-blue-light animate-spin mb-4" />
            <p className="text-app-text-secondary">Loading logs...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-8 w-8 text-app-error mb-4" />
            <p className="text-app-error">{error}</p>
            <Button 
              variant="outline" 
              onClick={fetchLogs} 
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <History className="h-8 w-8 text-app-text-secondary mb-4" />
            <p className="text-app-text-secondary">
              {searchTerm ? 'No logs match your search' : 'No logs found'}
            </p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredLogs.map((log, index) => (
              <motion.div
                key={log.uuid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className="hover-lift cursor-pointer overflow-hidden"
                  onClick={() => handleViewLogDetail(log.uuid)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(log.status)}
                          <span className="text-sm font-medium capitalize">
                            {log.status}
                          </span>
                          
                          {log.attachments && log.attachments.length > 0 && (
                            <div className="flex items-center text-xs text-app-text-secondary ml-1">
                              <Image className="h-3 w-3 mr-1" />
                              {log.attachments.length}
                            </div>
                          )}
                        </div>
                        
                        <h3 className="font-medium line-clamp-1">{log.subject || 'Report'}</h3>
                        
                        <div className="flex items-center text-xs text-app-text-secondary mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(log.sent_at)}
                        </div>
                      </div>
                      
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {nextPageUrl && (
              <div className="py-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={fetchMoreLogs}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LogHistory;
