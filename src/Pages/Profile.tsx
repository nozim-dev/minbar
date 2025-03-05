import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BannerImg from "../images/banner.avif";
import ProfileImg from "../images/profile.jpg";

interface UserDataType {
  id: number | null;
  email: string;
  username: string;
  password: string;
  profileImage: any;
  bannerImage: any;
  kasbi: string;
}
// Api .env fayliga ko'chirildi xavfsizlik uchun
const API_URL = import.meta.env.VITE_API_URL;
const Profile = () => {
  const navigate = useNavigate();

  // LocalStorage-dan foydalanuvchi ma'lumotlarini olish
  const [userData, setUserData] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [DefaultUserData, setDefaultUserData] = useState<UserDataType>({
    id: null,
    email: "",
    username: "",
    password: "",
    profileImage: "",
    bannerImage: "",
    kasbi: "",
  });

  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${userData.jwt}`,
    },
  });

  // Rasmlarni yuklab oladi
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<string | null>(null);

  const fetchUserImages = async () => {
    try {
      if (typeof DefaultUserData.profileImage === "object") {
        setProfileImage(DefaultUserData.profileImage.url);
        console.log(DefaultUserData.profileImage.url);
      } else {
        const profileRes = await apiClient.get(
          `/api/upload/files/${DefaultUserData.profileImage}`
        );
        setProfileImage(profileRes.data);
      }

      if (typeof DefaultUserData.bannerImage === "object") {
        setBannerImage(DefaultUserData.bannerImage.url);
        console.log(DefaultUserData.bannerImage.url);
      } else {
        const bannerRes2 = await apiClient.get(
          `/api/upload/files/${DefaultUserData.bannerImage}`
        );
        setBannerImage(bannerRes2.data);
      }
    } catch (error) {
      console.error("Rasmni olishda xatolik:", error);
    }
  };
  // useEffect da DefaultUserData yuklangach ishlash
  useEffect(() => {
    if (DefaultUserData.id !== null) {
      fetchUserImages();
    }
  }, [DefaultUserData]);

  // Foydalanuvchi ma'lumotlarini olib kelish
  useEffect(() => {
    const getProfileData = async () => {
      if (!userData?.jwt) return;
      try {
        const { data } = await apiClient.get("/api/users/me?populate=*");
        setDefaultUserData(data);
      } catch (error: any) {
        console.error("Error fetching profile data:", error.message);
      }
    };
    getProfileData();
  }, [userData]); // userData butunligi tekshiriladi

  // Input o'zgarishlarini ushlab turish
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (files && files[0]) {
      const formData = new FormData();
      formData.append("files", files[0]);

      setIsUploading(true);
      console.log("Uploading file:", files[0]);

      try {
        if (!userData?.jwt) {
          console.error("User is not authenticated!");
          return;
        }

        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        });

        const uploadedFile = uploadRes?.data?.[0]; // Fayl obyektini olish
        if (!uploadedFile?.id || !uploadedFile?.url) {
          throw new Error("Failed to retrieve uploaded file data");
        }

        setDefaultUserData((currentUser) => ({
          ...currentUser,
          [name]: uploadedFile.id, // Faqat URL saqlanadi
        }));
      } catch (error: any) {
        console.error("Error uploading file:", error.message);
      } finally {
        setIsUploading(false);
      }
    } else {
      setDefaultUserData((currentUser) => ({
        ...currentUser,
        [name]: value,
      }));
    }
  };

  // Profilni yangilash

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(DefaultUserData);

    try {
      const response = await apiClient.put(`/api/users/${DefaultUserData.id}`, {
        email: DefaultUserData.email,
        username: DefaultUserData.username,
        password: DefaultUserData.password,
        profileImage: DefaultUserData.profileImage,
        bannerImage: DefaultUserData.bannerImage,
        kasbi: DefaultUserData.kasbi,
      });

      console.log("User updated:", response.data);
      setDefaultUserData(response.data); // Yangilangan ma'lumotlarni stateni yangilash
    } catch (error: any) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  // modalni ochadigan funksiya
  const openModal = (modalId: string | null) => {
    if (!modalId) return;
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      modalElement.classList.remove("hidden");
    }
    document.body.classList.add("overflow-y-hidden");
  };

  // modalni yopadigan funksiya
  const closeModal = function (modalId: string | null) {
    const modalElement = modalId ? document.getElementById(modalId) : null;
    if (modalElement) {
      modalElement.style.display = "none";
    }
    document
      .getElementsByTagName("body")[0]
      .classList.remove("overflow-y-hidden");
  };

  // foydalanuvchi ma'lumotlarini o'chiradi
  const handleDeleteAccount = async () => {
    try {
      await apiClient.delete(`/api/users/${DefaultUserData.id}`);
      localStorage.clear();
      setUserData({});
      closeModal("modelConfirm");
      setTimeout(() => navigate("/sign-up"), 500);
    } catch (error: any) {
      console.error("Error deleting account:", error.message);
    }
  };

  // foydalanuvchidan chiqadi
  const handleLogOut = () => {
    localStorage.clear();
    navigate("/sign-in");
    window.location.reload(); // Sahifani yangilash
  };

  return (
    <div>
      <section className="py-10 my-auto dark:bg-gray-900">
        <div className="lg:w-[80%] md:w-[90%] w-[96%] mx-auto flex gap-4">
          <div className="lg:w-[88%] sm:w-[88%] w-full mx-auto shadow-2xl p-4 rounded-xl h-fit self-center dark:bg-gray-800/40">
            <div>
              <div className="flex justify-between items-center gap-[8px]">
                <div>
                  <h1 className="lg:text-3xl md:text-2xl text-xl font-serif font-extrabold mb-2 dark:text-white">
                    Profile
                  </h1>
                  <h2 className="text-grey text-sm mb-4 dark:text-gray-400">
                    Create Profile
                  </h2>
                </div>
                <Link
                  to="/post"
                  className="w-full max-w-[120px] py-[7.5px] rounded-[3.75px] bg-[#37B21F] font-openSans font-normal leading-[22.5px] text-[15px] border text-[#fff] hover:border-[#37B21F] hover:bg-[#fff] hover:text-[#37B21F] transition-all flex justify-center items-center gap-[6px] group"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.46001 19.24L19.25 4.45L15.55 0.75L0.759995 15.54L0.75 19.25L4.46001 19.24Z"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-[#37B21F] transition"
                    />
                    <path
                      d="M13.35 4.13L15.87 6.64999"
                      stroke="white"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="group-hover:stroke-[#37B21F] transition"
                    />
                  </svg>
                  Add Post
                </Link>
              </div>
              <form onSubmit={handleSubmit}>
                <div
                  style={{
                    backgroundImage: bannerImage
                      ? `url(${API_URL}${bannerImage})`
                      : `url(${BannerImg})`,
                  }}
                  className={`w-full rounded-sm bg-cover bg-no-repeat items-center bg-top`}
                >
                  <div
                    style={{
                      backgroundImage: profileImage
                        ? `url(${API_URL}${profileImage})`
                        : `url(${ProfileImg})`,
                    }}
                    className={`mx-auto flex justify-center w-[141px] h-[141px] bg-blue-300/20 rounded-full bg-cover bg-center bg-no-repeat`}
                  >
                    <div className="bg-white/90 rounded-full w-6 h-6 text-center ml-28 mt-4">
                      <input
                        type="file"
                        name="profileImage"
                        id="profileImage"
                        hidden
                        onChange={handleChange}
                      />

                      <label htmlFor="profileImage">
                        {isUploading ? (
                          <div>Loading...</div>
                        ) : (
                          <svg
                            data-slot="icon"
                            className="w-6 h-5 text-blue-700"
                            fill="none"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                            ></path>
                          </svg>
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <input
                      type="file"
                      name="bannerImage"
                      id="bannerImage"
                      hidden
                      onChange={handleChange}
                    />

                    <div className="bg-white flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                      <label
                        htmlFor="bannerImage"
                        className="inline-flex items-center gap-1 cursor-pointer"
                      >
                        Cover
                        <svg
                          data-slot="icon"
                          className="w-6 h-5 text-blue-700"
                          fill="none"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                          ></path>
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                          ></path>
                        </svg>
                      </label>
                    </div>
                  </div>
                </div>
                <h2 className="text-center mt-1 font-semibold dark:text-gray-300">
                  Upload Profile and Cover Image
                </h2>
                <div className="mb-6">
                  <label
                    htmlFor="first_name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full name
                  </label>
                  <input
                    name="username"
                    type="text"
                    id="first_name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="John"
                    defaultValue={DefaultUserData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email address
                  </label>
                  <input
                    name="email"
                    type="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="john.doe@company.com"
                    defaultValue={DefaultUserData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="job"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Kasbingiz
                  </label>
                  <input
                    name="kasbi"
                    type="text"
                    id="job"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Jurnalist"
                    onChange={handleChange}
                    defaultValue={
                      DefaultUserData?.kasbi ? DefaultUserData?.kasbi : ""
                    }
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Change your Password
                  </label>
                  <input
                    name="password"
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="•••••••••"
                    onChange={handleChange}
                  />
                </div>
                <div className="flex gap-[8px] ">
                  <button
                    type="button"
                    onClick={() => handleLogOut()}
                    className="text-white bg-yellow-700 hover:bg-yellow-800 focus:ring-4 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:focus:ring-yellow-800 flex gap-[6px]"
                  >
                    Hisobni chiqib ketish
                    <span>
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 2.75H18.12C18.9125 2.71467 19.6868 2.9947 20.2734 3.52881C20.86 4.06293 21.2111 4.80763 21.25 5.6V18.4C21.2111 19.1924 20.86 19.9371 20.2734 20.4712C19.6868 21.0053 18.9125 21.2853 18.12 21.25H12"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15 12H2.78"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.75 12L6.75 16"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.75 12L6.75 8"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <button
                    type="button"
                    className="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 flex gap-[6px]"
                    onClick={() => openModal("modelConfirm")}
                  >
                    Hisobni o'chirish{" "}
                    <span className="">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M17.96 5.83002H5.69V19.19C5.69 20.32 6.61001 21.24 7.74001 21.24H15.9C17.03 21.24 17.95 20.32 17.95 19.19V5.83002H17.96Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M3.78998 5.83002H20.21"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.08 2.73999H8.91998V5.81999H15.08V2.73999Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9.94 9.75V17.14"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M14.05 9.75V17.14"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                  <button
                    type="submit"
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex gap-[6px]"
                  >
                    O'zgartirish
                    <span className="flex justify-center items-center">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M6.46001 21.24L21.25 6.45L17.55 2.75L2.75999 17.54L2.75 21.25L6.46001 21.24Z"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M15.35 6.13L17.87 8.64999"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div
        id="modelConfirm"
        className="fixed hidden z-50 inset-0 bg-gray-900 bg-opacity-60 overflow-y-auto h-full w-full px-4 "
      >
        <div className="relative top-40 mx-auto shadow-xl rounded-md bg-white max-w-md">
          <div className="flex justify-end p-2">
            <button
              onClick={() => closeModal("modelConfirm")}
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </button>
          </div>

          <div className="p-6 pt-0 text-center">
            <svg
              className="w-20 h-20 text-red-600 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <h3 className="text-xl font-normal text-gray-500 mt-5 mb-6">
              Are you sure you want to delete this user?
            </h3>
            <a
              href="#"
              onClick={() => handleDeleteAccount()}
              className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-base inline-flex items-center px-3 py-2.5 text-center mr-2"
            >
              Yes, I'm sure
            </a>
            <a
              href="#"
              onClick={() => closeModal("modelConfirm")}
              className="text-gray-900 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-cyan-200 border border-gray-200 font-medium inline-flex items-center rounded-lg text-base px-3 py-2.5 text-center"
              data-modal-toggle="delete-user-modal"
            >
              No, cancel
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
