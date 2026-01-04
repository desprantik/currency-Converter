import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Currency {
  code: string;
  name: string;
}

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  currencies: Currency[];
}

// Map currency codes to country codes for flags
const currencyToCountryCode: { [key: string]: string } = {
  USD: 'us', EUR: 'eu', GBP: 'gb', INR: 'in', JPY: 'jp',
  AUD: 'au', CAD: 'ca', CHF: 'ch', CNY: 'cn', SGD: 'sg',
  AED: 'ae', SAR: 'sa', NZD: 'nz', SEK: 'se', NOK: 'no',
  MXN: 'mx', BRL: 'br', ZAR: 'za', HKD: 'hk', KRW: 'kr',
  THB: 'th', TRY: 'tr', RUB: 'ru', PLN: 'pl', DKK: 'dk',
  IDR: 'id', MYR: 'my', PHP: 'ph', ILS: 'il', CZK: 'cz',
  CLP: 'cl', TWD: 'tw', ARS: 'ar', VND: 'vn', EGP: 'eg',
  PKR: 'pk', BDT: 'bd', HUF: 'hu', UAH: 'ua', RON: 'ro',
  NGN: 'ng', KES: 'ke', QAR: 'qa', OMR: 'om', KWD: 'kw',
  BHD: 'bh', JOD: 'jo', LKR: 'lk', ISK: 'is', HRK: 'hr',
  BGN: 'bg', MAD: 'ma', TND: 'tn', JMD: 'jm', PEN: 'pe',
  COP: 'co', UYU: 'uy', GHS: 'gh', DZD: 'dz', KZT: 'kz',
  // Additional currency mappings
  AFN: 'af', ALL: 'al', AMD: 'am', ANG: 'cw', AOA: 'ao',
  AWG: 'aw', AZN: 'az', BAM: 'ba', BBD: 'bb', BIF: 'bi',
  BMD: 'bm', BND: 'bn', BOB: 'bo', BSD: 'bs', BTN: 'bt',
  BWP: 'bw', BYN: 'by', BZD: 'bz', CDF: 'cd', CLF: 'cl',
  CNH: 'cn', CRC: 'cr', CUP: 'cu', CVE: 'cv', DJF: 'dj',
  DOP: 'do', ERN: 'er', ETB: 'et', FJD: 'fj', FKP: 'fk',
  FOK: 'fo', GEL: 'ge', GGP: 'gg', GIP: 'gi', GMD: 'gm',
  GNF: 'gn', GTQ: 'gt', GYD: 'gy', HNL: 'hn', HTG: 'ht',
  IQD: 'iq', IRR: 'ir', JEP: 'je', KGS: 'kg', KHR: 'kh',
  KMF: 'km', KPW: 'kp', KYD: 'ky', LAK: 'la', LBP: 'lb',
  LRD: 'lr', LSL: 'ls', LYD: 'ly', MDL: 'md', MGA: 'mg',
  MKD: 'mk', MMK: 'mm', MNT: 'mn', MOP: 'mo', MRU: 'mr',
  MUR: 'mu', MVR: 'mv', MWK: 'mw', MZN: 'mz', NAD: 'na',
  NIO: 'ni', NPR: 'np', PAB: 'pa', PGK: 'pg', PYG: 'py',
  RSD: 'rs', RWF: 'rw', SBD: 'sb', SCR: 'sc', SDG: 'sd',
  SHP: 'sh', SLE: 'sl', SOS: 'so', SRD: 'sr', SSP: 'ss',
  STN: 'st', SVC: 'sv', SYP: 'sy', SZL: 'sz', TJS: 'tj',
  TMT: 'tm', TOP: 'to', TTD: 'tt', TZS: 'tz', UGX: 'ug',
  UZS: 'uz', VES: 've', VUV: 'vu', WST: 'ws', XAF: 'cm',
  XCD: 'ag', XDR: 'im', XOF: 'sn', XPF: 'pf', YER: 'ye',
  ZMW: 'zm', ZWL: 'zw',
};

// Generate consistent color based on currency code
const getColorForCurrency = (code: string) => {
  const colors = [
    'from-blue-400 to-blue-600',
    'from-purple-400 to-purple-600',
    'from-pink-400 to-pink-600',
    'from-red-400 to-red-600',
    'from-orange-400 to-orange-600',
    'from-yellow-400 to-yellow-600',
    'from-green-400 to-green-600',
    'from-teal-400 to-teal-600',
    'from-cyan-400 to-cyan-600',
    'from-indigo-400 to-indigo-600',
    'from-violet-400 to-violet-600',
    'from-fuchsia-400 to-fuchsia-600',
  ];
  
  // Generate a hash from the currency code
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    hash = code.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Circular flag component with real country flags
const CircularFlag = ({ code }: { code: string }) => {
  const countryCode = currencyToCountryCode[code]?.toLowerCase() || 'xx';
  const flagUrl = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode}.svg`;
  const initials = code.substring(0, 2).toUpperCase();
  const gradientColor = getColorForCurrency(code);

  return (
    <div 
      className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
      style={{
        border: '1.813px solid white',
        boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -2px rgba(0, 0, 0, 0.1)',
      }}
    >
      <img 
        src={flagUrl} 
        alt={`${code} flag`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials with random gradient color
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', ...gradientColor.split(' '));
          e.currentTarget.parentElement!.innerHTML = `<span class="text-white font-semibold text-sm flex items-center justify-center w-full h-full">${initials}</span>`;
        }}
      />
    </div>
  );
};

export function CurrencySelector({ value, onChange, currencies }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Prevent viewport resize on mobile when keyboard opens
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content');
      }
    } else {
      document.body.style.overflow = '';
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle keyboard visibility and adjust drawer height
  useEffect(() => {
    if (!isOpen) return;

    const updateDrawerHeight = () => {
      if (drawerRef.current) {
        const viewportHeight = window.visualViewport?.height || window.innerHeight;
        const maxHeight = Math.min(viewportHeight * 0.85, window.innerHeight * 0.85);
        drawerRef.current.style.maxHeight = `${maxHeight}px`;
      }
    };

    // Update on visual viewport changes (keyboard open/close)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateDrawerHeight);
    }
    
    updateDrawerHeight();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateDrawerHeight);
      }
    };
  }, [isOpen]);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 h-[60px] bg-gray-50 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0"
        style={{
          borderRadius: '9999px',
        }}
      >
        <CircularFlag code={value} />
        <span className="text-lg text-gray-900" style={{ color: '#101828' }}>{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
      </button>

      {/* Bottom Sheet Modal with Glassmorphism */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        >
          <div 
            ref={drawerRef}
            className="w-full max-w-lg rounded-t-2xl flex flex-col animate-slide-up overflow-hidden"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(40px) saturate(180%)',
              WebkitBackdropFilter: 'blur(40px) saturate(180%)',
              boxShadow: '0 -8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
              maxHeight: '85vh',
              paddingBottom: 'env(safe-area-inset-bottom)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6"
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <h3 className="text-xl text-gray-900 font-medium">Select Currency</h3>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Search Input */}
            <div 
              className="p-4"
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
              }}
            >
              <input
                type="text"
                placeholder="Search currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-3xl outline-none text-base focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.4)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
                autoFocus
              />
            </div>

            {/* Currency List */}
            <div className="overflow-y-auto flex-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className="w-full px-6 py-4 text-left transition-colors flex items-center gap-4"
                  style={{
                    backgroundColor: currency.code === value 
                      ? 'rgba(59, 130, 246, 0.15)' 
                      : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (currency.code !== value) {
                      e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currency.code !== value) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <CircularFlag code={currency.code} />
                  <div className="flex flex-col flex-1">
                    <span className="text-base text-gray-900">{currency.code}</span>
                    <span className="text-sm text-gray-500">{currency.name}</span>
                  </div>
                  {currency.code === value && (
                    <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
              {filteredCurrencies.length === 0 && (
                <div className="px-6 py-12 text-center text-gray-500">
                  No currencies found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
