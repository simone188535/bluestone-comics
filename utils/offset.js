/*
    this function returns the proper number offset calculation
    needed for proper pagination in pgSQL.
*/
const pageOffset = (pageNumber, offsetBy) => {
  const pageNumMinusOne = pageNumber - 1;
  return (pageNumMinusOne < 0 ? 0 : pageNumMinusOne) * offsetBy;
};

module.exports = pageOffset;
