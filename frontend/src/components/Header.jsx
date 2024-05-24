import { Button, Center, Flex, Image, useColorMode } from "@chakra-ui/react";
import userAtom from "../atoms/userAtom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";

import { AiFillHome } from "react-icons/ai";
import { FiLogOut } from "react-icons/fi";
import useLogout from "../hooks/useLogout";
import authScreenAtom from "../atoms/AuthAtom";

const Header = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const setAuthScreen = useSetRecoilState(authScreenAtom);
  const logout = useLogout();
  const user = useRecoilValue(userAtom);
  return (
    <Flex justifyContent={"space-between"} mt={6} mb={12}>
      {user && (
        <Link to={"/"}>
          <AiFillHome size={24} />
        </Link>
      )}
      {!user && (
        <Link
          to={"/auth"}
          onClick={() => {
            setAuthScreen("login");
          }}
        >
          Login
        </Link>
      )}
      <Image
        cursor={"pointer"}
        alt="logo"
        w={6}
        src={colorMode === "dark" ? "/light-logo.svg" : "/dark-logo.svg"}
        onClick={toggleColorMode}
      />
      {!user && (
        <Link
          to={"/auth"}
          onClick={() => {
            setAuthScreen("signup");
          }}
        >
          Sign up
        </Link>
      )}
      {user && (
        <Flex alignItems={"center"} gap={4}>
          <Link to={`/${user.username}`}>
            <RxAvatar size={24} />
          </Link>
          <Button size={"xs"} onClick={logout}>
            <FiLogOut size={20} />
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
