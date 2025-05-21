import React from 'react'
import ToglleButton from './ToglleButton'

const DashboardHeader = () => {

    const dailyTrends = ['1D', '1M', '1Y','All']
  return (
    <div className=' py-6 '>
      <div className='flex flex-col gap-4'>
        {/* subheader div */}
        <div className='flex justify-between w-full'>
            <h1 className='font-semibold Inter text-2xl'>Dashboard</h1>
            <button className='bg-blue-700 rounded-lg py-1 px-3 text-white'>Add Asset</button>

        </div>

        {/* toggle button and daily trend */}
        <div className='flex justify-between mt-4'>
            <ToglleButton />

            <div className='grid grid-cols-4 gap-2 font-semibold '>
                {
                    dailyTrends.map((list, index)=>(
                        <h1 
                        
                        className='border border-gray-200 rounded flex items-center px-2  hover:bg-blue-100'>{list}</h1>
                    ))
                }
            </div>

        </div>

      </div>
    </div>
  )
}

export default DashboardHeader
