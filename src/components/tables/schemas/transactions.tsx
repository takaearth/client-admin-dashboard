import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CircleXIcon, CheckCircle2Icon, HourglassIcon, MessageCircleMoreIcon, MessageCircleXIcon, SmartphoneIcon, SignalIcon } from "lucide-react";
//custom
import { cn } from "@/lib/utils";
import { timestampToDate } from "@/lib";
import { Transaction } from "@/lib/types";

export const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "tracking_id",
    header: "Tracking ID",
  },
  {
    accessorKey: "file_id",
    header: "Intasend ID",
    cell: ({ row }) => row.original.file_id,
  },
  {
    accessorKey: "userPhone",
    header: "User Phone",
  },
  {
    accessorKey: "userName",
    header: "User Name",
  },
  {
    accessorKey: "beneficiary",
    header: "Beneficiary",
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
            status === "successful" || status === "completed"
              ? "text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50"
              : status === "failed" || status === "cancelled" || status === "unsuccessful"
              ? "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400 bg-red-50"
              : "text-yellow-500 dark:text-yellow-400 border-yellow-500 dark:border-yellow-400 bg-yellow-50"
          )}
        >
          {status === "claimed" ? <CheckCircle2Icon /> : status === "pending" ? <HourglassIcon /> : <CircleXIcon />}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "paid",
    header: "Paid",
    cell: ({ row }) => {
      const amount = parseFloat(row.original.paid_amount || "0");
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "KES" }).format(amount); // Assuming KES
    },
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => {
      const source = row.original.source?.toLowerCase();
      return (
        <Badge variant="outline" className="uppercase">
          {source === "ussd" ? <SignalIcon /> : source === "android" || source === "ios" ? <SmartphoneIcon /> : <CircleXIcon />}
          {source}
        </Badge>
      );
    },
  },
  {
    accessorKey: "provider_reference",
    header: "Provider Ref",
  },
  {
    accessorKey: "updated", // This is the drop event timestamp
    header: "Updated",
    cell: ({ row }) => {
      const updated = row.original.updated;
      return timestampToDate(updated);
    },
  },
  {
    accessorKey: "created", // This is the drop event timestamp
    header: "Created",
    cell: ({ row }) => {
      const created = row.original.created;
      return timestampToDate(created);
    },
  },
];
