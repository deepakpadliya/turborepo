import { useState } from 'react'
import type { ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router'
import './App.scss'
import Sidebar from './components/Sidebar'
import { FormBuilder, FormData, Forms, PreviewPage, PublicFormPage } from './components/forms'
import { FaUser, FaLayerGroup, FaBars, FaTimes } from 'react-icons/fa'
import { AuthPage, ProtectedRoute, useAuthContext } from './components/auth'

const ProtectedContent = ({ children }: { children: ReactNode }) => {
  return <ProtectedRoute>{children}</ProtectedRoute>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path='/' element={<ProtectedContent><div>Dashboard</div></ProtectedContent>} />
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/forms' element={<ProtectedContent><Forms /></ProtectedContent>} />
      <Route path='/forms/builder' element={<ProtectedContent><Navigate to='/forms' replace /></ProtectedContent>} />
      <Route path='/forms/builder/:formId' element={<ProtectedContent><FormBuilder /></ProtectedContent>} />
      <Route path='/forms/public/:publicId' Component={PublicFormPage} />
      <Route path='/forms/preview' element={<ProtectedContent><PreviewPage /></ProtectedContent>} />
      <Route path='/forms/data' element={<ProtectedContent><FormData /></ProtectedContent>} />
      <Route path='/settings' element={<ProtectedContent><div>Settings</div></ProtectedContent>} />
    </Routes>
  );
};

const AppLayout = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isPublicFormRoute = location.pathname.startsWith('/forms/public/');
  const isAuthRoute = location.pathname.startsWith('/auth');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (isPublicFormRoute || isAuthRoute) {
    return (
      <main className='public-layout'>
        <AppRoutes />
      </main>
    );
  }

  return (
    <>
      <div className='navbar'>
        <button className='sidebar-toggle' onClick={toggleSidebar} aria-label="Toggle Sidebar">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <div className='logo'>
          <FaLayerGroup />
          FormBuilder
        </div>
        {isAuthenticated ? (
          <>
            <div className='profile'>
              <FaUser />
              {user?.email ?? 'Signed in'}
            </div>
            <button className='logout-btn' onClick={logout} type='button'>
              Logout
            </button>
          </>
        ) : null}
      </div>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <Sidebar isCollapsed={!sidebarOpen} />
      </aside>

      <main className={`container ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
        <AppRoutes />
      </main>
      <div className={`footer ${sidebarOpen ? 'expanded' : 'collapsed'}`}>
        © 2026 FormBuilder - All rights reserved
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App
