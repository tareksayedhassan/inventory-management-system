"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookie from "cookie-universal";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { BASE_URL, REGISTER } from "@/apiCaild/API";
import { registerClient } from "@/utils/ValidationSchemas";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Label } from "@radix-ui/react-label";
import { cn } from "@/lib/utils";

const cookie = Cookie();

function RegisterForm({ className, ...props }: React.ComponentProps<"form">) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState<Record<string, string>>({});

  const handileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const vaildate = registerClient.safeParse({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!vaildate.success) {
      const inputError: Record<string, string> = {};
      vaildate.error.issues.forEach((item) => {
        const errorKey = item.path[0];
        if (typeof errorKey === "string") {
          inputError[errorKey] = item.message;
        }
      });
      setError(inputError);
      return;
    }

    setError({});

    try {
      const res = await axios.post(`${BASE_URL}/${REGISTER}`, {
        name,
        email,
        password,
        confirmPassword,
      });

      const token = res.data.token;

      cookie.set("Bearer", token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
      toast.success("user created sucssuflly");
    } catch (err) {
      const error = err as AxiosError;

      const message =
        typeof error.response?.data === "string"
          ? error.response?.data
          : (error.response?.data as any)?.message;

      if (message === "Email aleady exists") {
        setError((prev) => ({
          ...prev,
          email: "This email is already registered",
        }));
      } else {
        toast.error("Something went wrong, please try again");
      }
    }
  };
  return (
    <>
      <form
        onSubmit={handileSubmit}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">Register Now</h1>
          <p className="text-muted-foreground text-sm text-balance">
            regsiter now in Our website{" "}
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="name"
              placeholder="Enter Your Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {error.name && (
              <div className="bg-red-200 px-4 py-2 mx-1 my-2 rounded-md text-sm flex items-center max-w-md">
                <svg
                  viewBox="0 0 24 24"
                  className="text-red-600 w-4 h-4 sm:w-4 sm:h-4 mr-2"
                >
                  <path
                    fill="currentColor"
                    d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207A11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47a1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                  ></path>
                </svg>
                <p>{error.name}</p>
              </div>
            )}
          </div>{" "}
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error.email && (
            <div className="bg-red-200 px-4 py-2 mx-1 my-2 rounded-md text-sm flex items-center max-w-md">
              <svg
                viewBox="0 0 24 24"
                className="text-red-600 w-4 h-4 sm:w-4 sm:h-4 mr-2"
              >
                <path
                  fill="currentColor"
                  d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207A11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47a1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                ></path>
              </svg>
              <p>{error.email}</p>
            </div>
          )}
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              required
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>
          {error.password && (
            <div className="bg-red-200 px-4 py-2 mx-1 my-2 rounded-md text-sm flex items-center max-w-md">
              <svg
                viewBox="0 0 24 24"
                className="text-red-600 w-4 h-4 sm:w-4 sm:h-4 mr-2"
              >
                <path
                  fill="currentColor"
                  d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207A11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47a1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                ></path>
              </svg>
              <p>{error.password}</p>
            </div>
          )}
          <div className="grid gap-3">
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="********"
              required
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            />
          </div>
          {error.confirmPassword && (
            <div className="bg-red-200 px-4 py-2 mx-1 my-2 rounded-md text-sm flex items-center max-w-md">
              <svg
                viewBox="0 0 24 24"
                className="text-red-600 w-4 h-4 sm:w-4 sm:h-4 mr-2"
              >
                <path
                  fill="currentColor"
                  d="M11.983,0a12.206,12.206,0,0,0-8.51,3.653A11.8,11.8,0,0,0,0,12.207A11.779,11.779,0,0,0,11.8,24h.214A12.111,12.111,0,0,0,24,11.791h0A11.766,11.766,0,0,0,11.983,0ZM10.5,16.542a1.476,1.476,0,0,1,1.449-1.53h.027a1.527,1.527,0,0,1,1.523,1.47a1.475,1.475,0,0,1-1.449,1.53h-.027A1.529,1.529,0,0,1,10.5,16.542ZM11,12.5v-6a1,1,0,0,1,2,0v6a1,1,0,1,1-2,0Z"
                ></path>
              </svg>
              <p>{error.confirmPassword}</p>
            </div>
          )}
          <Button type="submit" className="w-full cursor-pointer">
            register
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a href="/login" className="underline underline-offset-4">
            Log in
          </a>
        </div>
      </form>
    </>
  );
}

export default RegisterForm;
