import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Sidebar from './components/Sidebar'

function App() {

  return (
    <>
     <div className='navbar'>
      <div className='logo'>logo</div>
      <div className='profile'>profile</div>
     </div>
     
      <aside className='sidebar'>
        <Sidebar />
      </aside>
     
     <main className='container'>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<div>Dashboard</div>} />
          <Route path='/forms' element={<div>Forms</div>} />
          <Route path='/settings' element={<div>Settings</div>} />
        </Routes>
      </BrowserRouter>
     </main>
     <div className='footer'>footer</div>
    </>
  )
}

export default App
