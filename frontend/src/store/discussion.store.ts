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

const messagesLoading = signal<boolean>(false);

const messagesInDiscussion = signal<Message[]>([]);

//focus discussion data
const setDiscussion = (discussion: Discussion | null) => {
  selectedDiscussion.value = discussion;
};

//simple utils to clear data in messages

const getDiscussionName = (loggedUserId: number, users: Users[]) => {
  return users.find((user) => user.id !== loggedUserId);
};

const getSenderName = (loggedUserId: number, users: Users[]) => {
  return users.find((user) => user.id === loggedUserId);
};

const getMessageTimeFromDate = (incomingDate: string) => {
  const dateObject = new Date(incomingDate);

  const formattedTime = dateObject.toLocaleTimeString();

  return formattedTime;
};

//data utils

const getDiscussionsList = async () => {
  try {
    const discussions = await apiFetch('discussions');

    ownedDiscussions.value = discussions;
  } catch (error) {
    console.log(error);
  }
};

const getMessagesInDiscussion = async () => {
  try {
    messagesInDiscussion.value = [];

    messagesLoading.value = true;

    const messages = await apiFetch(
      `messages?id=${selectedDiscussion.value?.id}`
    );

    messagesInDiscussion.value = messages;
  } catch (error) {
    console.log(error);
  } finally {
    messagesLoading.value = false;
  }
};

export {
  selectedDiscussion,
  ownedDiscussions,
  messagesLoading,
  messagesInDiscussion,
  setDiscussion,
  getDiscussionName,
  getSenderName,
  getMessageTimeFromDate,
  getDiscussionsList,
  getMessagesInDiscussion,
};
