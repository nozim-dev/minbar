import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface UserType {
  email: string;
  profileImage: {
    url: string;
  };
  kasbi: string;
  username: string;
}

export default function Users() {
  const API = "http://localhost:1337";
  const [users, setUsers] = useState<UserType[]>([]);

  useEffect(() => {
    try {
      axios
        .get("http://localhost:1337/api/users?populate=profileImage")
        .then((response) => {
          console.log(response.data);
          setUsers(response.data);
        });
    } catch (error) {
      console.error("There was an error fetching the users!", error);
    }
  }, []);

  return (
    <ul role="list" className="divide-y divide-gray-100 mt-8">
      {users.map((user) => (
        <Link
          to=":id"
          key={user.email}
          className="flex justify-between items-center gap-x-6 p-2 border border-[transparent] hover:border-gray-300 rounded-md"
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              alt=""
              src={`${API + user.profileImage.url}`}
              className="size-12 flex-none rounded-full bg-gray-50 object-cover"
            />
            <div className="min-w-0 flex items-center">
              <p className="text-sm/6 font-semibold text-gray-900">
                {user.username}
              </p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm/6 text-gray-900">{user.kasbi}</p>
          </div>
        </Link>
      ))}
    </ul>
  );
}
