import batmanLarge from "../../../../assets/homepage/batman-welcome-Large.jpg";

import UploadWorkTutorial from "../../pages/UploadWorkTutorial";
import MakeAComicOnline from "../../pages/MakeAComicOnline";

const pageOne = [
  {
    key: 1,
    link: "/articles/test",
    header:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua",
    img: {
      src: batmanLarge,
      alt: "placeholder",
    },
    extraDetails: {
      date: "2023-06-27T20:00:54.813Z",
      articleType: "Creator",
      minRead: 5,
    },
    mainComponent: UploadWorkTutorial,
  },
  {
    key: 2,
    link: "/articles/hmm",
    header: "Testing123",
    desc: "Testing Desc",
    img: {
      src: batmanLarge,
      alt: "placeholder",
    },
    extraDetails: {
      date: "2023-06-27T20:00:54.813Z",
      articleType: "Creator",
      minRead: 5,
    },
    mainComponent: MakeAComicOnline,
  },
];

export default pageOne;
