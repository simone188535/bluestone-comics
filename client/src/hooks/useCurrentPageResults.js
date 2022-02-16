import { useMemo } from "react";

// This code was inspired by this article: https://www.freecodecamp.org/news/build-a-custom-pagination-component-in-react/

const useCurrentPageResults = (currentPage, filteredResults, PageSize) => {
  return useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredResults.slice(firstPageIndex, lastPageIndex);
  }, [PageSize, currentPage, filteredResults]);
};

export default useCurrentPageResults;
