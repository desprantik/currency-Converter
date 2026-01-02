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

const CircularFlag = ({ code }: { code: string }) => {
  const flagEmojis: { [key: string]: string } = {
    USD: '🇺🇸', EUR: '🇪🇺', GBP: '🇬🇧', INR: '🇮🇳', JPY: '🇯🇵',
    AUD: '🇦🇺', CAD: '🇨🇦', CHF: '🇨🇭', CNY: '🇨🇳', SGD: '🇸🇬',
    AED: '🇦🇪', SAR: '🇸🇦', NZD: '🇳🇿', SEK: '🇸🇪', NOK: '🇳🇴',
    MXN: '🇲🇽', BRL: '🇧🇷', ZAR: '🇿🇦', HKD: '🇭🇰', KRW: '🇰🇷',
    THB: '🇹🇭', TRY: '🇹🇷', RUB: '🇷🇺', PLN: '🇵🇱', DKK: '🇩🇰',
    IDR: '🇮🇩', MYR: '🇲🇾', PHP: '🇵🇭', ILS: '🇮🇱', CZK: '🇨🇿',
    CLP: '🇨🇱', TWD: '🇹🇼', ARS: '🇦🇷', VND: '🇻🇳', EGP: '🇪🇬',
    PKR: '🇵🇰', BDT: '🇧🇩', HUF: '🇭🇺', UAH: '🇺🇦', RON: '🇷🇴',
    NGN: '🇳🇬', KES: '🇰🇪', QAR: '🇶🇦', OMR: '🇴🇲', KWD: '🇰🇼',
    BHD: '🇧🇭', JOD: '🇯🇴', LKR: '🇱🇰',
  };

  const gradients: { [key: string]: string } = {
    USD: 'bg-gradient-to-br from-blue-400 to-blue-600',
    EUR: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
    GBP: 'bg-gradient-to-br from-red-400 to-red-600',
    INR: 'bg-gradient-to-br from-orange-400 to-orange-600',
    JPY: 'bg-gradient-to-br from-pink-400 to-pink-600',
    AUD: 'bg-gradient-to-br from-green-400 to-green-600',
    CAD: 'bg-gradient-to-br from-red-400 to-red-500',
    CHF: 'bg-gradient-to-br from-red-500 to-red-700',
    CNY: 'bg-gradient-to-br from-red-400 to-yellow-500',
    SGD: 'bg-gradient-to-br from-red-400 to-red-600',
    AED: 'bg-gradient-to-br from-green-500 to-green-700',
    SAR: 'bg-gradient-to-br from-green-500 to-green-700',
    NZD: 'bg-gradient-to-br from-blue-500 to-blue-700',
    SEK: 'bg-gradient-to-br from-blue-400 to-blue-600',
    NOK: 'bg-gradient-to-br from-red-500 to-blue-600',
    MXN: 'bg-gradient-to-br from-green-500 to-red-600',
    BRL: 'bg-gradient-to-br from-green-400 to-yellow-500',
    ZAR: 'bg-gradient-to-br from-green-500 to-yellow-600',
    HKD: 'bg-gradient-to-br from-red-500 to-red-700',
    KRW: 'bg-gradient-to-br from-blue-400 to-red-500',
    THB: 'bg-gradient-to-br from-red-500 to-blue-600',
    TRY: 'bg-gradient-to-br from-red-500 to-red-700',
    RUB: 'bg-gradient-to-br from-blue-500 to-red-600',
    PLN: 'bg-gradient-to-br from-red-500 to-red-700',
    DKK: 'bg-gradient-to-br from-red-500 to-red-700',
    IDR: 'bg-gradient-to-br from-red-500 to-red-700',
    MYR: 'bg-gradient-to-br from-blue-500 to-red-600',
    PHP: 'bg-gradient-to-br from-blue-400 to-red-500',
    ILS: 'bg-gradient-to-br from-blue-400 to-blue-600',
    CZK: 'bg-gradient-to-br from-blue-500 to-red-600',
    CLP: 'bg-gradient-to-br from-blue-500 to-red-600',
    TWD: 'bg-gradient-to-br from-blue-500 to-red-600',
    ARS: 'bg-gradient-to-br from-blue-400 to-blue-600',
    VND: 'bg-gradient-to-br from-red-500 to-yellow-500',
    EGP: 'bg-gradient-to-br from-red-500 to-yellow-600',
    PKR: 'bg-gradient-to-br from-green-500 to-green-700',
    BDT: 'bg-gradient-to-br from-green-500 to-red-600',
    HUF: 'bg-gradient-to-br from-red-500 to-green-600',
    UAH: 'bg-gradient-to-br from-blue-400 to-yellow-500',
    RON: 'bg-gradient-to-br from-blue-500 to-yellow-600',
    NGN: 'bg-gradient-to-br from-green-500 to-green-700',
    KES: 'bg-gradient-to-br from-red-500 to-green-600',
    QAR: 'bg-gradient-to-br from-purple-500 to-purple-700',
    OMR: 'bg-gradient-to-br from-red-500 to-green-600',
    KWD: 'bg-gradient-to-br from-green-500 to-red-600',
    BHD: 'bg-gradient-to-br from-red-500 to-red-700',
    JOD: 'bg-gradient-to-br from-red-500 to-green-600',
    LKR: 'bg-gradient-to-br from-orange-500 to-orange-700',
  };

  const emoji = flagEmojis[code] || '💱';
  const gradient = gradients[code] || 'bg-gradient-to-br from-gray-400 to-gray-600';

  return (
    <div className={`w-10 h-10 rounded-full ${gradient} flex items-center justify-center text-xl shadow-md`}>
      {emoji}
    </div>
  );
};

export function CurrencySelector({ value, onChange, currencies }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 px-5 py-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
        >
          <CircularFlag code={value} />
          <span className="text-lg text-gray-900">{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
        >
          <div 
            className="w-full max-w-lg bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl text-gray-900">Select Currency</h3>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100">
              <input
                type="text"
                placeholder="Search currency..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-gray-50 outline-none text-base focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="overflow-y-auto flex-1">
              {filteredCurrencies.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    onChange(currency.code);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`w-full px-6 py-4 text-left hover:bg-gray-50 transition-colors flex items-center gap-4 ${
                    currency.code === value ? 'bg-blue-50' : ''
                  }`}
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
