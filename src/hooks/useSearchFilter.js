import { useState, useMemo } from 'react';

const useSearchFilter = (items, getSearchTerm) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = useMemo(() => {
    return items.filter(item =>
      getSearchTerm(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, getSearchTerm]);

  return { searchTerm, setSearchTerm, filteredItems };
};

export default useSearchFilter;

