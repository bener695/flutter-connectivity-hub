
// Function to request camera permission
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    // Request camera permission
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    
    // Stop all tracks to release the camera
    stream.getTracks().forEach(track => track.stop());
    
    return true;
  } catch (error) {
    console.error('Camera permission error:', error);
    return false;
  }
};

// Function to check if camera permission is granted
export const checkCameraPermission = async (): Promise<boolean> => {
  try {
    const permissions = await navigator.permissions.query({ name: 'camera' as PermissionName });
    return permissions.state === 'granted';
  } catch (error) {
    console.error('Error checking camera permission:', error);
    // If query fails, try getting the media as a fallback
    return requestCameraPermission();
  }
};

// Function to check image capture support (just to be explicit)
export const isImageCaptureSupported = (): boolean => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};
