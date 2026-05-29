import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignatureTool from './pages/SignatureTool';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signatures" element={<SignatureTool />} />
    </Routes>
  );
}
