import {
  Routes,
  Route,
  Navigate
} from "react-router-dom";
import Home from './Home';
import Login from './Login';
import Settings from './Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/settings" element={<Settings />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}