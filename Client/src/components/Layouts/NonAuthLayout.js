import React from 'react'
import NavBar from '../NavBar'
import { Outlet } from 'react-router'

const NonAuthLayout = () => {
  
  return (
    <>
    <NavBar />
    <Outlet />
    </>
  )
}

export default NonAuthLayout