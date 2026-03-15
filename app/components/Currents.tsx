"use client"

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useState, useEffect, memo, useMemo } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'
import { ArrowPathIcon } from '@heroicons/react/24/outline'

type Suggestion = {
    placeName: string,
    city: string,
    category: string,
    mediaLink: string,
    personSubmitted: string,
    notes: string
}

const columnHelper = createColumnHelper<Suggestion>()

const Current = memo(function Current() {
    const [data, setData] = useState<Suggestion[]>([])

    const columns = useMemo(() => [
        columnHelper.accessor('placeName', { cell: (info) => info.getValue() }),
        columnHelper.accessor('city', { cell: (info) => info.getValue() }),
        columnHelper.accessor('category', { cell: (info) => info.getValue() }),
        columnHelper.accessor('mediaLink', {
            cell: (info) => {
                const link = info.getValue();
                return (
                    <a href={link} target="_blank" rel="noopener noreferrer" className='text-blue-400 underline'>
                        Link
                    </a>
                )
            }
        }),
        columnHelper.accessor('personSubmitted', { cell: (info) => info.getValue() }),
        columnHelper.accessor('notes', { cell: (info) => info.getValue() }),
    ], [])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel()
    })

    const headers: Record<string, string> = {
        "placeName": "Place",
        "city": "City",
        "category": "Category",
        "mediaLink": "Link",
        "personSubmitted": "Added By",
        "notes": "Notes"
    }

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch('api/read_data')
            const json = await response.json()
            setData(json.response ?? [])
        }
        fetchData()
    }, [])

    const handleDeleteRow = async (rowIndex: number) => {
        try {
            console.log(rowIndex + 1)
        } catch (error: any) {
            console.error("Error deleting row", error?.name, error?.message)
        }
    }

    return (
        <div className='text-[#FFF3D6] bg-[#344E41] shadow-lg w-fit p-10 rounded-lg flex flex-col justify-center gap-5'>
            <div className="flex items-center justify-between gap-5">
                <div className='flex gap-5 justify-between w-full'>
                    <div className='flex gap-5'>
                        <h1 className='text-[1.5rem] font-semibold'>Current Suggestions</h1>
                        <span className='font-bold bg-[#FFF3D6] shadow-lg text-[#416252] px-3 py-2 rounded-xl'>
                            {data.length} {data.length === 1 ? "place" : "places"}
                        </span>
                    </div>
                    <button className='flex items-center gap-2 px-4 border rounded-lg'>
                        <ArrowPathIcon className='w-5'/>
                        Refresh
                    </button>
                </div>
            </div>

            <div>
                <table className='w-full'>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className='border-b'>
                                <th>#</th>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id} className='px-5'>
                                        {header.isPlaceholder ? null : headers[header.id]}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {table.getRowModel().rows.map((row) => (
                            <tr key={row.id} className='bg-[#FFF3D6] text-[#416252]'>
                                <td className='text-center border-b px-3 py-2'>
                                    {parseInt(row.id) + 1}
                                </td>
                                {row.getVisibleCells().map((cell) => (
                                    <td key={cell.id} className='border-b px-3 py-2'>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                                <td className='border-b px-3 py-2'>
                                    <button onClick={() => handleDeleteRow(parseInt(row.id))} className='cursor-pointer'>
                                        <TrashIcon className='h-5'/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className='w-full flex justify-center'>
                <button className='bg-[#416252] p-2 px-4 shadow-lg rounded-lg hover:bg-[#547D69] transition cursor-pointer'>
                    Download as Excel File (.csv)
                </button>
            </div>
        </div>
    )
})

export default Current