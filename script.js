const apiKey = '6865d30b89737d41702124eee12bbd97';
const searchInput = document.getElementById('searchInput');
const sortingOptions = document.getElementById('sort');
const moviesContainer = document.getElementById('moviesContainer');
const paginationContainer = document.getElementById('pagination');
const movieDetailsModal = document.getElementById('movieDetailsModal');
const modalTitle = document.getElementById('modalTitle');
const modalOverview = document.getElementById('modalOverview');
const modalReleaseDate = document.getElementById('modalReleaseDate');
const modalRuntime = document.getElementById('modalRuntime');
const modalGenres = document.getElementById('modalGenres');
const movieRecommendations = document.getElementById('movieRecommendations');

let currentPage = 1;
let totalResults = 0;
let currentSortOption = sortingOptions.value;


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
