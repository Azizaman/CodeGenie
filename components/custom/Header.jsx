import React, { useContext, useState } from 'react'
import Image from 'next/image'
import { Button } from '../ui/button'
import Colors from '@/data/Colors'
import { UserDetailContext } from '@/context/UserDetailContext';
import { useRouter } from 'next/navigation';

function Header() {
  const router = useRouter();
  const { userDetail } = useContext(UserDetailContext);
  
  return (
    <div className='p-1 flex justify-between items-center w-full'>
      <Image 
        src={'/logo.png'} 
        alt='Logo' 
        width={60} 
        height={60}
        className='w-12 h-12 md:w-16 md:h-16 cursor-pointer'
        onClick={() => router.push('/')}
      />
      
      <Button 
        className='mr-2 md:mr-10 text-sm md:text-base'
        onClick={() => router.push('/pricing')}
        style={{ backgroundColor: Colors.BLUE }}
      >
        Subscription
      </Button>

      {!userDetail?.name && (
        <div className='flex gap-2 md:gap-5'>
          <Button 
            variant="ghost" 
            className='text-sm md:text-base'
            onClick={() => router.push('/signin')}
          >
            Sign In
          </Button>
          <Button 
            className='text-white text-sm md:text-base'
            style={{ backgroundColor: Colors.BLUE }}
            onClick={() => router.push('/signup')}
          >
            Get Started
          </Button>
        </div>
      )}
    </div>
  )
}

export default Header