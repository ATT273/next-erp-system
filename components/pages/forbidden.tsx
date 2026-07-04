import Link from 'next/link'
import React from 'react'

const Forbidden = () => {
  return (
    <div className='h-[100vh] w-full flex flex-col justify-center items-center gap-2'>
      <h1 className='font-bold text-3xl'>Sorry, you do not have access to this page</h1>
      <Link href={'/dashboard'}>
        <button className='bg-stone-200 rounded-md h-[3em] w-[10rem]'>Go to Dashboard</button>
      </Link>
    </div>
  )
}

export default Forbidden