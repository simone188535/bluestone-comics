import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import scrollToTop from "../../../utils/scrollToTop";

/*
    This resets the scroll bar to the top of the page for a given component when 
    the url changes. Inspired by: https://stackoverflow.com/questions/58431946/why-does-my-react-router-link-bring-me-to-the-middle-of-a-page
    https://v5.reactrouter.com/web/guides/scroll-restoration/scroll-to-top
*/
function ScrollToTop({ coords }) {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop(coords);
  }, [coords, pathname]);

  return null;
}

export default ScrollToTop;
