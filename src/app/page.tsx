import Image from "next/image";
import Link from "next/link";
import logo from "../../public/cc-logo.svg";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-xl rounded-lg bg-white p-8 text-center text-black shadow-lg">
        <Image
          src={logo as HTMLImageElement}
          alt="CodeChef-VIT Logo"
          width={150}
          height={150}
          className="mx-auto mb-4"
        />
        <h1 className="mb-4 text-6xl font-bold">CodeChef-VIT</h1>
        <p className="mb-6 text-2xl">Portal Template Repository</p>
        <p className="mb-2 text-lg font-semibold text-gray-700">
          TanStack Query is Initialised in this Repository
        </p>
        <div className="flex flex-row gap-2">
          <Link
            href="/todo"
            className="mx-auto w-fit rounded-md bg-gray-100 p-3 text-lg font-medium text-indigo-600 transition-all duration-200 hover:bg-gray-200 hover:text-indigo-800 active:scale-95"
          >
            Sample GET Request
          </Link>
          <Link
            href="/post"
            className="mx-auto w-fit rounded-md bg-gray-100 p-3 text-lg font-medium text-indigo-600 transition-all duration-200 hover:bg-gray-200 hover:text-indigo-800 active:scale-95"
          >
            Sample POST Request
          </Link>
        </div>

        <div className="mt-2">
          <p className="text-lg font-semibold text-gray-700">
            Shadcn is Initialised in this Repository
          </p>
          <p className="mt-4 text-gray-700">
            Custom toast hook is created. You can use it by importing{" "}
            <code className="rounded bg-gray-100 p-1">useToast</code> from{" "}
            <code className="rounded bg-gray-100 p-1">
              &quot;@/lib/toast.tsx&quot;
            </code>{" "}
            and then calling the create method with message and type as
            arguments.
          </p>
          <div className="mt-4 text-gray-700">
            <p>Example: </p>
            <div className="rounded-md bg-gray-100 p-2 text-left">
              <p>
                <span className="text-blue-600">const</span>{" "}
                <span className="text-green-600">toast</span> ={" "}
                <span className="text-blue-600">useToast</span>();
              </p>
              <p>
                <span className="text-green-600">toast</span>.
                <span className="text-blue-600">create</span>(
                <span className="text-red-600">&quot;Hello World&quot;</span>,{" "}
                <span className="text-red-600">&quot;success&quot;</span>);
              </p>
            </div>
          </div>
          <p className="mt-4 text-gray-700">
            There are 3 variants configured:{" "}
            <span className="font-bold">success</span>,{" "}
            <span className="font-bold">error</span>, and{" "}
            <span className="font-bold">info</span>.
          </p>
          <p className="mt-4 text-gray-700">
            You can add more in{" "}
            <code className="rounded bg-gray-100 p-1">toast.tsx</code> file
          </p>
        </div>
      </div>
    </main>
  );
}
