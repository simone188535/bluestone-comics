// import batmanLarge from "../../../../assets/homepage/batman-welcome-Large.jpg";

import publishCBOnline from "./assets/how-to-publish-a-comic-book-online.jpeg";

import UploadWorkTutorial from "../../pages/UploadWorkTutorial";
// import MakeAComicOnline from "../../pages/MakeAComicOnline";

// Keep commented out
// import DemoArticle from "../../pages/DemoArticle";

const pageOne = [
  {
    key: 1,
    link: "/articles/how-to-publish-your-comic-book-online",
    header: "How to Publish A Comic Book Online: Step-by-Step Guide Article",
    desc: 'The "How-To" guide for self-publishing American Comic Books',
    img: {
      src: publishCBOnline,
      alt: "How to publish a comic book online",
    },
    extraDetails: {
      date: "2023-08-29T01:01:32.413Z",
      articleType: "Creator",
      minRead: 10,
    },
    className: "upload-work-tutorial",
    mainComponent: UploadWorkTutorial,
  },
  // {
  //   key: 2,
  //   link: "/articles/hmm",
  //   header: "Testing123",
  //   desc: "Testing Desc",
  //   img: {
  //     src: batmanLarge,
  //     alt: "placeholder",
  //   },
  //   extraDetails: {
  //     date: "2023-06-27T20:00:54.813Z",
  //     articleType: "Creator",
  //     minRead: 5,
  //   },
  //   className: "demo-article",
  //   mainComponent: DemoArticle,
  //   asideComponent: DemoArticle,
  // },
];

export default pageOne;
