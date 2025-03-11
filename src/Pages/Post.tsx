import { PhotoIcon } from "@heroicons/react/16/solid";
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
interface PostType {
  title: string;
  categories: (number | string)[];
  description: string;
  image: any;
}
interface UserType {
  documentId: string;
  username?: string;
  jwt?: string;
  email?: string;
  id?: number;
}

export default function Post() {
  const notify = (text: string, position: any) =>
    toast(text, {
      type: position,
    });
  const categoryMap = {
    Talim: 1,
    Siyosat: 4,
    Tibbiyot: 6,
    Texnalogiya: 8,
  };
  const [postData, setPostData] = useState<PostType>({
    title: "",
    categories: [],
    description: "",
    image: "",
  });
  const [user, setUser] = useState<UserType>({
    documentId: "",
    username: "",
    jwt: "",
    email: "",
    id: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  // localStoragedan userga tegishli ma'lumotlarni olib keladi.
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  // .env fayldan api ssilkasini ushlaydi
  const API_URL = import.meta.env.VITE_API_URL;
  // Apini bitta callback funksiyaga oldim qayta ishlatish oson bo'lishi uchun.
  const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${userData.jwt}`,
    },
  });

  // Foydalanuvchi ma'lumotlarini olib kelib statega saqlaydi
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const { data } = await apiClient.get("/api/users/me");
        setUser(data);
      } catch (error: any) {
        console.error("Error fetching profile data:", error.message);
      }
    };
    getProfileData();
  }, [userData.jwt]);

  // Post qiladi
  const CreatePost = async (e: any) => {
    e.preventDefault();

    try {
      console.log(postData.categories);

      const newPost = await axios.post(
        `${API_URL}/api/blogs?populate=*`,
        {
          data: {
            sarlavha: postData.title,
            img: postData.image,
            matn: postData.description,
            categories: postData.categories.map((cat: any) => ({ id: cat })),
            user: { id: user?.id },
          },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );
      console.log("Post created successfully:", newPost.data);
      e.target.reset();
      notify("Post muvaffaqiyatli tarzda yaratildi!", "success");
    } catch (error: any) {
      console.error(
        "Error creating post:",
        error.response?.data || error.message
      );
      notify(error.response?.data || error.message, "error");
    }
  };

  // Input kiritilgan ma'lumotlarni statemizga saqlaydi
  const HandleInputValue = async ({
    target,
  }: React.ChangeEvent<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >) => {
    const { name, value } = target as HTMLInputElement;
    const files = (target as HTMLInputElement).files;

    if (name === "categories") {
      // Select (multiple) elementidan tanlangan barcha qiymatlarni olish
      const selectedOptions = Array.from(
        (target as HTMLSelectElement).selectedOptions
      ).map(
        (option) =>
          categoryMap[option.value as keyof typeof categoryMap] || option.value
      );

      setPostData((currentPost) => ({
        ...currentPost,
        categories: selectedOptions,
      }));
    } else if (files && files[0]) {
      const formData = new FormData();
      formData.append("files", files[0]);

      console.log("Uploading file:", files[0]);

      try {
        const uploadRes = await axios.post(`${API_URL}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        });

        console.log("Upload response:", uploadRes.data);

        const uploadedFile = uploadRes.data?.[0]; // Fayl obyektini olish
        if (!uploadedFile?.id || !uploadedFile?.url) {
          throw new Error("Failed to retrieve uploaded file data");
        }

        setPostData((currentPost) => ({
          ...currentPost,
          [name]: [{ id: uploadedFile.id, url: uploadedFile.url }], // ID va URL saqlanadi
        }));
        setLoading(false);
      } catch (error: any) {
        console.error("Error uploading file:", error.message);
      }
    } else {
      setPostData((currentPost) => ({
        ...currentPost,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={CreatePost} className="mt-[20px]">
      <ToastContainer theme="colored" hideProgressBar={false} />
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-[42px] font-semibold text-gray-900">Post</h2>
          <p className="mt-1 text-sm/6 text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="w-full mt-10 flex gap-x-6 gap-y-8 justify-between">
              <div className="w-full">
                <label
                  htmlFor="title"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Title of Post
                </label>
                <div className="mt-2">
                  <input
                    id="title"
                    name="title"
                    type="text"
                    onChange={(e) =>
                      HandleInputValue(
                        e as React.ChangeEvent<
                          HTMLInputElement | HTMLSelectElement
                        >
                      )
                    }
                    required
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                </div>
              </div>
              <div className="w-full max-w-[250px]">
                <label
                  htmlFor="category"
                  className="block text-sm/6 font-medium text-gray-900"
                >
                  Category
                </label>
                <div className="mt-2 grid grid-cols-1">
                  <select
                    id="category"
                    name="categories"
                    autoComplete="category-name"
                    required
                    onChange={HandleInputValue}
                    multiple
                    className="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  >
                    <option value="Talim">Ta'lim</option>
                    <option value="Siyosat">Siyosat</option>
                    <option value="Tibbiyot">Tibbiyot</option>
                    <option value="Texnalogiya">Texnalogiya</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="description"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Description
              </label>
              <div className="mt-2">
                <textarea
                  id="description"
                  name="description"
                  rows={8}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  defaultValue={""}
                  required
                  onChange={HandleInputValue}
                />
              </div>
              <p className="mt-3 text-sm/6 text-gray-600">
                Write a few sentences about your post.
              </p>
            </div>
            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Photo
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    aria-hidden="true"
                    className="mx-auto size-12 text-gray-300"
                  />
                  <div className="mt-4 flex text-sm/6 text-gray-600">
                    <label
                      htmlFor="image"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="image"
                        name="image"
                        type="file"
                        className="sr-only"
                        required
                        onChange={HandleInputValue}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs/5 text-gray-600">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <Link
          to="/profile"
          type="button"
          className="text-sm/6 font-semibold text-gray-900"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Create post
        </button>
      </div>
    </form>
  );
}
