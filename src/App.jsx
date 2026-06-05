import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SignatureTool from './pages/SignatureTool';
import MergeTool from './pages/MergeTool';
import FillFormTool from './pages/FillFormTool';
import ProcessedPDFPage from './pages/ProcessedPDFPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/signatures" element={<SignatureTool />} />
      <Route path="/merge" element={<MergeTool />} />
      <Route path="/forms" element={<FillFormTool />} />
      <Route path="/forms/preview" element={<ProcessedPDFPage />} />
    </Routes>
  );
}
