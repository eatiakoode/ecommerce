import { MdOutlineDashboard } from "react-icons/md";
import { LuUsers } from "react-icons/lu";
import { TbTruckDelivery } from "react-icons/tb";
import { RiCoupon2Line } from "react-icons/ri";
import { TbSettings } from "react-icons/tb";
import { TbTag } from "react-icons/tb";
import { TbBriefcase } from "react-icons/tb";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BiBadge } from "react-icons/bi";
import { MdOutlineRateReview } from "react-icons/md";
import { MdStraighten } from "react-icons/md";
import { MdSlideshow } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";
import { RiArticleLine } from "react-icons/ri";
import { RiQuestionAnswerLine } from "react-icons/ri";
import { RiTeamLine } from "react-icons/ri";

export const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: <MdOutlineDashboard />,
  },
  {
    title: "Categories",
    url: "/categories",
    icon: <TbTag />,
  },
  {
    title: "Brands",
    url: "/brands",
    icon: <BiBadge />,
  },
  {
    title: "Sizes",
    url: "/sizes",
    icon: <MdStraighten />,
  },
  {
    title: "Products",
    url: "/products",
    icon: <MdOutlineShoppingCart />,
  },
  {
    title: "Insta Posts",
    url: "/insta-posts",
    icon: <FaInstagram />,
  },
  {
    title: "Testimonials",
    url: "/testimonials",
    icon: <MdOutlineRateReview />,
  },
  {
    title: "Sliders",
    url: "/sliders",
    icon: <MdSlideshow />,
  },
  {
    title: "Staff",
    url: "/staff",
    icon: <TbBriefcase />,
  },

  {
    title: "Teams",
    url: "/teams",
    icon: <RiTeamLine />,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: <LuUsers />,
  },
  {
    title: "Orders",
    url: "/orders",
    icon: <TbTruckDelivery />,
  },
  {
    title: "Blogs",
    url: "/blogs",
    icon: <RiArticleLine />,
  },
  {
    title: "Coupons",
    url: "/coupons",
    icon: <RiCoupon2Line />,
  },
  {
    title: "FAQ",
    url: "/faq",
    icon: <RiQuestionAnswerLine />,
  },
  {
    title: "Enquiries",
    url: "/enquiries",
    icon: <RiQuestionAnswerLine />,
  },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: <TbSettings />,
  // },
];
