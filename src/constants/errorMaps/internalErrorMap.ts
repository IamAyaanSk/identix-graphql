type ErrorMapKey =
  | 'auth/unauthorized'
  | 'auth/unauthenticated'
  | 'user/notAuthorize'
  | 'user/alreadyExists'
  | 'user/failRegister'
  | 'user/failDelete'
  | 'user/notFound'
  | 'user/failPasswordReset'
  | 'userLink/failCreate'
  | 'userLink/failUpdate'
  | 'userLink/failDeleted'
  | 'userLink/failFetched'
  | 'server/failComplete'
  | 'auth/samePassword';

const internalErrorMap: Record<ErrorMapKey, string> = {
  'auth/unauthorized': 'You are not authorized to perform this action',
  'auth/unauthenticated': 'You are not authenticated',
  'auth/samePassword': 'You cannot set your new password same as old password',
  'user/notAuthorize': 'Unable to authorize. Please check username/password combination',
  'user/alreadyExists': 'Email already registered',
  'user/failRegister': 'Registration failed',
  'user/failDelete': 'Failed to delete account',
  'user/notFound': 'User not found',
  'user/failPasswordReset': 'Expired or invalid request',
  'userLink/failCreate': 'Failed to create new link',
  'userLink/failUpdate': 'Failed to update link',
  'userLink/failDeleted': 'Unable to delete link',
  'userLink/failFetched': 'Unable to fetch links',
  'server/failComplete': 'Something went wrong, please try again later',
};

export { internalErrorMap };