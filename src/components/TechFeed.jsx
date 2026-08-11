import { useState, useEffect } from 'react';
import { ExternalLink, ArrowRight, GitBranch, Flame } from 'lucide-react';
import { briefing } from '../data/contentModel';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../index.css';

// Helper to format large numbers to "k" format
const formatNumber = (num) => {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num;
};

// Helper to clean up descriptions
const cleanDescription = (desc, t) => {
  if (!desc) return 'No description provided.';
  // Detect Chinese characters
  if (/[\u4e00-\u9fa5]/.test(desc)) {
    // Basic heuristics for known repos to make it look nicer, otherwise generic fallback
    if (desc.toLowerCase().includes('agent')) return 'Agentic AI toolkit designed for local execution.';
    if (desc.toLowerCase().includes('writing') || desc.toLowerCase().includes('读起来像')) return 'AI writing toolkit designed to produce more natural, human-like output.';
    if (desc.toLowerCase().includes('ppt') || desc.toLowerCase().includes('slides')) return 'AI presentation generator and formatting toolkit.';
    return t('tech_feed.fallback_desc', 'Trending repository on GitHub.');
  }
  return desc;
};

// Helper for relative time (e.g., 2h)
const getShortRelativeTime = (timestamp) => {
  const diff = Math.round((Date.now() - timestamp * 1000) / (1000 * 60 * 60));
  if (diff >= 24) return Math.round(diff / 24) + 'd';
  if (diff === 0) return '1h';
  return diff + 'h';
};

export default function TechFeed() {
  const { t } = useTranslation();
  const [liveGithub, setLiveGithub] = useState([]);
  const [liveHn, setLiveHn] = useState([]);
  const [loading, setLoading] = useState(true);

  const latestBrief = briefing[0];

  useEffect(() => {
    async function fetchLiveData() {
      try {
        const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const ghRes = await fetch(`https://api.github.com/search/repositories?q=created:>${oneWeekAgo}&sort=stars&order=desc`);
        const ghData = await ghRes.json();
        if (ghData.items) {
          setLiveGithub(ghData.items.slice(0, 3));
        }

        const hnRes = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const hnIds = await hnRes.json();
        const topIds = hnIds.slice(0, 3);
        const storyPromises = topIds.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        setLiveHn(await Promise.all(storyPromises));
      } catch (e) {
        console.error("Error fetching live briefing data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLiveData();
  }, []);

  return (
    <div className="tech-feed-section" style={{ marginTop: '4rem', marginBottom: '4rem' }}>
      
      {/* Header Section */}
      <header style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {t('tech_feed.title', 'DEVELOPER INTELLIGENCE')}
        </h2>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          {t('tech_feed.subtitle', 'What developers are building, discussing and shipping today.')}
        </p>
      </header>

      <div style={{ height: '1px', background: 'var(--surface-border)', width: '100%', marginBottom: '32px' }}></div>

      {/* TODAY'S BRIEF (Editorial Full Width) */}
      <section style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em' }}>
          <span style={{ textTransform: 'uppercase' }}>{t('tech_feed.todays_brief', "TODAY'S BRIEF")}</span>
          <span>·</span>
          <span>{latestBrief?.date?.toUpperCase()}</span>
        </div>
        
        <div className="card" style={{ padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--surface-border)', background: 'var(--surface-bg)' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {t('tech_feed.developer_intelligence', 'Developer Intelligence')} — {latestBrief?.date}
          </h3>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.6', maxWidth: '800px' }}>
            {latestBrief?.summary}
          </p>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            <span>3 {t('tech_feed.github_projects', 'GitHub projects')}</span>
            <span>·</span>
            <span>3 {t('tech_feed.hn_stories', 'HN stories')}</span>
            <span>·</span>
            <span>6 {t('tech_feed.signals_analyzed', 'signals analyzed')}</span>
          </div>

          <Link to={`/briefing/${latestBrief?.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem', color: 'var(--text-primary)', textDecoration: 'none', fontWeight: 500 }}>
            {t('tech_feed.read_briefing', "Read today's briefing")} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Feeds Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* GitHub Container */}
        <div className="card" style={{ border: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-border)' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <GitBranch size={18} /> {t('tech_feed.github_trending', 'GitHub Trending')}
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>{t('tech_feed.loading', 'Loading...')}</div>
            ) : (
              liveGithub.map((repo, idx) => (
                <a 
                  key={repo.id} 
                  href={repo.html_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    padding: '20px 24px', 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    display: 'block',
                    borderBottom: idx < liveGithub.length - 1 ? '1px solid var(--surface-border)' : 'none',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-border)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', paddingRight: '2rem' }}>{repo.name}</h4>
                    <ExternalLink size={14} style={{ color: 'var(--text-secondary)', position: 'absolute', right: '24px', top: '24px' }} />
                  </div>
                  
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '0.5rem 0 1rem 0', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {cleanDescription(repo.description, t)}
                  </p>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>★ {formatNumber(repo.stargazers_count)}</span>
                    {repo.language && (
                      <>
                        <span>·</span>
                        <span>{repo.language}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{t('tech_feed.trending', 'Trending #')}{idx + 1}</span>
                  </div>
                </a>
              ))
            )}
          </div>
          
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--surface-border)', background: 'var(--surface-bg)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <a href="https://github.com/trending" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {t('tech_feed.view_all_trending', 'View all trending')} <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Hacker News Container */}
        <div className="card" style={{ border: '1px solid var(--surface-border)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--surface-border)' }}>
            <h3 style={{ fontSize: '1.1rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
              <Flame size={18} style={{ color: 'var(--danger)' }} /> {t('tech_feed.hacker_news', 'Hacker News')}
            </h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <div style={{ padding: '24px', color: 'var(--text-secondary)' }}>{t('tech_feed.loading', 'Loading...')}</div>
            ) : (
              liveHn.map((story, idx) => (
                <a 
                  key={story.id} 
                  href={story.url || `https://news.ycombinator.com/item?id=${story.id}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  style={{ 
                    padding: '20px 24px', 
                    textDecoration: 'none', 
                    color: 'inherit', 
                    display: 'block',
                    borderBottom: idx < liveHn.length - 1 ? '1px solid var(--surface-border)' : 'none',
                    transition: 'background 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--surface-border)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h4 style={{ fontSize: '1rem', margin: 0, color: 'var(--text-primary)', lineHeight: '1.4', paddingRight: '2rem' }}>
                      {story.title}
                    </h4>
                    <ExternalLink size={14} style={{ color: 'var(--text-secondary)', position: 'absolute', right: '24px', top: '24px' }} />
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <span>{story.score} {t('tech_feed.pts', 'pts')}</span>
                    {story.descendants !== undefined && (
                      <>
                        <span>·</span>
                        <span>{story.descendants} {t('tech_feed.comments', 'comments')}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{getShortRelativeTime(story.time)}</span>
                  </div>
                </a>
              ))
            )}
          </div>
          
          <div style={{ padding: '16px 24px', borderTop: '1px solid var(--surface-border)', background: 'var(--surface-bg)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
            <a href="https://news.ycombinator.com" target="_blank" rel="noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {t('tech_feed.view_hn', 'View Hacker News')} <ArrowRight size={14} />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
