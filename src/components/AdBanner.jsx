import { motion } from 'framer-motion';
import '../index.css';

function AdBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="ad-banner-container"
    >
      <div className="ad-content">
        <span className="ad-badge">Patrocinado</span>
        <div className="ad-placeholder-text">
          Espaço para Anúncios (AdSense / Sponsors)
        </div>
        <p className="ad-subtext">Apoie os desenvolvedores do Hub</p>
      </div>
    </motion.div>
  );
}

export default AdBanner;
