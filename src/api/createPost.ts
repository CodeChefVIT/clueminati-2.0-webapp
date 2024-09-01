import client from "./client/client";

//Define API related types here
export interface PostParams {
  userID: number;
  title: string;
  body: string;
}

//POST REQUEST
export async function createPost(data: PostParams) {
  const response = await client.post<PostParams>("/posts", data);
  return response.data;
}
