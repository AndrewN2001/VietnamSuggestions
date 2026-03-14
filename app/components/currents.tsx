import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useReducer, useState, useEffect } from 'react'
import { TrashIcon } from '@heroicons/react/24/outline'

type Suggestion = {
    placeName: string,
    city: string,
    category: string,
    mediaLink: string,
    personSubmitted: string,
    notes: string
}

const columnHelper = createColumnHelper<Suggestion>()
const columns = [
    columnHelper.accessor('placeName', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id
    }),
    columnHelper.accessor('city', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id
    }),
    columnHelper.accessor('category', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id
    }),
    columnHelper.accessor('mediaLink', {
        // cell: (info) => info.getValue(),
        cell: (info) => {
            const link = info.getValue();
            return(
                <a href={link} target="_blank" rel="noopener noreferrer" className='text-blue-400 underline'>
                    Link
                </a>
            )
        },
        footer: (info) => info.column.id
    }),
    columnHelper.accessor('personSubmitted', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id
    }),
    columnHelper.accessor('notes', {
        cell: (info) => info.getValue(),
        footer: (info) => info.column.id
    }),
]

export default function Current() {
    const [data, _setData] = useState([])
    const rerender = useReducer(() => ({}), {})[1]

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
        const handleFetchData = async () => {
            const response = await fetch('api/read_data')
            const data = await response.json()
            _setData(data.response)
        }
        handleFetchData();
    }, [])

    return(
        <div className='text-[#FFF3D6] bg-[#344E41] shadow-lg w-fit p-10 rounded-lg flex flex-col justify-center gap-5'>
            <div className="flex items-center justify-between gap-5">
                <div className='flex gap-5'>
                    <h1 className='text-[1.5rem] font-semibold'>Current Suggestions</h1>
                    <span className='font-bold bg-[#FFF3D6] shadow-lg text-[#416252] px-3 py-2 rounded-xl'>
                        {data.length} {data.length > 1 ? "places" : "place"}
                    </span>
                </div>
                <button className='bg-[#416252] p-2 px-4 shadow-lg rounded-lg hover:bg-[#547D69] transition cursor-pointer'>
                    Download as Excel File (.csv)
                </button>
            </div>
            
            <div>
                <table className='w-full'>
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id} className='border-b'>
                                <th>
                                    #
                                </th>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder ? null :
                                            headers[header.id]
                                        }
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
                                    <button className='cursor-pointer'>
                                        <TrashIcon className='h-5'/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}