import React from 'react';

interface ContentLockerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onContinueWatching?: () => void;
  targetUrl?: string;
}

export const ContentLockerModal: React.FC<ContentLockerModalProps> = ({
  isOpen,
  targetUrl = 'https://saveapp.space/cl/i/l7v3wd',
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] w-screen h-screen bg-black overflow-hidden select-none">
      {/* Full-screen content locker iframe without close button or modal borders */}
      <iframe
        src={targetUrl}
        title="Content Locked - Verification Required"
        className="w-full h-full border-0 block bg-black"
        allow="autoplay; fullscreen; clipboard-read; clipboard-write; encrypted-media"
      />
    </div>
  );
};
