export function applyFilters(products, filters) {
  let filtered = [...products];

  // Search Filter (by title)
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(product => product.title.toLowerCase().includes(query));
  }

  // Category Filter
  if (filters.categories.length > 0) {
    filtered = filtered.filter(product => filters.categories.includes(product.category));
  }

  // Price Range Filter
  filtered = filtered.filter(product => product.price <= filters.maxPrice);

  // Sort (Optional)
  if (filters.sort === 'low-to-high') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'high-to-low') {
    filtered.sort((a, b) => b.price - a.price);
  }

  return filtered;
}

export function setupFilterUI(products, onFilterChange) {
  const categoryContainer = document.querySelector('#categoryFilters');
  const sortSelect = document.querySelector('#sortFilter');
  const activeFiltersContainer = document.querySelector('#activeFilters');
  const clearAllBtn = document.querySelector('#clearAllFilters');
  const priceRange = document.querySelector('#priceRange');
  const priceRangeValue = document.querySelector('#priceRangeValue');
  const searchInput = document.querySelector('#searchInput');

  // Dynamically set slider max value based on products
  const maxProductPrice = Math.max(...products.map(p => p.price));
  priceRange.max = Math.ceil(maxProductPrice / 10) * 10; // Round up to nearest 10
  priceRange.value = priceRange.max;
  priceRangeValue.textContent = priceRange.max;

  // Populate Category Checkboxes Dynamically
  const categories = [...new Set(products.map(p => p.category))];
  categoryContainer.innerHTML = categories.map(cat => `
    <label class="w-full inline-flex items-center space-x-2 cursor-pointer select-none">
      <input type="checkbox" value="${cat}" class="category-checkbox size-4 bg-white border-2 border-gray-300 rounded-md" />
      <span class="text-sm text-accent">
        ${cat}
      </span>
    </label>
  `).join('');

  
  // Event Listeners
  categoryContainer.addEventListener('change', () => triggerFilterChange());
  sortSelect.addEventListener('change', () => triggerFilterChange());
  priceRange.addEventListener('input', () => {
    priceRangeValue.textContent = priceRange.value;
    triggerFilterChange();
  });
  searchInput.addEventListener('input', () => triggerFilterChange());

  clearAllBtn.addEventListener('click', () => {
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    sortSelect.value = '';
    priceRange.value = priceRange.max;
    priceRangeValue.textContent = priceRange.max;
    searchInput.value = '';
    triggerFilterChange();
  });


  activeFiltersContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-filter')) {
      const value = e.target.closest('.remove-filter').dataset.value;
      document.querySelector(`.category-checkbox[value="${value}"]`).checked = false;
      triggerFilterChange();
    }
  });


  function triggerFilterChange() {
    const filters = getCurrentFilters();
    renderActiveFilterTags(filters.categories);
    onFilterChange(filters);
  }


  function getCurrentFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
    const sortValue = sortSelect.value;
    const searchQuery = searchInput.value.trim();
    return {
      categories: selectedCategories,
      sort: sortValue,
      maxPrice: parseInt(priceRange.value),
      searchQuery: searchQuery
    };
  }

  function renderActiveFilterTags(categories) {
    activeFiltersContainer.innerHTML = categories.map(cat => `
      <div class="bg-surface flex items-center gap-1 px-4 py-1.5 text-xs rounded-full">
        <span>${cat}</span>
        <button type="button" class="text-muted hover:text-accent transition remove-filter" data-value="${cat}">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    `).join('');

    const showClear = categories.length > 0 ||
                      parseInt(priceRange.value) != parseInt(priceRange.max) ||
                      searchInput.value.trim() !== '';

    clearAllBtn.style.display = showClear ? 'inline-flex' : 'none';
  }
}
