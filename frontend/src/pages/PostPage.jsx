import {
  Avatar,
  Flex,
  Text,
  Image,
  Box,
  Divider,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "../components/Actions";
import { useEffect, useState } from "react";
import Comment from "../components/Comment";
import useGetUser from "../hooks/useGetUser";
import useShowToast from "../hooks/useShowToast";
import { useNavigate, useParams } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
// import postsAtom from "../atoms/postsAtom";

const PostPage = () => {
  const { pid } = useParams();
  const { user, loading } = useGetUser();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const showToast = useShowToast();
  const currUser = useRecoilValue(userAtom);
  const [liked, setLiked] = useState(false);
  const currPost = posts[0];
  console.log(user);
  const navigate = useNavigate();

  const handleDeletePost = async () => {
    if (!window.confirm("Are you sure you want to delete the post ? ")) return;

    try {
      const res = await fetch(`/api/posts/${currPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      navigate(`/${user.username}`);
      showToast("Success", "Post Deleted Successfully", "success");
      //   window.location.reload();
    } catch (error) {
      showToast("Error", error, "error");
    }
  };

  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log(data);
        setPosts([data]);
        // console.log("Posts From recoil state ");
      } catch (error) {
        console.log(error);
      }
    };
    getPost();
  }, [pid, showToast, setPosts]);

  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={16} />
      </Flex>
    );
  }

  if (!currPost) return null;

  return (
    <>
      <Flex>
        <Flex w={"full"} alignItems={"center"} gap={3}>
          <Avatar src={user.profilePic} size={"md"} name={user.name} />
          <Flex alignItems={"center"}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
              {user.username}
            </Text>
            <Image src="/verified.png" w={4} h={4} ml={4} mt={1} />
          </Flex>
        </Flex>
        <Flex alignItems={"center"} gap={4}>
          <Text
            fontSize={"sm"}
            width={36}
            textAlign={"right"}
            color={"gray.light"}
          >
            {formatDistanceToNow(new Date(currPost.createdAt))} ago
          </Text>
          {/* <BsThreeDots /> */}
          {currUser?._id === user._id && (
            <DeleteIcon onClick={handleDeletePost} />
          )}
        </Flex>
      </Flex>

      <Text my={3}>{currPost.text}</Text>

      <Box
        borderRadius={6}
        overflow={"hidden"}
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        {currPost.img && <Image src={currPost.img} w={"full"} />}
      </Box>

      <Flex gap={3} my={3}>
        <Actions post={currPost} />
      </Flex>

      <Divider my={3} />
      {/* 
      <Flex justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text fontSize={"2xl"}>👋</Text>
          <Text color={"gray.light"}>Get the app to like, reply and post</Text>
        </Flex>
        <Button>Get</Button>
      </Flex> */}

      {/* <Divider my={4} />- */}

      {currPost.replies.map((reply) => (
        <Comment
          key={reply._id}
          reply={reply}
          lastReply={
            reply._id === currPost.replies[currPost.replies.length - 1]._id
          }
        />
      ))}
      {/* <Comment
        reply={reply}
        lastReply={lastReply}
      /> */}
      {/*<Comment
        createdAt={"1d"}
        comment={"Yeah we have to talk about this"}
        likes={63}
        avatar={"https://bit.ly/sage-adebayo"}
        username={"john doe"}
      />
      <Comment
        createdAt={"1d"}
        comment={"Ai can't replace us"}
        likes={130}
        avatar={"https://bit.ly/prosper-baba"}
        username={"IamHuman"}
      />
      <Comment
        createdAt={"1d"}
        comment={"I am do this all day"}
        likes={18}
        avatar={"https://bit.ly/kent-c-dodds"}
        username={"Steve"}
      />
      <Comment
        createdAt={"1d"}
        comment={"I love using ai during work, Ai can make our work eassy"}
        likes={83}
        username={"dhruv"}
        avatar={"https://bit.ly/ryan-florence"}
      /> */}
    </>
  );
};

export default PostPage;
