import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  // createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown, Files } from "lucide-react";
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
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { AlchemyContext } from "../../context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../shadcn/ui/select";
import { ethers } from "ethers";
import { Progress } from "@material-tailwind/react";
import { ExtendedBlock } from "../../context/AlchemyContext";
import { Loader } from "../atoms";

// const columnHelper = createColumnHelper<Block>();

const BlocksTable = () => {
  const navigate = useNavigate();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const { blockList, setBlocksPerPage, loading } =
    React.useContext(AlchemyContext);

  const columns: ColumnDef<ExtendedBlock>[] = [
    {
      accessorKey: "number",
      header: "Block",
      cell: ({ row }) => (
        <div
          className="text-left text-[#9918b3] hover:text-[#9918b3]/60"
          onClick={() => navigate(`/blocks/${row.getValue("number")}`)}
        >
          {row.getValue("number")}
        </div>
      ),
      enableSorting: true,
      enableHiding: false,
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
      header: () => "Fee Recipient",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-left font-medium text-[#9918b3]">
            {row.getValue<string>("miner").slice(0, 20).concat("...")}
          </span>
          <Files
            className="ml-2 hover:text-[#9918b3] active:text-[#e3bfeb] cursor-pointer"
            size={15}
            onClick={() =>
              navigator.clipboard.writeText(row.getValue<string>("miner"))
            }
          />
        </div>
      ),
    },
    {
      accessorKey: "gasUsed",
      header: () => "Gas Used",
      cell: ({ row }) => (
        <div className="text-left font-medium flex flex-col gap-2">
          <span className="flex justify-between items-center">
            {row
              .getValue<{ toNumber: () => number }>("gasUsed")
              .toNumber()
              .toLocaleString()}

            <span className="text-[11px]">
              {(
                (row
                  .getValue<{ toNumber: () => number }>("gasUsed")
                  .toNumber() *
                  100) /
                row.getValue<{ toNumber: () => number }>("gasLimit").toNumber()
              ).toPrecision(4)}
              %
            </span>
          </span>
          <Progress
            value={
              (row.getValue<{ toNumber: () => number }>("gasUsed").toNumber() *
                100) /
              row.getValue<{ toNumber: () => number }>("gasLimit").toNumber()
            }
            color="purple"
            size="sm"
          />
        </div>
      ),
    },
    {
      accessorKey: "gasLimit",
      header: () => "Gas Limit",
      cell: ({ row }) => (
        <div className="text-left font-medium">
          {row
            .getValue<{ toNumber: () => number }>("gasLimit")
            .toNumber()
            .toLocaleString()}
        </div>
      ),
    },
    {
      accessorKey: "baseFeePerGas",
      header: () => "Base Fee",
      cell: ({ row }) => (
        <div className="text-left font-medium">
          {Number(
            ethers.formatUnits(
              row
                .getValue<{ toBigInt: () => bigint }>("baseFeePerGas")
                .toBigInt(),
              "gwei",
            ),
          ).toPrecision(3)}{" "}
          Gwei
        </div>
      ),
    },
    {
      accessorKey: "reward",
      header: () => "Reward",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {row.getValue("reward")} ETH
        </div>
      ),
    },
    {
      accessorKey: "burntFees",
      header: () => "Burnt Fees (ETH)",
      cell: ({ row }) => (
        <div className="text-right font-medium">
          {Number(
            ethers.formatEther(BigInt(row.getValue<number>("burntFees"))),
          ).toFixed(6)}
        </div>
      ),
    },
  ];

  React.useEffect(() => {
    setBlocksPerPage(50);
    table.setPageSize(25);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const table = useReactTable({
    data: blockList ?? [],
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
  console.log(table.getState().pagination.pageSize, "table");
  return (
    <div className="w-full lg:px-16 mt-24 mb-20">
      <h2 className="text-3xl">Blocks</h2>
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
            setBlocksPerPage(+value);
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
  );
};

export default BlocksTable;
