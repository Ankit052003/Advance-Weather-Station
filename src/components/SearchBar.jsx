import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import './SearchBar.css';

const SearchBar = ({ onSearch, onGetLocation, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleLocationClick = () => {
    if (onGetLocation) {
      onGetLocation();
    }
  };

  return (
    <motion.div 
      className="search-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search for a city..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            disabled={loading}
          />
        </div>
        <motion.button
          type="submit"
          className="search-button"
          disabled={loading || !query.trim()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Search
        </motion.button>
      </form>
      
      <motion.button
        onClick={handleLocationClick}
        className="location-button"
        disabled={loading}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <MapPin size={18} />
        Use My Location
      </motion.button>
    </motion.div>
  );
};

export default SearchBar;
