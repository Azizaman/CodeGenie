import { UserDetailContext } from '@/context/UserDetailContext';
import { api } from '@/convex/_generated/api';
import { useConvex } from 'convex/react';
import React, { useContext, useEffect, useState } from 'react'
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';

function WorkspaceHistory() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [workspaceList, setworkspaceList] = useState();
  const { toggleSidebar } = useSidebar();

  const convex = useConvex();
  useEffect(() => {
    if (userDetail) {
      GetAllWorkspace();
    }
  }, [userDetail]);

  const GetAllWorkspace = async () => {
    const result = await convex.query(api.workspace.GetAllworkspace, {
      userId: userDetail?._id
    });
    setworkspaceList(result);
    console.log('This is the result in the workspace history: ', result);
  };

  return (
    <div>
      <h2 className='font-medium text-lg'>Your Chats</h2>
      <div>
        {workspaceList && workspaceList?.map((workspace, index) => (
          <Link href={'/workspace/' + workspace?._id} key={index}>
            <h2 
              onClick={toggleSidebar} // Just toggle sidebar without reload
              className='text-sm text-gray-400 font-light space-y-4 mt-5 hover:text-white cursor-pointer'>
              {workspace?.messages[0]?.content}
            </h2>
          </Link>
          
        ))}
        
      </div>
    </div>
  );
}

export default WorkspaceHistory;
