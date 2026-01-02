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
    <div className="w-10 h-10 rounded-full overflow-hidden shadow-md border-2 border-white flex-shrink-0">
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

  const selectedCurrency = currencies.find((c) => c.code === value);

  return (
    <>
      <div className="flex justify-center">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors"
        >
          <CircularFlag code={value} />
          <span className="text-lg text-gray-900">{value}</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Bottom Sheet Modal */}
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
            {/* Header */}
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

            {/* Search Input */}
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

            {/* Currency List */}
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
