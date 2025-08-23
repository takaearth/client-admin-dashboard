"use client";
import { z } from "zod";
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
import { Smartbin } from "@/lib/types";
import useFirebaseClients from "@/hooks/firebase-clients"; // For fetching clients
import useFirebaseSmartbins from "@/hooks/firebase-smartbins"; // For add/update operations

const formSchema = z.object({
  assignedId: z.string().min(6).max(50),
  client: z.string().optional(), // Assuming this will be client ID
  status: z.string().min(1, "Status is required."),
  addressName: z.string().optional(),
  addressCity: z.string().optional(),
  addressDetails: z.string().optional(),
  latitude: z.number({ coerce: true }).optional(), // Coerce to number from input
  longitude: z.number({ coerce: true }).optional(), // Coerce to number from input
});

type SmartbinFormData = z.infer<typeof formSchema>;

export function SmartbinForm({
  isEditMode = false,
  loading: smartbinLoading,
  error: smartbinError,
  smartbin,
}: {
  isEditMode?: boolean;
  loading?: boolean;
  error?: any;
  smartbin?: Smartbin;
}) {
  const router = useRouter();
  const { clients, loading: clientsLoading, error: clientsError } = useFirebaseClients();
  const { addSmartbin, editSmartbin } = useFirebaseSmartbins(); // Assuming these methods exist

  const [loading, setLoading] = useState(false);

  const form = useForm<SmartbinFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assignedId: "",
      client: "",
      status: "storage", // Default status for a new smartbin
      addressName: "",
      addressCity: "",
      addressDetails: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  useEffect(() => {
    if (smartbin) {
      // If smartbin prop is provided (edit mode)
      form.reset({
        assignedId: smartbin.assignedId || "",
        client: smartbin.client?.id || "",
        status: smartbin.status || "storage",
        addressName: smartbin.address?.name || "",
        addressCity: smartbin.address?.city || "",
        addressDetails: smartbin.address?.detail || "",
        latitude: smartbin.coords?.lat ?? undefined,
        longitude: smartbin.coords?.lng ?? undefined,
      });
    } else {
      form.reset();
    }
  }, [smartbin, form.reset]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="w-full flex justify-between items-center max-w-5xl mx-auto mb-6 md:mb-8">
          <Button size="lg" variant="outline" onClick={() => router.back()}>
            <ChevronLeftIcon className="w-6 h-6" />
            Back
          </Button>
          <Button type="submit" size="lg" variant="default">
            {loading || smartbinLoading ? <LucideLoader className="h-6 w-6 animate-spin" /> : <SaveIcon className="w-6 h-6" />}
            {isEditMode ? "Update Smartbin" : "Create Smartbin"}
          </Button>
        </div>
        <Card className="w-full max-w-5xl mx-auto">
          <CardContent className="p-6 md:p-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 items-start">
              <div className="flex flex-col items-start md:col-span-3">
                <h1 className="text-xl font-semibold">{isEditMode ? "Edit Smartbin" : "Create Smartbin"}</h1>
                <p className="text-muted-foreground text-balance text-sm">Fill the form below to {isEditMode ? "update the" : "create a new"} smartbin.</p>
              </div>
              <FormField
                control={form.control}
                name="assignedId"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Smartbin Assigned ID</FormLabel>
                      <FormControl>
                        <Input placeholder="Smartbin Name" type="text" disabled={loading || smartbinLoading || !!smartbinError} {...field} />
                      </FormControl>
                      <FormDescription>This field is very important. Ensure the assignedId is correct and unique.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="client"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Smartbin Client</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a client" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {clientsLoading && (
                            <SelectItem value="loading" disabled>
                              Loading clients...
                            </SelectItem>
                          )}
                          {clientsError && (
                            <SelectItem value="error" disabled>
                              Error loading clients
                            </SelectItem>
                          )}
                          {!clientsLoading &&
                            !clientsError &&
                            clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>If client isnt on this list, check the clients data table.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Smartbin Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select bin status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="deployed">
                            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-green-500 dark:bg-green-400"></span>Deployed
                          </SelectItem>
                          <SelectItem value="maintenance">
                            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-yellow-500 dark:bg-yellow-400"></span>Under Maintenance
                          </SelectItem>
                          <SelectItem value="storage">
                            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-purple-500 dark:bg-purple-400"></span>Storage
                          </SelectItem>
                          <SelectItem value="deactivated">
                            <span className="inline-block w-2 h-2 mr-2 rounded-full bg-red-500 dark:bg-red-400"></span>Deactivated
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>This field is very important. Dont change if unconfirmed.</FormDescription>
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
                        <Input placeholder="Address Name" type="text" disabled={loading || smartbinLoading || !!smartbinError} {...field} />
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
                        <Input placeholder="Address City" type="text" disabled={loading || smartbinLoading || !!smartbinError} {...field} />
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
                        <Input placeholder="Address Details" type="text" disabled={loading || smartbinLoading || !!smartbinError} {...field} />
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
                          <Input placeholder="Location Latitude" type="number" disabled={loading || smartbinLoading || !!smartbinError} {...field} />
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
                          <Input placeholder="Location Longitude" type="number" disabled={loading || smartbinLoading || !!smartbinError} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex flex-col items-center w-full md:col-span-3">
                {(smartbinLoading || clientsLoading) && (
                  <div className="flex items-center text-muted-foreground mt-4">
                    <LucideLoader className="h-4 w-4 animate-spin mr-2" /> Loading data...
                  </div>
                )}
                {(smartbinError || clientsError) && <p className="text-destructive text-sm mt-4">Error loading data: {smartbinError?.message || clientsError?.message}</p>}
              </div>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );

  async function handleSubmit(formData: SmartbinFormData) {
    setLoading(true);

    // Construct the Smartbin object for submission
    // This might need adjustment based on your exact Smartbin type structure

    //find client object
    const client = clients.find((client) => client.id === formData.client);

    const smartbinPayload: Omit<Smartbin, "id" | "createdAt" | "updatedAt" | "address.country"> & { id?: string } = {
      assignedId: formData.assignedId,
      client: {
        id: client?.id || "Unassigned",
        name: client?.name || "Unassigned",
      },
      status: formData.status as Smartbin["status"], // Cast if status has specific literal types
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

    const promise = isEditMode && smartbin?.id ? editSmartbin(smartbin.id, smartbinPayload) : addSmartbin(smartbinPayload as Omit<Smartbin, "id">);

    toast.promise(promise, {
      loading: `${isEditMode ? "Updating" : "Creating"} smartbin...`,
      success: (result: any) => {
        setLoading(false);
        if (!isEditMode) form.reset(); // Reset form only on create
        router.push("/dashboard/smartbins/data");
        return `Smartbin ${formData.assignedId} ${isEditMode ? "updated" : "created"} successfully.`;
      },
      error: (error: Error) => {
        setLoading(false);
        return `Error ${isEditMode ? "updating" : "creating"} smartbin: ${error.message || "Unknown error"}`;
      },
    });
  }
}
