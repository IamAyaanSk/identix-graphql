type ERROR =
  | 'auth/unauthorized'
  | 'auth/unauthenticated'
  | 'user/notAuthorize'
  | 'user/alreadyExists'
  | 'user/failCreate'
  | 'user/failDelete'
  | 'link/failCreate'
  | 'link/failUpdate'
  | 'link/notDeleted'
  | 'link/notFetched';

const errorMap: Record<ERROR, string> = {
  'auth/unauthorized': 'You are not authorized to perform this action',
  'auth/unauthenticated': 'You are not authenticated',
  'user/notAuthorize': 'Unable to authorize. Please check username/password combination',
  'user/alreadyExists': 'Email already registered',
  'user/failCreate': 'Registration failed',
  'user/failDelete': 'Failed to delete account',
  'link/failCreate': 'Failed to create new link',
  'link/failUpdate': 'Failed to update card',
  'link/notDeleted': 'Unable to delete link',
  'link/notFetched': 'Unable to fetch links',
};

export { errorMap };
