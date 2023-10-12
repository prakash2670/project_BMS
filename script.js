searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    currentPage = 1;
    fetchMovies();
  }
});

sortingOptions.addEventListener('change', () => {
  currentPage = 1;
  currentSortOption = sortingOptions.value;
  fetchMovies();
});
