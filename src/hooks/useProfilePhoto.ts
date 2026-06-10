import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  getRemoteProfilePhotoUrl,
  resolveProfilePhotoUri,
} from '../utils/profilePhoto';

export function useProfilePhoto() {
  const { user } = useAuth();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!user?.id) {
      setPhotoUri(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const uri = await resolveProfilePhotoUri(user.id, getRemoteProfilePhotoUrl(user));
      setPhotoUri(uri);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { photoUri, reload, isLoading };
}
