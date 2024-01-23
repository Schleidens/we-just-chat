import React, { useEffect, useRef } from 'react';
import SimpleBar from 'simplebar-react';

import { auth } from '../../firebase/main';

import Loader from '../../components/Loader';
import UsersListModal from '../../components/UsersListModal';

import './style.scss';

import {
  ownedDiscussions,
  selectedDiscussion,
  setDiscussion,
  getDiscussionName,
  getTimeFromDate,
  messagesLoading,
  messagesInDiscussion,
  getDiscussionsList,
  getMessagesInDiscussion,
  newMessageContent,
  setNewMessageContent,
  sendNewMessage,
} from '../../store/discussion.store';
import usersStore from '../../store/users.store';
import messagesHook from '../../hook/messages.hook';

const ChatPage = () => {
  const _ownedDiscussions = ownedDiscussions.value;
  const _selectedDiscussion = selectedDiscussion.value;
  const _messagesLoading = messagesLoading.value;
  const _messagesInDiscussion = messagesInDiscussion.value;
  const _newMessageContent = newMessageContent.value;

  const _user = usersStore.user.value;

  const messagesRef = useRef<HTMLDivElement>(null);

  messagesHook.useMessagesScroll(messagesRef, _messagesInDiscussion);

  useEffect(() => {
    getDiscussionsList();
  }, []);

  useEffect(() => {
    getMessagesInDiscussion();
  }, [_selectedDiscussion]);

  useEffect(() => {
    const socket = new WebSocket(import.meta.env.VITE_WS_URL);

    socket.onmessage = (info) => {
      const data = JSON.parse(info.data);

      if (data.key === 'new-message') {
        const updatedSelectedDiscussion = selectedDiscussion.peek();
        const _ownedDiscussions = ownedDiscussions.peek();

        ownedDiscussions.value = _ownedDiscussions
          .map((discussion) => {
            if (discussion.id === data.message.discussion_id) {
              discussion.last_message = data.message.text_body;
            }

            return discussion;
          })
          .sort((a, b) => {
            if (a.id === data.message.discussion_id) {
              return -1;
            } else if (b.id === data.message.discussion_id) {
              return 1;
            } else {
              return 0;
            }
          });

        if (updatedSelectedDiscussion?.id === data.message.discussion_id) {
          const allMessageInDiscussion = messagesInDiscussion.peek();

          messagesInDiscussion.value = [
            ...allMessageInDiscussion,
            data.message,
          ];
        } else if (data.key === 'ping') {
          socket.send(JSON.stringify({ key: 'pong' }));
        } else {
          return;
        }
      } else if (data.key === 'new-discussion') {
        getDiscussionsList();
      }
    };

    socket.onopen = async () => {
      const token = await auth.currentUser?.getIdToken();

      socket.send(JSON.stringify({ key: 'authToken', token: token }));
    };
  }, []);

  return (
    <>
      <main className='chat__page'>
        <div
          className={`discussion ${
            _selectedDiscussion === null
              ? 'discussions__mobile-size'
              : 'messages__mobile-size__hidden'
          }`}
        >
          <div className='title'>
            <h2>We Just Chat</h2>
          </div>

          <div className='new-chat'>
            <button
              type='button'
              className='btn btn-success new-chat-btn'
              data-bs-toggle='modal'
              data-bs-target='#exampleModal'
            >
              New Chat
            </button>

            {/* modal for lis of users */}
            <UsersListModal />
          </div>
          <ul className='list-group'>
            {_ownedDiscussions.map((discussion, index) => {
              const updatedSelectedDiscussion = selectedDiscussion.peek();
              return (
                <li
                  key={index}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    _selectedDiscussion !== null &&
                    updatedSelectedDiscussion?.id === discussion.id
                      ? 'active-discussion'
                      : ''
                  }`}
                  onClick={() => setDiscussion(discussion)}
                >
                  <img
                    className='profile-img'
                    src='https://ik.imagekit.io/nv2j2amfx9/avatar'
                    alt=''
                  />
                  <div className='ms-2 me-auto'>
                    <div className='fw-bold'>
                      {
                        getDiscussionName(
                          _user?.id as number,
                          discussion.participants
                        )?.username
                      }
                    </div>
                    <span className='last-message'>
                      {discussion.last_message}
                    </span>
                  </div>
                  <div className='last-time'>
                    {getTimeFromDate(discussion.updated_at)}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {_selectedDiscussion !== null ? (
          <div
            className={`chat ${
              _selectedDiscussion !== null
                ? 'discussions__mobile-size'
                : 'discussion__mobile-size__hidden'
            }`}
          >
            <div className='title'>
              <button
                className='close-chat-btn'
                onClick={() => setDiscussion(null)}
              >
                <img
                  src='https://ik.imagekit.io/nv2j2amfx9/back-button.png'
                  alt=''
                />
              </button>
              <span>
                {
                  getDiscussionName(
                    _user?.id as number,
                    _selectedDiscussion.participants
                  )?.username
                }
              </span>
            </div>

            <div className='chat__box'>
              <div
                className='messages'
                ref={messagesRef}
              >
                <SimpleBar className='top-wrapper'>
                  {!_messagesLoading && (
                    <ul>
                      {_messagesInDiscussion.map((message, index) => {
                        return (
                          <li
                            key={index}
                            className={
                              _user?.id === message.sender_id
                                ? 'sended-message'
                                : 'received-message'
                            }
                          >
                            <div
                              className={
                                _user?.id === message.sender_id
                                  ? 'sended-message-item'
                                  : 'received-message-item'
                              }
                            >
                              {message.text_body}
                            </div>
                            <h6>{getTimeFromDate(message.created_at)}</h6>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </SimpleBar>

                {_messagesLoading && <Loader />}
              </div>

              <div className='new-message'>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendNewMessage();
                  }}
                  className='w-100 d-flex'
                >
                  <textarea
                    value={_newMessageContent}
                    className='form-control'
                    id='exampleInputPassword1'
                    placeholder='New message'
                    onChange={(e) => {
                      setNewMessageContent(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      const _newMessageContent = newMessageContent.peek();

                      if (
                        e.key === 'Enter' &&
                        _newMessageContent.split('\n').join('').length > 0
                      ) {
                        sendNewMessage();
                      } else {
                        return;
                      }
                    }}
                  />

                  <button
                    type='submit'
                    className='btn btn-primary'
                  >
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={`no-chat ${
              _selectedDiscussion !== null
                ? 'discussions__mobile-size'
                : 'discussion__mobile-size__hidden'
            }`}
          >
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ChatPage;
