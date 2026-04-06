import { useState, useEffect, useRef } from 'react';

// In-memory cache: title → image URL (persists for the session)
const imageCache = new Map();
// Pending requests tracker to avoid duplicate fetches
const pending = new Set();

// Jikan rate limit: ~3 req/s — we space out with a simple queue
const queue = [];
let isProcessing = false;

function enqueue(fn) {
  return new Promise((resolve, reject) => {
    queue.push({ fn, resolve, reject });
    if (!isProcessing) processQueue();
  });
}

async function processQueue() {
  isProcessing = true;
  while (queue.length > 0) {
    const { fn, resolve, reject } = queue.shift();
    try { resolve(await fn()); }
    catch (err) { reject(err); }
    // 400ms gap between requests to stay well under the 3 req/s limit
    if (queue.length > 0) await new Promise(r => setTimeout(r, 400));
  }
  isProcessing = false;
}

async function fetchAnimeImage(title) {
  const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Jikan ${res.status}`);
  const json = await res.json();
  const item = json.data?.[0];
  // Prefer large webp, fall back to jpg
  return item?.images?.webp?.large_image_url
    || item?.images?.jpg?.large_image_url
    || item?.images?.jpg?.image_url
    || null;
}

/**
 * Returns { imageUrl, loading, error } for a given anime title.
 * Only starts fetching when `shouldFetch` is true (controlled by the caller
 * via IntersectionObserver so we only load visible cards).
 */
export function useAnimeImage(title, shouldFetch) {
  const [imageUrl, setImageUrl] = useState(() => imageCache.get(title) ?? null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!shouldFetch) return;
    if (imageCache.has(title)) { setImageUrl(imageCache.get(title)); return; }
    if (pending.has(title)) return;
    if (fetchedRef.current) return;

    fetchedRef.current = true;
    pending.add(title);
    setLoading(true);

    enqueue(() => fetchAnimeImage(title))
      .then(url => {
        imageCache.set(title, url);
        setImageUrl(url);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      })
      .finally(() => pending.delete(title));
  }, [title, shouldFetch]);

  return { imageUrl, loading, error };
}
