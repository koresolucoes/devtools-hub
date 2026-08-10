import { useState, useEffect } from 'react';
import { Rss, ExternalLink, Flame } from 'lucide-react';

export default function TechFeed() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHN() {
      try {
        const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
        const ids = await res.json();
        
        // Fetch top 6 stories
        const topIds = ids.slice(0, 6);
        const storyPromises = topIds.map(id => 
          fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
        );
        
        const topStories = await Promise.all(storyPromises);
        setStories(topStories);
      } catch (err) {
        console.error('Failed to fetch HN', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHN();
  }, []);

  return (
    <aside className="tech-feed-sidebar card">
      <div className="feed-header" style={{ padding: '1rem', borderBottom: '1px solid var(--surface-border)' }}>
        <h3><Flame size={16} style={{ color: 'var(--danger)' }}/> Trending Tech (HN)</h3>
        <a href="https://news.ycombinator.com" target="_blank" rel="noreferrer" title="Hacker News">
          <Rss size={16} style={{ color: 'var(--text-secondary)' }} />
        </a>
      </div>
      
      <div className="feed-list">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Loading feed...
          </div>
        ) : (
          stories.map(story => (
            <div key={story.id} className="feed-item">
              <a href={story.url || `https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noreferrer" className="feed-title">
                {story.title}
              </a>
              <div className="feed-meta">
                <span>{story.score} pts</span>
                <span>by {story.by}</span>
                <a href={`https://news.ycombinator.com/item?id=${story.id}`} target="_blank" rel="noreferrer" style={{ marginLeft: 'auto', color: 'inherit' }}>
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
