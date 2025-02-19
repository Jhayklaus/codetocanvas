'use client';
import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import Image from 'next/image';
import lamp from '@/assets/svgs/lamp.svg';
import { ChevronDown } from 'lucide-react';
import { Ramadan } from '@/assets/svgs/Ramadan';

interface CustomSelectProps<T extends React.ReactNode> {
  value: T | '';
  onChange: (value: T) => void;
  options: T[];
  label?: string;
}

const CustomSelect = <T extends React.ReactNode>({ value, onChange, options, label }: CustomSelectProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  const selectOption = (option: T) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        className="w-full px-3 py-2 border rounded-lg text-black flex justify-between items-center"
        onClick={toggleOpen}
      >
        {String(value) || `Select ${label}`}
        <ChevronDown className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 max-h-[200px] overflow-auto">
          {options.map((option, index) => (
            <button
              key={index}
              type="button"
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 text-black"
              onClick={() => selectOption(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CountdownDisplay = ({ day1, day2 }: { day1: string; day2: string }) => (
  <div className='flex justify-center gap-2 w-2/4 mt-2 h-[12vh]'>
    <div className='bg-[#D49E46] w-2/4 rounded flex justify-center items-center'>
      <p className=' text-center text-4xl font-bold font-mono text-white'>{day1 || "0"}</p>
    </div>
    <div className='bg-[#D49E46] w-2/4 rounded flex justify-center items-center'>
      <p className='text-center text-4xl font-bold font-mono text-white '>{day2 || "0"}</p>
    </div>
  </div>
);

const TemplateContent = ({ templateRef, day1, day2, content, type }: { templateRef: React.RefObject<HTMLDivElement | null>; day1: string; day2: string; content: string; type: string }) => (
  <div ref={templateRef} className="flex flex-col items-center gap-2 w-full min-h-[40vh] bg-[#FDF9D1]/20 shadow pb-5">
    <div className='flex justify-between w-full'>
      <Image src={lamp} alt='lamp' width={50} />
      <div className='self-end flex flex-col items-center gap-5'>
        <div className='bg-[#D49E46] min-w-2/4 rounded-b px-2 flex justify-center items-center'>
          <p className='text-center text-xs lg:text-sm font-bold text-white '>{type}</p>
        </div>
        <Ramadan />
        {/* <div>
          <p className='text-[#BF8B3F] text-2xl md:text-xl lg:text-2xl font-black'>Ramadan 2025</p>        </div> */}
      </div>
      <Image className='rotate-360' src={lamp} alt='lamp' width={50} />
    </div>
    <CountdownDisplay day1={day1} day2={day2} />
    <div className='mt-3 px-5 text-center'>
      <p className='text-[#D49E46] font-light'>{content}</p>
    </div>
  </div>
);

export default function RamadanGraphicsTemplate() {
  const [day, setDay] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [content, setContent] = useState('');
  const templateRef = useRef<HTMLDivElement>(null);

  const saveAsImage = async () => {
    if (!templateRef.current) return;

    const canvas = await html2canvas(templateRef.current, { scale: 10 });
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = `ramadan_graphic_${new Date().toISOString().slice(0, 10)}.png`;
    link.click();
  };

  const typeSelections = ['Countdown', 'Daily Reminder'];
  const days: string[] = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, '0'));

  const splitday = day.split('');
  const day1 = splitday[0];
  const day2 = splitday[1];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Day:</label>
          <CustomSelect<string>
            value={day}
            onChange={setDay}
            options={days}
            label='Day'
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Type:</label>
          <CustomSelect<string>
            value={type}
            onChange={setType}
            options={typeSelections}
            label='Type'
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content"
            className="w-full px-3 py-2 border rounded-lg h-32 text-black"
          />
        </div>
        <TemplateContent templateRef={templateRef} day1={day1} day2={day2} content={content} type={type} />
        <button
          onClick={saveAsImage}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Download Image
        </button>
      </div>
    </div>
  );
};

