import { signal } from '@preact/signals-react';

export interface Users {
  id: number;
  username: string | null;
  user_id: string;
}

const users = signal<null | Users>({
  id: 1,
  username: 'johndoe',
  user_id: 'tiJan',
});

export default { users };
