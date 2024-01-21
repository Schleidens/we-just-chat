import { signal } from '@preact/signals-react';
import { apiFetch } from '../utils/api.fetch';

export interface Users {
  id: number;
  username: string | null;
  user_id: string;
}

const users = signal<null | Users>(null);

const authLoading = signal<boolean>(true);

const getCurrentUserInformation = async () => {
  try {
    authLoading.value = true;

    const currentUser = await apiFetch('me');

    users.value = currentUser;
  } catch (error) {
    users.value = null;
    console.log(error);
  } finally {
    authLoading.value = false;
  }
};

const setUsername = async (username: string) => {
  try {
    authLoading.value = true;

    await apiFetch('me', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });
  } catch (error) {
    console.log(error);
  } finally {
    authLoading.value = false;
    await getCurrentUserInformation();
  }
};

export default { users, authLoading, getCurrentUserInformation, setUsername };
