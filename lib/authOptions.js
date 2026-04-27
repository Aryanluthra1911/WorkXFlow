import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await prisma.users.findUnique({
                    where: { email: credentials.email }
                });

                if (!user) {
                    throw new Error("User not found");
                }

                const isValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isValid) {
                    throw new Error("Incorrect Password");
                }

                return {
                    id: String(user.id),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    c_name: user.c_name
                };
            }
        })
    ],
    pages: {
        signIn: "/signin"
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.c_name = user.c_name;
                token.email = user.email;
                token.name = user.name;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.c_name = token.c_name;
                session.user.email = token.email;
                session.user.name = token.name;
            }
            return session;
        }
    }
};