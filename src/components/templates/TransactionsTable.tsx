import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ethers } from "ethers";
import { ArrowRight, ChevronDown, Files } from "lucide-react";
import moment from "moment";
import { Button } from "../shadcn/ui/button";
import { Input } from "../shadcn/ui/input";
import {
  AlchemyContext,
  ExtendedTransaction,
} from "../../context/AlchemyContext";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@radix-ui/react-select";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../shadcn/ui/table";
import { Loader } from "../atoms";

const TransactionsTable = () => {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const { fetchedTxns, loading, setLimit, setFetchTxnsOnly } =
    useContext(AlchemyContext);

  useEffect(() => {
    setFetchTxnsOnly(true);
    setLimit(30);
    table.setPageSize(25);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: ColumnDef<ExtendedTransaction>[] = [
    {
      accessorKey: "transactionHash",
      header: "Txn Hash",
      cell: ({ row }) => (
        <div
          className="text-left text-[#9918b3] hover:text-[#9918b3]/60"
          onClick={() => navigate(`/txns/${row.getValue("transactionHash")}`)}
        >
          {row.getValue<string>("transactionHash").slice(0, 20).concat("...")}
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
      filterFn: "includesString",
    },
    {
      accessorKey: "blockNumber",
      header: "Block",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue<number>("blockNumber")}</div>
      ),
    },
    {
      accessorKey: "timestamp",
      header: "Age",
      cell: ({ row }) => (
        <div className="">
          {moment.unix(row.getValue("timestamp")).fromNow()}
        </div>
      ),
    },

    {
      accessorKey: "from",
      header: () => "From",
      cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex items-center w-[240px]">
            <span className="text-left font-medium text-[#9918b3]">
              {row.getValue<string>("from").slice(0, 20).concat("...")}
            </span>
            <Files
              className="ml-2 hover:text-[#9918b3] active:text-[#e3bfeb] cursor-pointer"
              size={15}
              onClick={() =>
                navigator.clipboard.writeText(row.getValue<string>("from"))
              }
            />
          </div>
          <span className="rounded-full border border-[#e3bfeb]  p-2">
            <ArrowRight className="text-[#e3bfeb]" size={15} />
          </span>
        </div>
      ),
    },

    {
      accessorKey: "to",
      header: () => "To",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-left font-medium text-[#9918b3]">
            {row.getValue<string>("to").slice(0, 20).concat("...")}
          </span>
          <Files
            className="ml-2 hover:text-[#9918b3] active:text-[#e3bfeb] cursor-pointer"
            size={15}
            onClick={() =>
              navigator.clipboard.writeText(row.getValue<string>("to"))
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "value",
      header: () => "Value",
      cell: ({ row }) => (
        <div className="text-left font-medium">
          {Number(ethers.formatEther(row.getValue<bigint>("value"))).toFixed(6)}{" "}
          ETH
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: fetchedTxns ?? [],
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
    <div>
      {" "}
      <div className="w-full lg:px-16 mt-24 mb-20">
        <h2 className="text-3xl">Transactions</h2>
        <div className="flex items-center py-4">
          <Input
            placeholder="Search by transaction hash..."
            value={
              (table
                .getColumn("transactionHash")
                ?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table
                .getColumn("transactionHash")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm border border-[#e3bfeb]"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto border border-[#e3bfeb]"
              >
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
                      <TableHead key={header.id} className="font-bold">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
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
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
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

          <Select
            onValueChange={(value: string | number) => {
              table.setPageSize(+value);
              setLimit(+value);
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={`${25}`} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[25, 50, 100].map((item) => (
                  <SelectItem key={item} value={item.toString()}>
                    {item}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        {loading && (
          <div className="flex flex-col justify-center items-center w-full">
            <Loader size="medium" />
            <p className="text-center">Loading data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsTable;
