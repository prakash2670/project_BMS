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


function fetchMovies() {
  const searchTerm = searchInput.value.trim();
  const sortBy = currentSortOption;

  if (searchTerm === '') {
    if (sortBy === 'popularity.desc') {
      fetchPopularMovies();
    } else if (sortBy === 'release_date.desc') {
      fetchMoviesByReleaseDate();
    } else if (sortBy === 'vote_average.desc') {
      fetchMoviesByRating();
    }
    return;
  }

 const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${searchTerm}&page=${currentPage}&sort_by=${sortBy}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
      displayPagination(data.total_pages);
    })
    .catch((error) => console.log(error));
}

function fetchPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=${currentPage}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
      displayPagination(data.total_pages);
    })
    .catch((error) => console.log(error));
}


function fetchMoviesByReleaseDate() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=release_date.desc&page=${currentPage}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
      displayPagination(data.total_pages);
    })
    .catch((error) => console.log(error));
}
function fetchMoviesByRating() {
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc&page=${currentPage}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displayMovies(data.results);
      displayPagination(data.total_pages);
    })
    .catch((error) => console.log(error));
}
function displayMovies(movies) {
  moviesContainer.innerHTML = '';

  if (movies.length === 0) {
    const noResults = document.createElement('p');
    noResults.classList.add('no-results');
    noResults.textContent = 'No results found.';
    moviesContainer.appendChild(noResults);
    return;
  }

 movies.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    image.alt = movie.title;
    movieElement.appendChild(image);

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    const title = document.createElement('h3');
    title.classList.add('movie-title');
    title.textContent = movie.title;
    movieInfo.appendChild(title);

    const rating = document.createElement('span');
    rating.classList.add('movie-rating');
    rating.textContent = movie.vote_average;
    movieInfo.appendChild(rating);

    movieElement.appendChild(movieInfo);
    moviesContainer.appendChild(movieElement);

    // Event listener for displaying movie details on click
    movieElement.addEventListener('click', () => {
      openMovieDetailsModal(movie.id);
    });
  });
}

// Open movie details modal
function openMovieDetailsModal(movieId) {
  const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;
  const movieRecommendationsUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}`;

  fetch(movieDetailsUrl)
    .then((response) => response.json())
    .then((data) => {
      modalTitle.textContent = data.title;
      modalOverview.textContent = data.overview;
      modalReleaseDate.textContent = `Release Date: ${data.release_date}`;
      modalRuntime.textContent = `Runtime: ${data.runtime} minutes`;
      modalGenres.textContent = `Genres: ${data.genres.map((genre) => genre.name).join(', ')}`;

      // Fetch and display movie recommendations
      fetch(movieRecommendationsUrl)
        .then((response) => response.json())
        .then((recommendations) => {
          displayMovieRecommendations(recommendations.results);
        })
        .catch((error) => console.log(error));
    })
    .catch((error) => console.log(error));

  movieDetailsModal.style.display = 'block';
}

//Close movie details modal
function closeMovieDetailsModal() {
  movieDetailsModal.style.display = 'none';
  movieRecommendations.innerHTML = '';
}

// Event listener for closing the movie details modal
document.getElementById('closeModal').addEventListener('click', closeMovieDetailsModal);

// Display movie recommendations
function displayMovieRecommendations(recommendations) {
  movieRecommendations.innerHTML = '';

  recommendations.forEach((movie) => {
    const movieElement = document.createElement('div');
    movieElement.classList.add('movie');

    const image = document.createElement('img');
    image.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    image.alt = movie.title;
    movieElement.appendChild(image);

    const title = document.createElement('h3');
    title.classList.add('movie-title');
    title.textContent = movie.title;
    movieElement.appendChild(title);

    movieRecommendations.appendChild(movieElement);
  });
}

// Display pagination links
function displayPagination(totalPages) {
  paginationContainer.innerHTML = '';

  const maxDisplayedPages = 6; // Set the maximum number of pagination links to be displayed

  let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
  let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);

  if (endPage - startPage + 1 < maxDisplayedPages) {
    startPage = Math.max(1, endPage - maxDisplayedPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    const link = document.createElement('a');
    link.href = '#';
    link.textContent = i;
    link.classList.add('pagination-link');

    if (i === currentPage) {
      link.classList.add('active');
    }

    link.addEventListener('click', () => {
      currentPage = i;
      fetchMovies();
    });

    paginationContainer.appendChild(link);
  }
}

