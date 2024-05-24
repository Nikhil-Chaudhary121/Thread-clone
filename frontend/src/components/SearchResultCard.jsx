import { Avatar, Button, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const SearchResultCard = ({ user }) => {
  return (
    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
      <Link to={`/${user.username}`}>
        <Flex justifyContent={"center"} gap={5} alignItems={"center"}>
          <Avatar src={user.profilePic} cursor={"pointer"} />
          <Text fontSize={"lg"} cursor={"pointer"}>
            {user.username}
          </Text>
        </Flex>
      </Link>
      <Link to={`/${user.username}`}>
        <Button>View Profile</Button>
      </Link>
    </Flex>
  );
};

export default SearchResultCard;
