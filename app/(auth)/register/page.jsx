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
    const [phoneno,setPhoneNo] = useState("")
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
                phoneno
            });
            if (res.data.success) {
                toast.success(res.data.message);
                await signIn("credentials", {
                    redirect: false,
                    email,
                    password,
                });
                router.push("/dashboard");
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            console.error("register error:", err);
            console.log(err?.response?.data);
            toast.error(err?.response?.data?.message);
        } finally {
            setloading(false);
        }
    };
    return (
        <div className=" h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-white ">
            <div className="w-full h-[10%] bg-white flex items-center justify-between p-2 px-4">
                <div onClick={()=>{
                    router.push("/")
                }} className=" p-4 text-3xl font-extrabold bg-linear-to-r from-zinc-950 to-zinc-500 text-transparent bg-clip-text ">
                    WorkXflow
                </div>
                <div onClick={()=>{
                    router.push("/")
                }} className="flex  items-center justify-center gap-1 p-2 font-semibold text-gray-600 hover:text-black transform transition-all duration-500">
                    <FaArrowLeft size={13}/>
                    Back
                </div>
            </div>
            <div className="w-full h-[90%] flex items-center justify-center">
                <div className="w-[33%] flex flex-col items-center justify-around bg-white rounded-2xl py-10 shadow-2xl border-2 gap-5">
                    <div
                        className={
                            "w-full flex items-center justify-center font-bold text-xl italic"
                        }
                    >
                        Register Your Company
                    </div>
                    <div className="w-[85%] h-auto">
                        <form onSubmit={sendData}>
                            <div className="flex flex-col gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="Full Name">Full Name</Label>
                                    <Input
                                        className={"bg-white"}
                                        id="Full Name"
                                        type="Full Name"
                                        placeholder=""
                                        onChange={(e) =>
                                            setname(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="Company Name">
                                        Company Name
                                    </Label>
                                    <Input
                                        className={"bg-white"}
                                        id="Company Name"
                                        type="Company Name"
                                        placeholder=""
                                        onChange={(e) =>
                                            setc_name(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        className={"bg-white"}
                                        id="email"
                                        type="email"
                                        placeholder="name@company.com"
                                        onChange={(e) =>
                                            setemail(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="Company Name">
                                        Phone no.
                                    </Label>
                                    <Input
                                        className={"bg-white"}
                                        id="PhoneNo"
                                        type="tel"
                                        inputMode="numeric"
                                        placeholder="00000 00000"
                                        value={phoneno}
                                        onChange={(e) =>
                                            setPhoneNo(
                                                e.target.value.replace(/\D/g, "")
                                            )
                                        }
                                        maxLength={10}
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
                                        className={"bg-white"}
                                        id="password"
                                        type="password"
                                        required
                                        onChange={(e) =>
                                            setpassword(e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div
                                onClick={() => router.push("/signin")}
                                className="w-full flex items-center justify-end text-xs font-semibold pt-4 on hover:underline transform transition-all duration-500 text-gray-500 hover:text-black"
                            >
                                Already have an Account?
                            </div>
                            <Button type="submit" className="w-full mt-6" disabled={loading}>
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
