import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Hub from './pages/Hub';
import NpmVerifyTool from './pages/NpmVerifyTool';
import RagSandbox from './pages/RagSandbox';
import TokenEstimator from './pages/TokenEstimator';
import CICDBuilder from './pages/CICDBuilder';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hub />} />
          <Route path="npm-verify" element={<NpmVerifyTool />} />
          <Route path="rag-sandbox" element={<RagSandbox />} />
          <Route path="token-estimator" element={<TokenEstimator />} />
          <Route path="cicd-builder" element={<CICDBuilder />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
