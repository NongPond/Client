import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AcceptInvite from "./pages/AcceptInvite";
import Notifications from "./pages/Notifications";
import ProtectedRoute from "./components/ProtectedRoute"
import BoardList from "./pages/BoardList";
import GuestHome from "./pages/GuestHome";
import Verify from "./pages/Verify";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<GuestHome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/boards" element={<BoardList />} />
      <Route path="/verify" element={<Verify />} />
      
      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/board/:boardId"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/invite/:token"
        element={
          <ProtectedRoute>
            <AcceptInvite />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;