import React from 'react'
import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import SideBar from './components/Pages/Profile/SideBar'

function NoHFLayout() {
    return (
      <>
      <Outlet/>
      <Toaster/>
      </>  
    )
}

export default NoHFLayout
