import { createContext, useState, useEffect, ReactNode } from "react";
import { apiClient } from "../Service/apiClient";

// 🔹 Post interfeysi
interface Post {
  id: number;
  sarlavha: string;
  img: { url: string };
}

// 🔹 Context interfeysi
interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filteredPosts: Post[];
}

// 🔹 Context yaratish
export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

// 🔹 Provider komponenti
export const SearchProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await apiClient.get<{ data: Post[] }>(
          "/api/blogs?blogs?populate[img]=true&populate[categories]=true&populate[user][populate]=*"
        );
        setPosts(data.data);
        setFilteredPosts(data.data);
      } catch (error) {
        console.error("Xatolik:", error);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter((post) =>
      post.sarlavha.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPosts(filtered);
  }, [searchTerm, posts]);

  return (
    <SearchContext.Provider
      value={{ searchTerm, setSearchTerm, filteredPosts }}
    >
      {children}
    </SearchContext.Provider>
  );
};
