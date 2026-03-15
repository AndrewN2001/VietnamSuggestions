import SuggestionForm from './components/SuggestionForm';
import Current from './components/Currents';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <div className="bg-[#416252] text-[#416252] w-full flex flex-col items-center justify-center py-10 px-5 gap-5">
      <Toaster/>
      <SuggestionForm/>
      <Current/>
    </div>
  );
}
