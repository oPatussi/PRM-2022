import { Route, Routes } from 'react-router-dom';

//Contexts
import { AuthContextProvider } from './context/AuthContext';
import { CartContextProvider } from './context/CartContext';

//Pages
import { HomePage } from './pages/Home';
import { ProductPage } from './pages/Product';
import { SignInPage } from './pages/SignIn';
import { SignUpPage } from './pages/SignUp';

//CSS GLobal
import './assets/css/global.scss';

function App() {
  return (
    <AuthContextProvider>
      <CartContextProvider>
        <Routes>
          <Route path="" element={<HomePage />} />
          <Route path="/products/:id" element={<ProductPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Routes>
      </CartContextProvider>
    </AuthContextProvider>
  )
}

export default App
