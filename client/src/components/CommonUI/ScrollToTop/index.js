import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { scrollToTop, defaultScrollToTopObj } from "../../../utils/scrollToTop";

/*
    This resets the scroll bar to the top of the page for a given component when 
    the url changes. Inspired by: https://stackoverflow.com/questions/58431946/why-does-my-react-router-link-bring-me-to-the-middle-of-a-page
    https://v5.reactrouter.com/web/guides/scroll-restoration/scroll-to-top
    This component is designed to take an object of x and y for the pages initial position. 
    For a initials positioning of 0,0 (to start the page postion at the very top when the pathname
    changes) do this: <ScrollToTop />. To start the page at a specific position do this: <ScrollToTop coords={{x: 20}} />,
     <ScrollToTop coords={{y: 30}} /> or <ScrollToTop coords={{x: 20, y:30}} />
*/
function ScrollToTop({ coords = defaultScrollToTopObj }) {
  const { pathname } = useLocation();

  useEffect(() => {
    scrollToTop(coords);
  }, [coords, pathname]);

  return null;
}

export default ScrollToTop;
