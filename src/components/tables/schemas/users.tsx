import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleXIcon, CheckCircle2Icon, MoreVerticalIcon } from "lucide-react";
//custom
import { cn } from "@/lib/utils";
import { User } from "@/lib/types";
import { timestampToDate } from "@/lib";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "phone",
    header: "Phone Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => {
      const state = row.original.state?.toLowerCase();
      return (
        <Badge
          variant="outline"
          className={cn(
            "flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 uppercase",
            state === "active"
              ? "text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50"
              : "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400 bg-red-50"
          )}
        >
          {state === "active" ? <CheckCircle2Icon /> : <CircleXIcon />}
          {state}
        </Badge>
      );
    },
  },
  {
    accessorKey: "points",
    header: "Points",
  },
  {
    accessorKey: "enrolled",
    header: "Enrolled",
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
    accessorKey: "updated",
    header: "Updated At",
    cell: ({ row }) => {
      const updated = row.original.updated;
      return timestampToDate(updated);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const userId = row.original.id;
      return (
        <Link href={`/dashboard/users/${userId}`}>
          <Button variant="ghost" className="flex size-5 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open User</span>
          </Button>
        </Link>
      );
    },
  },
];
