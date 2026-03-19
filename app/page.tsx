"use client"

import SuggestionForm from './components/SuggestionForm';
import Current from './components/Currents';
import { Toaster } from 'react-hot-toast';
import {useState} from 'react';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0)
  
  return (
    <div className="bg-[#416252] text-[#416252] w-full flex flex-col items-center justify-center py-10 px-5 gap-5">
      <Toaster/>
      <SuggestionForm onSubmitSuccess={() => setRefreshKey(refreshKey + 1)}/>
      <Current refreshKey={refreshKey}/>
      <div className='text-[#FFF3D6]'>
        Created by Andrew Nguyen | <a href="https://github.com/AndrewN2001/VietnamSuggestions" rel="noreferrer" target="_blank" className='hover:underline'>Github</a>
      </div>
    </div>
  );
}
