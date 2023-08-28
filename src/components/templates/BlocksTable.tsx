import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../shadcn/ui/table";
import { Button } from "../shadcn/ui/button";
import { Input } from "../shadcn/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../shadcn/ui/dropdown-menu";
import { Block } from "alchemy-sdk";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useFetchBlockData } from "../../hooks";

const columnHelper = createColumnHelper<Block>();

// eslint-disable-next-line react-refresh/only-export-components
export const columns: ColumnDef<Block>[] = [
  {
    accessorKey: "number",
    header: "Block",
    cell: ({ row }) => (
      <div className="text-left">{row.getValue("number")}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "timestamp",
    header: "Age",
    cell: ({ row }) => (
      <div className="capitalize">
        {moment.unix(row.getValue("timestamp")).fromNow()}
      </div>
    ),
  },
  {
    accessorKey: "transactions",
    header: "Txn",
    cell: ({ row }) => (
      <div className="lowercase">
        {row.getValue<unknown[]>("transactions").length}
      </div>
    ),
  },
  {
    accessorKey: "miner",
    header: () => "Validator",
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue<string>("miner").slice(0, 20).concat("...")}
      </div>
    ),
  },
  {
    accessorKey: "gasUsed",
    header: () => "Gas Used",
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue<{ toNumber: () => number }>("gasUsed").toNumber()}
      </div>
    ),
  },
  {
    accessorKey: "gasLimit",
    header: () => "Gas Limit",
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue<{ toNumber: () => number }>("gasLimit").toNumber()}
      </div>
    ),
  },
  {
    accessorKey: "baseFeePerGas",
    header: () => "Base Fee",
    cell: ({ row }) => (
      <div className="text-left font-medium">
        {row.getValue<{ toNumber: () => number }>("baseFeePerGas").toNumber()}
      </div>
    ),
  },
  // {
  //   accessorKey: "reward",
  //   header: () => "Reward",
  //   cell: ({ row }) => (
  //     <div className="text-right font-medium">{row.getValue("reward")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "difficulty",
  //   header: () => "Burnt Fees",
  //   cell: ({ row }) => (
  //     <div className="text-right font-medium">{row.getValue("difficulty")}</div>
  //   ),
  // },
];

const BlocksTable = () => {
  const navigate = useNavigate();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { blockList } = useFetchBlockData();

  const table = useReactTable({
    data: blockList,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full lg:px-16 mt-24">
      <div className="flex items-center py-4">
        <Input
          placeholder="Search by block number..."
          value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("number")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => navigate(`/blocks/${row.getValue("number")}`)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        {/* <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div> */}
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BlocksTable;
