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
import toast from 'react-hot-toast';

type Suggestion = {
    placeName: string,
    city: string,
    category: string,
    mediaLink: string,
    personSubmitted: string,
    notes: string
}

const columnHelper = createColumnHelper<Suggestion>()

const Current = memo(function Current({refreshKey}: {refreshKey: number}) {
    const [data, setData] = useState<Suggestion[]>([])

    const columns = useMemo(() => [
        columnHelper.accessor('placeName', { cell: (info) => info.getValue() }),
        columnHelper.accessor('city', { cell: (info) => info.getValue() }),
        columnHelper.accessor('category', { cell: (info) => info.getValue() }),
        columnHelper.accessor('mediaLink', {
            cell: (info) => {
                const link = info.getValue();
                return (
                    <a href={link} target="_blank" rel="noopener noreferrer" className='text-[#7dd3b4] underline'>
                        Link
                    </a>
                )
            }
        }),
        columnHelper.accessor('personSubmitted', { cell: (info) => info.getValue() }),
        columnHelper.accessor('notes', { 
            cell: (info) => {
                return(
                    <span title={info.getValue()} className='block max-w-50 truncate'>
                        {info.getValue()}
                    </span>
                )
            } 
        }),
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
    }, [refreshKey])

    const handleDeleteRow = async (rowIndex: number) => {
        try {
            // console.log(rowIndex + 1)
            const response = await fetch('api/delete_data', {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({rowIndex: rowIndex + 1})
            })
            if (!response.ok) throw new Error("Failed to delete!")
            setData(prev => prev.filter((_, i) => i !== rowIndex))
            toast.success("Suggestion deleted successfully!")
        } catch (error: any) {
            console.error("Error deleting row", error?.name, error?.message)
        }
    }

    return (
        <div className='text-[#FFF3D6] bg-[#344E41] shadow-lg w-full sm:w-fit p-10 rounded-lg flex flex-col justify-center gap-5'>
            <div className="flex items-center justify-between gap-5">
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 w-full justify-between'>
                    <div className='flex sm:flex-row flex-col gap-2 sm:gap-5'>
                        <h1 className='text-[1.5rem] font-semibold'>Current Suggestions</h1>
                        <span className='w-fit font-bold bg-[#FFF3D6] shadow-lg text-[#416252] px-3 sm:py-2 py-1 rounded-xl'>
                            {data.length} {data.length === 1 ? "place" : "places"}
                        </span>
                    </div>
                </div>
            </div>

            <div>
                <div className='sm:hidden block'>
                    {data.length > 0 ? (
                        <div className='flex flex-col gap-2 max-h-125 overflow-scroll'>
                            {data.map((suggestion, index) => (
                                <div 
                                    key={`${suggestion.placeName}-${suggestion.personSubmitted}-${Math.random() * 1000}`} 
                                    className='bg-[#416252] p-3 rounded-lg shadow-lg w-full flex justify-between'
                                >
                                    <div>
                                        <h1 className='font-semibold'>
                                            {suggestion.placeName}
                                        </h1>
                                        <div className='text-[13px]'>
                                            <h2 className='text-[#FFF3D6]/80'>
                                                {suggestion.city} · {suggestion.category}
                                            </h2>
                                            <h3 className='text-[#FFF3D6]/60'>
                                                Added by {suggestion.personSubmitted}
                                            </h3>
                                            <h4 className='text-[#FFF3D6]/50 max-h-50 overflow-y-auto mt-1'>
                                                {suggestion.notes}
                                            </h4>
                                            <a href={suggestion.mediaLink} className='text-[#7dd3b4] underline'>
                                                Link
                                            </a>
                                        </div>
                                    </div>

                                    <button onClick={() => handleDeleteRow(index)} className='cursor-pointer'>
                                        <TrashIcon className='h-5'/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className='p-10 text-center rounded-lg shadow-lg font-semibold border border-dashed opacity-80'>
                            No entries found.
                        </div>
                    )}
                </div>
                
                    
                <table className='w-full hidden sm:block max-h-90'>
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
                    {data.length > 0 ? (
                        <tbody>
                            {table.getRowModel().rows.map((row) => (
                                <tr key={row.id} className='text-[#FFF3D6] border-b border-[#FFF3D6]/40 last:border-b-0'>
                                    <td className='text-center px-3 py-2'>
                                        {parseInt(row.id) + 1}
                                    </td>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id} className=' px-3 py-2'>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                    <td className=' px-3 py-2'>
                                        <button onClick={() => handleDeleteRow(parseInt(row.id))} className='cursor-pointer'>
                                            <TrashIcon className='h-5'/>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    ) : (
                        <tbody className=''>
                            <tr className=''>
                                <td colSpan={8} className='text-center py-5 text-[#FFF3D6]/80'>
                                    No entries available.
                                </td>
                            </tr>
                        </tbody>
                    )}
                </table>
            </div>

            <div className='w-full flex justify-center'>
                <button onClick={() => (window.location.href = `https://docs.google.com/spreadsheets/d/${process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=Vietnam_Trip_Suggestion_List`)} className='bg-[#416252] w-full sm:w-fit p-2 px-4 shadow-lg rounded-lg hover:bg-[#547D69] transition cursor-pointer'>
                    Download as Excel File (.csv)
                </button>
            </div>
        </div>
    )
})

export default Current