import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyList from "../images/empty-inbox.png";
import { SearchContext } from "../Contexts/SearchContext";

interface BlogType {
  createdAt: string;
  documentId: string;
  id: number;
  publishedAt: string;
  updatedAt: string;
  matn: string;
  sarlavha: string;
  img: any;
  user: any;
  categories: any;
  CategoryName: string;
  blogs: any;
}

const Posts = () => {
  const [data, setData] = useState<BlogType[]>([]);
  const { cart_id } = useParams<string>();
  const [expandedPosts, setExpandedPosts] = useState<Record<number, boolean>>(
    {}
  );

  const searchContext = useContext(SearchContext);

  if (!searchContext) {
    return <p>Ma'lumotlar yuklanmoqda...</p>;
  }

  const { searchTerm } = searchContext;

  const togglePost = (postId: number) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          cart_id === "all"
            ? "http://localhost:1337/api/blogs?populate[img]=true&populate[categories]=true&populate[user][populate]=*"
            : `http://localhost:1337/api/categories/${cart_id}?populate[blogs][populate][img]=true&populate[blogs][populate][user][populate][profileImage]=true&populate[blogs][populate][user][populate][bannerImage]=true&populate[blogs][populate][categories]=true`
        );
        setData(
          cart_id === "all" ? response.data.data : response.data.data.blogs
        );
      } catch (error: any) {
        console.error(error.response?.data?.error?.message || error.message);
      }
    };

    fetchData();
  }, [cart_id]);

  // 🔹 Qidiruv so‘zini qo‘llab filter qilamiz
  const filteredPosts = data.filter((post) =>
    post.sarlavha.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return filteredPosts.length > 0 ? (
    filteredPosts.map((post) => (
      <div
        className="w-full max-w-[642px] border border-[#E5E7EB] p-[20px] rounded-[5.63px]"
        key={post.id}
      >
        <header className="w-full">
          <div className="flex gap-[11.25px] items-center">
            <div className="w-[52.5px] h-[52.5px] rounded-full">
              <img
                className="w-full rounded-full h-full object-cover"
                src={`http://localhost:1337${post?.user?.profileImage?.url}`}
                alt=""
              />
            </div>
            <div>
              <h3 className="font-openSans text-[14.53px] leading-[18.8px] font-normal text-[#4B5563]">
                {post?.user?.username}
              </h3>
              <p className="mt-[2px] text-[13.1px] font-openSans font-normal leading-[18.8px] text-[#9CA3AF]">
                {post?.user?.kasbi}
              </p>
            </div>
          </div>
          <div className="mt-[22.5px] flex gap-[7.5px]">
            {post.categories.map((category: any, id: number) => (
              <div
                className="w-max rounded-[9999px] py-[3.75px] px-[8px] flex justify-center items-center gap-[7.5px] font-openSans font-normal text-[13.1px] leading-[18.8px] text-[#6B7280] bg-[#F3F4F6]"
                key={id}
              >
                <span className="w-[15px] h-[15px] flex justify-center items-center">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.625 4.60498H4.63125M4.625 2.10498H7.75C8.07 2.10498 8.39 2.22686 8.63375 2.47123L13.0088 6.84623C13.2431 7.08064 13.3747 7.39853 13.3747 7.72998C13.3747 8.06144 13.2431 8.37932 13.0088 8.61373L8.63375 12.9887C8.39934 13.2231 8.08146 13.3547 7.75 13.3547C7.41855 13.3547 7.10066 13.2231 6.86625 12.9887L2.49125 8.61373C2.375 8.49781 2.2828 8.36006 2.21995 8.2084C2.1571 8.05674 2.12483 7.89415 2.125 7.72998V4.60498C2.125 3.94194 2.38839 3.30605 2.85723 2.83721C3.32607 2.36837 3.96196 2.10498 4.625 2.10498Z"
                      stroke="#6B7280"
                      strokeWidth="1.25"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {category.CategoryName}
              </div>
            ))}
          </div>
        </header>
        <div className="mt-[11px] h-[1px] w-full bg-[#E5E7EB]"></div>
        <div className="mt-[22.5px]">
          <h1 className="font-PTserif text-[20.74px] font-normal leading-[30px] text-[#4B5563]">
            {post.sarlavha}
          </h1>
          <div className="w-full max-w-[603px] h-full max-h-[360px] mt-[15px]">
            <img
              src={`http://localhost:1337${post?.img?.url}`}
              alt=""
              className="w-full h-full cover"
            />
          </div>
          <pre
            className={`mt-[14.26px] font-PTserif font-normal text-[16.9px] leading-[22.5px] text-[#6B7280] ${
              expandedPosts[post.id] ? "h-full" : "h-[69px]"
            } overflow-y-hidden text-wrap text-justify`}
          >
            {post.matn}
          </pre>
          <button
            className={`h-[53px] w-full flex justify-center items-end translate-y-[-30px] font-openSans font-normal text-[15px] leading-[22.5px] text-[#60A5FA] gap-[7.5px] ${
              expandedPosts[post.id] ? "mt-[30px]" : "bg-ReadMoreBtn"
            }`}
            onClick={() => togglePost(post.id)}
          >
            {expandedPosts[post.id]
              ? "Qisqa shaklda o'qing"
              : "Batafsil shaklda o'qing"}
          </button>
        </div>
      </div>
    ))
  ) : (
    <div className="w-full flex flex-col justify-center items-center gap-[30px]">
      <img src={EmptyList} alt="" className="w-full max-w-[120px] mx-auto" />
      <h1 className="font-openSans font-normal leading-[22.5px] text-[15px] text-[#6B7280]">
        Hozirda bu ruknda postlar yo'q
      </h1>
    </div>
  );
};

export default Posts;
