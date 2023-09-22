type ErrorMapKey =
  | 'auth/unauthorized'
  | 'auth/unauthenticated'
  | 'user/notAuthorize'
  | 'user/alreadyExists'
  | 'user/failCreate'
  | 'user/failDelete'
  | 'user/notFound'
  | 'user/failPasswordReset'
  | 'link/failCreate'
  | 'link/failUpdate'
  | 'link/notDeleted'
  | 'link/notFetched'
  | 'server/failComplete'
  | 'auth/samePassword';

const internalErrorMap: Record<ErrorMapKey, string> = {
  'auth/unauthorized': 'You are not authorized to perform this action',
  'auth/unauthenticated': 'You are not authenticated',
  'auth/samePassword': 'You cannot set your new password same as old password',
  'user/notAuthorize': 'Unable to authorize. Please check username/password combination',
  'user/alreadyExists': 'Email already registered',
  'user/failCreate': 'Registration failed',
  'user/failDelete': 'Failed to delete account',
  'user/notFound': 'User not found',
  'user/failPasswordReset': 'Expired or invalid request',
  'link/failCreate': 'Failed to create new link',
  'link/failUpdate': 'Failed to update link',
  'link/notDeleted': 'Unable to delete link',
  'link/notFetched': 'Unable to fetch links',
  'server/failComplete': 'Something went wrong, please try again later',
};

export { internalErrorMap };
