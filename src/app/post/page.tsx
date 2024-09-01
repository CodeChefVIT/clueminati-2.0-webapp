"use client";
import { createPost, type PostParams } from "@/api/createPost";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useToast from "@/lib/toast";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page: React.FC = () => {
  const toast = useToast();
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const [formData, setFormData] = useState<PostParams>({
    userID: 1,
    title: "",
    body: "",
  });

  const createPostMutation = useMutation({
    mutationKey: ["create-post"],
    mutationFn: (data: PostParams) => createPost(data),
    onSuccess: () => {
      toast.create("Post created successfully", "success");
      setFormData({ userID: 1, title: "", body: "" });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.body) {
      return toast.create("Title and body are required", "error");
    }
    createPostMutation.mutate(formData);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-5xl flex-col p-8 text-black">
      <div
        className="my-0 mb-8 flex max-w-5xl flex-row items-center gap-2 self-start text-4xl font-bold text-amber-900"
        onClick={handleBack}
      >
        <ChevronLeft
          className="h-full rounded-md bg-[#FFF8D8] p-1 transition-all duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:brightness-95 active:scale-95"
          size={32}
        />
        Create Post
      </div>

      <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col items-center justify-center">
        <div className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
          <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
            Create Post
          </h1>
          <Input
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter title"
            className="mb-4 bg-gray-100 text-gray-800 placeholder-gray-500"
          />
          <Input
            name="body"
            value={formData.body}
            onChange={handleInputChange}
            placeholder="Enter body"
            className="mb-4 bg-gray-100 text-gray-800 placeholder-gray-500"
          />
          <Button
            onClick={handleSubmit}
            disabled={createPostMutation.isPending}
            className="w-full bg-[#A0522D] text-white hover:bg-[#8B4513]"
          >
            {createPostMutation.isPending ? (
              <p>Creating Post...</p>
            ) : (
              <p>Create Post</p>
            )}
          </Button>

          {createPostMutation.isError && (
            <p className="mt-4 text-red-500">
              Error creating post: {createPostMutation.error?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
