import { Outlet } from 'react-router-dom'
import SideBar from './components/SideBar'

function RootLayout() {
  return (
    <div className="flex h-screen ">
      <SideBar />
      <div className="my-[14px] mx-[20px] w-full  max-h-screen overflow-hidden">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
