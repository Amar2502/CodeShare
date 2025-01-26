import React from 'react'
import Footer from './components/Pages/Footer'
import { Outlet } from 'react-router-dom'
import SideBar from './components/Pages/Profile/SideBar'

function WorkspaceLayout() {
    return (
      <>
        <div className='flex h-screen'>
          <div className='w-64 bg-gray-800 text-white h-full'>
            <SideBar />
          </div>
          <div className='flex-1 overflow-auto'>
            <Outlet />
          </div>
        </div>
        <Footer />
      </>
    )
}

export default WorkspaceLayout
