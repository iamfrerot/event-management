import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/app/lib/mongoDb";
import User, { IUser } from "@/app/models/User";

export const authOptions: NextAuthOptions = {
 session: {
  strategy: "jwt",
 },
 providers: [
  CredentialsProvider({
   name: "Credentials",
   credentials: {
    email: {
     type: "email",
    },
    password: { type: "password" },
   },
   async authorize(credentials) {
    try {
     await connectDB();

     if (!credentials?.email || !credentials?.password) {
      throw new Error("Email and password are required");
     }

     const user: IUser | null = await User.findOne({
      email: credentials.email,
     });

     if (!user) {
      throw new Error("Invalid email or password");
     }

     const isValidPassword = await user.comparePassword(credentials.password);
     if (!isValidPassword) {
      throw new Error("Invalid email or password");
     }

     const { _id, role, email } = user as {
      _id: string;
      role: string;
      email: string;
     };

     return {
      id: _id,
      role: role,
      email: email,
     };
    } catch (error: any) {
     throw new Error(error.message);
    }
   },
  }),
 ],
 callbacks: {
  async jwt({ token, user }) {
   if (user) {
    token.id = user.id;
    token.role = user.role;
   }
   return token;
  },
  async session({ session, token }) {
   session.user.id = token.id;
   session.user.role = token.role;
   return session;
  },
 },
 pages: {
  signIn: "/login",
 },
};
