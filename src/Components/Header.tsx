import { Link } from "react-router-dom";
import logo from "./image/logo.jpeg";
import { useContext, useEffect, useState } from "react";
import { SearchContext } from "../Contexts/SearchContext";

const Header = () => {
  const [user, setUser] = useState<{ username?: string }>({});

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}");
    // console.log(userData);
    setUser(userData);
  }, []);

  const searchContext = useContext(SearchContext);

  if (!searchContext) {
    return null; // Agar Context yuklanmagan bo'lsa, hech narsa qaytarmaydi
  }

  const { setSearchTerm } = searchContext;

  return (
    <header className="w-full max-w-[1140px] mx-auto flex justify-between gap-[20px] pt-[50px]">
      <a href="/" className="w-full max-w-[52px] h-[41px]">
        <img src={logo} alt="" />
      </a>
      <div className="w-full max-w-[547px] bg-[#fff] p-[11.25px] flex gap-[11.25px] border shadow-shadowInput rounded-[5.63px] hover:border-[black] items-center">
        <span className="w-[22.5px] h-[22.5px] flex justify-center items-center">
          <svg
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.0625 17.4375L12.4375 11.8125M14.3125 7.125C14.3125 7.9868 14.1428 8.84016 13.813 9.63636C13.4832 10.4326 12.9998 11.156 12.3904 11.7654C11.781 12.3748 11.0576 12.8582 10.2614 13.188C9.46516 13.5178 8.6118 13.6875 7.75 13.6875C6.8882 13.6875 6.03484 13.5178 5.23864 13.188C4.44244 12.8582 3.719 12.3748 3.10961 11.7654C2.50023 11.156 2.01684 10.4326 1.68704 9.63636C1.35724 8.84016 1.1875 7.9868 1.1875 7.125C1.1875 5.38452 1.8789 3.71532 3.10961 2.48461C4.34032 1.2539 6.00952 0.5625 7.75 0.5625C9.49048 0.5625 11.1597 1.2539 12.3904 2.48461C13.6211 3.71532 14.3125 5.38452 14.3125 7.125Z"
              stroke="#9CA3AF"
              strokeWidth="0.9375"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <input
          className="w-full outline-none"
          type="search"
          name="search"
          id="search"
          placeholder="Minbar.uz dan qidiring"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full max-w-[280px] flex gap-[10px]">
        <Link
          to="/users"
          className="w-full max-w-[182px] flex gap-[7.5px] items-center font-openSans font-normal leading-[22.5px] text-[15px] text-[#6B7280] border border-[#fff] hover:border-[#6B7280] rounded-[3.75px] p-3"
        >
          <span className="w-[33.75px] h-[33.75px] flex justify-center items-center">
            <svg
              width="27"
              height="27"
              viewBox="0 0 27 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13.5 2.62281C14.2558 1.76599 15.2545 1.15962 16.3634 0.884397C17.4723 0.609173 18.6387 0.678142 19.7074 1.08213C20.7761 1.48611 21.6965 2.20596 22.346 3.14588C22.9955 4.0858 23.3434 5.20123 23.3434 6.34375C23.3434 7.48627 22.9955 8.6017 22.346 9.54162C21.6965 10.4815 20.7761 11.2014 19.7074 11.6054C18.6387 12.0094 17.4723 12.0783 16.3634 11.8031C15.2545 11.5279 14.2558 10.9215 13.5 10.0647M17.7188 26.0312H0.84375V24.625C0.84375 22.3872 1.7327 20.2411 3.31504 18.6588C4.89737 17.0764 7.04349 16.1875 9.28125 16.1875C11.519 16.1875 13.6651 17.0764 15.2475 18.6588C16.8298 20.2411 17.7187 22.3872 17.7188 24.625V26.0312ZM17.7188 26.0312H26.1562V24.625C26.1565 23.1438 25.7667 21.6887 25.0263 20.4058C24.2858 19.123 23.2207 18.0577 21.938 17.317C20.6553 16.5763 19.2002 16.1864 17.719 16.1863C16.2379 16.1863 14.7827 16.5761 13.5 17.3167M14.9062 6.34375C14.9062 7.83559 14.3136 9.26634 13.2587 10.3212C12.2038 11.3761 10.7731 11.9688 9.28125 11.9688C7.78941 11.9688 6.35867 11.3761 5.30377 10.3212C4.24888 9.26634 3.65625 7.83559 3.65625 6.34375C3.65625 4.85191 4.24888 3.42117 5.30377 2.36628C6.35867 1.31138 7.78941 0.718751 9.28125 0.718751C10.7731 0.718751 12.2038 1.31138 13.2587 2.36628C14.3136 3.42117 14.9062 4.85191 14.9062 6.34375Z"
                stroke="#6B7280"
                strokeWidth="1.40625"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          Foydalanuvchilar
        </Link>

        {user.username ? (
          <Link
            to="/profile"
            className="group w-full py-[7.5px] rounded-[3.75px] bg-[#37B21F] font-openSans font-normal leading-[22.5px] text-[15px] border text-[#fff] hover:border-[#37B21F] hover:bg-[#fff] hover:text-[#37B21F] transition-all flex justify-center items-center gap-[8px]"
          >
            <span className="w-[22.5px] h-[22.5px] flex justify-center items-center">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M17.5588 18.5488C16.5654 15.8918 14.0036 14 11 14C7.99638 14 5.4346 15.8918 4.44117 18.5488M17.5588 18.5488C19.6672 16.7154 21 14.0134 21 11C21 5.47715 16.5228 1 11 1C5.47715 1 1 5.47715 1 11C1 14.0134 2.33285 16.7154 4.44117 18.5488M17.5588 18.5488C15.8031 20.0756 13.5095 21 11 21C8.49052 21 6.19694 20.0756 4.44117 18.5488M14 8C14 9.65685 12.6569 11 11 11C9.34315 11 8 9.65685 8 8C8 6.34315 9.34315 5 11 5C12.6569 5 14 6.34315 14 8Z"
                  stroke="#fff"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  className="group-hover:stroke-[#37B21F] transition-all"
                />
              </svg>
            </span>
            {user.username}
          </Link>
        ) : (
          <Link
            to="/sign-in"
            className="w-full max-w-[85px] py-[7.5px] rounded-[3.75px] bg-[#37B21F] font-openSans font-normal leading-[22.5px] text-[15px] border text-[#fff] hover:border-[#37B21F] hover:bg-[#fff] hover:text-[#37B21F] transition-all flex justify-center items-center"
          >
            Kirish
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;
