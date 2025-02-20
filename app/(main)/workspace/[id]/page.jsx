import Chatview from '@/components/custom/Chatview'
import Codeview from '@/components/custom/Codeview'
import React from 'react'

function Workspace() {
  return (
    <div className='pl-8 pt-2 grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Chatview/>
        <div className='col-span-2'>
        <Codeview/>

        </div>
        
        </div>
  )
}

export default Workspace