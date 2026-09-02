"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import api from "@/lib/axios";
import { FaArrowLeft } from "react-icons/fa";

const page = () => {
    const router = useRouter();
    const [name, setname] = useState("");
    const [c_name, setc_name] = useState("");
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [phoneno, setPhoneNo] = useState("");
    const role = "Admin";
    const [loading, setloading] = useState(false);

    const sendData = async (e) => {
        e.preventDefault();
        setloading(true);
        try {
            const res = await api.post("/registercompany", {
                name: name,
                c_name: c_name,
                email: email,
                password: password,
                role: role,
                phoneno,
            });
            if (res.data.success) {
                toast.success(res.data.message || "Company registered successfully.");
                await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });
                router.push("/dashboard");
            } else {
                toast.error(res.data.message || "Registration failed. Please try again.");
            }
        } catch (err) {
            console.error("register error:", err);
            console.log(err?.response?.data);
            toast.error(err?.response?.data?.message || "Something went wrong while registering. Please try again.");
        } finally {
            setloading(false);
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
                        Register Your Company
                    </div>

                    <div className="w-[88%] h-auto">
                        <form onSubmit={sendData}>
                            <div className="flex flex-col gap-3">
                                <div className="grid gap-1">
                                    <Label htmlFor="Full Name">Full Name</Label>
                                    <Input
                                        className="bg-white"
                                        id="Full Name"
                                        type="text"
                                        placeholder=""
                                        onChange={(e) => setname(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="Company Name">Company Name</Label>
                                    <Input
                                        className="bg-white"
                                        id="Company Name"
                                        type="text"
                                        placeholder=""
                                        onChange={(e) => setc_name(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        className="bg-white"
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        onChange={(e) => setemail(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="PhoneNo">Phone no.</Label>
                                    <Input
                                        className="bg-white"
                                        id="PhoneNo"
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="00000 00000"
                                        value={phoneno}
                                        onChange={(e) =>
                                            setPhoneNo(e.target.value.replace(/\D/g, ""))
                                        }
                                        maxLength={10}
                                        required
                                    />
                                </div>

                                <div className="grid gap-1">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        className="bg-white"
                                        id="password"
                                        type="password"
                                        required
                                        onChange={(e) => setpassword(e.target.value)}
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
                                    onClick={() => router.push("/signin")}
                                    className="hover:underline transform transition-all duration-500 text-gray-500 hover:text-black cursor-pointer"
                                >
                                    Already have an Account?
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-3" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Creating...
                                    </span>
                                ) : (
                                    "Create Account"
                                )}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;