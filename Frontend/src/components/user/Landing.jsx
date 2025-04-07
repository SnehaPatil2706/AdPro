import React from 'react'
import Footer from './Footer'
import { Outlet } from 'react-router'
import Header from './Header'
import Sidebar from './Sidebar'

function Landing() {
  return (
    <>
     <Header />
     <Sidebar />
     <Outlet />
     <Footer />
    </>
  )
}

export default Landing