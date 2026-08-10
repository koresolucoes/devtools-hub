import { useState, useEffect } from 'react';
import { Rss, ExternalLink, Flame, GitBranch, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function getRelativeTime(timestamp, language = 'en') {
  const rtf = new Intl.RelativeTimeFormat(language.split('-')[0], { numeric: 'auto' });
  const daysDifference = Math.round((timestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
  const hoursDifference = Math.round((timestamp * 1000 - Date.now()) / (1000 * 60 * 60));
  
  if (Math.abs(daysDifference) > 0) return rtf.format(daysDifference, 'day');
  return rtf.format(hoursDifference, 'hour');
}

export default function TechFeed() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('hn'); // 'hn' or 'github'
  const [stories, setStories] = useState([]);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(Date.now());

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'hn') {
        const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const ids = await res.json();
        const topIds = ids.slice(0, 6);
        const storyPromises = topIds.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        setStories(await Promise.all(storyPromises));
      } else {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const res = await fetch(`https://api.github.com/search/repositories?q=created:>${oneWeekAgo}&sort=stars&order=desc`);
        const data = await res.json();
        setRepos(data.items.slice(0, 6));
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
      setLastUpdated(Date.now());
    }
  };

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchData();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  return (
    <aside className="tech-feed-sidebar card" style={{ padding: 0 }}>
      <div className="feed-tabs" style={{ display: 'flex', borderBottom: '1px solid var(--surface-border)' }}>
        <button 
          onClick={() => setActiveTab('hn')}
          style={{ flex: 1, padding: '1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'hn' ? '2px solid var(--accent-color)' : '2px solid transparent', color: activeTab === 'hn' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 500 }}
        >
          <Flame size={16} style={{ color: activeTab === 'hn' ? 'var(--danger)' : 'currentColor' }}/> {t('tech_feed.trending_hn')}
        </button>
        <button 
          onClick={() => setActiveTab('github')}
          style={{ flex: 1, padding: '1rem', background: 'transparent', border: 'none', borderBottom: activeTab === 'github' ? '2px solid var(--accent-color)' : '2px solid transparent', color: activeTab === 'github' ? 'var(--text-primary)' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 500 }}
        >
          <GitBranch size={16} /> {t('tech_feed.trending_gh')}
        </button>
      </div>

      <div className="feed-actions" style={{ padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-bg)', borderBottom: '1px solid var(--surface-border)', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span>{t('tech_feed.updated')} {new Date(lastUpdated).toLocaleTimeString()}</span>
        <button onClick={fetchData} disabled={loading} style={{ background: 'transparent', border: 'none', color: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <RefreshCw size={12} className={loading ? 'spinning' : ''} /> {t('tech_feed.refresh')}
        </button>
      </div>
      
      <div className="feed-list">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            {t('tech_feed.loading')}
          </div>
        ) : activeTab === 'hn' ? (
          stories.map(story => (
            <div key={story.id} className="feed-item">
              <a href={story.url || `https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noreferrer" className="feed-title">
                {story.title}
              </a>
              <div className="feed-meta">
                <span>{story.score} pts</span>
                <span>by {story.by} • {getRelativeTime(story.time, i18n.language)}</span>
                <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: 'inherit' }}>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))
        ) : (
          repos.map(repo => (
            <div key={repo.id} className="feed-item">
              <a href={repo.html_url} target="_blank" rel="noreferrer" className="feed-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <GitBranch size={14} /> {repo.full_name}
              </a>
              <div className="feed-meta">
                <span style={{ color: 'var(--accent-color)' }}>★ {repo.stargazers_count.toLocaleString()}</span>
                <span>{repo.language || 'Markdown'}</span>
                <a href={repo.html_url} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: 'inherit' }}>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
