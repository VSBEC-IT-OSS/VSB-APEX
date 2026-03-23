import { useState, useEffect } from 'react';
import { dataService } from '../data/dataService.js';

/**
 * Generic data hook — handles loading, error, and refetch.
 * Usage: const { data, loading, error } = useData('getAttendanceOverview');
 */
export function useData(method, params = null) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    dataService[method](params)
      .then(d => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [method, JSON.stringify(params)]);

  return { data, loading, error };
}
