import React, { useState, useEffect } from 'react';
import { Clock, Star, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';

interface Offer {
  id: string;
  name: string;
  description: string;
  url: string;
  rating: number;
  time: string;
  iconType: 'opera' | 'cashapp' | 'survey' | 'generic';
  thumbnailUrl?: string;
}

interface ContentLockerModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onUnlocked?: () => void;
  targetUrl?: string;
}

const DEFAULT_OFFERS: Offer[] = [
  {
    id: 'opera-gx',
    name: 'Quick install: Opera GX',
    description: 'Download and run OperaGX!',
    url: 'https://saveapp.space/cl/i/l7v3wd',
    rating: 5,
    time: '~1 min',
    iconType: 'opera',
  },
  {
    id: 'cashapp-750',
    name: 'Get $750 to your CashApp here!',
    description: 'Input Emails to have a chance to Get $750 to your CashApp!',
    url: 'https://saveapp.space/cl/i/l7v3wd',
    rating: 4.8,
    time: '~1 min',
    iconType: 'cashapp',
  },
  {
    id: 'ipsos-isay',
    name: 'Ipsos iSay Rewards',
    description: 'Complete profile registration and mobile verification.',
    url: 'https://saveapp.space/cl/i/l7v3wd',
    rating: 4.6,
    time: '~2 min',
    iconType: 'survey',
  },
];

export const ContentLockerModal: React.FC<ContentLockerModalProps> = ({
  isOpen,
  onUnlocked,
  targetUrl = 'https://saveapp.space/cl/i/l7v3wd',
}) => {
  const [offers, setOffers] = useState<Offer[]>(DEFAULT_OFFERS);
  const [clickedOfferId, setClickedOfferId] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);

  // Attempt to fetch dynamic offers from the API if available
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    fetch('/api/locker/offers')
      .then((res) => (res.ok ? res.json() : null))
      .then((payload) => {
        if (!isMounted || !payload?.data?.offers) return;
        const liveOffers: Offer[] = payload.data.offers.map((o: any, idx: number) => ({
          id: `live-${idx}`,
          name: o.short_name || 'Featured Offer',
          description: o.instructions || 'Complete instructions to verify access.',
          url: o.tracking_url || targetUrl,
          rating: o.rating || 4.8,
          time: o.time || '~1 min',
          iconType: o.short_name?.toLowerCase().includes('cash')
            ? 'cashapp'
            : o.short_name?.toLowerCase().includes('opera')
            ? 'opera'
            : o.short_name?.toLowerCase().includes('say') || o.short_name?.toLowerCase().includes('survey')
            ? 'survey'
            : 'generic',
          thumbnailUrl: o.thumbnail,
        }));
        if (liveOffers.length > 0) {
          setOffers(liveOffers);
        }
      })
      .catch(() => {
        // Retain default curated offers on error
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, targetUrl]);

  if (!isOpen) return null;

  const handleOfferClick = (offer: Offer) => {
    setClickedOfferId(offer.id);
    setIsVerifying(true);

    // Open target tracking offer in a new tab
    const offerUrl = offer.url.startsWith('http') ? offer.url : targetUrl;
    window.open(offerUrl, '_blank', 'noopener,noreferrer');

    // Simulate completion check for smooth user feedback
    setTimeout(() => {
      setCompletedCount(1);
      setIsVerifying(false);
      if (onUnlocked) {
        setTimeout(onUnlocked, 1200);
      }
    }, 6000);
  };

  const renderOfferIcon = (offer: Offer) => {
    if (offer.thumbnailUrl) {
      return (
        <img
          src={offer.thumbnailUrl}
          alt={offer.name}
          className="w-full h-full object-cover rounded-xl"
          onError={(e) => {
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      );
    }

    if (offer.iconType === 'opera') {
      return (
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center p-1.5 shadow-sm">
          {/* Opera GX Neon O icon */}
          <div className="w-8 h-8 rounded-full border-[3px] border-white flex items-center justify-center shadow-inner">
            <div className="w-4 h-4 rounded-full border-[2px] border-white/60" />
          </div>
        </div>
      );
    }

    if (offer.iconType === 'cashapp') {
      return (
        <div className="w-12 h-12 rounded-xl bg-[#00D632] flex items-center justify-center text-white font-black text-2xl shadow-sm tracking-tighter">
          $
        </div>
      );
    }

    if (offer.iconType === 'survey') {
      return (
        <div className="w-12 h-12 rounded-xl bg-[#003b64] flex items-center justify-center text-white font-bold text-xs p-1 shadow-sm">
          <span className="text-[13px] font-black tracking-tight text-[#ffc72c]">iSay</span>
        </div>
      );
    }

    return (
      <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-amber-400 font-bold text-lg">
        ★
      </div>
    );
  };

  return (
    <div
      id="content-locker-overlay"
      className="fixed inset-0 z-[99999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto select-none"
    >
      {/* Modal Container matching screenshot */}
      <div
        id="content-locker-box"
        className="relative w-full max-w-[700px] rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border-t-4 border-[#675E01] bg-[#0C3C6C] my-auto text-white flex flex-col"
      >
        {/* Top Centered Verification Required Badge */}
        <div className="w-full flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-b-xl bg-[#675E01] shadow-md">
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span className="text-[11px] font-black tracking-[0.14em] text-white uppercase">
              Verification Required
            </span>
          </div>
        </div>

        {/* Header Section with Title, Steps and 3D Padlock */}
        <div className="px-6 sm:px-8 pt-3 pb-5 flex items-start justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl sm:text-[34px] font-black tracking-tight mb-1 text-white">
              Movie <span className="text-[#e2b714]">Locked</span>
            </h2>
            <p className="text-xs sm:text-[13px] font-semibold text-white/95 mb-3">
              Complete <span className="text-[#e2b714] font-black">ONE</span> Quick Offer to Unlock Watch
            </p>

            {/* 3 Numbered Steps matching screenshot */}
            <div className="space-y-1.5 mb-2.5">
              <div className="flex items-center gap-2 text-xs text-white/95">
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-slate-900 font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                  1
                </span>
                <span>Pick any offer below</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/95">
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-slate-900 font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                  2
                </span>
                <span>Follow easy steps & instructions</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/95">
                <span className="w-5 h-5 rounded-full bg-[#d4af37] text-slate-900 font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                  3
                </span>
                <span>Come back to start download</span>
              </div>
            </div>

            {/* Red Note */}
            <div className="text-[11px] text-white/70 pt-1.5 border-t border-white/10">
              <span className="text-[#ff4444] font-bold uppercase">NOTE:</span> complete carefully
            </div>
          </div>

          {/* 3D Padlock Graphic */}
          <div className="shrink-0 hidden sm:flex items-center justify-center pt-2">
            <div className="relative w-24 h-24 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="shackleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f1f5f9" />
                    <stop offset="50%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                  <linearGradient id="lockBodyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" />
                    <stop offset="40%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#d97706" />
                  </linearGradient>
                  <linearGradient id="bodyHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fef3c7" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Padlock Shackle */}
                <path
                  d="M34 46 V28 C34 19 41 12 50 12 C59 12 66 19 66 28 V46"
                  fill="none"
                  stroke="url(#shackleGrad)"
                  strokeWidth="9"
                  strokeLinecap="round"
                />
                {/* Padlock Body */}
                <rect
                  x="24"
                  y="42"
                  width="52"
                  height="46"
                  rx="12"
                  fill="url(#lockBodyGrad)"
                  stroke="#b45309"
                  strokeWidth="1.5"
                />
                {/* Highlight curve */}
                <path
                  d="M26 52 C26 46 30 44 36 44 H64 C70 44 74 46 74 52"
                  fill="none"
                  stroke="url(#bodyHighlight)"
                  strokeWidth="2"
                />
                {/* Keyhole */}
                <circle cx="50" cy="61" r="4.5" fill="#3b0764" />
                <polygon points="48,63 52,63 53.5,73 46.5,73" fill="#3b0764" />
              </svg>
            </div>
          </div>
        </div>

        {/* Offers Container (#141416 rounded container matching screenshot) */}
        <div className="bg-[#141416] p-3 sm:p-4 rounded-2xl mx-3 sm:mx-4 mb-3 sm:mb-4 shadow-inner flex flex-col gap-2.5">
          {offers.map((offer) => {
            const isSelected = clickedOfferId === offer.id;
            return (
              <div
                key={offer.id}
                id={`offer-card-${offer.id}`}
                className="group bg-white rounded-xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Left: Icon & Text */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                    {renderOfferIcon(offer)}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight leading-snug group-hover:text-slate-600 transition-colors truncate">
                      {offer.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 leading-tight mt-0.5 line-clamp-2">
                      {offer.description}
                    </p>
                  </div>
                </div>

                {/* Right: Rating, Duration & Action Button */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="hidden md:flex flex-col items-end text-right">
                    <div className="flex items-center gap-0.5 text-amber-500 text-xs">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(offer.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3" />
                      {offer.time}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOfferClick(offer)}
                    className="bg-[#675E01] hover:bg-[#7b7102] active:scale-95 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg flex items-center gap-1.5 transition-all shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    {isSelected && isVerifying ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : isSelected && completedCount > 0 ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                        <span>Done</span>
                      </>
                    ) : (
                      <>
                        <span>Complete</span>
                        <span className="text-white font-black text-sm">→</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Completion Status Bar */}
        <div className="px-6 pb-4 pt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-slate-300 tracking-wider">
            <span className="uppercase tracking-widest text-slate-400">
              {completedCount} OF 1 OFFERS COMPLETED
            </span>
            <span className="text-slate-400 font-semibold">
              {completedCount}/1 Offers Completed
            </span>
          </div>

          {/* Progress Bar with ping-pong golden glow */}
          <div className="w-full h-2.5 bg-slate-900/80 rounded-full overflow-hidden relative p-0.5 border border-white/5">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                completedCount > 0
                  ? 'w-full bg-emerald-500'
                  : 'w-1/4 bg-gradient-to-r from-[#675E01] via-[#d4af37] to-[#675E01] animate-pulse'
              }`}
              style={{
                boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
