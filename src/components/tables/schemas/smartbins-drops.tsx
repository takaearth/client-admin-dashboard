import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { CircleXIcon, CheckCircle2Icon, HourglassIcon, SmartphoneIcon, SignalIcon, RefrigeratorIcon } from "lucide-react";
//custom
import { cn } from "@/lib/utils";
import { timestampToDate } from "@/lib";
import { SmartbinDrop } from "@/lib/types";

export const smartbinsDropColumns: ColumnDef<SmartbinDrop>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "binDropId",
    header: "Drop ID",
  },
  {
    accessorKey: "binId",
    header: "Bin ID",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status?.toLowerCase();
      return (
        <Badge
          variant="outline"
          className={cn(
            "flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 uppercase",
            status === "claimed"
              ? "text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50"
              : status === "pending"
              ? "text-yellow-500 dark:text-yellow-400 border-yellow-500 dark:border-yellow-400 bg-yellow-50"
              : "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400 bg-red-50"
          )}
        >
          {status === "claimed" ? <CheckCircle2Icon /> : status === "pending" ? <HourglassIcon /> : <CircleXIcon />}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "plastic",
    header: "Plastic",
  },
  {
    accessorKey: "other",
    header: "Other",
  },
  {
    accessorKey: "created",
    header: "Created At",
    cell: ({ row }) => {
      const created = row.original.created;
      return timestampToDate(created);
    },
  },
  {
    accessorKey: "timestamp", // This is the drop event timestamp
    header: "Drop Timestamp",
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return timestampToDate(timestamp);
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.original.source?.toLowerCase();
      return (
        <Badge variant="outline" className="uppercase">
          {source === "ussd" ? <SignalIcon /> : source === "android" || source === "ios" ? <SmartphoneIcon /> : source == "direct" ? <RefrigeratorIcon /> : <CircleXIcon />}
          {source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: (info) => info.getValue() || "-", // Handle potentially undefined userId
  },
  {
    accessorKey: "sync_source",
    header: "Sync Source",
    cell: ({ row }) => {
      const sync_source = row.original.sync_source?.toLowerCase();
      return (
        <Badge variant="outline" className="uppercase">
          {sync_source === "ussd" ? <SignalIcon /> : sync_source === "android" || sync_source === "ios" ? <SmartphoneIcon /> : <CircleXIcon />}
          {sync_source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "synced",
    header: "Synced At",
    cell: ({ row }) => {
      const synced = row.original.synced;
      return timestampToDate(synced);
    },
  },
];
