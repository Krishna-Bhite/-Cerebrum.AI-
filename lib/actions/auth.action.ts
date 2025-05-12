"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";
import { set } from "react-hook-form";

//session cookie
export const setSessionCookie = async (token: string) => {
  const cookieStore = await cookies();

  const setSessionCookie = await auth.createSessionCookie(token, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
  });

  cookieStore.set("session", setSessionCookie, {
    maxAge: 60 * 60 * 24 * 5 * 1000, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
};

// Sign up
export const signUp = async (params: SignUpParams) => {
  const { uid, name, email, password } = params;

  try {
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error: any) {
    console.log("Error signing up:", error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};

// Sign in but non functional handeled in Authform.tsx only
// export const signIn = async (params: SignInParams) => {
//   const { email, idToken } = params;

//   try {
//     const userRecord = await auth.getUserByEmail(email);

//     if (!userRecord) {
//       return {
//         success: false,
//         message: "User not found. Please sign up.",
//       };
//     }

//     await setSessionCookie(idToken);
//   } catch (error: any) {
//     console.log("Error signing in:", error.message);
//     return {
//       success: false,
//       message: error.message,
//     };
//   }
// };

// For gettiong the user and rout protectection
export const getUser = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedClaims.uid)
      .get();

    if (!userRecord.exists) {
      return null;
    }

    return {
      id: userRecord.id,
      ...userRecord.data(),
    };
  } catch (error: any) {
    console.log("Error getting user:", error.message);
    return null;
  }
};

//Easy funct to check user exist or not
export const isAuthenticated = async () => {
  const user = await getUser();
  if (!user) {
    return false;
  }
  return true;
}