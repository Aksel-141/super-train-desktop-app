import { MdHome, MdEditDocument } from 'react-icons/md'
import { NavLink } from 'react-router-dom'
import navRoutes from '../constants/routes'
console.log(navRoutes)

const navMenuItems = [
  {
    id: 'home',
    title: 'головна',
    path: '/',
    icon: <MdHome size={24} />
  },
  {
    id: 'exercisesEditor',
    title: 'Редактор вправ',
    path: '/exercisesEditor',
    icon: <MdEditDocument size={24} />
  },
  {
    id: 'workautEditor',
    title: 'Редактор тренувань',
    path: '/workoutEditor',
    icon: <MdEditDocument size={24} />
  }
]

function SideBar() {
  return (
    <div className="max-w-[325px] bg-[#fff] px-[28px] pt-[6px]">
      {/* Logo title */}
      <div className="text-center ">
        <h1 className="font-bold text-[36px] text-[#C67AFF] select-none">Super Trainer</h1>
      </div>
      {/* Nav menu */}
      <div className="mt-[29px]">
        {navMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path} // Використовуємо шлях для навігації
            className="flex items-center gap-2  hover:bg-[#f4f4f4] rounded-md cursor-pointer mb-[5px]"
            style={({ isActive }) => ({
              color: isActive ? '#C67AFF' : '#404040'
            })}
          >
            {item.icon}
            <span className="text-[24px] font-semibold capitalize">{item.title}</span>
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export default SideBar
