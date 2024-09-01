"use client";
import { getTODO } from "@/api/getTODO";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: getTODO,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-black">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-8 text-black">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 text-black">
      <div className="mx-auto max-w-5xl">
        <div
          className="mb-8 flex flex-row items-center gap-2 text-4xl font-bold text-amber-900"
          onClick={handleBack}
        >
          <ChevronLeft
            className="h-full rounded-md bg-[#FFF8D8] p-1 transition-all duration-300 ease-in-out hover:scale-105 hover:cursor-pointer hover:brightness-95 active:scale-95"
            size={32}
          />
          Todo List
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.map((item, index) => (
            <div
              key={index}
              className="rounded-xl border-2 border-gray-200 bg-white p-4 shadow-lg transition-shadow hover:shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Todo ID: {item.id}
                </span>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    item.completed
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {item.completed ? "Completed" : "Pending"}
                </span>
              </div>
              <h2 className="text-lg font-medium text-gray-800">
                {item.title}
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                User ID: {item.userId}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
