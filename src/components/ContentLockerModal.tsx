import React from 'react';

interface ContentLockerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  targetUrl?: string;
}

export const ContentLockerModal: React.FC<ContentLockerModalProps> = ({
  isOpen,
  targetUrl = 'https://saveapp.space/cl/i/l7v3wd',
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="content-locker-modal"
      className="fixed inset-0 z-[99999] w-screen h-screen bg-black/80 flex items-center justify-center overflow-hidden"
    >
      <iframe
        src={targetUrl}
        title="Content Locker"
        className="w-full h-full border-0"
        allow="payment; fullscreen; clipboard-write"
      />
    </div>
  );
};

