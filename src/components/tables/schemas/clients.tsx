import { ColumnDef } from '@tanstack/react-table';
import { Client } from '@/lib/types';

export const clientColumns: ColumnDef<Client>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue() ?? 'N/A', // Display 'N/A' if name is null
  },
];
