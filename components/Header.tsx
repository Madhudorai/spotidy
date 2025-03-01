"use client";

import { useRouter } from "next/navigation";
import { twMerge } from "tailwind-merge";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";
import { HiHome } from "react-icons/hi";
import { BiSearch } from "react-icons/bi";
import Button from "./Button";
import useAuthModal from "@/hooks/useAuthModal";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { FaUserAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface HeaderProps {
	children: React.ReactNode;
	className?: string;
}

const Header: React.FC<HeaderProps> = ({ children, className }) => {
   const authModal = useAuthModal();
   const router = useRouter();

   const supabaseClient = useSupabaseClient();
   const { user } = useUser();

   const handleLogout = async () => {
      try {
          // Step 1: Sign out the user from Supabase
          const { error } = await supabaseClient.auth.signOut();
          if (error) {
              toast.error(`Error logging out: ${error.message}`);
              return;
          }
  
          // Step 2: Clear GitHub cookies by sending a request to your server or
          // refreshing the session without relying on GitHub cache
          await supabaseClient.auth.refreshSession();
  
          // Step 3: Navigate back to the login page or refresh the application state
          router.push("/");
          toast.success("Logged out successfully!");
      } catch (err) {
          toast.error("Unexpected error during logout.");
          console.error(err);
      }
  };  

	return (
		<div className={twMerge("h-fit bg-gradient-to-b from-blue-800 p-6", className)}>
			<div className="w-full mb-4 flex items-center justify-between">
				<div className="hidden md:flex gap-x-2 items-center">
					<button
						onClick={() => router.back()}
						className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
					>
						<RxCaretLeft size={35} className="text-white" />
					</button>
					<button
						onClick={() => router.forward()}
						className="rounded-full bg-black flex items-center justify-center hover:opacity-75 transition"
					>
						<RxCaretRight size={35} className="text-white" />
					</button>
				</div>
				<div className="flex md:hidden gap-x-2 items-center">
					<button
						className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
					>
						<HiHome className="text-black" size={20} />
					</button>
					<button
						className="rounded-full p-2 bg-white flex items-center justify-center hover:opacity-75 transition"
					>
						<BiSearch className="text-black" size={20} />
					</button>
				</div>
				<div className="flex justify-between items-center gap-x-4">
					{user ? (
						<div className="flex gap-x-4 items-center">
							<Button onClick={handleLogout} className="bg-white px-6 py-2">
								Logout
							</Button>
							{/* Tooltip on hover */}
							<div className="relative group">
								<Button className="bg-white">
									<FaUserAlt />
								</Button>
								<div className="
                        absolute 
                        left-1/2 
                        -translate-x-1/2 
                        mt-2 
                        w-max
                        max-w-xs
                        px-4 
                        py-2 
                        bg-gray-800 
                        text-white 
                        text-sm 
                        rounded 
                        opacity-0 
                        group-hover:opacity-100 
                        transition-opacity 
                        break-words
                        z-50
                     "
                        style={{ whiteSpace: "nowrap" }}>
                        {user.email}
                     </div>
							</div>
						</div>
					) : (
						<Button
							onClick={authModal.onOpen}
							className="bg-white px-6 py-2"
						>
							Log in
						</Button>
					)}
				</div>
			</div>
			{children}
		</div>
	);
};

export default Header;
