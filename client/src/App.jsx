import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Discovery from './pages/Discovery';
import Leads from './pages/Leads';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen text-zinc-50 relative">
        <div className="bg-mesh" />
        <Sidebar />
        <main className="ml-64 flex-1 p-8 max-w-[1600px] w-full mx-auto relative z-10">
          <Routes>
            <Route path="/" element={<Navigate to="/discovery" replace />} />
            <Route path="/discovery" element={<Discovery />} />
            <Route path="/leads" element={<Leads />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
