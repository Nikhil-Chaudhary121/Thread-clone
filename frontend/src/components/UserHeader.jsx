import {
  Avatar,
  Text,
  Box,
  Flex,
  VStack,
  Link,
  Menu,
  MenuButton,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { CgMoreO } from "react-icons/cg";
import { BsFeather, BsInstagram } from "react-icons/bs";
import userAtom from "../atoms/userAtom";
import { useState } from "react";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const toast = useToast();
  const currUser = useRecoilValue(userAtom);
  // console.log(currUser);
  // if(currUser){
  const [following, setFollowing] = useState(
    user.followers.includes(currUser?._id) || false
  );
  // );}else{
  //    const [following, setFollowing] = useState(false)
  // }
  // }
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);
  // console.log(user );
  const copyUrl = () => {
    const currUrl = window.location.href;
    navigator.clipboard.writeText(currUrl).then(() => {
      toast({
        title: "Copy",
        status: "success",
        description: "Profile link copied",
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const handleFollowUnfollow = async () => {
    if (!currUser) {
      showToast("Error", "Please login to follow ", "error");
      return;
    }
    if (updating) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      if (following) {
        showToast("Success", `Unfollowed ${user.name}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `Followed ${user.name}`, "success");
        user.followers.push(currUser._id);
      }
      console.log(data);
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack gap={4} alignItems={"start"}>
      <Flex justifyContent={"space-between"} w={"full"}>
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
            {user.name}
          </Text>
          <Flex gap={2} alignItems={"center"}>
            <Text
              fontSize={{
                base: "xs",
                md: "sm",
                lg: "md",
              }}
            >
              {user.username}
            </Text>
            <Text
              fontSize={"xs"}
              bg={"gray.dark"}
              color={"gray.light"}
              p={1}
              pt={-1}
              pb={0}
              borderRadius={"full"}
            >
              threads.net
            </Text>
          </Flex>
        </Box>
        <Box>
          {user.profilePic && (
            <Avatar
              name={user.name}
              size={{
                base: "md",
                md: "xl",
              }}
              src={user.profilePic}
            />
          )}
          {!user.profilePic && (
            <Avatar
              name={user.name}
              size={{
                base: "md",
                md: "xl",
              }}
              src="https:/'/bit.ly/broken-link"
            />
          )}
        </Box>
      </Flex>
      <Text>{user.bio}</Text>
      {currUser?._id === user._id && (
        <Link as={RouterLink} to={"/update"}>
          <Button>Update Profile</Button>
        </Link>
      )}
      {currUser?._id !== user._id && (
        <Button isLoading={updating} onClick={handleFollowUnfollow}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}

      <Flex w={"full"} justifyContent={"space-between"}>
        <Flex gap={2} alignItems={"center"}>
          <Text color={"gray.light"}>{user.followers.length} followers</Text>
          <Box w={1} h={1} borderRadius={"full"} bg={"gray.light"}></Box>
          <Link color={"gray.light"}>instagram.com</Link>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <BsInstagram size={24} cursor={"pointer"}></BsInstagram>
          </Box>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor={"pointer"}></CgMoreO>
              </MenuButton>
              <Portal>
                <MenuList bg={"gray.dark"}>
                  <MenuItem bg={"gray.dark"} onClick={copyUrl}>
                    Copy link
                  </MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
      <Flex w={"full"}>
        <Flex
          flex={1}
          justifyContent={"center"}
          borderBottom={"1.5px solid white"}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Threads</Text>
        </Flex>
        <Flex
          flex={1}
          justifyContent={"center"}
          borderBottom={"1px solid gray "}
          pb="3"
          cursor={"pointer"}
        >
          <Text fontWeight={"bold"}>Replies</Text>
        </Flex>
      </Flex>
    </VStack>
  );
};

export default UserHeader;
