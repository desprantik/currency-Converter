import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownUp, ChevronDown, Delete, Star, X, Clock } from 'lucide-react';
import { CurrencySelector } from './components/CurrencySelector';
import { supabase } from './utils/supabase/client';

// Circular flag component with gradient background
const CircularFlag = ({ code, size = 'md' }: { code: string; size?: 'sm' | 'md' | 'lg' }) => {
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

  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl',
  };

  return (
    <div className={`${sizeClasses[size]} rounded-full ${gradient} flex items-center justify-center shadow-md`}>
      {emoji}
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
  timestamp: number;
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
  const [tableExists, setTableExists] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSaveHistory, setShowSaveHistory] = useState(false);
  const [historyDescription, setHistoryDescription] = useState('');
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const API_KEY = 'b91b4ba5acae6d8300c177f0';

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
    const stored = localStorage.getItem('currency_favorites');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
          setUseLocalStorage(true);
          return;
        }
      } catch (e) {}
    }

    try {
      const { data, error } = await supabase
        .from('favorite_pairs')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        setTableExists(false);
        setUseLocalStorage(true);
        return;
      }

      setTableExists(true);
      setFavorites(data || []);
      setUseLocalStorage(false);
    } catch (error) {
      setTableExists(false);
      setUseLocalStorage(true);
    }
  };

  const fetchHistory = async () => {
    const stored = localStorage.getItem('currency_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setHistory(parsed);
          setUseLocalStorage(true);
          return;
        }
      } catch (e) {}
    }

    try {
      const { data, error } = await supabase
        .from('history_entries')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        setTableExists(false);
        setUseLocalStorage(true);
        return;
      }

      setTableExists(true);
      setHistory(data || []);
      setUseLocalStorage(false);
    } catch (error) {
      setTableExists(false);
      setUseLocalStorage(true);
    }
  };

  const checkIfFavorite = () => {
    const exists = favorites.some(
      (fav) => fav.from_currency === fromCurrency && fav.to_currency === toCurrency
    );
    setIsFavorite(exists);
  };

  const toggleFavorite = async () => {
    if (useLocalStorage) {
      if (isFavorite) {
        const updated = favorites.filter(
          (fav) => !(fav.from_currency === fromCurrency && fav.to_currency === toCurrency)
        );
        setFavorites(updated);
        localStorage.setItem('currency_favorites', JSON.stringify(updated));
      } else {
        const newFav: FavoritePair = {
          id: Date.now().toString(),
          from_currency: fromCurrency,
          to_currency: toCurrency,
        };
        const updated = [...favorites, newFav];
        setFavorites(updated);
        localStorage.setItem('currency_favorites', JSON.stringify(updated));
      }
    } else {
      if (isFavorite) {
        const favorite = favorites.find(
          (fav) => fav.from_currency === fromCurrency && fav.to_currency === toCurrency
        );
        if (favorite) {
          await removeFavorite(favorite.id);
        }
      } else {
        try {
          const { data, error } = await supabase
            .from('favorite_pairs')
            .insert([{ from_currency: fromCurrency, to_currency: toCurrency }])
            .select();

          if (error) {
            console.error('Error adding favorite to Supabase:', error);
            setUseLocalStorage(true);
            const newFav: FavoritePair = {
              id: Date.now().toString(),
              from_currency: fromCurrency,
              to_currency: toCurrency,
            };
            const updated = [...favorites, newFav];
            setFavorites(updated);
            localStorage.setItem('currency_favorites', JSON.stringify(updated));
            return;
          }

          await fetchFavorites();
        } catch (error) {
          console.error('Error adding favorite:', error);
          setUseLocalStorage(true);
          const newFav: FavoritePair = {
            id: Date.now().toString(),
            from_currency: fromCurrency,
            to_currency: toCurrency,
          };
          const updated = [...favorites, newFav];
          setFavorites(updated);
          localStorage.setItem('currency_favorites', JSON.stringify(updated));
        }
      }
    }
  };

  const removeFavorite = async (id: string) => {
    if (useLocalStorage) {
      const updated = favorites.filter((fav) => fav.id !== id);
      setFavorites(updated);
      localStorage.setItem('currency_favorites', JSON.stringify(updated));
    } else {
      try {
        const { error } = await supabase
          .from('favorite_pairs')
          .delete()
          .eq('id', id);

        if (error) {
          console.error('Error removing favorite from Supabase:', error);
          return;
        }

        await fetchFavorites();
      } catch (error) {
        console.error('Error removing favorite:', error);
      }
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
        
        if (currencies.length === 0) {
          const currencyNames: { [key: string]: string } = {
            USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound', INR: 'Indian Rupee',
            JPY: 'Japanese Yen', AUD: 'Australian Dollar', CAD: 'Canadian Dollar',
            CHF: 'Swiss Franc', CNY: 'Chinese Yuan', SGD: 'Singapore Dollar',
            AED: 'UAE Dirham', SAR: 'Saudi Riyal', NZD: 'New Zealand Dollar',
            SEK: 'Swedish Krona', NOK: 'Norwegian Krone', MXN: 'Mexican Peso',
            BRL: 'Brazilian Real', ZAR: 'South African Rand', HKD: 'Hong Kong Dollar',
            KRW: 'South Korean Won', THB: 'Thai Baht', TRY: 'Turkish Lira',
            RUB: 'Russian Ruble', PLN: 'Polish Zloty', DKK: 'Danish Krone',
            IDR: 'Indonesian Rupiah', MYR: 'Malaysian Ringgit', PHP: 'Philippine Peso',
            ILS: 'Israeli Shekel', CZK: 'Czech Koruna', CLP: 'Chilean Peso',
            TWD: 'Taiwan Dollar', ARS: 'Argentine Peso', VND: 'Vietnamese Dong',
            EGP: 'Egyptian Pound', PKR: 'Pakistani Rupee', BDT: 'Bangladeshi Taka',
            HUF: 'Hungarian Forint', UAH: 'Ukrainian Hryvnia', RON: 'Romanian Leu',
            NGN: 'Nigerian Naira', KES: 'Kenyan Shilling', QAR: 'Qatari Riyal',
            OMR: 'Omani Rial', KWD: 'Kuwaiti Dinar', BHD: 'Bahraini Dinar',
            JOD: 'Jordanian Dinar', LKR: 'Sri Lankan Rupee',
          };
          
          const currencyList = Object.keys(data.conversion_rates)
            .map(code => ({ code, name: currencyNames[code] || code }))
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
    if (value.endsWith('.')) return value;
    const parts = value.split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const cleaned = input.replace(/[^\d.]/g, '');
    
    const parts = cleaned.split('.');
    if (parts.length > 2) return;
    
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

  const saveToHistory = (description: string) => {
    const rate = exchangeRates[toCurrency];
    if (!rate) return;

    const newEntry: HistoryEntry = {
      id: Date.now().toString(),
      from_amount: amount,
      from_currency: fromCurrency,
      to_amount: (parseFloat(amount) * rate).toFixed(2),
      to_currency: toCurrency,
      rate: rate.toFixed(4),
      description: description,
      timestamp: Date.now(),
    };

    const updated = [newEntry, ...history];
    setHistory(updated);
    localStorage.setItem('currency_history', JSON.stringify(updated));
    setHistoryDescription('');
    setShowSaveHistory(false);
  };

  const removeHistoryEntry = (id: string) => {
    const updated = history.filter((entry) => entry.id !== id);
    setHistory(updated);
    localStorage.setItem('currency_history', JSON.stringify(updated));
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-4 sm:items-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-6 space-y-6 relative min-h-[600px] flex flex-col">
        <div className="absolute top-6 right-6 flex gap-2">
          <div className="relative">
            <button
              onClick={() => {
                setShowHistory(!showHistory);
                setShowFavorites(false);
              }}
              className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors relative"
              title="History"
            >
              <Clock className="w-5 h-5 text-gray-600" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>

            {showHistory && (
              <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-10">
                <div className="flex items-center justify-between">
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
                  <div className="space-y-2 max-h-96 overflow-y-auto">
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
                            <p className="text-xs text-gray-400 mt-1">{formatDate(entry.timestamp)}</p>
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
                  className="w-full py-2 rounded-xl text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
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
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${
                isFavorite 
                  ? 'bg-yellow-400 text-white hover:bg-yellow-500' 
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
              title="Favorites"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </button>
            
            {showFavorites && (
              <div className="absolute top-12 right-0 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 space-y-3 z-10">
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
                  onClick={() => toggleFavorite()}
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

        <div className="space-y-3">
          <label className="text-sm text-gray-500">From</label>
          <CurrencySelector
            value={fromCurrency}
            onChange={setFromCurrency}
            currencies={currencies}
          />
          <input
            type="text"
            value={formatAmountDisplay(amount)}
            onChange={handleInputChange}
            className="w-full text-7xl outline-none text-gray-900 tracking-tight bg-transparent text-center py-8"
            placeholder="0"
          />
        </div>

        <div className="flex items-center justify-center gap-3 py-4">
          <button className="px-8 py-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
            Convert
          </button>
          <button
            onClick={handleSwap}
            className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            title="Swap currencies"
          >
            <ArrowDownUp className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            1 {fromCurrency} = {currentRate()} {toCurrency}
          </p>
        </div>

        <div className="space-y-3 flex-1">
          <label className="text-sm text-gray-500">To</label>
          <CurrencySelector
            value={toCurrency}
            onChange={setToCurrency}
            currencies={currencies}
          />
          <div className="w-full text-7xl text-gray-900 tracking-tight text-center py-8">
            {loading ? '...' : convertedAmount()}
          </div>
        </div>
      </div>

      {showSaveHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setShowSaveHistory(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
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
                className="flex-1 py-3 rounded-xl bg-500 text-white hover:bg-blue-600 transition-colors"
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
