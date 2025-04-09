import { useMemo, useState } from "react";
import {
  FinancialRecord,
  useFinancialRecords,
} from "../../contexts/financial-record-context";
import { useTable, Column, CellProps } from "react-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Trash2 } from "lucide-react";

interface EditableCellProps extends CellProps<FinancialRecord> {
  updateRecord: (rowIndex: number, columnId: string, value: any) => void;
  editable: boolean;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value: initialValue,
  row,
  column,
  updateRecord,
  editable,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);

  const onBlur = () => {
    setIsEditing(false);
    updateRecord(row.index, column.id, value);
  };

  return (
    <div
      onClick={() => editable && setIsEditing(true)}
      style={{ cursor: editable ? "pointer" : "default" }}
    >
      {isEditing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          onBlur={onBlur}
          className="w-full px-1 py-0.5 bg-transparent border border-input rounded text-sm"
        />
      ) : typeof value === "string" ? (
        value
      ) : (
        value.toString()
      )}
    </div>
  );
};

export const FinancialRecordList = () => {
  const { records, updateRecord, deleteRecord } = useFinancialRecords();

  const updateCellRecord = (rowIndex: number, columnId: string, value: any) => {
    const id = records[rowIndex]?._id;
    updateRecord(id ?? "", { ...records[rowIndex], [columnId]: value });
  };

  const columns: Array<Column<FinancialRecord>> = useMemo(
    () => [
      {
        Header: "Description",
        accessor: "description",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Amount",
        accessor: "amount",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Category",
        accessor: "category",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Payment Method",
        accessor: "paymentMethod",
        Cell: (props) => (
          <EditableCell {...props} updateRecord={updateCellRecord} editable />
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => {
          const date = new Date(value);
          const formatted = date.toLocaleString("en-US", {
            timeZone: "Asia/Kathmandu",
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          });
          return <span>{formatted}</span>;
        },
      },
      {
        Header: "Delete",
        id: "delete",
        Cell: ({ row }) => (
          <Button
            onClick={() => {
              // Show a confirmation alert before proceeding with deletion
              const confirmDelete = window.confirm(
                "Are you sure you want to delete this record?"
              );
              if (confirmDelete) {
                deleteRecord(row.original._id ?? ""); // Proceed with deletion if confirmed
              }
            }}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        ),
      },
    ],
    [records]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: records,
    });

  // ✅ Categorize as Profit or Loss
  const profitCategories = ["Salary", "Part Time Job"];
  const totalProfit = records
    .filter((r) => profitCategories.includes(r.category))
    .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);

  const totalLoss = records
    .filter((r) => !profitCategories.includes(r.category))
    .reduce((sum, r) => sum + parseFloat(r.amount.toString()), 0);

  const net = totalProfit - totalLoss;

  const chartData = [
    { name: "Income", value: totalProfit },
    { name: "Expense", value: totalLoss },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

  return (
    <div className="w-full px-4 md:px-6 py-6 bg-background text-foreground">
      <h1 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-teal-500 mb-4">
        Financial Overview
      </h1>
      {/* 📊 Profit/Loss Chart */}
      <Card className="mb-6 shadow-xl dark:border dark:border-slate-700">
        <CardContent className="py-6">
          <p className="text-center font-semibold text-muted-foreground mb-4">
            Financial Overview Chart
          </p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 💰 Summary */}
      <Card className="mb-6 shadow-xl dark:border dark:border-slate-700">
        <CardContent className="py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-muted-foreground font-semibold text-sm">
                Total Income
              </p>
              <p className="text-green-500 font-bold text-xl">
                Rs. {totalProfit.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-semibold">
                Total Expenses
              </p>
              <p className="text-red-500 font-bold text-xl">
                Rs. {totalLoss.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground font-semibold text-sm">
                Net Balance
              </p>
              <p
                className={cn(
                  "font-bold text-xl",
                  net >= 0 ? "text-green-400" : "text-red-500"
                )}
              >
                Rs. {net.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📋 Financial Records Table */}
      <div className="overflow-x-auto rounded-lg shadow dark:border dark:border-slate-700">
        <h2 className="text-2xl text-center sm:text-3xl md:text-4xl font-bold text-teal-500 mb-4 mt-4">
          Your Financial Records
        </h2>
        <p className="text-lg mb-2 text-yellow-600 text-center font-semibold">
          ( Click a cell to edit )
        </p>
        <div className="min-w-full">
          <table
            {...getTableProps()}
            className="w-full text-sm  divide-y divide-border bg-card text-card-foreground table-auto"
          >
            <thead className="bg-muted/30">
              {headerGroups.map((hg) => (
                <tr {...hg.getHeaderGroupProps()}>
                  {hg.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-4 py-3 text-left font-semibold uppercase tracking-wider whitespace-nowrap"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-4 py-3 whitespace-nowrap"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
