import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout.tsx";
import SignIn from "./Pages/SignIn.tsx";
import SignUp from "./Pages/SignUp.tsx";
import NavigationLayout from "./Layouts/NavigationLayout.tsx";
import Cart from "./Pages/Cart.tsx";
import Posts from "./Pages/Posts.tsx";
import Profile from "./Pages/Profile.tsx";
import CategoryLayout from "./Layouts/CategoryLayout.tsx";
import Post from "./Pages/Post.tsx";
import Users from "./Pages/Users.tsx";
import User from "./Pages/User.tsx";
import Error from "./Pages/Error.tsx";
import UserPosts from "./Pages/UserPosts.tsx";
import { SearchProvider } from "./Contexts/SearchContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SearchProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />} errorElement={<Error />}>
            <Route
              path="/"
              element={<NavigationLayout />}
              errorElement={<Error />}
            >
              <Route path="/userposts" element={<UserPosts />} />
              <Route
                path="/"
                element={<CategoryLayout />}
                errorElement={<Error />}
              >
                <Route
                  path=":category_id"
                  element={<Posts />}
                  errorElement={<Error />}
                >
                  <Route path=":cart_id" element={<Cart />} />
                </Route>
              </Route>
              <Route path="/post" element={<Post />} />
              <Route path="/users" element={<Users />} errorElement={<Error />}>
                <Route path=":user_id" element={<User />} />
              </Route>
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SearchProvider>
  </StrictMode>
);
