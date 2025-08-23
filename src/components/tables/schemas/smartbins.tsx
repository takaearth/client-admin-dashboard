import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
//ui
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CircleXIcon, WarehouseIcon, CogIcon, CheckCircle2Icon, MoreVerticalIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
//custom
import { cn } from "@/lib/utils";
import { Smartbin } from "@/lib/types";

export const smartbinColumns: ColumnDef<Smartbin>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "assignedId",
    header: "Assigned Id", // This is the smartbin's own name e.g., "atreides"
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
            status === "deployed"
              ? "text-green-500 dark:text-green-400 border-green-500 dark:border-green-400 bg-green-50"
              : status === "maintenance"
              ? "text-yellow-500 dark:text-yellow-400 border-yellow-500 dark:border-yellow-400 bg-yellow-50"
              : status === "storage"
              ? "text-purple-500 dark:text-purple-400 border-purple-500 dark:border-purple-400 bg-purple-50"
              : "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400 bg-red-50"
          )}
        >
          {status === "deployed" ? <CheckCircle2Icon /> : status === "maintenance" ? <CogIcon /> : status === "storage" ? <WarehouseIcon /> : <CircleXIcon />}
          {status}
        </Badge>
      );
    },
  },
  {
    id: "locationName", // Unique ID for accessorFn
    header: "Location Name", // This is the address name e.g., "JKUAT"
    accessorFn: (row) => row.address.name,
  },
  {
    id: "addressDetail",
    header: "Address Detail",
    accessorFn: (row) => row.address.detail,
  },
  {
    accessorFn: (row) => row.address.city,
    id: "city",
    header: "City",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const binId = row.original.id;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex size-5 text-muted-foreground data-[state=open]:bg-muted" size="icon">
              <MoreVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <Link href={`/dashboard/smartbins/${binId}`}>
              <DropdownMenuItem>View</DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
