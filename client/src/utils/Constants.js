// Upload
const CONSTANTS = {
  IMAGE_UPLOAD_DIMENSIONS: {
    THUMBNAIL: {
      WIDTH: 320,
      HEIGHT: 485,
      MAX_FILE_SIZE: 1048576, // 1MB
      MAX_FILE_SIZE_IN_BYTES: "1MB",
    },
    STANDARD_UPLOAD_SIZE: {
      WIDTH: 1988,
      HEIGHT: 3056,
      MAX_FILE_SIZE: 2097152, // 2MB
      MAX_FILE_SIZE_IN_BYTES: "2MB",
    },
  },
  PAGINATION_LIMIT: 12,
  GENRES: [
    "Action",
    "Adventure",
    "Anthropomorphic",
    "Children",
    "Comedy",
    "Crime",
    "Drama",
    "Family",
    "Fantasy",
    "Graphic Novel",
    "Historical",
    "Horror",
    "LGBTQ",
    "Mature",
    "Music",
    "Mystery",
    "Mythology",
    "Psychological",
    "Romance",
    "School Life",
    "Sci-Fi",
    "Slice of Life",
    "Sport",
    "Superhero",
    "Supernatural",
    "Thriller",
    "War",
    "Western",
    "Zombies",
  ],
  NUM_OF_ITEMS_PER_SEARCH_PAGE: 20,
};

export default CONSTANTS;
