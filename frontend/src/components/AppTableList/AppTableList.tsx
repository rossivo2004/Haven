import { Pagination, PaginationProps } from '@nextui-org/react'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'
import React, { Fragment, useCallback, useEffect, useState } from 'react'

// Custom props của Pagination loại props 'total' thêm sizePage và dataLength
interface CustomPaginationProps extends Omit<PaginationProps, 'total'> {
    tableList: React.ReactNode,
    sizePage: number,
    dataLength: number
    positionPagination?: "start" | "center" | "end"
}

const AppTableList: React.FC<CustomPaginationProps> = ({ tableList, sizePage, dataLength, variant = "bordered", positionPagination }) => {
    const [page, setPage] = useState(1)
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const total = Math.ceil(dataLength / sizePage); // Math.ceil làm tròn lên số nguyên lớn nhất

    useEffect(() => {
        setPage(Number(searchParams.get('page')))
    }, [page])

    const handleChange = (newPage: any) => {
        router.push(`?page=${newPage}`)
    }

    return (
        <div className='flex flex-col gap-5'>
            {tableList}

            {total > 1 ? (
                <div className={`flex flex-1 justify-center ${positionPagination === 'start' ? 'sm:justify-start' : positionPagination === 'end' ? 'sm:justify-end' : 'sm:justify-center'}`}>
                    <Pagination
                        page={page}
                        total={total}
                        onChange={handleChange}
                        variant={variant}
                    />
                </div>
            ) : <Fragment />}
        </div>
    )
}

export default AppTableList