"use client";
import Loading from "@/components/Loading";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const [teamCode, setTeamCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const team = localStorage.getItem("team");
    if (team) {
      setTeamCode(team);
    } else {
      toast.error("Something went wrong!");
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setTimeout(() => {
        router.push("/login");
      }, 500);
    }
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [router]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-white">
      <div className="mt-8 w-full max-w-md rounded-lg bg-white p-8">
        <h1 className="mb-6 text-center text-2xl font-semibold leading-7">
          Team Formation
        </h1>

        <div>
          <div className="mb-4">
            <label
              htmlFor="teamCode"
              className="text-sm font-semibold text-gray-700"
            >
              Team Code
            </label>
            <p className="mb-2 text-sm text-gray-600">
              Your teammates can use this code to join you!
            </p>
            <div className="relative">
              <input
                className="w-full rounded-lg border-none bg-gray-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Team code"
                value={teamCode!}
                readOnly
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 -translate-y-1/2 transform rounded bg-gray-200 p-2 hover:bg-gray-300"
                onClick={() => copyToClipboard(teamCode!)}
              >
                <Copy className="text-lg text-gray-600" />
              </button>
            </div>
            <button
              className={`mt-4 w-full rounded-lg bg-[#88DBF9] py-2 font-semibold text-black hover:bg-blue-700`}
              onClick={() => router.push("/")}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
