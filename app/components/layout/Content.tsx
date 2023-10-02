import {
  HomeIcon,
  HeartIcon,
  ListBulletIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
// import  from "@heroicons/react/24/outline";
export const MENU = [
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/",
  },
  {
    title: "Favourities",
    icon: <HeartIcon />,
    link: "/#",
  },
  {
    title: "Listings",
    icon: <ListBulletIcon />,
    link: "/listings",
  },
  {
    title: "Profile",
    icon: <UserGroupIcon />,
    link: "/profile/myProperties",
  },
];
