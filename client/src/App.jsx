import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Discovery from './pages/Discovery';
import Leads from './pages/Leads';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import GoogleCallback from './pages/GoogleCallback';

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen text-zinc-50 relative">
      <div className="bg-mesh" />
      <Sidebar />
      <main className="ml-64 flex-1 p-8 max-w-[1600px] w-full mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <DashboardLayout />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/discovery" replace />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
