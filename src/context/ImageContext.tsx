import React, { createContext, useContext, useState, useEffect } from 'react';
import { ImageSlot } from '../types';
import { initialImageSlots } from '../data/defaultContent';

interface ImageContextType {
  slots: ImageSlot[];
  getImageUrl: (slotId: string) => string;
  updateImageSlot: (slotId: string, newUrl: string) => Promise<boolean>;
  refreshImages: () => Promise<void>;
  isLoading: boolean;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [slots, setSlots] = useState<ImageSlot[]>(initialImageSlots);
  const [isLoading, setIsLoading] = useState(true);

  const refreshImages = async () => {
    try {
      const res = await fetch('/api/images');
      if (res.ok) {
        const data = await res.json();
        if (data && data.slots) {
          setSlots(prevSlots =>
            prevSlots.map(slot => ({
              ...slot,
              currentUrl: data.slots[slot.id] || slot.defaultUrl,
            }))
          );
        }
      }
    } catch {
      // Fall back to default bundled high-res images
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshImages();
  }, []);

  const getImageUrl = (slotId: string): string => {
    const slot = slots.find(s => s.id === slotId);
    return slot ? slot.currentUrl : '';
  };

  const updateImageSlot = async (slotId: string, newUrl: string): Promise<boolean> => {
    setSlots(prev =>
      prev.map(slot => (slot.id === slotId ? { ...slot, currentUrl: newUrl } : slot))
    );
    return true;
  };

  return (
    <ImageContext.Provider value={{ slots, getImageUrl, updateImageSlot, refreshImages, isLoading }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImages must be used within an ImageProvider');
  }
  return context;
};
