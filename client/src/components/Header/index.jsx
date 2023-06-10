import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../actions";
import logo from "../../assets/logo.png";
import "./header.scss";

/* 
    The purpose of this function is to add the active class to an element for styling purposes.
    If the active class is already added the it removes it (toggle effect). 
*/
const toggleMenu = (e, toggleFocus) => {
  let toggleItem;

  if (toggleFocus === "mainNav") {
    toggleItem = document.querySelector(".nav-menu");
  } else if (toggleFocus === "navSubItem") {
    toggleItem = e.currentTarget.querySelector(".submenu");
  } else if (toggleFocus === "searchIcon") {
    toggleItem = document.querySelector(".search");
  }

  if (toggleItem.classList.contains("active")) {
    toggleItem.classList.remove("active");
  } else {
    toggleItem.classList.add("active");
  }
};

// These are nav items the render conditionally depending on whether the user is login or not
const AuthNavItems = () => {
  const dispatch = useDispatch();
  const [currentUsername, setCurrentUsername] = useState("");
  const { isAuthenticated, currentUser, isFetching } = useSelector((state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    currentUser: state.auth.user,
    isFetching: state.auth.isFetching,
  }));

  useEffect(() => {
    if (currentUser) {
      setCurrentUsername(currentUser.username);
    }
  }, [currentUser]);

  const NavItems = () => {
    if (isFetching) {
      // If loading, show nothing
      return null;
    }
    if (isAuthenticated) {
      // If isAuthenticated show protected nav items

      return (
        <li
          className="nav-menu-item has-submenu"
          onMouseEnter={(e) => toggleMenu(e, "navSubItem")}
          onMouseLeave={(e) => toggleMenu(e, "navSubItem")}
        >
          <button className="link-button" type="button" tabIndex="0">
            <img
              className="link-profile-img"
              src={currentUser.user_photo}
              alt="thumbnail-profile-pic"
              width="40"
              height="40"
            />
          </button>
          <ul className="submenu">
            <li className="subitem">
              <Link to={`/profile/${currentUsername}`}>Profile</Link>
            </li>
            <li className="subitem">
              <Link to="/upload">Upload</Link>
            </li>
            <li className="subitem">
              <button
                type="button"
                className="link-button"
                onClick={() => dispatch(authActions.logout())}
              >
                <Link to="/">Logout</Link>
              </button>
            </li>
          </ul>
        </li>
      );
    }

    return (
      <>
        <li className="nav-menu-item button">
          <Link to="/sign-up">Sign Up</Link>
        </li>
        <li className="nav-menu-item button">
          <Link to="/login">Login</Link>
        </li>
      </>
    );
  };
  return NavItems();
};

const SearchIconToggle = ({ searchToggle }) => {
  const toggleIcon = searchToggle ? (
    <FontAwesomeIcon icon={faTimes} size="lg" />
  ) : (
    <FontAwesomeIcon icon={faSearch} size="lg" />
  );

  return toggleIcon;
};

const ShowSearchBar = ({
  textSearch,
  setTextSearch,
  searchToggle,
  setSearchToggle,
}) => {
  const history = useHistory();

  const onSearch = (e) => {
    e.preventDefault();
    // go to search page
    history.push(`/search?q=${textSearch}`);
    // close and clear out global nav
    setTextSearch("");
    toggleMenu(e, "searchIcon");
    setSearchToggle(!searchToggle);
  };

  return (
    searchToggle && (
      <div className="global-nav-item searchbar-container">
        <form
          className="search-form"
          method="get"
          action="#"
          onSubmit={onSearch}
        >
          <input
            type="text"
            name="search-bar"
            className="nav-searchbar"
            placeholder="What are you look for?"
            autoComplete="off"
            onChange={(e) => setTextSearch(e.target.value)}
          />
        </form>
      </div>
    )
  );
};

const Header = () => {
  const [searchToggle, setSearchToggle] = useState(false);
  const [textSearch, setTextSearch] = useState("");

  const searchButtonClicked = (e) => {
    toggleMenu(e, "searchIcon");
    setSearchToggle(!searchToggle);
  };

  useEffect(() => {
    // if the search toggle is closed and text is present, remove the text
    if (!searchToggle && textSearch) {
      setTextSearch("");
    }
  }, [searchToggle, textSearch]);

  return (
    <nav className="global-nav">
      <div className="global-nav-item logo">
        <Link to="/">
          <img
            src={logo}
            className="logo-img"
            alt="Bluestone Comics logo"
            width="auto"
            height="auto"
          />
        </Link>
      </div>
      <ul className="global-nav-item nav-menu">
        <li className="nav-menu-item">
          <Link to="/search">Comic List</Link>
        </li>
        <li className="nav-menu-item">
          <Link to="/about">About</Link>
        </li>
        {/* <li className="nav-menu-item">
          <Link to="/comic-list">Comic List</Link>
        </li>
        <li className="nav-menu-item">
          <Link to="/contest">Contests</Link>
        </li>
        <li className="nav-menu-item">
          <Link to="/articles">Articles</Link>
        </li>
        <li className="nav-menu-item">
          <Link to="/news">News</Link>
        </li> */}
        <AuthNavItems />
      </ul>
      <button
        type="button"
        className="global-nav-item mobile-toggle"
        onClick={(e) => toggleMenu(e, "mainNav")}
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>
      <button
        type="button"
        className="global-nav-item search"
        onClick={(e) => searchButtonClicked(e)}
      >
        <SearchIconToggle
          setTextSearch={setTextSearch}
          searchToggle={searchToggle}
        />
      </button>
      <ShowSearchBar
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        searchToggle={searchToggle}
        setSearchToggle={setSearchToggle}
      />
    </nav>
  );
};

export default Header;
