import './Sidebar.scss'
import { ChevronDownIcon } from "@radix-ui/react-icons";

const Sidebar = () => {
  const menus =[
    { name: 'Dashboard', href: '/' },
    { name: 'Forms', submenu: [
      { name: 'Form Design', href: '/forms/design' },
      { name: 'Form Data', href: '/forms/data' },
    ]},
    { name: 'Settings', href: '/settings' },
  ];
  return (
    <ul className="sidebar">
      {menus.map((menu) => (
        <li key={menu.name}>
          <a href={menu.href}>{menu.name} {menu.submenu ? <ChevronDownIcon /> : null}</a>
          {menu.submenu && (
            <ul className="submenu">
              {menu.submenu.map((subitem) => (
                <li key={subitem.name}>
                  <a href={subitem.href}>{subitem.name}</a>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  )
}

export default Sidebar