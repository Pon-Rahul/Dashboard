

import axios from "axios";
import type { User, Comment } from "../types";

export const fetchUsers = async (): Promise<User[]> => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/users");
  return res.data;
};

export const fetchComments = async (): Promise<Comment[]> => {
  const res = await axios.get("https://jsonplaceholder.typicode.com/comments");
  return res.data;
};
