import React from 'react';
import SimpleBar from 'simplebar-react';

import Loader from '../../components/Loader';

import './style.scss';

import {
  ownedDiscussions,
  selectedDiscussion,
  setDiscussion,
  getDiscussionName,
  getSenderName,
  messagesLoading,
  messagesInDiscussion,
} from '../../store/discussion.store';
import usersStore from '../../store/users.store';

const ChatPage = () => {
  const _ownedDiscussions = ownedDiscussions.value;
  const _selectedDiscussion = selectedDiscussion.value;
  const _messagesLoading = messagesLoading.value;
  const _messagesInDiscussion = messagesInDiscussion.value;

  const _users = usersStore.users.value;

  return (
    <>
      <main className='chat__page'>
        <div className='discussion'>
          <div className='title'>
            <h2>We Just Chat</h2>
          </div>

          <div className='new-chat'>
            <button
              type='button'
              className='btn btn-success'
            >
              New Chat
            </button>
          </div>
          <ul className='list-group'>
            {_ownedDiscussions.map((discussion, index) => (
              <li
                key={index}
                className='list-group-item d-flex justify-content-between align-items-center'
                onClick={() => setDiscussion(discussion)}
              >
                <div className='ms-2 me-auto'>
                  <div className='fw-bold'>
                    {getDiscussionName(12, discussion.participants)?.username}
                  </div>
                  {discussion.last_message}
                </div>
                <span className='badge bg-primary rounded-pill'>14</span>
              </li>
            ))}
          </ul>
        </div>

        {_selectedDiscussion !== null ? (
          <div className='chat'>
            <div className='title'>
              <button
                className='close-chat-btn'
                onClick={() => setDiscussion(null)}
              >
                X
              </button>
              <span>
                {
                  getDiscussionName(
                    _users?.id,
                    _selectedDiscussion.participants
                  )?.username
                }
              </span>
            </div>

            <div className='chat__box'>
              <div className='messages'>
                <SimpleBar style={{ maxHeight: 740 }}>
                  {!_messagesLoading && (
                    <ul>
                      {_messagesInDiscussion.map((message, index) => (
                        <li
                          key={index}
                          className={
                            _users?.id === message.sender_id
                              ? 'sended-message'
                              : 'received-message'
                          }
                        >
                          <div
                            className={
                              _users?.id === message.sender_id
                                ? 'sended-message-item'
                                : 'received-message-item'
                            }
                          >
                            {message.text_body}
                          </div>
                          <h5>
                            {
                              getSenderName(
                                message.sender_id,
                                _selectedDiscussion.participants
                              )?.username
                            }
                          </h5>
                        </li>
                      ))}
                    </ul>
                  )}
                  {_messagesLoading && <Loader />}
                </SimpleBar>
              </div>

              <div className='new-message'>
                <form className='w-100 d-flex'>
                  <textarea
                    className='form-control'
                    id='exampleInputPassword1'
                    placeholder='Jessica'
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
          <div className='no-chat'>
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </main>
    </>
  );
};

export default ChatPage;
