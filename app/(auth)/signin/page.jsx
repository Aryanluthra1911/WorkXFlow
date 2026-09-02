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
                toast.error(res.error);
                setError(res.error);
                setLoading(false);
                return;
            }
            else{
                toast.success("signin successfull");
                router.push("/dashboard");
            }
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
            
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen w-screen bg-gradient-to-br from-blue-50 to-white ">
            <div className="w-full h-[10%] bg-white flex items-center justify-between p-2 px-4">
                <div
                    onClick={() => {
                        router.push("/");
                    }}
                    className=" p-4 text-3xl font-extrabold bg-linear-to-r from-zinc-950 to-zinc-500 text-transparent bg-clip-text "
                >
                    WorkXflow
                </div>
                <div
                    onClick={() => {
                        router.push("/");
                    }}
                    className="flex  items-center justify-center gap-1 p-2 font-semibold text-gray-600 hover:text-black transform transition-all duration-500"
                >
                    <FaArrowLeft size={13} />
                    Back
                </div>
            </div>
            <div className="w-full h-[90%] flex items-center justify-center">
                <div className="w-[30%] flex flex-col items-center justify-around bg-white rounded-2xl py-10 shadow-2xl border-2 gap-5">
                    <div
                        className={
                            "w-full flex items-center justify-center font-bold text-xl italic"
                        }
                    >
                        Sign in to your account
                    </div>
                    <div className="w-[85%] h-auto">
                        <form onSubmit={handleSubmit}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        className={"bg-white"}
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">
                                            Password
                                        </Label>
                                        <a
                                            href="#"
                                            className="ml-auto inline-block text-xs underline-offset-4 hover:underline transform transition-all duration-500 text-gray-500 hover:text-black font-semibold"
                                        >
                                            Forgot your password?
                                        </a>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        className={"bg-white"}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                onClick={() => router.push("/register")}
                                className="w-full flex items-center justify-end text-xs font-semibold pt-4 on hover:underline transform transition-all duration-500 text-gray-500 hover:text-black"
                            >
                                Don't have an account?
                            </div>
                            <Button type="submit" className="w-full mt-6">
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
