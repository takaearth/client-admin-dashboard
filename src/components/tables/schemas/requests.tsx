import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleX, CheckCircle2Icon, MoreVerticalIcon } from "lucide-react";
//custom
import { formatDate } from "@/lib";
import { Request } from "@/lib/types";

export const requestColumns: ColumnDef<Request>[] = [
  {
    accessorKey: "id",
    header: "Request ID",
    cell: (info) => info.getValue() || "N/A", // Handle optional ID
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "address",
    header: "Address",
    // You might want to enable resizing or set a min/max size for longer addresses
    // size: 300,
  },
  {
    accessorKey: "pickup",
    header: "Pickup Time",
    cell: ({ row }) => {
      const pickup = row.original.pickup;
      return formatDate(pickup);
    },
  },
  {
    accessorKey: "timestamp",
    header: "Request Timestamp",
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return formatDate(timestamp);
    },
  },
  {
    accessorKey: "source",
    header: "Source",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();
      return (
        <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 uppercase">
          {status === "completed" ? (
            <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
          ) : status === "pending" ? (
            <CircleX className="text-yellow-500 dark:text-yellow-400" />
          ) : (
            <CircleX className="text-red-500 dark:text-red-400" />
          )}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: () => (
      <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
        <MoreVerticalIcon />
        <span className="sr-only">Open menu</span>
      </Button>
    ),
  },
];
