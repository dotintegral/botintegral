interface CachedItem<T> {
  key: string;
  data: T;
  expires: number;
}

const currentTimestamp = () => Math.round(new Date().getTime() / 1000);

const cache: Record<string, CachedItem<any>> = {};

const cacheTime = 5 * 60;

export const getCached = <T>(key: string): T | undefined => {
  const cached = (cache[key] as CachedItem<T>) || undefined;
  const now = currentTimestamp();

  if (!cached) {
    return undefined;
  }
  if (now > cached.expires) {
    return undefined;
  }

  return cached.data;
};

export const saveCache = <T>(key: string) => (data: T): void => {
  cache[key] = {
    key,
    data,
    expires: currentTimestamp() + cacheTime,
  };
};
