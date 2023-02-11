module.exports = {
  joinHelper: (arr) => arr.join(','),
  withGenresStr:
    'WITH workGenres AS (SELECT genres.book_id AS genre_book_id, array_agg(genres.genre)::text[] AS genre_array FROM genres GROUP BY genre_book_id ORDER BY genre_book_id)'
};
