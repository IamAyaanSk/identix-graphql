type ERROR = 'auth/unauthorized' | 'auth/unauthenticated';

const errorMap: Record<ERROR, string> = {
  'auth/unauthorized': 'You are not authorized to perform this action',
  'auth/unauthenticated': 'You are not authenticated',
};

export { errorMap };
