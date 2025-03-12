
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  animated = true,
  className 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Size mapping
  const sizeMap = {
    sm: { width: 48, height: 48 },
    md: { width: 80, height: 80 },
    lg: { width: 120, height: 120 },
    xl: { width: 160, height: 160 },
  };
  
  const { width, height } = sizeMap[size];
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrame: number;
    let progress = 0;
    
    const drawLogo = (time: number) => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate animation progress if animated
      if (animated) {
        progress = (time / 3000) % 1; // 3-second cycle
      } else {
        progress = 0.5; // Static position
      }
      
      // Create gradient based on progress (blue to green)
      const blueGradient = ctx.createLinearGradient(0, 0, width, height);
      blueGradient.addColorStop(0, '#68B2F8');
      blueGradient.addColorStop(1, '#2071CC');
      
      const greenGradient = ctx.createLinearGradient(0, 0, width, height);
      greenGradient.addColorStop(0, '#6CDFB0');
      greenGradient.addColorStop(1, '#1D9D6D');
      
      // Draw main circular shape
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) * 0.4;
      
      // Draw blue circle
      ctx.beginPath();
      ctx.arc(
        centerX - maxRadius * 0.2 * Math.cos(progress * Math.PI * 2), 
        centerY - maxRadius * 0.2 * Math.sin(progress * Math.PI * 2), 
        maxRadius * 0.7, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = blueGradient;
      ctx.fill();
      
      // Draw green circle with slight overlap
      ctx.beginPath();
      ctx.arc(
        centerX + maxRadius * 0.2 * Math.cos(progress * Math.PI * 2), 
        centerY + maxRadius * 0.2 * Math.sin(progress * Math.PI * 2), 
        maxRadius * 0.6, 
        0, 
        Math.PI * 2
      );
      ctx.fillStyle = greenGradient;
      ctx.fill();
      
      // Add blend effect where circles overlap
      ctx.globalCompositeOperation = 'screen';
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * 0.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fill();
      
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      
      // Continue animation if animated
      if (animated) {
        animationFrame = requestAnimationFrame(drawLogo);
      }
    };
    
    // Start animation
    animationFrame = requestAnimationFrame(drawLogo);
    
    // Cleanup animation on unmount
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [width, height, animated]);
  
  return (
    <div className={cn(
      "relative flex items-center justify-center",
      animated && "animate-logo-pulse",
      className
    )}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height} 
        className="max-w-full"
      />
    </div>
  );
};

export default Logo;
