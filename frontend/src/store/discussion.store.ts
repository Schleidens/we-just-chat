import { signal } from '@preact/signals-react';
import { Users } from './users.store';
import { apiFetch } from '../utils/api.fetch';

export interface Discussion {
  id: number;
  last_message: string;
  user1: number;
  user2: number;
  participants: Users[];
}

export interface Message {
  id: number;
  sender_id: number;
  discussion_id: number;
  text_body: string;
  created_at: string;
}

const selectedDiscussion = signal<null | Discussion>(null);

const ownedDiscussions = signal<Discussion[]>([]);

const setDiscussion = (discussion: Discussion | null) => {
  selectedDiscussion.value = discussion;
};

const getDiscussionName = (loggedUserId: number, users: Users[]) => {
  return users.find((user) => user.id !== loggedUserId);
};

const getSenderName = (loggedUserId: number, users: Users[]) => {
  return users.find((user) => user.id === loggedUserId);
};

const messagesLoading = signal<boolean>(false);

const messagesInDiscussion = signal<Message[]>([
  {
    id: 1,
    sender_id: 1,
    discussion_id: 2,
    text_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    created_at: 'jodia',
  },
  {
    id: 2,
    sender_id: 11,
    discussion_id: 2,
    text_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    created_at: 'jodia',
  },
  {
    id: 2,
    sender_id: 11,
    discussion_id: 2,
    text_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    created_at: 'jodia',
  },
  {
    id: 2,
    sender_id: 1,
    discussion_id: 2,
    text_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    created_at: 'jodia',
  },
  {
    id: 2,
    sender_id: 11,
    discussion_id: 2,
    text_body:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    created_at: 'jodia',
  },
]);

const getDiscussionsList = async () => {
  try {
    const discussions = await apiFetch('discussions');

    ownedDiscussions.value = discussions;

    console.log(discussions);
  } catch (error) {
    console.log(error);
  }
};

const getMessagesInDiscussion = async () => {
  try {
    messagesInDiscussion.value = [];
    const messages = await apiFetch(
      `messages?id=${selectedDiscussion.value?.id}`
    );

    console.log(messages);

    messagesInDiscussion.value = messages;
  } catch (error) {
    console.log(error);
  }
};

export {
  selectedDiscussion,
  ownedDiscussions,
  messagesLoading,
  messagesInDiscussion,
  getDiscussionName,
  getSenderName,
  setDiscussion,
  getDiscussionsList,
  getMessagesInDiscussion,
};
