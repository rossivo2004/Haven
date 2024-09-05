import { Pagination as NextUIPagination } from "@nextui-org/react";

interface CustomPaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
}

function CustomPagination({ totalItems, itemsPerPage, currentPage, onPageChange }: CustomPaginationProps) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return (
        <div>
            <NextUIPagination 
                showControls 
                total={totalPages} 
                initialPage={currentPage} 
                onChange={(page) => onPageChange(page)}
                className="text-main"
            />
        </div>
    );
}

export default CustomPagination;
