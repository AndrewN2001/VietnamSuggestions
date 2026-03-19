"use client"

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import clsx from 'clsx'
import toast from 'react-hot-toast';

type selectionType = {
  id: number,
  type: string
}

const selections: selectionType[] = [
  {id: 1, type: "Attraction / Sight"},
  {id: 2, type: "Food / Restaurant"},
  {id: 3, type: "Hotel / Stay"},
  {id: 4, type: "Activity / Experience"},
  {id: 5, type: "Other"},
]

export default function SuggestionForm({onSubmitSuccess}: {onSubmitSuccess? : () => void}){
    const [selected, setSelected] = useState(selections[1].type);
    const [formData, setFormData] = useState({
        placeName: "",
        category: selections[2].type,
        city: "",
        mediaLink: "",
        person: "",
        notes: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
        ...prev,
        [e.target.name]: e.target.value
        }))
    }

    const handleClear = () => {
        setFormData({
        placeName: "",
        category: selections[2].type,
        city: "",
        mediaLink: "",
        person: "",
        notes: ""
        })
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // console.log(formData)
        if (!formData.placeName || !formData.city || !formData.person) {
            alert("Please fill in all required fields")
            return
        }
        try{
            const response = await fetch('api/insert_data', {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData)
            })

            if (!response.ok) throw new Error('Failed to submit')
            toast.success('Suggestion submitted successfully!')
            onSubmitSuccess && onSubmitSuccess()
            setFormData({
                placeName: "",
                category: "",
                city: "",
                mediaLink: "",
                person: "",
                notes: ""
            })
        } catch (error: any){
            console.error(error)
        }
    }
    
    return(
        <div className="bg-[#FFF3D6] w-fit p-10 rounded-lg shadow-lg">
            <h1 className="text-md md:text-[1.5rem] font-semibold">Suggest me a place to visit in Viet Nam!</h1>
            <h2 className="text-sm">(Specifically Ho Chi Minh City)</h2>
    
            <form className="pt-5 flex flex-col gap-3">
                <div>
                    <h1 className="text-sm">PLACE NAME:</h1>
                    <input 
                        name="placeName" 
                        className="bg-white w-full p-2 drop-shadow"
                        value={formData.placeName}
                        placeholder="e.g. McDonald's"
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3 items-center'>
                    <div className='flex-1 min-w-0'>
                        <h1 className='text-sm'>CITY:</h1>
                        <input 
                            name="city"
                            className='w-full bg-white p-2 drop-shadow' 
                            placeholder="e.g. Ho Chi Minh City"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className='flex-1 min-w-0 w-full'>
                        <h1 className='text-sm'>CATEGORY:</h1>
                        <div className='w-full'>
                            <Listbox value={selected} onChange={(val) => {
                                setSelected(val)
                                setFormData(prev => ({...prev, category: val}))
                            }}>
                                <ListboxButton
                                    className={clsx(
                                        "flex gap-4 bg-white w-full text-left p-2 drop-shadow rounded-lg focus:outline-none transition duration-100 ease-in data-leave:data-closed:opacity-0"
                                    )}
                                >
                                    {selected}
                                    <ChevronDownIcon
                                        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                                        aria-hidden="true"
                                    />
                                </ListboxButton>
                                <ListboxOptions
                                    anchor="bottom"
                                    transition
                                    className={clsx(
                                        "flex flex-col gap-2 bg-white p-2 rounded-lg w-(--button-width) [--anchor-gap:--spacing(1)]"
                                    )}
                                >
                                {selections.map((selection) => (
                                    <ListboxOption
                                        key={selection.type}
                                        value={selection.type}
                                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-gray-200"
                                    >
                                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                                        <div className="text-sm/6 text-[#416252]">{selection.type}</div>
                                    </ListboxOption>
                                ))}
                                </ListboxOptions>
                            </Listbox>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h1 className="text-sm">SOCIAL MEDIA LINK:</h1>
                    <input 
                        name="mediaLink" 
                        className="bg-white w-full p-2 drop-shadow" 
                        placeholder='e.g. TikTok, Instagram'
                        value={formData.mediaLink}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div>
                    <h1 className="text-sm">PERSON SUBMITTING:</h1>
                    <input 
                        name="person" 
                        className="bg-white w-full p-2 drop-shadow" 
                        placeholder='Your name'
                        value={formData.person}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <div>
                    <h1 className="text-sm">NOTES</h1>
                    <textarea 
                        name="notes" 
                        className="bg-white w-full p-2 drop-shadow resize-y max-h-50 min-h-fit" 
                        placeholder='Opening hours, tips, why do you want to go...'
                        value={formData.notes}
                        onChange={handleChange}
                        required
                    />
                </div>
        
                <button type="submit" onClick={handleSubmit} className='bg-[#416252] text-[#FFF3D6] w-full py-3 rounded-lg shadow-lg hover:bg-[#547D69] transition cursor-pointer'>
                    Submit Suggestion
                </button>
            </form>
            <button onClick={handleClear} className='w-full border p-3 rounded-lg mt-3 shadow-lg cursor-pointer'>
                Clear Fields
            </button>
        </div>
    )
}
