const defaultScrollObj = { x: 0, y: 0 };
/* 
    This function takes an object and will automatically assign the non-specified coordinates as 0.
    ie If scrollToTop({ y:30 }) x will automatically equal 0
*/

const scrollToTop = (scrollObj = defaultScrollObj) => {
  const newScrollObj = Object.assign(defaultScrollObj, scrollObj);
  window.scrollTo(newScrollObj.x, newScrollObj.y);
};

export default scrollToTop;
