import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import useShowToast from "../hooks/useShowToast";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";
import SearchResultCard from "./SearchResultCard";

const SearchBar = () => {
  const { username } = useParams();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchText, setSearchText] = useState("");
  const currUser = useRecoilValue(userAtom);
  const [users, setUsers] = useState([]);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(false);
  const handleTextChange = (e) => {
    setSearchText(e.target.value);

    // setPostText(e.target.value);
  };

  const handleOnClose = () => {
    setSearchText("");
    setUsers([]);
    onClose();
  };

  useEffect(() => {
    if (searchText !== "") {
      setLoading(true);
      //   console.log(searchText);
      const findUser = async () => {
        try {
          const res = await fetch(`/api/users/search?username=${searchText}`, {
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
          setUsers(data);
          console.log(data);
        } catch (error) {
          showToast("Error", error, "error");
        } finally {
          setLoading(false);
        }
      };
      findUser();
    }
  }, [searchText]);

  //   const handleCreatePost = async () => {
  // if (loading) return;
  // setLoading(true);
  // try {
  //   const res = await fetch("/api/posts/create", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       postedBy: user._id,
  //       img: imgUrl,
  //       text: postText,
  //     }),
  //   });
  //   const data = await res.json();
  //   if (data.error) {
  //     showToast("Error", data.error, "error");
  //     return;
  //   }
  //   showToast("Success", "Post Created Successfully", "success");
  //   if (username === user.username) {
  //     setPosts([data, ...posts]);
  //     setPostText("");
  //     setRemainingChar(500);
  //   }
  //   onClose();
  // } catch (error) {
  //   showToast("Error", error, "error");
  // } finally {
  //   setLoading(false);
  // }
  //   };

  return (
    <>
      <Button
        pos={"fixed"}
        bg={useColorModeValue("gray.300", "gray.dark")}
        bottom={90}
        right={5}
        size={{ base: "sm", sm: "md" }}
        onClick={onOpen}
      >
        <SearchIcon />
      </Button>
      <Modal isOpen={isOpen} onClose={handleOnClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search By Username</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <Input
                onChange={handleTextChange}
                value={searchText}
                placeholder="Search..."
              />
            </FormControl>
            <Flex mt={6} w={"full"}>
              {loading && (
                <Flex pos={"absolute"} left={"49%"}>
                  <Spinner size={"lg"} />
                </Flex>
              )}
              {!loading && users.length !== 0 && (
                <Flex w={"full"} wrap={"wrap"} gap={4}>
                  {users.map((user) => {
                    if (user._id !== currUser._id) {
                      return <SearchResultCard key={user._id} user={user} />;
                    } else {
                      return;
                    }
                  })}
                  {/* <SearchResultCard />
                <SearchResultCard />
                <SearchResultCard />
                <SearchResultCard /> */}
                </Flex>
              )}
            </Flex>
          </ModalBody>

          <ModalFooter>
            {/* <Button
              isLoading={loading}
              colorScheme="blue"
              mr={3}
              onClick={handleCr4eatePost}
            >
              Post
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchBar;
