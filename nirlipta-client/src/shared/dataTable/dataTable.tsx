import React, { useState, useMemo } from "react";
import { flexRender, getCoreRowModel, useReactTable, ColumnDef } from "@tanstack/react-table";
import Pagination from "../../pages/components/Pagination";

// Define the type for the data expected in the table
interface Instructor {
    _id: string;
    name: string;
    specialization: string[];
    experience: string;
}

// Props for the DataTable component
interface DataTableProps {
    defaultData: Instructor[];  // Specify the data type as Instructor[]
    columns: ColumnDef<Instructor>[];  // Specify the columns type
    itemsPerPage: number;
}

const DataTable: React.FC<DataTableProps> = ({ defaultData = [], columns, itemsPerPage = 10 }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Fallback for empty data
    const data = defaultData || [];
    const totalPages = Math.ceil(data.length / itemsPerPage);

    // Memoize the current data to prevent unnecessary recalculations
    const currentData = useMemo(() => {
        return data.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    const table = useReactTable({
        data: currentData,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // Handle page change via Pagination
    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="p-4">
            <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                    <tr key={headerGroup.id} className="bg-gray-100 border-b border-gray-300">
                        {headerGroup.headers.map((header) => (
                            <th
                                key={header.id}
                                className="text-left p-4 text-sm font-medium text-gray-700 uppercase tracking-wider"
                            >
                                {header.isPlaceholder
                                    ? null
                                    : flexRender(header.column.columnDef.header, header.getContext())}
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody>
                {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                        <tr
                            key={row.id}
                            className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 border-b border-gray-300"
                        >
                            {row.getVisibleCells().map((cell) => (
                                <td key={cell.id} className="p-4 text-sm text-gray-800">
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={columns.length} className="text-center p-4 text-gray-500">
                            No data available.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default DataTable;
