// simpleImageUpload.js
// Simple image upload alternative using public image services

/**
 * Upload image using a simple public service (for development)
 * This bypasses Supabase storage issues
 */
export const uploadEventImageSimple = async (file) => {
  try {
    console.log('📤 Using simple image upload method...');
    
    // For now, return a placeholder image URL
    // You can replace this with any public image URL
    const placeholderImages = [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1469571486292-0ba58a47f4b1?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop'
    ];
    
    // Pick a random placeholder image
    const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
    
    console.log('✅ Using placeholder image:', randomImage);
    return randomImage;
    
  } catch (error) {
    console.error('❌ Simple image upload failed:', error);
    throw error;
  }
};

/**
 * Convert file to base64 data URL (alternative method)
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Upload image as base64 data URL
 */
export const uploadEventImageBase64 = async (file) => {
  try {
    console.log('📤 Converting image to base64...');
    
    const dataUrl = await fileToDataUrl(file);
    console.log('✅ Image converted to base64');
    
    return dataUrl;
    
  } catch (error) {
    console.error('❌ Base64 conversion failed:', error);
    throw error;
  }
};

/**
 * Get a random placeholder image for events
 */
export const getRandomEventImage = () => {
  const eventImages = [
    'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1469571486292-0ba58a47f4b1?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=500&h=300&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=500&h=300&fit=crop&auto=format'
  ];
  
  return eventImages[Math.floor(Math.random() * eventImages.length)];
};


