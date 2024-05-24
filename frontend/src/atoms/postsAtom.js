import { atom } from "recoil";

const postsAtom = atom({
  key: "postAtom",
  default: [],
});

export default postsAtom;
