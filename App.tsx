import React, { useState, useEffect } from 'react';
import { ArrowDownUp, ChevronDown, Delete, Star, X, Clock } from 'lucide-react';
import { CurrencySelector } from './components/CurrencySelector';
import { projectId, publicAnonKey } from './utils/supabase/info';

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
const CircularFlag = ({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) => {
  const countryCode = currencyToCountryCode[code]?.toLowerCase() || 'xx';
  const flagUrl = `https://cdn.jsdelivr.net/gh/hampusborgos/country-flags@main/svg/${countryCode}.svg`;
  const initials = code.substring(0, 2).toUpperCase();
  const gradientColor = getColorForCurrency(code);

  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-md border-2 border-white flex-shrink-0`}>
      <img 
        src={flagUrl} 
        alt={`${code} flag`}
        className="w-full h-full object-cover"
        onError={(e) => {
          // Fallback to initials with random gradient color
          e.currentTarget.style.display = 'none';
          e.currentTarget.parentElement!.classList.add('bg-gradient-to-br', ...gradientColor.split(' '));
          e.currentTarget.parentElement!.innerHTML = `<span class="text-white font-semibold ${textSizeClasses[size]} flex items-center justify-center w-full h-full">${initials}</span>`;
        }}
      />
    </div>
  );
};

interface ExchangeRates {
  [key: string]: number;
}

interface Currency {
  code: string;
  name: string;
}

interface FavoritePair {
  id: string;
  from_currency: string;
  to_currency: string;
}

interface HistoryEntry {
  id: string;
  from_amount: string;
  from_currency: string;
  to_amount: string;
  to_currency: string;
  rate: string;
  description: string;
  timestamp?: number;
  created_at?: string;
}

export default function App() {
  const [amount, setAmount] = useState('0');
  const [toAmount, setToAmount] = useState('0');
  const [lastEdited, setLastEdited] = useState<'from' | 'to'>('from');
  const [fromCurrency, setFromCurrency] = useState('INR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoritePair[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    // Load history from localStorage on mount
    try {
      const stored = localStorage.getItem('conversionHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Ensure it's an array and limit to 20
        return Array.isArray(parsed) ? parsed.slice(0, 20) : [];
      }
      return [];
    } catch {
      return [];
    }
  });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [editingDescription, setEditingDescription] = useState<string | null>(null);
  const [editDescriptionValue, setEditDescriptionValue] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [recentAmounts, setRecentAmounts] = useState<{ [key: string]: Array<{ from: string; to: string; lastEdited: 'from' | 'to'; id: string; fadingOut?: boolean }> }>(() => {
    // Load from localStorage on mount
    try {
      const stored = localStorage.getItem('recentAmounts');
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old format to new format if needed
        const migrated: typeof parsed = {};
        for (const [key, entries] of Object.entries(parsed)) {
          migrated[key] = (entries as any[]).map((entry, idx) => ({
            ...entry,
            lastEdited: entry.lastEdited || 'from',
            id: entry.id || `${key}-${idx}-${Date.now()}`,
            fadingOut: false,
          }));
        }
        return migrated;
      }
      return {};
    } catch {
      return {};
    }
  });

  // Persist recent amounts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('recentAmounts', JSON.stringify(recentAmounts));
    } catch (error) {
      console.error('Error saving recent amounts:', error);
    }
  }, [recentAmounts]);

  const API_KEY = 'b91b4ba5acae6d8300c177f0';
  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-913e994f`;

  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency]);

  useEffect(() => {
    fetchFavorites();
    // History is loaded from localStorage in useState initializer
  }, []);

  useEffect(() => {
    checkIfFavorite();
  }, [fromCurrency, toCurrency, favorites]);

  // Update amounts when currencies change
  useEffect(() => {
    if (Object.keys(exchangeRates).length === 0) return;
    
    if (lastEdited === 'from' && amount && !isNaN(parseFloat(amount)) && amount !== '0') {
      const rate = exchangeRates[toCurrency];
      if (rate) {
        // Preserve full precision internally
        const result = parseFloat(amount) * rate;
        setToAmount(result === 0 ? '0' : result.toString());
      }
    } else if (lastEdited === 'to' && toAmount && !isNaN(parseFloat(toAmount)) && toAmount !== '0') {
      const rate = exchangeRates[toCurrency];
      if (rate) {
        // Preserve full precision internally
        const result = parseFloat(toAmount) / rate;
        setAmount(result === 0 ? '0' : result.toString());
      }
    } else if (amount === '0') {
      setToAmount('0');
    } else if (toAmount === '0') {
      setAmount('0');
    }
  }, [fromCurrency, toCurrency, exchangeRates, lastEdited, amount, toAmount]);

  // Save conversion to history (called explicitly on Enter key)
  const saveConversionToHistory = () => {
    if (Object.keys(exchangeRates).length === 0) return;
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) === 0) return;
    
    const rate = exchangeRates[toCurrency];
    if (!rate) return;

    // Preserve full precision internally
    const toAmountValue = (parseFloat(amount) * rate).toString();
    
    // Create new history entry
    const newEntry: HistoryEntry = {
      id: `local-${Date.now()}-${Math.random()}`,
      from_amount: amount,
      from_currency: fromCurrency,
      to_amount: toAmountValue,
      to_currency: toCurrency,
      rate: rate.toFixed(4),
      description: '',
      timestamp: Date.now(),
    };

    setHistory(prev => {
      // Remove exact duplicate if exists (same from/to amounts and currencies)
      const filtered = prev.filter(entry => 
        !(entry.from_amount === newEntry.from_amount &&
          entry.to_amount === newEntry.to_amount &&
          entry.from_currency === newEntry.from_currency &&
          entry.to_currency === newEntry.to_currency)
      );
      
      // Add new entry at the beginning (most recent first)
      const updated = [newEntry, ...filtered];
      
      // FIFO: Keep only the 20 most recent entries
      const limited = updated.slice(0, 20);
      
      // Persist to localStorage
      try {
        localStorage.setItem('conversionHistory', JSON.stringify(limited));
      } catch (error) {
        console.error('Error saving history to localStorage:', error);
      }
      
      return limited;
    });
  };

  // Keyboard visibility detection
  useEffect(() => {
    const handleFocusIn = () => {
      setIsKeyboardVisible(true);
    };

    const handleFocusOut = () => {
      // Small delay to ensure keyboard is dismissed
      setTimeout(() => {
        setIsKeyboardVisible(false);
      }, 100);
    };

    const handleViewportResize = () => {
      if (window.visualViewport) {
        const viewportHeight = window.visualViewport.height;
        const windowHeight = window.innerHeight;
        // If viewport is significantly smaller, keyboard is likely visible
        setIsKeyboardVisible(viewportHeight < windowHeight * 0.75);
      }
    };

    // Track input focus
    const inputs = document.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocusIn);
      input.addEventListener('blur', handleFocusOut);
    });

    // Track viewport changes (mobile keyboard)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportResize);
    }

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocusIn);
        input.removeEventListener('blur', handleFocusOut);
      });
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  // Track recent amounts per currency pair (only when conversion is meaningful)
  useEffect(() => {
    // Only track when both amounts are valid and non-zero
    if (amount === '0' || toAmount === '0' || amount === '' || toAmount === '') return;
    const fromNum = parseFloat(amount.replace(/,/g, ''));
    const toNum = parseFloat(toAmount.replace(/,/g, ''));
    if (isNaN(fromNum) || isNaN(toNum) || fromNum === 0 || toNum === 0) return;
    
    // Only track when user has finished editing (debounced)
    const timeoutId = setTimeout(() => {
      const pairKey = `${fromCurrency}_${toCurrency}`;
      const newEntry = {
        from: amount,
        to: toAmount,
        lastEdited: lastEdited,
        id: `${pairKey}-${Date.now()}-${Math.random()}`,
      };

      setRecentAmounts(prev => {
        const pairAmounts = prev[pairKey] || [];
        const swappedPairKey = `${toCurrency}_${fromCurrency}`;
        const swappedPairAmounts = prev[swappedPairKey] || [];
        
        // Check if this exact entry already exists (considering both directions)
        const entryExists = [...pairAmounts, ...swappedPairAmounts].some(entry => {
          // Check if it's the same entry in current direction
          if (entry.from === amount && entry.to === toAmount && entry.lastEdited === lastEdited) {
            return true;
          }
          // Check if it's the same entry in swapped direction
          if (entry.from === toAmount && entry.to === amount) {
            const swappedLastEdited = lastEdited === 'from' ? 'to' : 'from';
            if (entry.lastEdited === swappedLastEdited) {
              return true;
            }
          }
          return false;
        });
        
        // If entry already exists, don't create a new one (prevents animation on swap)
        if (entryExists) {
          return prev;
        }
        
        // Remove duplicate if exists (check by input value based on which field was edited)
        const filtered = pairAmounts.filter(
          entry => {
            if (lastEdited === 'from') {
              return entry.from !== amount || entry.lastEdited !== 'from';
            } else {
              return entry.to !== toAmount || entry.lastEdited !== 'to';
            }
          }
        );
        // Add to beginning (most recent on top)
        const updated = [newEntry, ...filtered];
        
        // If we have more than 5 entries, mark the 6th one as fading out
        if (updated.length > 5) {
          updated[5] = { ...updated[5], fadingOut: true };
          // Remove it after animation completes
          setTimeout(() => {
            setRecentAmounts(prevState => {
              const currentPairAmounts = prevState[pairKey] || [];
              const withoutFading = currentPairAmounts.filter(e => !e.fadingOut);
              return { ...prevState, [pairKey]: withoutFading.slice(0, 5) };
            });
          }, 300); // Match animation duration
        }
        
        return { ...prev, [pairKey]: updated.slice(0, 6) }; // Temporarily keep 6 for fade-out
      });
    }, 1000); // Wait 1 second after user stops changing

    return () => clearTimeout(timeoutId);
  }, [amount, toAmount, fromCurrency, toCurrency, lastEdited]);

  // Keyboard input support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with input field typing
      if (document.activeElement?.tagName === 'INPUT') {
        return;
      }
      
      if (e.key >= '0' && e.key <= '9') {
        handleNumberClick(e.key);
      } else if (e.key === '.') {
        handleNumberClick('.');
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [amount]);

  const fetchFavorites = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/favorites`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching favorites:', error);
        return;
      }

      const { data } = await response.json();
      setFavorites(data || []);
    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
    }
  };

  // History is now managed via localStorage, no need for fetchHistory
  // Keeping function for compatibility but it's a no-op
  const fetchHistory = async () => {
    // History is loaded from localStorage and managed in state
    // This function is kept for compatibility with existing code
  };

  const checkIfFavorite = () => {
    const exists = favorites.some(
      (fav) => fav.from_currency === fromCurrency && fav.to_currency === toCurrency
    );
    setIsFavorite(exists);
  };

  const toggleFavorite = async () => {
    if (isFavorite) {
      const favorite = favorites.find(
        (fav) => fav.from_currency === fromCurrency && fav.to_currency === toCurrency
      );
      if (favorite) {
        await removeFavorite(favorite.id);
      }
    } else {
      try {
        const response = await fetch(`${SERVER_URL}/favorites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            from_currency: fromCurrency,
            to_currency: toCurrency,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error('Error adding favorite:', error);
          return;
        }

        await fetchFavorites();
      } catch (error) {
        console.error('Error adding favorite:', error);
      }
    }
  };

  const removeFavorite = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/favorites/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error removing favorite:', error);
        return;
      }

      await fetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  const loadFavoritePair = (pair: FavoritePair) => {
    setFromCurrency(pair.from_currency);
    setToCurrency(pair.to_currency);
  };

  const fetchExchangeRates = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`
      );
      const data = await response.json();
      
      if (data.result === 'success') {
        setExchangeRates(data.conversion_rates);
        
        // Update toAmount when rates are loaded
        if (lastEdited === 'from' && amount && !isNaN(parseFloat(amount)) && amount !== '0') {
          const rate = data.conversion_rates[toCurrency];
          if (rate) {
            // Preserve full precision internally
            const result = parseFloat(amount) * rate;
            setToAmount(result === 0 ? '0' : result.toString());
          }
        } else if (amount === '0') {
          setToAmount('0');
        }
        
        // Build currency list from the rates
        if (currencies.length === 0) {
          const currencyNames: { [key: string]: string } = {
            USD: 'US Dollar',
            EUR: 'Euro',
            GBP: 'British Pound',
            INR: 'Indian Rupee',
            JPY: 'Japanese Yen',
            AUD: 'Australian Dollar',
            CAD: 'Canadian Dollar',
            CHF: 'Swiss Franc',
            CNY: 'Chinese Yuan',
            SGD: 'Singapore Dollar',
            AED: 'UAE Dirham',
            SAR: 'Saudi Riyal',
            NZD: 'New Zealand Dollar',
            SEK: 'Swedish Krona',
            NOK: 'Norwegian Krone',
            MXN: 'Mexican Peso',
            BRL: 'Brazilian Real',
            ZAR: 'South African Rand',
            HKD: 'Hong Kong Dollar',
            KRW: 'South Korean Won',
            THB: 'Thai Baht',
            TRY: 'Turkish Lira',
            RUB: 'Russian Ruble',
            PLN: 'Polish Zloty',
            DKK: 'Danish Krone',
            IDR: 'Indonesian Rupiah',
            MYR: 'Malaysian Ringgit',
            PHP: 'Philippine Peso',
            ILS: 'Israeli Shekel',
            CZK: 'Czech Koruna',
            CLP: 'Chilean Peso',
            TWD: 'Taiwan Dollar',
            ARS: 'Argentine Peso',
            VND: 'Vietnamese Dong',
            EGP: 'Egyptian Pound',
            PKR: 'Pakistani Rupee',
            BDT: 'Bangladeshi Taka',
            HUF: 'Hungarian Forint',
            UAH: 'Ukrainian Hryvnia',
            RON: 'Romanian Leu',
            NGN: 'Nigerian Naira',
            KES: 'Kenyan Shilling',
            QAR: 'Qatari Riyal',
            OMR: 'Omani Rial',
            KWD: 'Kuwaiti Dinar',
            BHD: 'Bahraini Dinar',
            JOD: 'Jordanian Dinar',
            LKR: 'Sri Lankan Rupee',
            ISK: 'Icelandic Krona',
            HRK: 'Croatian Kuna',
            BGN: 'Bulgarian Lev',
            MAD: 'Moroccan Dirham',
            TND: 'Tunisian Dinar',
            JMD: 'Jamaican Dollar',
            PEN: 'Peruvian Sol',
            COP: 'Colombian Peso',
            UYU: 'Uruguayan Peso',
            GHS: 'Ghanaian Cedi',
            DZD: 'Algerian Dinar',
            KZT: 'Kazakhstani Tenge',
            // Additional currency names
            AFN: 'Afghan Afghani',
            ALL: 'Albanian Lek',
            AMD: 'Armenian Dram',
            ANG: 'Netherlands Antillean Guilder',
            AOA: 'Angolan Kwanza',
            AWG: 'Aruban Florin',
            AZN: 'Azerbaijani Manat',
            BAM: 'Bosnia-Herzegovina Convertible Mark',
            BBD: 'Barbadian Dollar',
            BIF: 'Burundian Franc',
            BMD: 'Bermudan Dollar',
            BND: 'Brunei Dollar',
            BOB: 'Bolivian Boliviano',
            BSD: 'Bahamian Dollar',
            BTN: 'Bhutanese Ngultrum',
            BWP: 'Botswanan Pula',
            BYN: 'Belarusian Ruble',
            BZD: 'Belize Dollar',
            CDF: 'Congolese Franc',
            CLF: 'Chilean Unit of Account',
            CNH: 'Chinese Yuan (Offshore)',
            CRC: 'Costa Rican Colón',
            CUP: 'Cuban Peso',
            CVE: 'Cape Verdean Escudo',
            DJF: 'Djiboutian Franc',
            DOP: 'Dominican Peso',
            ERN: 'Eritrean Nakfa',
            ETB: 'Ethiopian Birr',
            FJD: 'Fijian Dollar',
            FKP: 'Falkland Islands Pound',
            FOK: 'Faroese Króna',
            GEL: 'Georgian Lari',
            GGP: 'Guernsey Pound',
            GIP: 'Gibraltar Pound',
            GMD: 'Gambian Dalasi',
            GNF: 'Guinean Franc',
            GTQ: 'Guatemalan Quetzal',
            GYD: 'Guyanaese Dollar',
            HNL: 'Honduran Lempira',
            HTG: 'Haitian Gourde',
            IQD: 'Iraqi Dinar',
            IRR: 'Iranian Rial',
            JEP: 'Jersey Pound',
            KGS: 'Kyrgystani Som',
            KHR: 'Cambodian Riel',
            KMF: 'Comorian Franc',
            KPW: 'North Korean Won',
            KYD: 'Cayman Islands Dollar',
            LAK: 'Laotian Kip',
            LBP: 'Lebanese Pound',
            LRD: 'Liberian Dollar',
            LSL: 'Lesotho Loti',
            LYD: 'Libyan Dinar',
            MDL: 'Moldovan Leu',
            MGA: 'Malagasy Ariary',
            MKD: 'Macedonian Denar',
            MMK: 'Myanma Kyat',
            MNT: 'Mongolian Tugrik',
            MOP: 'Macanese Pataca',
            MRU: 'Mauritanian Ouguiya',
            MUR: 'Mauritian Rupee',
            MVR: 'Maldivian Rufiyaa',
            MWK: 'Malawian Kwacha',
            MZN: 'Mozambican Metical',
            NAD: 'Namibian Dollar',
            NIO: 'Nicaraguan Córdoba',
            NPR: 'Nepalese Rupee',
            PAB: 'Panamanian Balboa',
            PGK: 'Papua New Guinean Kina',
            PYG: 'Paraguayan Guarani',
            RSD: 'Serbian Dinar',
            RWF: 'Rwandan Franc',
            SBD: 'Solomon Islands Dollar',
            SCR: 'Seychellois Rupee',
            SDG: 'Sudanese Pound',
            SHP: 'Saint Helena Pound',
            SLE: 'Sierra Leonean Leone',
            SOS: 'Somali Shilling',
            SRD: 'Surinamese Dollar',
            SSP: 'South Sudanese Pound',
            STN: 'São Tomé and Príncipe Dobra',
            SVC: 'Salvadoran Colón',
            SYP: 'Syrian Pound',
            SZL: 'Swazi Lilangeni',
            TJS: 'Tajikistani Somoni',
            TMT: 'Turkmenistani Manat',
            TOP: 'Tongan Paʻanga',
            TTD: 'Trinidad and Tobago Dollar',
            TZS: 'Tanzanian Shilling',
            UGX: 'Ugandan Shilling',
            UZS: 'Uzbekistan Som',
            VES: 'Venezuelan Bolívar',
            VUV: 'Vanuatu Vatu',
            WST: 'Samoan Tala',
            XAF: 'CFA Franc BEAC',
            XCD: 'East Caribbean Dollar',
            XDR: 'Special Drawing Rights',
            XOF: 'CFA Franc BCEAO',
            XPF: 'CFP Franc',
            YER: 'Yemeni Rial',
            ZMW: 'Zambian Kwacha',
            ZWL: 'Zimbabwean Dollar',
          };
          
          const currencyList = Object.keys(data.conversion_rates)
            .map(code => ({
              code,
              name: currencyNames[code] || code
            }))
            .sort((a, b) => a.code.localeCompare(b.code));
          
          setCurrencies(currencyList);
        }
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertedAmount = (): string => {
    if (toAmount && toAmount !== '0') {
      return formatAmountDisplay(toAmount);
    }
    const rate = exchangeRates[toCurrency];
    if (!rate || !amount || amount === '0') return '0';
    // Preserve full precision internally - don't round here
    const result = parseFloat(amount) * rate;
    return formatAmountDisplay(result);
  };

  const currentRate = () => {
    const rate = exchangeRates[toCurrency];
    return rate ? formatNumber(rate.toFixed(4)) : '...';
  };

  // Format number with thousand separators (for exchange rates, etc.)
  const formatNumber = (numStr: string) => {
    const parts = numStr.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  // Format amount with decimal handling based on value ranges
  // Value ≥ 1: up to 2 decimals, trim trailing zeros
  // Value < 1 and ≥ 0.01: up to 4 decimals, trim trailing zeros
  // Value < 0.01: up to 6 decimals
  // Never round to zero unless value is zero
  const formatAmountDisplay = (value: string | number): string => {
    // Handle string input
    if (typeof value === 'string') {
      // Don't format while typing (if it ends with a decimal point)
      if (value.endsWith('.')) return value;
      // Remove thousand separators for parsing
      const cleaned = value.replace(/,/g, '');
      const numValue = parseFloat(cleaned);
      if (isNaN(numValue)) return '0';
      return formatAmountDisplay(numValue);
    }

    // Handle number input
    const numValue = value;
    
    // Return '0' if the value is zero
    if (numValue === 0) return '0';
    
    // Determine decimal places based on value range
    let maxDecimals: number;
    if (numValue >= 1) {
      maxDecimals = 2;
    } else if (numValue >= 0.01) {
      maxDecimals = 4;
    } else {
      maxDecimals = 6;
    }

    // Round to maxDecimals (not truncate)
    const multiplier = Math.pow(10, maxDecimals);
    const rounded = Math.round(numValue * multiplier) / multiplier;
    
    // Never round to zero unless value is zero
    if (rounded === 0 && numValue !== 0) {
      // If rounding would result in zero, use more precision
      const morePrecise = Math.round(numValue * Math.pow(10, 8)) / Math.pow(10, 8);
      return formatNumberWithDecimals(morePrecise, 8);
    }

    // Format with appropriate decimals and trim trailing zeros
    return formatNumberWithDecimals(rounded, maxDecimals);
  };

  // Helper function to format number with decimals and trim trailing zeros
  const formatNumberWithDecimals = (num: number, maxDecimals: number): string => {
    // Format with maxDecimals
    const formatted = num.toFixed(maxDecimals);
    
    // Split into integer and decimal parts
    const parts = formatted.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    if (parts.length === 1) {
      return integerPart;
    }
    
    // Trim trailing zeros from decimal part
    const decimalPart = parts[1].replace(/0+$/, '');
    
    // If all decimals were zeros, return just integer part
    if (decimalPart === '') {
      return integerPart;
    }
    
    return `${integerPart}.${decimalPart}`;
  };

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Prevent browser from scrolling page when keyboard opens
    // Lock scroll position immediately
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    
    // Prevent any scroll
    const lockScroll = () => {
      window.scrollTo(0, currentScroll);
      document.documentElement.scrollTop = currentScroll;
      document.body.scrollTop = currentScroll;
    };
    
    // Lock immediately and keep locking to prevent browser scroll
    lockScroll();
    requestAnimationFrame(lockScroll);
    setTimeout(lockScroll, 0);
    setTimeout(lockScroll, 10);
    setTimeout(lockScroll, 50);
    setTimeout(lockScroll, 100);
    
    setIsKeyboardVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeyboardVisible(true);
    const input = e.target.value;
    // Remove all non-digit and non-decimal characters
    const cleaned = input.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Update amount with cleaned value
    if (cleaned === '' || cleaned === '.') {
      setAmount('0');
      setToAmount('0');
    } else {
      setAmount(cleaned);
      setLastEdited('from');
      // Calculate toAmount - preserve full precision internally
      const rate = exchangeRates[toCurrency];
      if (rate) {
        const result = parseFloat(cleaned) * rate;
        setToAmount(result === 0 ? '0' : result.toString());
      }
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveConversionToHistory();
    }
  };

  const handleToInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeyboardVisible(true);
    const input = e.target.value;
    // Remove all non-digit and non-decimal characters
    const cleaned = input.replace(/[^\d.]/g, '');
    
    // Prevent multiple decimal points
    const parts = cleaned.split('.');
    if (parts.length > 2) {
      return;
    }
    
    // Update toAmount with cleaned value
    if (cleaned === '' || cleaned === '.') {
      setToAmount('0');
      setAmount('0');
    } else {
      setToAmount(cleaned);
      setLastEdited('to');
      // Calculate from amount - preserve full precision internally
      const rate = exchangeRates[toCurrency];
      if (rate) {
        const result = parseFloat(cleaned) / rate;
        setAmount(result === 0 ? '0' : result.toString());
      }
    }
  };

  const handleToInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveConversionToHistory();
    }
  };

  const handleNumberClick = (num: string) => {
    if (num === '.' && amount.includes('.')) return;
    if (amount === '0' && num !== '.') {
      setAmount(num);
    } else {
      setAmount(amount + num);
    }
  };

  const handleBackspace = () => {
    if (amount.length > 1) {
      setAmount(amount.slice(0, -1));
    } else {
      setAmount('0');
    }
  };

  const handleClear = () => {
    setAmount('0');
  };

  const handleSwap = () => {
    // Swap currencies
    const newFromCurrency = toCurrency;
    const newToCurrency = fromCurrency;
    
    // Also swap the amounts to maintain the conversion
    const tempAmount = amount;
    const tempToAmount = toAmount;
    
    setFromCurrency(newFromCurrency);
    setToCurrency(newToCurrency);
    setAmount(tempToAmount);
    setToAmount(tempAmount);
    // Swap lastEdited direction
    setLastEdited(lastEdited === 'from' ? 'to' : 'from');
  };

  const saveToHistory = async (description: string) => {
    const rate = exchangeRates[toCurrency];
    if (!rate) {
      console.error('❌ No exchange rate available');
      setToast({ message: 'No exchange rate available', type: 'error' });
      setTimeout(() => setToast(null), 3000);
      return;
    }

    setSaving(true);

    // Preserve full precision internally
    const toAmountValue = (parseFloat(amount) * rate).toString();
    
    const newEntry: HistoryEntry = {
      id: `local-${Date.now()}-${Math.random()}`,
      from_amount: amount,
      from_currency: fromCurrency,
      to_amount: toAmountValue,
      to_currency: toCurrency,
      rate: rate.toFixed(4),
      description: description,
      timestamp: Date.now(),
    };

    try {
      setHistory(prev => {
        // Remove exact duplicate if exists
        const filtered = prev.filter(entry => 
          !(entry.from_amount === newEntry.from_amount &&
            entry.to_amount === newEntry.to_amount &&
            entry.from_currency === newEntry.from_currency &&
            entry.to_currency === newEntry.to_currency)
        );
        
        // Add new entry at the beginning (most recent first)
        const updated = [newEntry, ...filtered];
        
        // FIFO: Keep only the 20 most recent entries
        const limited = updated.slice(0, 20);
        
        // Persist to localStorage
        try {
          localStorage.setItem('conversionHistory', JSON.stringify(limited));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        return limited;
      });

      setSaving(false);
      setToast({ message: 'Conversion saved successfully!', type: 'success' });
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('❌ Error saving history:', error);
      setSaving(false);
      setToast({ 
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 
        type: 'error' 
      });
      setTimeout(() => setToast(null), 4000);
    }
  };

  const updateHistoryDescription = async (id: string, description: string) => {
    try {
      setHistory(prev => {
        const updated = prev.map(entry => 
          entry.id === id ? { ...entry, description } : entry
        );
        
        // Persist to localStorage
        try {
          localStorage.setItem('conversionHistory', JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        return updated;
      });
      
      setEditingDescription(null);
    } catch (error) {
      console.error('Error updating history:', error);
      setToast({ message: 'Failed to update description', type: 'error' });
      setTimeout(() => setToast(null), 3000);
    }
  };

  const removeHistoryEntry = async (id: string) => {
    try {
      setHistory(prev => {
        const updated = prev.filter(entry => entry.id !== id);
        
        // Persist to localStorage
        try {
          localStorage.setItem('conversionHistory', JSON.stringify(updated));
        } catch (error) {
          console.error('Error saving to localStorage:', error);
        }
        
        return updated;
      });
    } catch (error) {
      console.error('Error removing history:', error);
    }
  };

  const clearAllHistory = () => {
    try {
      // Clear history from state
      setHistory([]);
      
      // Clear from localStorage
      localStorage.removeItem('conversionHistory');
      
      // Reset amounts to 0
      setAmount('0');
      setToAmount('0');
      
      // Set currency pair: use most recent favorite if available, otherwise default to INR/USD
      if (favorites.length > 0) {
        // Use the first (most recent) favorite pair
        const mostRecentFavorite = favorites[0];
        setFromCurrency(mostRecentFavorite.from_currency);
        setToCurrency(mostRecentFavorite.to_currency);
      } else {
        // Default to INR and USD
        setFromCurrency('INR');
        setToCurrency('USD');
      }
      
      // Close confirmation dialog
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setAmount(entry.from_amount);
    setFromCurrency(entry.from_currency);
    setToCurrency(entry.to_currency);
  };

  const loadRecentAmount = (entry: { from: string; to: string; lastEdited: 'from' | 'to' }) => {
    if (entry.lastEdited === 'from') {
      setAmount(entry.from);
      setLastEdited('from');
      const rate = exchangeRates[toCurrency];
      if (rate) {
        // Preserve full precision internally
        const result = parseFloat(entry.from) * rate;
        setToAmount(result === 0 ? '0' : result.toString());
      }
    } else {
      setToAmount(entry.to);
      setLastEdited('to');
      const rate = exchangeRates[toCurrency];
      if (rate) {
        // Preserve full precision internally
        const result = parseFloat(entry.to) / rate;
        setAmount(result === 0 ? '0' : result.toString());
      }
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const numberPadButtons = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '.', '0', 'backspace'
  ];

  return (
    <div className="h-screen w-full bg-white flex items-start justify-center p-5 overflow-y-auto" style={{ height: '100vh', height: '100dvh' }}>
      <div className="w-full max-w-md space-y-4 relative flex flex-col items-start" style={{ height: '100%' }}>
        {/* Header with Logo and Icons */}
        <div className="flex items-center justify-between flex-shrink-0 h-[44.794px] w-full">
          <h1 className="text-[rgb(26,0,155)]" style={{ fontSize: '32px', lineHeight: '44.8px', fontFamily: '"ABeeZee", sans-serif' }}>Konvert</h1>
          
          {/* Top Right Icons */}
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowFavorites(false);
                }}
                className="w-9 h-9 rounded-full hover:bg-gray-200 flex items-center justify-center transition-colors relative"
                style={{ backgroundColor: '#f3f4f6' }}
                title="History"
              >
                <Clock className="w-4 h-4 text-gray-600" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                    {Math.min(history.length, 20)}
                  </span>
                )}
              </button>

              {/* History Dropdown */}
              {showHistory && (
                <div className="fixed sm:absolute top-0 sm:top-12 left-0 sm:left-auto right-0 sm:right-0 w-full sm:w-80 max-w-sm sm:max-w-none mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-50 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center justify-between sticky top-0 bg-white pb-2 gap-3">
                    <p className="text-sm text-gray-900 flex-shrink-0">Conversion History</p>
                    <div className="flex items-center gap-3 flex-1 justify-end">
                      {history.length > 0 && (
                        <button 
                          onClick={() => setShowClearConfirm(true)}
                          className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center"
                        >
                          Clear all
                        </button>
                      )}
                      <button 
                        onClick={() => setShowHistory(false)} 
                        className="flex-shrink-0 flex items-center justify-center"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Clear Confirmation Dialog */}
                  {showClearConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
                      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full space-y-4">
                        <p className="text-sm text-gray-900">
                          Clear all conversion history?
                        </p>
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setShowClearConfirm(false)}
                            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={clearAllHistory}
                            className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Clear
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No history yet. Conversions are saved automatically!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((entry) => (
                        <div
                          key={entry.id}
                          className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors space-y-1"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className={editingDescription === entry.id ? "w-full" : "flex-1"}>
                              <button
                                onClick={() => {
                                  loadHistoryEntry(entry);
                                  setShowHistory(false);
                                }}
                                className="w-full text-left"
                              >
                                <div className="flex items-baseline gap-2">
                                  <span className="text-gray-900">
                                    {formatAmountDisplay(entry.from_amount)} {entry.from_currency}
                                  </span>
                                  <span className="text-gray-400">→</span>
                                  <span className="text-gray-900">
                                    {formatAmountDisplay(entry.to_amount)} {entry.to_currency}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                  {formatDate(entry.timestamp || (entry.created_at ? new Date(entry.created_at).getTime() : Date.now()))}
                                </p>
                              </button>
                              {editingDescription === entry.id ? (
                                <div className="mt-2 w-full space-y-2">
                                  <input
                                    type="text"
                                    value={editDescriptionValue}
                                    onChange={(e) => setEditDescriptionValue(e.target.value)}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        updateHistoryDescription(entry.id, editDescriptionValue);
                                      } else if (e.key === 'Escape') {
                                        setEditingDescription(null);
                                      }
                                    }}
                                    className="w-full px-3 py-2 text-sm bg-white rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div className="flex items-center justify-end gap-2 w-full">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingDescription(null);
                                      }}
                                      className="px-4 py-2 text-sm font-medium bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                      Cancel
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateHistoryDescription(entry.id, editDescriptionValue);
                                      }}
                                      className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    >
                                      Save
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingDescription(entry.id);
                                    setEditDescriptionValue(entry.description || '');
                                  }}
                                  className="mt-1 cursor-text"
                                >
                                  {entry.description ? (
                                    <p className="text-sm text-gray-600">{entry.description}</p>
                                  ) : (
                                    <p className="text-sm text-gray-400 italic">Click to add description</p>
                                  )}
                                </div>
                              )}
                            </div>
                            {editingDescription !== entry.id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeHistoryEntry(entry.id);
                                }}
                                className="flex-shrink-0 p-1 rounded-full hover:bg-red-100 transition-colors"
                                title="Delete"
                              >
                                <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  // Toggle favorite status
                  await toggleFavorite();
                  // Also toggle favorites dropdown if not already a favorite
                  if (!isFavorite) {
                    setShowFavorites(!showFavorites);
                  }
                  setShowHistory(false);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative ${
                  isFavorite 
                    ? 'bg-yellow-400 text-white hover:bg-yellow-500' 
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                style={!isFavorite ? { backgroundColor: '#f3f4f6' } : undefined}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </button>
              
              {/* Favorites Dropdown */}
              {showFavorites && (
                <div className="fixed sm:absolute top-0 sm:top-12 left-0 sm:left-auto right-0 sm:right-0 w-full sm:w-64 max-w-xs sm:max-w-none mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-50 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-900">Favorites</p>
                    <button onClick={() => setShowFavorites(false)}>
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {favorites.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No favorites yet. Click the star to save this pair!
                    </p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {favorites.map((pair) => (
                        <div
                          key={pair.id}
                          className="flex items-center justify-between bg-gray-50 rounded-2xl px-3 py-2 hover:bg-gray-100 transition-colors"
                        >
                          <button
                            onClick={() => {
                              loadFavoritePair(pair);
                              setShowFavorites(false);
                            }}
                            className="flex-1 text-left text-sm text-gray-900"
                          >
                            {pair.from_currency} → {pair.to_currency}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFavorite(pair.id);
                            }}
                            className="ml-2 p-1 rounded-full hover:bg-gray-200 transition-colors"
                            title="Remove from favorites"
                          >
                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* From Currency Section */}
        <div className="flex gap-2 items-center justify-start w-full">
          <label className="text-sm text-gray-900 leading-5 shrink-0 w-[34px]" style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.1504px' }}>From</label>
          <div className="flex items-center justify-between gap-4 flex-1 min-w-0 h-[72px]">
            <CurrencySelector
              value={fromCurrency}
              onChange={setFromCurrency}
              currencies={currencies}
            />
            <input
              type="text"
              value={formatAmountDisplay(amount)}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={handleInputFocus}
              className="text-5xl outline-none bg-transparent text-right flex-1 min-w-0"
              placeholder="0"
              style={{ 
                fontSize: '36px', 
                fontWeight: '600',
                lineHeight: 'normal', 
                letterSpacing: '-1.3813px', 
                color: (() => {
                  const numValue = parseFloat(amount.replace(/,/g, ''));
                  return (amount === '0' || amount === '' || isNaN(numValue) || numValue === 0) ? 'rgba(16, 24, 40, 0.4)' : '#101828';
                })()
              }}
            />
          </div>
        </div>

        {/* Exchange Rate with Swap Button */}
        <div className="flex items-center justify-between w-full" style={{ height: '47.985px' }}>
          <p className="text-xs leading-4" style={{ fontSize: '12px', lineHeight: '16px', color: '#99a1af' }}>
            1 {fromCurrency} = {currentRate()} {toCurrency}
          </p>
          <button
            onClick={handleSwap}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors touch-manipulation flex-shrink-0"
            title="Swap currencies"
          >
            <ArrowDownUp className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* To Currency Section */}
        <div className="flex gap-2 items-center justify-center w-full">
          <label className="text-sm text-gray-900 leading-5 shrink-0 w-[34px]" style={{ fontSize: '14px', lineHeight: '20px', letterSpacing: '-0.1504px' }}>To</label>
          <div className="flex items-center justify-between gap-4 flex-1 min-w-0 h-[72px]">
            <CurrencySelector
              value={toCurrency}
              onChange={setToCurrency}
              currencies={currencies}
            />
            <input
              type="text"
              value={formatAmountDisplay(toAmount || convertedAmount())}
              onChange={handleToInputChange}
              onKeyDown={handleToInputKeyDown}
              onFocus={handleInputFocus}
              className="text-5xl outline-none bg-transparent text-right flex-1 min-w-0"
              placeholder="0"
              style={{ 
                fontSize: '36px', 
                fontWeight: '600',
                lineHeight: '71.111px', 
                letterSpacing: '-1.3813px', 
                color: (() => {
                  const displayValue = toAmount || convertedAmount();
                  const numValue = parseFloat(displayValue.replace(/,/g, ''));
                  return (displayValue === '0' || isNaN(numValue) || numValue === 0) ? 'rgba(16, 24, 40, 0.4)' : '#101828';
                })()
              }}
            />
          </div>
        </div>

        {/* Recent Conversions Section - Shows last 2-3 from full history */}
        {(() => {
          // Get the most recent 3 conversions from full history
          const recentHistory = history.slice(0, 3);
          
          if (recentHistory.length === 0) return null;

          return (
            <div className="w-full mt-6">
              {recentHistory.map((entry, index) => {
                // Determine which field was edited based on timestamp and current state
                // For simplicity, assume 'from' was edited (can be enhanced later)
                const isNewEntry = index === 0;
                
                // Extract timestamp from ID or use entry timestamp
                const entryTimestamp = entry.timestamp || (entry.id.match(/\d{13}/) ? parseInt(entry.id.match(/\d{13}/)![0]) : 0);
                const isRecentlyCreated = entryTimestamp > 0 && (Date.now() - entryTimestamp) < 500;
                const shouldAnimate = isNewEntry && isRecentlyCreated;

                return (
                  <button
                    key={entry.id}
                    onClick={() => {
                      loadHistoryEntry(entry);
                    }}
                    className="w-full grid grid-cols-[1fr_auto_1fr] items-center py-2.5 px-2 active:bg-gray-50 active:opacity-80 transition-all touch-manipulation"
                    style={{
                      animation: shouldAnimate ? 'fadeIn 0.3s ease-out' : undefined,
                    }}
                  >
                    <span className="text-sm text-gray-500 text-left">
                      {formatAmountDisplay(entry.from_amount)} {entry.from_currency}
                    </span>
                    <span className="text-xs text-gray-400 mx-3">→</span>
                    <span className="text-sm text-gray-500 text-right">
                      {formatAmountDisplay(entry.to_amount)} {entry.to_currency}
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* Save History Modal */}
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-lg flex items-center gap-2 animate-slide-up ${
            toast.type === 'success'
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
          style={{
            animation: 'slideUp 0.3s ease-out',
          }}
        >
          {toast.type === 'success' ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
          <span className="font-medium">{toast.message}</span>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from {
            transform: translate(-50%, 100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}
