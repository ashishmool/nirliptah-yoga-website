import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="mt-6 flex justify-center">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md mr-2 disabled:opacity-50"
            >
                Prev
            </button>
            <span className="text-lg">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="py-2 px-4 bg-gray-300 text-gray-700 rounded-md ml-2 disabled:opacity-50"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;
