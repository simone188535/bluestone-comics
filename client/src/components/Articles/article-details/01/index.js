// import batmanLarge from "../../../../assets/homepage/batman-welcome-Large.jpg";

// thumbnails
import { publishCBOnline } from "./assets/UploadWorkTutorial";
import { ComicCreationRolesSm } from "./assets/EightRolesOfComicCreation";

// pages
import UploadWorkTutorial from "../../pages/UploadWorkTutorial";
import EightRolesOfComicCreation from "../../pages/EightRolesOfComicCreation";

// Keep commented out
// import DemoArticle from "../../pages/DemoArticle";
// import DemoMakeAComicOnline from "../../pages/DemoMakeAComicOnline";

const pageOne = [
  {
    key: 2,
    link: "/articles/the-8-roles-needed-to-create-comic-book",
    header: "The 8 Roles Needed To Create A Comic Book",
    desc: "Creating a comic book is not a one-person job. It requires a team of talented individuals to bring the story to life.",
    img: {
      src: ComicCreationRolesSm,
      alt: "8 Roles Needed To Create A Comic Book",
    },
    extraDetails: {
      date: "2023-09-16T00:56:39.200Z",
      articleType: "Creator",
      minRead: 5,
    },
    className: "comic-creation-roles",
    mainComponent: EightRolesOfComicCreation,
  },
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
  // keep
  // {
  //   key: 3,
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
  //   mainComponent: DemoMakeAComicOnline,
  //   asideComponent: DemoArticle,
  // },
];

export default pageOne;
