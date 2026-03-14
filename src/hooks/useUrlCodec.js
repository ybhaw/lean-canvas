import { useState, useEffect, useCallback, useRef } from 'react';
import { encode, decode } from '../lib/codec';
import { validateCanvasData } from '../lib/canvas-fields';

export function useUrlCodec() {
  const [sharedData, setSharedData] = useState(null);
  const [isShared, setIsShared] = useState(false);
  const [error, setError] = useState(null);
  const updateTimerRef = useRef(null);

  // On mount, check URL hash for shared canvas data
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const raw = decode(hash);
    if (!raw) {
      setError('This shared link appears to be corrupted.');
      return;
    }

    const validated = validateCanvasData(raw);
    if (!validated) {
      setError('This shared link contains invalid data.');
      return;
    }

    setSharedData(validated);
    setIsShared(true);
  }, []);

  const clearShared = useCallback(() => {
    setSharedData(null);
    setIsShared(false);
    setError(null);
    // Remove hash without triggering navigation
    history.replaceState(null, '', window.location.pathname);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
    history.replaceState(null, '', window.location.pathname);
  }, []);

  const getShareUrl = useCallback((data) => {
    const encoded = encode(data);
    if (!encoded) return null;
    return `${window.location.origin}${window.location.pathname}#${encoded}`;
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (updateTimerRef.current) clearTimeout(updateTimerRef.current);
    };
  }, []);

  return {
    sharedData,
    isShared,
    error,
    clearShared,
    dismissError,
    getShareUrl,
  };
}
