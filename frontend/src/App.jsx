import { Container } from "@chakra-ui/react";
import { Navigate, Route, Routes } from "react-router-dom";
import PostPage from "./pages/PostPage";
import UserPage from "./pages/UserPage";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import LogOutButton from "./components/LogOutButton";
import UserProfileEdit from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";
import SearchBar from "./components/SearchBar";
function App() {
  const user = useRecoilValue(userAtom);
  // console.log(user);
  return (
    <Container maxWidth={"620px"}>
      <Header />
      <Routes>
        <Route
          path="/"
          element={user ? <HomePage /> : <Navigate to={"/auth"} />}
        />
        <Route
          path="/auth"
          element={!user ? <AuthPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/update"
          element={!user ? <Navigate to={"/auth"} /> : <UserProfileEdit />}
        />
        <Route
          path="/:username"
          element={
            user ? (
              <>
                <UserPage />
                <CreatePost />
              </>
            ) : (
              <UserPage />
            )
          }
        />
        <Route path="/:username/posts/:pid" element={<PostPage />} />
      </Routes>
      {/* {user && <LogOutButton />} */}
      {/* {user && <CreatePost />} */}
      <SearchBar />
    </Container>
  );
}

export default App;
