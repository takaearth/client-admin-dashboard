"use client";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
//ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideLoader, ChevronLeftIcon, SaveIcon } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
//custom
import { cn } from "@/lib/utils";
import { Client } from "@/lib/types";
import useFirebaseClients from "@/hooks/firebase-clients";

const formSchema = z.object({
  name: z.string().min(6).max(50),
});

export function ClientForm({ client }: { client?: Client }) {
  const router = useRouter();
  const { addClient } = useFirebaseClients();

  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="w-full flex justify-between items-center max-w-5xl mx-auto mb-6 md:mb-8">
          <Button size="lg" variant="outline" onClick={() => router.back()}>
            <ChevronLeftIcon className="w-6 h-6" />
            Back
          </Button>
          <Button type="submit" size="lg" variant="default">
            {loading ? <LucideLoader className="h-6 w-6 animate-spin" /> : <SaveIcon className="w-6 h-6" />}
            Create Client
          </Button>
        </div>
        <Card className="w-full max-w-5xl mx-auto pb-10">
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-start">
                <h1 className="text-xl font-semibold">Client Details</h1>
                <p className="text-muted-foreground text-balance text-sm">Fill the form below to create a new client.</p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Client Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Client Name" type="text" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );

  async function handleSubmit(data: Omit<Client, "id">) {
    console.log("data", data);
    setLoading(true);
    toast.promise(addClient(data), {
      loading: "Loading...",
      success: (data: { name: string }) => {
        setLoading(false);
        form.reset();
        return `${data.name} client account created.`;
      },
      error: (error: Error) => {
        setLoading(false);
        if (typeof error.message === "string") {
          return `Error creating client account. Details: ${error.message}`;
        } else {
          return "Error creating client account.";
        }
      },
    });
  }
}
