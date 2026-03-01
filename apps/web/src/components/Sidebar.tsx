import './Sidebar.scss'
import { NavLink } from 'react-router';
import { FaHome, FaWpforms, FaCog } from 'react-icons/fa';

const Sidebar = ({ isCollapsed = false }) => {
  const menus =[
    { name: 'Dashboard', href: '/', icon: FaHome },
    { name: 'Forms', href: '/forms', icon: FaWpforms },
    { name: 'Settings', href: '/settings', icon: FaCog },
  ];

  return (
    <ul className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {menus.map((menu) => {
        const Icon = menu.icon;
        return (
          <li key={menu.name}>
            <NavLink to={menu.href} className="menu-link">
              <div className="menu-content">
                <Icon className="menu-icon" />
                {!isCollapsed && <span className="menu-text">{menu.name}</span>}
              </div>
            </NavLink>
          </li>
        );
      })}
    </ul>
  )
}

export default Sidebar