import React from 'react'
import ToglleButton from './ToglleButton'
import { Link } from 'react-router-dom'

const DashboardHeader = () => {

    const dailyTrends = ['1D', '1M', '1Y','All']
  return (
    <div className=' py-6 '>
      <div className='flex flex-col justify-center   gap-4'>
        {/* subheader div */}
        <div className='flex   justify-between '>
           <Link to='/dashboard'> <h1 className='font-semibold Inter text-2xl'>Dashboard</h1></Link>
            <button className='bg-blue-700  rounded-lg py-1 px-3 text-white'>Add Asset</button>

        </div>

        {/* toggle button and daily trend */}
        <div className='flex md:flex-row flex-col gap-4 justify-between mt-4'>
            <ToglleButton />

            <div className="w overflow-x-hidden">
  <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 w-full font-semibold'>
    {
      dailyTrends.map((list, index) => (
        <h1
          key={index}
          className='border border-gray-200 rounded flex items-center px-2 py-2 hover:bg-blue-100 transition duration-200 truncate'
        >
          {list}
        </h1>
      ))
    }
  </div>
</div>


        </div>

      </div>
    </div>
  )
}

export default DashboardHeader
