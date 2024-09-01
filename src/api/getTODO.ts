import client from "./client/client";

//Define API related types here
interface PostParams {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

//GET REQUEST
export async function getTODO() {
  const response = await client.get<PostParams[]>("/todos");
  return response.data;
}
