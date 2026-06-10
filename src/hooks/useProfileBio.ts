import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getRemoteProfileBio,
  resolveProfileBio,
} from '../utils/profileBio';

export function useProfileBio() {
  const { user } = useAuth();
  const [bio, setBio] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user?.id) {
      setBio('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const resolved = await resolveProfileBio(user.id, getRemoteProfileBio(user));
      setBio(resolved);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { bio, reload, isLoading };
}
