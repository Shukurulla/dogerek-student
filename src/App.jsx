import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AllClubs from "./pages/AllClubs";
import MyClubs from "./pages/MyClubs";
import Applications from "./pages/Applications";
import ExternalCourses from "./pages/ExternalCourses";
import Attendance from "./pages/Attendance";
import Profile from "./pages/Profile";

function App() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Routes>
      <Route path="/login" element={!token ? <Login /> : <Navigate to="/" />} />

      <Route element={<PrivateRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/all-clubs" element={<AllClubs />} />
          <Route path="/my-clubs" element={<MyClubs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/external-courses" element={<ExternalCourses />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
