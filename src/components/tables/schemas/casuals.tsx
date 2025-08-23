import { ColumnDef } from '@tanstack/react-table';
import { Casual } from '@/lib/types';

export const casualColumns: ColumnDef<Casual>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone Number',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue() ?? 'N/A', // Display 'N/A' if name is null
  },
];
