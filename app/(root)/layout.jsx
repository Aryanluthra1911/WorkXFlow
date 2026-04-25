import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ProtectedShell from "./ProtectedShell";
import { FaUser } from "react-icons/fa"

export default async function ProtectedRoutesLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return <div className="h-screen w-screen bg-[#f3f4f6] flex justify-center items-center">
      <div className="h-[50%] w-[40%] bg-white rounded-2xl  flex flex-col justify-evenly items-center shadow-xl">
        <div className="w-20 h-20 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-full flex justify-center items-center">
          <FaUser size={30} className="text-white"/>
        </div>
        <div className="text-3xl text-black font-bold">
          User Not Authenticated 
        </div>
        <div className=" w-[70%] h-10 text-sm text-[#718096] font-light text-center">
          It looks like you're not logged in. Please sign in to access this page and continue your journey.
        </div>
        <Link
            href="/signin"
            className="text-md px-6 py-2 bg-gradient-to-br from-[#667eea] to-[#764ba2] rounded-2xl text-white font-semibold"
          >
            Sign In
          </Link>
      </div>
    </div>
  }
  return <ProtectedShell>{children}</ProtectedShell>;
}
