import { signal } from '@preact/signals-react';
import { Users } from './users.store';

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

const ownedDiscussions = signal<Discussion[]>([
  {
    id: 212,
    last_message: 'ti jinyo kap mande eske gen pate',
    user1: 111,
    user2: 222,
    participants: [
      {
        id: 11,
        username: 'TiDon',
        user_id: '55',
      },
      {
        id: 1,
        username: 'TiJinyo',
        user_id: '55',
      },
    ],
  },
]);

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

export {
  selectedDiscussion,
  ownedDiscussions,
  messagesLoading,
  messagesInDiscussion,
  getDiscussionName,
  getSenderName,
  setDiscussion,
};
