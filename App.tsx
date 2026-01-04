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
  const [amount, setAmount] = useState('150');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoritePair[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveHistory, setShowSaveHistory] = useState(false);
  const [historyDescription, setHistoryDescription] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const API_KEY = 'b91b4ba5acae6d8300c177f0';
  const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-913e994f`;

  useEffect(() => {
    fetchExchangeRates();
  }, [fromCurrency]);

  useEffect(() => {
    fetchFavorites();
    fetchHistory();
  }, []);

  useEffect(() => {
    checkIfFavorite();
  }, [fromCurrency, toCurrency, favorites]);

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

  const fetchHistory = async () => {
    try {
      const response = await fetch(`${SERVER_URL}/history`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error fetching history:', error);
        return;
      }

      const { data } = await response.json();
      setHistory(data || []);
    } catch (error) {
      console.error('❌ Error fetching history:', error);
    }
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

  const convertedAmount = () => {
    const rate = exchangeRates[toCurrency];
    if (!rate || !amount) return '0';
    const result = parseFloat(amount) * rate;
    return formatNumber(result.toFixed(2));
  };

  const currentRate = () => {
    const rate = exchangeRates[toCurrency];
    return rate ? formatNumber(rate.toFixed(4)) : '...';
  };

  const formatNumber = (numStr: string) => {
    const parts = numStr.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  const formatAmountDisplay = (value: string) => {
    // Don't format while typing (if it ends with a decimal point)
    if (value.endsWith('.')) return value;
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    } else {
      setAmount(cleaned);
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
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const saveToHistory = async (description: string) => {
    const rate = exchangeRates[toCurrency];
    if (!rate) {
      console.error('❌ No exchange rate available');
      return;
    }

    const payload = {
      from_amount: amount,
      from_currency: fromCurrency,
      to_amount: (parseFloat(amount) * rate).toFixed(2),
      to_currency: toCurrency,
      rate: rate.toFixed(4),
      description: description,
      timestamp: Date.now(),
    };

    console.log('☁️ Saving to Supabase...');
    console.log('URL:', `${SERVER_URL}/history`);
    console.log('Payload:', payload);

    try {
      const response = await fetch(`${SERVER_URL}/history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        // Try to parse as JSON, but handle non-JSON responses
        const contentType = response.headers.get('content-type');
        let error;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            error = await response.json();
          } catch (e) {
            const text = await response.text();
            console.error('Failed to parse error response as JSON:', text);
            error = { error: `Server error (${response.status}): ${text.substring(0, 100)}` };
          }
        } else {
          const text = await response.text();
          console.error('Non-JSON error response:', text);
          error = { error: `Server error (${response.status}): ${text.substring(0, 100)}` };
        }
        
        console.error('❌ Error saving history:', error);
        alert(`Failed to save: ${error.error || error.message || `HTTP ${response.status}`}`);
        return;
      }

      // Parse successful response
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Unexpected non-JSON response:', text);
        alert('Server returned unexpected response format');
        return;
      }

      const result = await response.json();
      console.log('✅ Successfully saved to Supabase:', result);
      await fetchHistory();
      setHistoryDescription('');
      setShowSaveHistory(false);
    } catch (error) {
      console.error('❌ Error saving history:', error);
      alert(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const removeHistoryEntry = async (id: string) => {
    try {
      const response = await fetch(`${SERVER_URL}/history/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Error removing history:', error);
        return;
      }

      await fetchHistory();
    } catch (error) {
      console.error('Error removing history:', error);
    }
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setAmount(entry.from_amount);
    setFromCurrency(entry.from_currency);
    setToCurrency(entry.to_currency);
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
    <div className="min-h-screen bg-white flex items-start justify-center px-4 pt-6 pb-4 sm:items-center sm:py-6 md:py-8">
      <div className="w-full max-w-md space-y-4 sm:space-y-6 relative flex flex-col">
        {/* Header with Logo and Icons */}
        <div className="flex items-center justify-between flex-shrink-0 px-2">
          <h1 className="text-2xl sm:text-3xl text-[rgb(26,0,155)]" style={{ fontFamily: 'Roboto', fontWeight: 100 }}>Konvert</h1>
          
          {/* Top Right Icons */}
          <div className="flex gap-2">
            <div className="relative">
              <button
                onClick={() => {
                  setShowHistory(!showHistory);
                  setShowFavorites(false);
                }}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors relative"
                title="History"
              >
                <Clock className="w-4 h-4 text-gray-600" />
                {history.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-black text-white text-xs rounded-full flex items-center justify-center">
                    {history.length}
                  </span>
                )}
              </button>

              {/* History Dropdown */}
              {showHistory && (
                <div className="fixed sm:absolute top-0 sm:top-12 left-0 sm:left-auto right-0 sm:right-0 w-full sm:w-80 max-w-sm sm:max-w-none mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-50 max-h-[70vh] sm:max-h-[60vh] overflow-y-auto">
                  <div className="flex items-center justify-between sticky top-0 bg-white pb-2">
                    <p className="text-sm text-gray-900">Conversion History</p>
                    <button onClick={() => setShowHistory(false)}>
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  
                  {history.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No history yet. Save your first conversion!
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {history.map((entry) => (
                        <div
                          key={entry.id}
                          className="bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition-colors group space-y-1"
                        >
                          <div className="flex items-start justify-between">
                            <button
                              onClick={() => {
                                loadHistoryEntry(entry);
                                setShowHistory(false);
                              }}
                              className="flex-1 text-left"
                            >
                              <div className="flex items-baseline gap-2">
                                <span className="text-gray-900">
                                  {formatNumber(entry.from_amount)} {entry.from_currency}
                                </span>
                                <span className="text-gray-400">→</span>
                                <span className="text-gray-900">
                                  {formatNumber(entry.to_amount)} {entry.to_currency}
                                </span>
                              </div>
                              {entry.description && (
                                <p className="text-sm text-gray-600 mt-1">{entry.description}</p>
                              )}
                              <p className="text-xs text-gray-400 mt-1">
                                {formatDate(entry.timestamp || (entry.created_at ? new Date(entry.created_at).getTime() : Date.now()))}
                              </p>
                            </button>
                            <button
                              onClick={() => removeHistoryEntry(entry.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                            >
                              <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      setShowSaveHistory(true);
                      setShowHistory(false);
                    }}
                    className="w-full py-2 rounded-xl text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors sticky bottom-0 bg-white pt-2"
                  >
                    + Save Current Conversion
                  </button>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => {
                  setShowFavorites(!showFavorites);
                  setShowHistory(false);
                }}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all relative ${
                  isFavorite 
                    ? 'bg-yellow-400 text-white hover:bg-yellow-500' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title="Favorites"
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
                          className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors group"
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
                            onClick={() => removeFavorite(pair.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-gray-500 hover:text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={() => {
                      toggleFavorite();
                    }}
                    className={`w-full py-2 rounded-xl text-sm transition-colors ${
                      isFavorite
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100'
                    }`}
                  >
                    {isFavorite ? '− Remove Current Pair' : '+ Add Current Pair'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* From Currency Section */}
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center justify-center gap-1">
            <label className="text-xs sm:text-sm text-gray-500">From</label>
            <CurrencySelector
              value={fromCurrency}
              onChange={setFromCurrency}
              currencies={currencies}
            />
          </div>
          <input
            type="text"
            value={formatAmountDisplay(amount)}
            onChange={handleInputChange}
            className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl outline-none text-gray-900 tracking-tight bg-transparent text-center py-2 sm:py-3 md:py-4"
            placeholder="0"
            style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}
          />
        </div>

        {/* Convert Button with Swap - Fixed at center */}
        <div className="flex items-center justify-center gap-3 py-2 sm:py-3">
          <button
            className="px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-colors text-sm sm:text-base"
            style={{ fontFamily: 'Roboto', fontWeight: 100 }}
          >
            Convert
          </button>
          <button
            onClick={handleSwap}
            className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 flex items-center justify-center transition-colors touch-manipulation"
            title="Swap currencies"
          >
            <ArrowDownUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>

        {/* Exchange Rate Info */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-400">
            1 {fromCurrency} = {currentRate()} {toCurrency}
          </p>
        </div>

        {/* To Currency Section */}
        <div className="space-y-3 sm:space-y-4 flex-1">
          <div className="flex items-center justify-center gap-1">
            <label className="text-xs sm:text-sm text-gray-500">To</label>
            <CurrencySelector
              value={toCurrency}
              onChange={setToCurrency}
              currencies={currencies}
            />
          </div>
          <div className="w-full text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-gray-900 tracking-tight text-center py-2 sm:py-3 md:py-4" style={{ fontSize: 'clamp(2rem, 8vw, 4rem)' }}>
            {loading ? '...' : convertedAmount()}
          </div>
        </div>
      </div>

      {/* Save History Modal */}
      {showSaveHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50" onClick={() => setShowSaveHistory(false)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 w-full max-w-sm space-y-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Save Conversion</h3>
              <button onClick={() => setShowSaveHistory(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-gray-900">
                  {formatAmountDisplay(amount)} {fromCurrency}
                </span>
                <span className="text-gray-400">→</span>
                <span className="text-gray-900">
                  {convertedAmount()} {toCurrency}
                </span>
              </div>
              <p className="text-sm text-gray-500">
                Rate: 1 {fromCurrency} = {currentRate()} {toCurrency}
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                value={historyDescription}
                onChange={(e) => setHistoryDescription(e.target.value)}
                placeholder="e.g., Hotel booking, Flight tickets..."
                className="w-full px-4 py-3 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                autoFocus
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowSaveHistory(false)}
                className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => saveToHistory(historyDescription)}
                className="flex-1 py-3 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
