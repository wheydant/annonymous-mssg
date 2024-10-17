import NextAuth from "next-auth";
import { authOptions } from "./options";

const handler = NextAuth(authOptions)
//All route files must always export with GET or POST verb attached to it.
export {handler as GET, handler as POST}