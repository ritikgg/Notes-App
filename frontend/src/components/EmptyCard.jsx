import React from 'react';
import { MdNoteAdd, MdDeleteSweep, MdArchive } from 'react-icons/md';

const EmptyCard = ({ imgSrc, message, type }) => {
    const getIcon = () => {
        switch (type) {
            case 'trash': return <MdDeleteSweep className='text-6xl text-red-300' />;
            case 'archive': return <MdArchive className='text-6xl text-purple-600' />
            default: return <MdNoteAdd className='text-6xl text-blue-300' />
        }
    }

    return(
        <div className="flex flex-col items-center justify-center mt-20 transition-all duration-300 ease-in-out">
            <div className="bg-gray-50 p-6 rounded-full mb-4 shadow-sm animate-pulse">
                {getIcon()}
            </div>
            <p className="w-1/2 text-sm font-medium text-slate-700 text-center leading-7">
            {message}
            </p>

        </div>
    )
}
export default EmptyCard;