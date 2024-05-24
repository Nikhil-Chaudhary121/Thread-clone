"use client";

import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import usePreviewImg from "../hooks/usePreviewImg";
import useShowToast from "../hooks/useShowToast";

export default function UserProfileEdit() {
  const [user, setUser] = useRecoilState(userAtom);
  const { handleImgChange, imgUrl } = usePreviewImg();
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  //   console.log(user);
  const [inputs, setInputs] = useState({
    username: user.username,
    name: user.name,
    email: user.email,
    bio: user.bio,
    profilePic: user.profilePic,
    password: "",
  });

  const handlOnSubmit = async (e) => {
    e.preventDefault();
    if (updating) return;
    setUpdating(true);
    // console.log(inputs);
    // const data = {
    //   username: inputs.username,
    //   name: inputs.name,
    //   email: inputs.email,
    //   bio: inputs.bio,
    //   profilePic: imgUrl,
    //   password: inputs.password,
    // };
    // console.log(imgUrl);
    try {
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });
      const data = await res.json();
      console.log(data);
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }
      showToast("Success", "Profile Updated Successfully", "success");
      setUser(data);
      localStorage.setItem("user-threads", JSON.stringify(data));
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

  const fileRef = useRef(null);

  // console.log(inputs);
  return (
    <form onSubmit={handlOnSubmit}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.dark")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={6}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Edit
          </Heading>
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || inputs.profilePic}
                />
              </Center>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImgChange}
                />
              </Center>
            </Stack>
          </FormControl>
          <FormControl id="name">
            <FormLabel>Full Name</FormLabel>
            <Input
              placeholder="Full Name"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              value={inputs.name}
            />
          </FormControl>
          <FormControl id="username">
            <FormLabel>Username</FormLabel>
            <Input
              placeholder="Username"
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              value={inputs.username}
            />
          </FormControl>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="your-email@example.com"
              _placeholder={{ color: "gray.500" }}
              type="email"
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              value={inputs.email}
            />
          </FormControl>
          <FormControl id="bio">
            <FormLabel>Bio</FormLabel>
            <Input
              placeholder="your bio "
              _placeholder={{ color: "gray.500" }}
              type="text"
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              value={inputs.bio}
            />
          </FormControl>
          <FormControl id="password">
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              value={inputs.password}
            />
          </FormControl>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            <Button
              isLoading={updating}
              type="submit"
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
