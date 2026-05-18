import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Fashion from "./pages/Fashion";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import Search from "./pages/Search";

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Guest Routes: If they have a token already, route past login straight to store */}
        <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/signup" element={token ? <Navigate to="/" replace /> : <Signup />} />

        {/* 🔒 PROTECTED SWIFTCART ROUTES (Requires active token session) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/fashion" element={<Fashion />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>
          
          {/* Admin Layout (Dedicated Admin Dashboard) */}
          <Route element={<AdminRoute />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
        </Route>

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
