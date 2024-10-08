import { signal } from '@preact/signals-react';
import { Users } from './users.store';
import { apiFetch } from '../utils/api.fetch';

export interface Discussion {
  id: number;
  last_message: string;
  user1: number;
  user2: number;
  created_at: string;
  updated_at: string;
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

const newMessageContent = signal<string>('');

// utils for message input
const setNewMessageContent = (message: string) => {
  newMessageContent.value = message;
};

// emoji store and utils
const isEmojiModalOpen = signal<boolean>(false);

const triggerEmojiModal = () => {
  isEmojiModalOpen.value = !isEmojiModalOpen.value;
};

const addEmojiInMessage = (emoji: string) => {
  newMessageContent.value = newMessageContent.value + emoji;
};

//focus discussion data
const setDiscussion = (discussion: Discussion | null) => {
  console.log(discussion);

  selectedDiscussion.value = discussion;
};

//simple utils to clear data in messages

const getDiscussionName = (loggedUserId: number, users: Users[]) => {
  return users.find((user) => user.id !== loggedUserId);
};

const getSenderName = (loggedUserId: number, users: Users[]) => {
  return users.find((user) => user.id === loggedUserId);
};

const getTimeFromDate = (incomingDate: string) => {
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

const sendNewMessage = async () => {
  try {
    if (newMessageContent.value) {
      const incomingMessage = newMessageContent.value;
      newMessageContent.value = '';
      await apiFetch('messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          discussion_id: selectedDiscussion.value?.id,
          text_body: incomingMessage,
        }),
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getOrCreateDiscussion = async (
  user1: number | undefined,
  user2: number | undefined
) => {
  try {
    const discussion = await apiFetch('discussions', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },

      body: JSON.stringify({ user1, user2 }),
    });

    selectedDiscussion.value = discussion;
  } catch (error) {
    console.log(error);
  } finally {
    getDiscussionsList();
  }
};

export {
  selectedDiscussion,
  ownedDiscussions,
  messagesLoading,
  messagesInDiscussion,
  newMessageContent,
  isEmojiModalOpen,
  setDiscussion,
  getDiscussionName,
  getSenderName,
  getTimeFromDate,
  getDiscussionsList,
  getMessagesInDiscussion,
  getOrCreateDiscussion,
  setNewMessageContent,
  sendNewMessage,
  addEmojiInMessage,
  triggerEmojiModal,
};
