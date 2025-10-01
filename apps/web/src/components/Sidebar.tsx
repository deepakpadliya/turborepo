import './Sidebar.scss'
import Anchor from '@repo/ui/Anchor';
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
          <Anchor href={menu.href}>{menu.name} {menu.submenu ? <ChevronDownIcon /> : null}</Anchor>
          {menu.submenu && (
            <ul className="submenu">
              {menu.submenu.map((subitem) => (
                <li key={subitem.name}>
                  <Anchor href={subitem.href}>{subitem.name}</Anchor>
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