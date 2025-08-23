import { ColumnDef } from "@tanstack/react-table";
// ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleX, CheckCircle2Icon, MoreVerticalIcon } from "lucide-react";
// custom
import { formatDate } from "@/lib";
import { Pickup } from "@/lib/types";

export const pickupColumns: ColumnDef<Pickup>[] = [
  {
    accessorKey: 'id',
    header: 'Pickup ID',
  },
  {
    accessorKey: 'userId',
    header: 'User ID',
  },
  {
    accessorKey: 'timestamp',
    header: 'Pickup Timestamp',
    cell: ({ row }) => {
      const timestamp = row.original.timestamp;
      return formatDate(timestamp);
    },
  },
  {
    accessorKey: 'quantity',
    header: 'Quantity',
    // cell: info => `${info.getValue()} kg` // Example: add units
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'status',
    header: 'Status',
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
    accessorKey: 'submitted',
    header: 'Submitted By/Ref', // Clarify header based on what 'submitted' represents
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