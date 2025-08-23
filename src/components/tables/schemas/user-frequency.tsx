import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleX, CheckCircle2Icon } from "lucide-react";
//custom
import { UserFrequency } from "@/lib/types";

export const userFrequencyTableColumns: ColumnDef<UserFrequency>[] = [
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "state",
    header: "State",
    cell: ({ row }) => (
      <Badge variant="outline" className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3 uppercase">
        {row.original.state === "active" ? <CheckCircle2Icon className="text-green-500 dark:text-green-400" /> : <CircleX className="text-red-500 dark:text-red-400" />}
        {row.original.state}
      </Badge>
    ),
  },
  {
    accessorKey: "count",
    header: "Total Count",
  },
  {
    accessorKey: "actions",
    cell: ({ row }) => (
      <Link href={`/dashboard/users/${row.original.phoneNumber}`}>
        <Button size="sm" variant="ghost">View Profile</Button>
      </Link>
    ),
  },
];
