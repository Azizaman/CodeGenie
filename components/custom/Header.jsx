import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext';
import Router from 'next/router';
import { useRouter } from 'next/navigation';

function Header() {
  const router=useRouter();
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  return (
    <div className='p-1 flex justify-between items-center cursor-pointer'>
        <Image src={'/logo.png'} alt='Logo' width={80} height={80} onClick={()=>{
          router.push('/')
        }}/>
        {!userDetail?.name &&
        <div className='flex gap-5'>
          
        <Button variant="ghost">Sign in</Button>
        <Button className={'text-white'} style={{
            backgroundColor:Colors.BLUE
        }}>Get Started</Button>

        </div>
      }
        

    </div>
  )
}

export default Header