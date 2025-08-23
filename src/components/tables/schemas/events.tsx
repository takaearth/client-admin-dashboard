import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleX, CheckCircle2Icon, MoreVerticalIcon } from "lucide-react";
//custom
import { formatDate } from "@/lib";
import { Event } from "@/lib/types";

export const eventColumns: ColumnDef<Event>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
    accessorKey: "enrolled",
    header: "Enrolled",
  },
  {
    accessorKey: "created",
    header: "Created At",
    cell: ({ row }) => {
      const created = row.original.created;
      return formatDate(created);
    },
  },
  {
    accessorKey: "updated",
    header: "Updated At",
    cell: ({ row }) => {
      const updated = row.original.updated;
      return formatDate(updated);
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const eventId = row.original.id
      return (
        <Link href={`/dashboard/events/${eventId}`}>
          <Button variant="ghost" className="flex size-8 text-muted-foreground data-[state=open]:bg-muted" size="icon">
            <MoreVerticalIcon />
            <span className="sr-only">Open Event</span>
          </Button>
        </Link>
      );
    },
  },
];
