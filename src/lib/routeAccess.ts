export type UserType = 'client' | 'trainer';

export interface RouteAccessRule {
  prefix: string;
  requiresAuth: boolean;
  allowedUserTypes?: UserType[];
  redirectAuthenticatedTo?: string;
}

export const routeAccessRules: RouteAccessRule[] = [
  { prefix: '/admin', requiresAuth: true, allowedUserTypes: ['trainer'] },
  { prefix: '/trainer/workout', requiresAuth: true, allowedUserTypes: ['trainer'] },
  { prefix: '/home', requiresAuth: true, allowedUserTypes: ['client'] },
  { prefix: '/profile', requiresAuth: true, allowedUserTypes: ['client'] },
  { prefix: '/progress', requiresAuth: true, allowedUserTypes: ['client'] },
  { prefix: '/nutrition', requiresAuth: true, allowedUserTypes: ['client'] },
  { prefix: '/me', requiresAuth: true, allowedUserTypes: ['client'] },
  { prefix: '/workout', requiresAuth: true, allowedUserTypes: ['client'] },
  { prefix: '/chat', requiresAuth: true },
  { prefix: '/auth', requiresAuth: false },
];

export const defaultRedirectByUserType: Record<UserType, string> = {
  trainer: '/admin',
  client: '/home',
};

export function getRouteAccessRule(pathname: string): RouteAccessRule | null {
  return (
    routeAccessRules.find((rule) => pathname === rule.prefix || pathname.startsWith(`${rule.prefix}/`)) ??
    null
  );
}

export function isProtectedPath(pathname: string): boolean {
  const rule = getRouteAccessRule(pathname);
  return Boolean(rule?.requiresAuth);
}

export function getAllowedUserTypesForPath(pathname: string): UserType[] | null {
  const rule = getRouteAccessRule(pathname);
  return rule?.allowedUserTypes ?? null;
}

export function getDefaultAuthorizedRedirect(userType?: UserType | null): string {
  if (!userType) {
    return '/home';
  }

  return defaultRedirectByUserType[userType];
}

export function canUserAccessPath(pathname: string, userType?: UserType | null): boolean {
  const rule = getRouteAccessRule(pathname);

  if (!rule) {
    return true;
  }

  if (!rule.requiresAuth) {
    return true;
  }

  if (!userType) {
    return false;
  }

  if (!rule.allowedUserTypes || rule.allowedUserTypes.length === 0) {
    return true;
  }

  return rule.allowedUserTypes.includes(userType);
}
