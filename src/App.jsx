import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Hub from './pages/Hub';
import OsvScanner from './pages/OsvScanner';
import RagSandbox from './pages/RagSandbox';
import TokenEstimator from './pages/TokenEstimator';
import PipelineArchitect from './pages/PipelineArchitect';
import GuideDetail from './pages/GuideDetail';
import TemplateDetail from './pages/TemplateDetail';
import BriefingDetail from './pages/BriefingDetail';
import GuidesIndex from './pages/GuidesIndex';
import TemplatesIndex from './pages/TemplatesIndex';
import BriefingIndex from './pages/BriefingIndex';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Hub />} />
          
          {/* New /tools routes */}
          <Route path="tools/osv-dependency-scanner" element={<OsvScanner />} />
          <Route path="tools/rag-chunking-sandbox" element={<RagSandbox />} />
          <Route path="tools/token-estimator" element={<TokenEstimator />} />
          <Route path="tools/pipeline-architect" element={<PipelineArchitect />} />

          {/* Knowledge Graph Routes */}
          <Route path="guides" element={<GuidesIndex />} />
          <Route path="guides/:slug" element={<GuideDetail />} />
          
          <Route path="templates" element={<TemplatesIndex />} />
          <Route path="templates/:slug" element={<TemplateDetail />} />
          
          <Route path="briefing" element={<BriefingIndex />} />
          <Route path="briefing/:slug" element={<BriefingDetail />} />

          {/* Legal Routes */}
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />

          {/* Legacy redirects */}
          <Route path="npm-verify" element={<Navigate to="/tools/osv-dependency-scanner" replace />} />
          <Route path="rag-sandbox" element={<Navigate to="/tools/rag-chunking-sandbox" replace />} />
          <Route path="token-estimator" element={<Navigate to="/tools/token-estimator" replace />} />
          <Route path="cicd-builder" element={<Navigate to="/tools/pipeline-architect" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
