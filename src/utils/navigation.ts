// utils/navigation.ts

/**
 * Format a path for navigation
 * Ensures path starts with a forward slash
 */
export const formatPath = (path: string): string => {
  return path.startsWith('/') ? path : `/${path}`;
};

/**
 * Check if a path matches the current path
 */
export const isActivePath = (currentPath: string, checkPath: string): boolean => {
  return currentPath === formatPath(checkPath);
};

/**
 * Check if a path is a parent of the current path
 */
export const isParentPath = (currentPath: string, parentPath: string): boolean => {
  if (parentPath === '/') return currentPath !== '/';
  return currentPath.startsWith(formatPath(parentPath));
};

/**
 * Extract query parameters from a URL
 */
export const getQueryParams = (search: string): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
};

/**
 * Build URL with query parameters
 */
export const buildUrl = (path: string, params: Record<string, string>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) searchParams.append(key, value);
  });
  const search = searchParams.toString();
  return search ? `${path}?${search}` : path;
};

/**
 * Get page path segments
 */
export const getPathSegments = (path: string): string[] => {
  return path.split('/').filter(Boolean);
};

/**
 * Get parent path
 */
export const getParentPath = (path: string): string => {
  const segments = getPathSegments(path);
  segments.pop();
  return segments.length ? `/${segments.join('/')}` : '/';
};