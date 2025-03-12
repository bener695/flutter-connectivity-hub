
import React, { useState, useRef } from 'react';
import { Camera, ImagePlus, Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { requestCameraPermission } from '@/utils/permissions';
import { toast } from '@/components/ui/use-toast';
import { sendReport } from '@/utils/api';

interface ImageUploaderProps {
  onSendComplete?: () => void;
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onSendComplete, 
  className 
}) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  
  // Open file browser
  const handleSelectImages = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      
      // Convert files to base64
      Promise.all(
        fileArray.map(file => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              if (e.target?.result) {
                resolve(e.target.result as string);
              }
            };
            reader.readAsDataURL(file);
          });
        })
      ).then(base64Images => {
        setSelectedImages(prev => [...prev, ...base64Images]);
      });
    }
  };
  
  // Open camera
  const handleOpenCamera = async () => {
    const hasPermission = await requestCameraPermission();
    
    if (!hasPermission) {
      toast({
        variant: "destructive",
        title: "Camera Access Denied",
        description: "Please enable camera access in your browser settings.",
      });
      return;
    }
    
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      setStream(cameraStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = cameraStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Failed to access camera. Please try again.",
      });
    }
  };
  
  // Capture photo
  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setSelectedImages(prev => [...prev, imageData]);
      }
    }
  };
  
  // Close camera
  const handleCloseCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };
  
  // Remove image
  const handleRemoveImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };
  
  // Send report with images
  const handleSendReport = async () => {
    if (selectedImages.length === 0) {
      toast({
        variant: "destructive",
        title: "No Images Selected",
        description: "Please select or capture at least one image.",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      await sendReport(selectedImages);
      
      toast({
        title: "Report Sent",
        description: "Your report has been sent successfully.",
      });
      
      // Reset selection
      setSelectedImages([]);
      
      if (onSendComplete) {
        onSendComplete();
      }
    } catch (error) {
      console.error('Error sending report:', error);
      
      toast({
        variant: "destructive",
        title: "Upload Failed",
        description: error instanceof Error 
          ? error.message 
          : "Failed to send report. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className={cn("w-full", className)}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        multiple
        className="hidden"
      />
      
      {/* Camera View */}
      {showCamera && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="flex justify-between items-center p-4 bg-black">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCloseCamera}
              className="text-white"
            >
              <X className="h-6 w-6" />
            </Button>
            <h2 className="text-white font-medium">Capture Photo</h2>
            <div className="w-10" />
          </div>
          
          <div className="relative flex-1 flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="p-6 flex justify-center bg-black">
            <Button
              size="lg"
              onClick={handleCapture}
              className="rounded-full w-16 h-16 p-0"
            >
              <div className="rounded-full w-12 h-12 border-2 border-white" />
            </Button>
          </div>
        </div>
      )}
      
      {/* Selected Images */}
      {selectedImages.length > 0 && (
        <div className="mt-4 mb-6">
          <h3 className="text-sm font-medium text-app-text-secondary mb-2">
            Selected Images ({selectedImages.length})
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {selectedImages.map((img, index) => (
              <div 
                key={index} 
                className="relative aspect-square rounded-lg overflow-hidden border border-gray-200"
              >
                <img 
                  src={img} 
                  alt={`Selected ${index}`} 
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Actions */}
      <div className="flex flex-col gap-3 mt-2">
        {selectedImages.length > 0 ? (
          <Button
            className="w-full button-primary"
            onClick={handleSendReport}
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Send Report
              </>
            )}
          </Button>
        ) : null}
        
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={handleOpenCamera}
            className="flex items-center justify-center py-6"
          >
            <Camera className="h-5 w-5 mr-2" />
            Take Photo
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSelectImages}
            className="flex items-center justify-center py-6"
          >
            <ImagePlus className="h-5 w-5 mr-2" />
            Select Images
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
