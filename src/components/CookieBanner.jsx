import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function CookieBanner() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('devshub_cookie_consent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  if (!isVisible) return null;

  const handleAccept = () => {
    localStorage.setItem('devshub_cookie_consent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('devshub_cookie_consent', 'rejected');
    setIsVisible(false);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'var(--surface-bg)',
      borderTop: '1px solid var(--surface-border)',
      padding: '1.5rem 2rem',
      zIndex: 1000,
      boxShadow: '0 -4px 20px rgba(0,0,0,0.2)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ flex: '1 1 300px' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{t('cookie.title', 'Sua privacidade')}</h3>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            {t('cookie.desc', 'Utilizamos tecnologias essenciais para operar o DevsHub e, com sua permissão, podemos utilizar tecnologias adicionais para entender o uso da plataforma e melhorar nossos serviços.')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button onClick={handleReject} className="button outline" style={{ padding: '0.5rem 1rem' }}>
            {t('cookie.reject', 'Rejeitar não essenciais')}
          </button>
          <button className="button outline" style={{ padding: '0.5rem 1rem' }}>
            {t('cookie.configure', 'Configurar')}
          </button>
          <button onClick={handleAccept} className="button primary" style={{ padding: '0.5rem 1rem' }}>
            {t('cookie.accept', 'Aceitar')}
          </button>
        </div>
      </div>
    </div>
  );
}
