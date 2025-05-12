import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomeOrders from './pages/HomeOrders';
import HomeAdmin from './pages/HomeAdmin';
import NotFound from './pages/NotFound';
import ProtectedRoute from './auth/ProtectedRoute';
import RedirectIfAuth from './auth/RedirectIfAuth';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={<RedirectIfAuth><Login/></RedirectIfAuth>}
        />
        <Route
          path="/signup"
          element={<RedirectIfAuth><Signup/></RedirectIfAuth>}
        />
        <Route element={<ProtectedRoute roles={['normal']} />}>
          <Route path="/home-orders" element={<HomeOrders />} />
        </Route>
        <Route element={<ProtectedRoute roles={['admin']} />}>
          <Route path="/home-admin" element={<HomeAdmin />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
