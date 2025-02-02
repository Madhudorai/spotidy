"use client";

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react";
import Modal from "./Modal";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useRouter } from "next/navigation";
import { FaGithub } from "react-icons/fa";
import { toast } from "react-hot-toast";
import useAuthModal from "@/hooks/useAuthModal";
import { useEffect } from "react";

const AuthModal = () => {
    const supabaseClient = useSupabaseClient();
    const router = useRouter();
    const { session } = useSessionContext();
    const {onClose, isOpen} = useAuthModal();

    useEffect(() => {
        if (session) {
            router.refresh();
            onClose();
        }
    }, [session, router, onClose]);

    const onChange = (open: boolean) => {
        if (!open) {
            onClose();
        }
    };

    const handleOAuthSignIn = async (provider: "github") => {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider,
        });

        if (error) {
            toast.error(`Failed to sign in with ${provider}: ${error.message}`);
        } else {
            toast.success(`Signed in with ${provider}!`);
        }
    };

    return (
        <Modal
            title="Welcome back"
            description=""
            isOpen={isOpen}
            onChange={onChange}
        >
            <div className="flex flex-col gap-4">
                <button
                    onClick={() => handleOAuthSignIn("github")}
                    className="flex items-center justify-center gap-2 bg-gray-900 text-white py-2 px-4 rounded hover:bg-gray-700"
                >
                    <FaGithub size={20} />
                    Sign in with GitHub
                </button>
            </div>
        </Modal>
    );
};

export default AuthModal;
