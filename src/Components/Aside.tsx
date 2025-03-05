import { NavLink } from "react-router-dom";
import tibbiyot from "../images/tibbiyot.png";
import talim from "../images/talim.png";
import siyosat from "../images/siyosat.png";
import texnalogiya from "../images/texnalogiya.png";
import { useEffect, useState } from "react";
import axios from "axios";

interface useArrayType {
  CategoryName: string;
  createdAt: string;
  documentId: string;
  id: 2;
  publishedAt: string;
  updatedAt: string;
}

const Icons = [
  {
    name: "Tibbiyot",
    icon: tibbiyot,
  },
  {
    name: "Talim",
    icon: talim,
  },
  {
    name: "Siyosat",
    icon: siyosat,
  },
  {
    name: "Texnalogiya",
    icon: texnalogiya,
  },
];

const Aside = () => {
  const [categories, setCategories] = useState<useArrayType[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/categories")
      .then((response) => {
        setCategories(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the categories!", error);
      });
  }, []);

  return (
    <div className="w-full max-w-[190px] flex flex-col gap-[7px] ">
      {categories.map((category) => (
        <NavLink
          key={category.id}
          className="px-[9.5px] py-[8px] flex gap-[7.5px] items-center font-openSans font-normal leading-[22.5px] text-[15px] text-[#6B7280] hover:underline"
          to={`/category/${category.documentId}`}
        >
          <span className="w-[22px] h-[22px] flex justify-center items-center">
            <img
              src={
                Icons.find((icon) => icon.name === category.CategoryName)?.icon
              }
              alt=""
              className="w-full"
            />
          </span>
          {category.CategoryName}
        </NavLink>
      ))}
    </div>
  );
};

export default Aside;
