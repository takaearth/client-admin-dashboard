"use client";
import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
//ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideEye, LucideEyeOff, LucideLoader } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
//custom
import { cn } from "@/lib/utils";
import { Credentials } from "@/lib/types";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(50),
});

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">Welcome back</h1>
                  <p className="text-muted-foreground text-balance">Login to your Acme Inc account</p>
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Email Address" type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <div className="flex w-full items-center space-x-2">
                            <Input type={visible ? "text" : "password"} placeholder="password" {...field} />
                            <Button onClick={toggleVisibility} variant="outline">
                              {visible ? <LucideEye className="h-4 w-4" /> : <LucideEyeOff className="h-4 w-4" />}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {error && <p className="text-destructive text-xs italic text-center mt-1">{error}</p>}
                <Button size="lg" type="submit" className="w-full mt-6">
                  {loading ? <LucideLoader className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Login
                </Button>
              </div>
            </form>
          </Form>
          <div className="bg-muted relative hidden md:block">
            <Image fill alt="logo" src="/images/taka/bin-yellow.png" className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale" />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );

  async function handleSubmit(data: Credentials) {
    setLoading(true);
    const res: any = await signIn("credentials", {
      ...data,
      callbackUrl: callbackUrl || "/dashboard",
    });

    if (res) setLoading(false);
  }

  function toggleVisibility(event: any) {
    event.preventDefault();
    setVisible((prevState) => {
      return !prevState;
    });
  }
}
