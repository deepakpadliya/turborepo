import './Sidebar.scss'
import Anchor from '@repo/ui/Anchor';

const Sidebar = () => {
  return (
    <ul className="sidebar">
        <li><Anchor href='/'>Dashboard</Anchor></li>
        <li><Anchor href='/forms'>Forms</Anchor></li>
        <li><Anchor href='/settings'>Settings</Anchor></li>
    </ul>
  )
}

export default Sidebar