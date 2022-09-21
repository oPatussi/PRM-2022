import { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { useAuth } from './hook/useAuth'
import { HomePage } from './pages/Home'
import { LoginPage } from './pages/Login'

function App() {
  
  const {user} = useAuth();

  return (
    <div id="app">
      {user ? (
      <HomePage></HomePage>
      ):(
        <Routes>
          <Route path='*' element={<LoginPage></LoginPage>} />
        </Routes>
        
      )}
      </div>
  )
}

export default App
