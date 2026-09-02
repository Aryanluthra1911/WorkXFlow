"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa";

const page = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        setLoading(true);
        try {
            e.preventDefault();
            setError("");
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });
            if (res?.error) {
                toast.error("Invalid email or password. Please try again.");
                setError(res.error);
                setLoading(false);
                return;
            }
            else{
                toast.success("Signed in successfully.");
                router.push("/dashboard");
            }

        } catch (error) {
            console.log(error)
            toast.error("Something went wrong while signing in. Please try again.");
        }finally{
            setLoading(false)

        }
    };

    return (
        <div className="min-h-screen w-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="fixed top-0 left-0 w-full z-50 flex items-center justify-between p-2 px-4">
                <div
                    onClick={() => router.push("/")}
                    className="p-4 text-3xl font-extrabold bg-linear-to-r from-zinc-950 to-zinc-500 text-transparent bg-clip-text cursor-pointer"
                >
                    WorkXflow
                </div>
            </div>

            <div className="w-full flex items-center justify-center px-4">
                <div className="w-full max-w-sm flex flex-col items-center justify-around bg-white rounded-2xl py-6 px-2 shadow-2xl border-2 gap-4">
                    <div className="w-full flex items-center justify-center font-bold text-lg italic">
                        Sign in to your account
                    </div>

                    <div className="w-[88%] h-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-3">
                                <div className="grid gap-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        className="bg-white"
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        className="bg-white"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="w-full flex items-center justify-between text-xs font-semibold pt-3">
                                <a
                                    href="#"
                                    className="underline-offset-4 hover:underline transform transition-all duration-500 text-gray-500 hover:text-black"
                                >
                                    Forgot your password?
                                </a>
                                <div
                                    onClick={() => router.push("/register")}
                                    className="hover:underline transform transition-all duration-500 text-gray-500 hover:text-black cursor-pointer"
                                >
                                    Don't have an account?
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-3" disabled={loading}>
                                {loading ? "Verifying..." : "Signin"}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default page;