import React from 'react'
import Header from './components/Pages/Header'
import Footer from './components/Pages/Footer'
import { Outlet } from 'react-router-dom'

function Layout() {
    return (
      <>
      {/* <Header/> */}
      <Outlet/>
      <Footer/>
      </>  
    )
}

export default Layout
