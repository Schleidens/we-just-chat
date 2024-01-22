import { signal } from '@preact/signals-react';
import { apiFetch } from '../utils/api.fetch';

export interface Users {
  id: number;
  username: string | null;
  user_id: string;
}

const user = signal<null | Users>(null);

const authLoading = signal<boolean>(true);

const usersList = signal<Users[]>([]);

const usernameSearch = signal<string>('');

const setUsernameSearch = (incomingUsername: string) => {
  usernameSearch.value = incomingUsername;
};

const getCurrentUserInformation = async () => {
  try {
    authLoading.value = true;

    const currentUser = await apiFetch('me');

    user.value = currentUser;
  } catch (error) {
    user.value = null;
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

const getUsersList = async () => {
  try {
    const result = await apiFetch('users');

    const filteredResult = result.filter((i: Users) => i.id !== user.value?.id);

    usersList.value = filteredResult;
  } catch (error) {
    console.log(error);
  }
};

const searchInUsersListByUsername = () => {
  if (!usernameSearch.value) {
    getUsersList();
  }

  const result = usersList.value.filter((user: Users) =>
    user.username?.toLocaleLowerCase().includes(usernameSearch.value)
  );

  usersList.value = result;
};

export default {
  user,
  authLoading,
  usersList,
  usernameSearch,
  getCurrentUserInformation,
  setUsername,
  getUsersList,
  setUsernameSearch,
  searchInUsersListByUsername,
};
