import { ColumnDef } from '@tanstack/react-table';
import { Employee } from '@/lib/types'; 

export const employeeColumns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    // You can add cell formatting or other options here if needed
    // cell: info => info.getValue(),
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'name',
    header: 'Name',
    cell: info => info.getValue() ?? 'N/A', // Display 'N/A' if name is null
  },
  {
    accessorKey: 'notId',
    header: 'Notification ID',
  },
  // If you have actions or other custom columns, you can add them here.
  // Example:
  // {
  //   id: 'actions',
  //   header: 'Actions',
  //   cell: ({ row }) => {
  //     const employee = row.original;
  //     // return JSX for action buttons like Edit, Delete, etc.
  //     return (
  //       <div>
  //         <button onClick={() => console.log('Edit', employee.id)}>Edit</button>
  //       </div>
  //     );
  //   },
  // },
];
