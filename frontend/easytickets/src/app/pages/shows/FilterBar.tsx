import React, { useState } from 'react';

interface FilterBarProps {
  setFilters: (filters: { name: string; sortBy: string; order: string }) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ setFilters }) => {
  const [name, setName] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [order, setOrder] = useState('');

  const handleSearch = () => {
    setFilters({ name, sortBy, order });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Search by name"
      />
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="">Sort by</option>
        <option value="nomeshow">Name</option>
        <option value="datashow">Date</option>
        <option value="artistas">Artist</option>
      </select>
      <select value={order} onChange={(e) => setOrder(e.target.value)}>
        <option value="">Order</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default FilterBar;
