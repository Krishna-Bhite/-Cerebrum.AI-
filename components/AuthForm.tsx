"use client";
import React from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import FormField from "@/components/FormField";
import { useRouter } from "next/navigation";
import { on } from "events";
import { create } from "domain";
import { auth } from "@/firebase/client";
import { setSessionCookie, signUp } from "@/lib/actions/auth.action";

// const formSchema = z.object({
//   username: z.string().min(2).max(50),
// });

const authFormSchema = (type: FormType) =>
  z.object({
    name:
      type === "sign-up" ? z.string().min(2).max(50) : z.string().optional(),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
  });

const AuthForm = ({ type }: { type: FormType }) => {
  const router = useRouter();

  // 1. Define a schema.
  const formSchema = authFormSchema(type);

  const isSignIn = type === "sign-in";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSuccess = (msg: string) => {
    toast.success(msg, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  const onError = (msg: string) => {
    toast.error(msg, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
  };

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (isSignIn) {
        // Sign in logic
        const { email, password } = values;
        try {
          const veryfiedUser = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );

          // Set the session cookie
          const token = await veryfiedUser.user.getIdToken();
          await setSessionCookie(token);
        } catch (error: any) {
          onError(
            "No account found with this email,\n or the credentials are incorrect."
          );
          return;
        }

        onSuccess("Sign in successful!");
        router.push("/home");
        console.log("Sign in", values);
      } else {
        // Sign up logic
        const { name, email, password } = values;
        try {
          const userCredientials = await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

          const result = await signUp({
            uid: userCredientials.user.uid,
            name: name!,
            email: email,
            password: password,
          });

          if (!result?.success) {
            onError(result?.message);
            return;
          }

          // Set the session cookie
          const token = await userCredientials.user.getIdToken();
          await setSessionCookie(token);

          onSuccess(result.message);
          router.push("/");
          console.log("Sign up", values);
        } catch (error: any) {
          console.log(error);
          onError("User already exists. Please sign in.");
          return;
        }
      }
    } catch (error) {
      console.log(error);
      onError("An error occurred. Please try again.");
    }
  }
  return (
    <div className="card-border lg:min-w-[566px]">
      <div className="flex flex-col gap-6 card py-14 px-10 items-center">
        <div className="flex flex-row gap-2 justify-center items-center">
          <Image src={"/logo.png"} alt="logo" height={60} width={60} />
          <h2 className="text-primary-100">Cerebrum.AI</h2>
        </div>
        <h3>Ace your interview with AI</h3>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 mt-4 form"
          >
            {!isSignIn && (
              <FormField
                control={form.control}
                label="Name"
                placeholder="John Doe"
                name="name"
              />
            )}
            <FormField
              control={form.control}
              label="Email"
              placeholder="johndoe@gmail.com"
              name="email"
            />
            <FormField
              control={form.control}
              label="Password"
              placeholder="Password"
              name="password"
              type="password"
            />
            <Button type="submit" className="btn">
              {isSignIn ? "Signin" : "Create an account"}
            </Button>
          </form>
        </Form>
        <p className="text-center">
          {isSignIn ? "No account yet?" : "Have an account?"}
          <Link
            href={isSignIn ? "/sign-up" : "sign-in"}
            className="ml-2 font-bold text-accent-100"
          >
            {isSignIn ? "Signup" : "Signin"}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
