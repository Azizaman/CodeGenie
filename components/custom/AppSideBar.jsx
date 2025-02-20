"use client" 
import React, { useState } from 'react';
import Image from 'next/image';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from '../ui/button';
import { MessageCircleCode } from 'lucide-react';
import WorkspaceHistory from './WorkspaceHistory';
import { useRouter } from 'next/navigation';
function AppSideBar() {
  const router=useRouter();
  const [renderKey, setRenderKey] = useState(0);  // Trigger controlled re-renders

  // Function to force re-render
  const forceReRender = () => {
    setRenderKey(prev => prev + 1);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-2">
        <Image src={'/logo.png'} alt="logo" height={75} width={75} onClick={()=>router.push('/')} className='cursor-pointer'></Image>
      </SidebarHeader>
      <SidebarContent className={'p-5'}>
        <Button onClick={forceReRender}> 
          <MessageCircleCode/> Start New Chat 
        </Button>
        <SidebarGroup>
          <WorkspaceHistory key={renderKey} forceReRender={forceReRender} />
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <Button>Subscription</Button>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSideBar;
