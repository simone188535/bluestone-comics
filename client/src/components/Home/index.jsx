import React, { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
// import Slider from "react-slick";
import { Link } from "react-router-dom";
import MetaTags from "../MetaTags";
import { DotButton, useDotButton } from "./Slider/EmblaCarouselDotButtons";
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "./Slider/EmblaCarouselArrowButtons";
import batmanXLarge from "../../assets/homepage/batman-welcome-XL.jpg";
// import batmanLarge from "../../assets/homepage/batman-welcome-Large.jpg";
// import batmanMedium from "../../assets/homepage/batman-welcome-Medium.jpg";
// import batmanSmall from "../../assets/homepage/batman-welcome-Small.jpg";
import blackPantherXLarge from "../../assets/homepage/black-panther-awards-XL.jpg";
// import blackPantherLarge from "../../assets/homepage/black-panther-awards-Large.jpg";
// import blackPantherMedium from "../../assets/homepage/black-panther-awards-Medium.jpg";
// import blackPantherSmall from "../../assets/homepage/black-panther-awards-Small.jpg";
import spidermanXLarge from "../../assets/homepage/spiderman-sponsorship-XL.jpg";
// import spidermanLarge from "../../assets/homepage/spiderman-sponsorship-Large.jpg";
// import spidermanMedium from "../../assets/homepage/spiderman-sponsorship-Medium.jpg";
// import spidermanSmall from "../../assets/homepage/spiderman-sponsorship-Small.jpg";
import "./home.scss";

// const LinkButton = ({ buttonText, link, btnClass }) => (
//   <Link to={link} className="link-button">
//     <button type="button" className={`bsc-button transparent ${btnClass}`}>
//       {buttonText}
//     </button>
//   </Link>
// );

const newComics = [
  {
    link: "https://www.bluestonecomics.com/read/Rewired/book/10/issue/1",
    img: "https://bluestone-images-prod.s3.amazonaws.com/works/a9e7e61e86e044fd87b59e59ccbe82ef/b43c3103799d4b40b4990b02c2e71caa/d021ea3e1a0343c9b8ce0bb8ebd7c048",
    title: "Rewired",
  },
  {
    link: "https://www.bluestonecomics.com/read/Crossed-Signals/book/7/issue/1",
    img: "https://bluestone-images-prod.s3.amazonaws.com/works/d5687027a493471d807217f8291d41eb/3daf95d6f3eb4bac8d2b687b3695aec5/ae0b1f1b55d14342a0a001e35397d338",
    title: "Crossed Signals",
  },
  {
    link: "https://www.bluestonecomics.com/read/Between-Sand-and-Sea/book/6/issue/1",
    img: "https://bluestone-images-prod.s3.amazonaws.com/works/610ca9b3b0a7492dbfcb0f0914c79fd3/1ca11c879187450fb25f14055e22c897/03ffa68c797e4f1493472759ddccd4dd",
    title: "Between Sand & Sea",
  },
  {
    link: "https://www.bluestonecomics.com/read/Maintenance/book/8/issue/1",
    img: "https://bluestone-images-prod.s3.amazonaws.com/works/48eeef9786e644a5befe9ce1cb607bc1/dec76ec58fc449e5a410cd738b244ab9/ea633ea23b5a40f7b94b5449d6d21c6c",
    title: "Maintenance",
  },
  // {
  //   link: "https://www.bluestonecomics.com/read/The-Storm/book/5/issue/1",
  //   img: "https://bluestone-images-prod.s3.amazonaws.com/works/114144d5298541da9d8956e173fa5c71/fde56ff5e11440079b4884ec9e88b166/4e8a5e9ace2a4bca82ca29870132f1e0",
  //   title: "The Storm",
  // },
];

const homePageSections = [
  {
    sectionOrder: "odd",
    sectionNum: "one",
    slantDirection: "left",
    imgSrc: batmanXLarge,
    imgAlt: "Welcome to Bluestone Comics",
    headerText: (
      <h1 className="primary-header">
        Welcome to <br /> Bluestone Comics
      </h1>
    ),
    detailsText: (
      <>
        <span>
          Bluestone Comics is a celebration of american indie comics books. Our
          goal is to promote their creation and culture.
        </span>
        <Link to="/search" className="link-button">
          <button type="button" className="bsc-button primary read-btn">
            Read Comics
          </button>
        </Link>
      </>
    ),
  },
  {
    sectionOrder: "even",
    sectionNum: "two",
    slantDirection: "right",
    imgSrc: blackPantherXLarge,
    imgAlt: "Bluestone Comics Awards",
    headerText: <h2 className="primary-header">Awards</h2>,
    detailsText: (
      <>
        If your work stands out from the rest, It may be featured on the
        homepage.
        {/* It may also be <strong>eligible for funding</strong>. */}
      </>
    ),
  },
  {
    sectionOrder: "odd",
    sectionNum: "three",
    slantDirection: "left",
    imgSrc: spidermanXLarge,
    imgAlt: "Bluestone Comics Sponsorship",
    headerText: <h2 className="primary-header">Sponsorship</h2>,
    detailsText:
      "Popular comics may have the chance to receive sponsorship in the future.",
  },
];

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 1,
//   slidesToScroll: 1,
// };

const Home = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4500 }),
  ]);

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi);

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <>
      <MetaTags
        title="Bluestone Comics: Make and Read Indie Comics"
        canonical="https://www.bluestonecomics.com"
        description="Bluestone Comics is a celebration of American comic books. Upload your own American style comic books. Read all comic books for free. Bring your comics to life."
      />
      <main className="container-fluid home-page">
        {/* <Slider {...settings} className="home-page-slick-slider"> */}
        <section className="slider embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {homePageSections.map(
                ({
                  // sectionOrder,
                  sectionNum,
                  slantDirection,
                  imgSrc,
                  imgAlt,
                  headerText,
                  detailsText,
                }) => (
                  // <section>
                  <div
                    // className={`hero-container sect-${sectionNum} ${sectionOrder} embla__slide`}
                    className="embla__slide"
                    key={sectionNum}
                  >
                    <div className="hero-image-container">
                      <picture className="hero-picture">
                        <img
                          className="hero-image"
                          src={imgSrc}
                          width="auto"
                          height="auto"
                          alt={imgAlt}
                        />
                        <div className="slider-gradient" />
                      </picture>
                      <article className={`desc ${slantDirection}-slant`}>
                        <section className="desc-content">
                          {headerText}
                          <p className="details">{detailsText}</p>
                        </section>
                      </article>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="button-container">
              <PrevButton
                onClick={onPrevButtonClick}
                disabled={prevBtnDisabled}
              />
              <NextButton
                onClick={onNextButtonClick}
                disabled={nextBtnDisabled}
              />
            </div>
          </div>
          <div className="embla__dots">
            {scrollSnaps.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : ""
                )}
              />
            ))}
          </div>
        </section>
        <section className="reader-section">
          <h2 className="sub-header">NEW COMICS</h2>
          <ul className="new-item-list">
            {newComics.map(({ link, title, img }) => (
              <li className="new-item">
                <a href={link} className="article-link">
                  <img src={img} alt={title} className="article-img" />
                  <h2 className="article-header">{title}</h2>
                </a>
              </li>
            ))}
          </ul>
        </section>
        <section className="read-more-section">
          <Link to="/search" className="link-button">
            <button
              type="button"
              className="bsc-button primary primary-glow more-btn"
            >
              More Comics
            </button>
          </Link>
        </section>
      </main>
      <div />
    </>
  );
};
export default Home;
