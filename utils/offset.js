/*
    this function shows the correct page number/offset 
    of the pgSQL results returned from the PostgresDB.
*/
const pageOffset = (pageNumber) => {
  let offset = pageNumber - 1;
  if (offset < 1) offset = 0;

  return offset;
};

module.exports = pageOffset;
