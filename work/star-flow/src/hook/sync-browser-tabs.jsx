import { genSimpleID } from '@/utils/generator';
import { localStore } from '@/utils/localStorage';
import { useEffect } from 'react';

/**
 * @param {string} key
 * @param {(e: *) => {}} callback
 * @returns
 */
export default function useSyncBrowserTabs(key, callback) {
  useEffect(() => {
    function handleSync(event) {
      if (event.key === key) {
        callback();
      }
    }
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('storage', handleSync);
    };
  }, [key, callback]);

  const triggerSync = () => {
    localStore.set(key, genSimpleID());
  };

  return triggerSync;
}
