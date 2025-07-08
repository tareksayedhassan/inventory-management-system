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
      cookie.set("Bearer", token);
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
          <Button type="submit" className="w-full">
            register
          </Button>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>
          <Button variant="outline" className="w-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
                fill="currentColor"
              />
            </svg>
            Login with GitHub
          </Button>
        </div>
        <div className="text-center text-sm">
          Don&apos;t have an account?{" "}
          <a href="#" className="underline underline-offset-4">
            Sign up
          </a>
        </div>
      </form>
    </>
  );
}

export default RegisterForm;
