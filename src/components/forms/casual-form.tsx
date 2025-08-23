"use client";
import { z } from "zod";
import Link from "next/link";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
//ui
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LucideLoader, ChevronLeftIcon, SaveIcon } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription, FormMessage } from "@/components/ui/form";
//custom
import { Casual } from "@/lib/types";
import useFirebaseCasuals from "@/hooks/firebase-casuals"; // For add/update operations

const formSchema = z.object({
  name: z.string().min(6).max(50),
  phone: z.string().min(1, "Phone number is required."), // Assuming this will be client ID
  position: z.string().min(1, "Position is required."),
  addressName: z.string().optional(),
  addressCity: z.string().optional(),
  addressDetails: z.string().optional(),
  latitude: z.number({ coerce: true }).optional(), // Coerce to number from input
  longitude: z.number({ coerce: true }).optional(), // Coerce to number from input
});

type CasualFormData = z.infer<typeof formSchema>;

export function CasualForm({ isEditMode = false, loading: casualLoading, error: casualError, casual }: { isEditMode?: boolean; loading?: boolean; error?: any; casual?: Casual }) {
  const router = useRouter();
  const { addCasual, editCasual } = useFirebaseCasuals(); // Assuming these methods exist

  const [loading, setLoading] = useState(false);

  const form = useForm<CasualFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      position: "casual", // Default status for a new casual
      addressName: "",
      addressCity: "",
      addressDetails: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (casual) {
      // If casual prop is provided (edit mode)
      form.reset({
        name: casual.name || "",
        phone: casual.client?.id || "",
        position: casual.position || "casual",
        addressName: casual.address?.name || "",
        addressCity: casual.address?.city || "",
        addressDetails: casual.address?.detail || "",
        latitude: casual.coords?.lat ?? undefined,
        longitude: casual.coords?.lng ?? undefined,
      });
    } else {
      form.reset();
    }
  }, [casual, form.reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="w-full flex justify-between items-center max-w-5xl mx-auto mb-6 md:mb-8">
          <Button size="lg" variant="outline" onClick={() => router.back()}>
            <ChevronLeftIcon className="w-6 h-6" />
            Back
          </Button>
          <Button type="submit" size="lg" variant="default">
            {loading || casualLoading ? <LucideLoader className="h-6 w-6 animate-spin" /> : <SaveIcon className="w-6 h-6" />}
            {isEditMode ? "Update Casual" : "Create Casual"}
          </Button>
        </div>
        <Card className="w-full max-w-5xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
              <div className="flex flex-col items-start md:col-span-3">
                <h1 className="text-xl font-semibold">{isEditMode ? "Edit Casual" : "Create Casual"}</h1>
                <p className="text-muted-foreground text-balance text-sm">Fill the form below to {isEditMode ? "update the" : "create a new"} casual.</p>
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Casual Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Casual Name" type="text" disabled={loading || casualLoading || !!casualError} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Casual Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Casual Phone Number" type="text" disabled={loading || casualLoading || !!casualError} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Casual Position</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select position" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="operator">Operator</SelectItem>
                          <SelectItem value="casual">Casual</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="flex flex-col items-start md:col-span-3">
                <h1 className="text-lg font-medium">Address Details</h1>
              </div>
              <FormField
                control={form.control}
                name="addressName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Address Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Address Name" type="text" disabled={loading || casualLoading || !!casualError} {...field} />
                      </FormControl>
                      <FormDescription>Used for the map tooltip</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="addressCity"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Address City</FormLabel>
                      <FormControl>
                        <Input placeholder="Address City" type="text" disabled={loading || casualLoading || !!casualError} {...field} />
                      </FormControl>
                      <FormDescription>Used for the map tooltip</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="addressDetails"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Address Details</FormLabel>
                      <FormControl>
                        <Input placeholder="Address Details" type="text" disabled={loading || casualLoading || !!casualError} {...field} />
                      </FormControl>
                      <FormDescription>Used for the map tooltip</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <div className="grid md:grid-cols-2 gap-6 md:col-span-3">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Location Latitude</FormLabel>
                        <FormControl>
                          <Input placeholder="Location Latitude" type="number" disabled={loading || casualLoading || !!casualError} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Location Longitude</FormLabel>
                        <FormControl>
                          <Input placeholder="Location Longitude" type="number" disabled={loading || casualLoading || !!casualError} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );

  async function handleSubmit(formData: CasualFormData) {
    setLoading(true);

    // Construct the Casual object for submission
    // This might need adjustment based on your exact Casual type structure

    const casualPayload: Omit<Casual, "id" | "createdAt" | "updatedAt"> & { id?: string } = {
      name: formData.name,
      position: formData.position as Casual["position"], // Cast if position has specific literal types
      address: {
        name: formData.addressName || "",
        city: formData.addressCity || "",
        detail: formData.addressDetails || "",
      },
      coords: {
        lat: formData.latitude ?? 0,
        lng: formData.longitude ?? 0,
      },
    };

    const promise = isEditMode && casual?.id ? editCasual(casual.id, casualPayload) : addCasual(casualPayload as Omit<Casual, "id">);

    toast.promise(promise, {
      loading: `${isEditMode ? "Updating" : "Creating"} casual...`,
      success: (result: any) => {
        setLoading(false);
        if (!isEditMode) form.reset(); // Reset form only on create
        return `Casual ${formData.name} ${isEditMode ? "updated" : "created"} successfully.`;
      },
      error: (error: Error) => {
        setLoading(false);
        return `Error ${isEditMode ? "updating" : "creating"} casual: ${error.message || "Unknown error"}`;
      },
    });
  }
}
