import { Article } from '../types';

export function sortArticles(articles: Article[], sortBy?: 'date' | 'priority' | 'views'): Article[] {
  const sorted = [...articles];
  if (sortBy === 'priority') {
    return sorted.sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99));
  } else if (sortBy === 'views') {
    return sorted.sort((a, b) => (b.viewsCount || 0) - (a.viewsCount || 0));
  } else {
    // Default 'date': sort newest first
    return sorted.sort((a, b) => {
      const timeA = a.isoDate ? new Date(a.isoDate).getTime() : 0;
      const timeB = b.isoDate ? new Date(b.isoDate).getTime() : 0;
      if (timeA !== timeB) return timeB - timeA;
      return (b.id || '').localeCompare(a.id || '');
    });
  }
}
