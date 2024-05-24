import { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
// import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";
import { Flex, Spinner } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUser from "../hooks/useGetUser";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
const UserPage = () => {
  const { user, loading } = useGetUser();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const { username } = useParams();
  const showToast = useShowToast();
  const [fetchingPosts, setFetchingPosts] = useState(true);

  useEffect(() => {
    const getUserPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log(data);
        setPosts(data);
        console.log("Here is the posts from recoil state ", posts);
      } catch (error) {
        showToast("Error", error, "error");
        setPosts([]);
      } finally {
        setFetchingPosts(false);
      }
    };

    getUserPosts();
  }, [username, showToast, setPosts]);
  // console.log(user);
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }
  if (!user && !loading) return <h1>User not found </h1>;
  return (
    <>
      <UserHeader user={user} />
      {!fetchingPosts && posts.length === 0 && (
        <h1>User don't have any post</h1>
      )}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {posts.map((post) => (
        <Post post={post} key={post._id} postedBy={post.postedBy} />
      ))}
    </>
  );
};

export default UserPage;
