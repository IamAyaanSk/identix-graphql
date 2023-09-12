type ERROR =
  | 'auth/unauthorized'
  | 'auth/unauthenticated'
  | 'user/notFound'
  | 'user/alreadyExists'
  | 'user/failCreate'
  | 'link/failCreate'
  | 'link/failUpdate'
  | 'link/notFound';

const errorMap: Record<ERROR, string> = {
  'auth/unauthorized': 'You are not authorized to perform this action',
  'auth/unauthenticated': 'You are not authenticated',
  'user/notFound': 'Unable to authorize. Please check username/password combination',
  'user/alreadyExists': 'Email already registered',
  'user/failCreate': 'Registration failed',
  'link/failCreate': 'Failed to create new link',
  'link/failUpdate': 'Failed to update card',
  'link/notFound': 'No link exist for provided link_id',
};

export { errorMap };
