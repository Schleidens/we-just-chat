import React, { useEffect } from 'react';
import usersStore from '../../store/users.store';
import { getOrCreateDiscussion } from '../../store/discussion.store';

import './style.scss';

function UsersListModal() {
  const _usersList = usersStore.usersList.value;
  const _getUsersList = usersStore.getUsersList;
  const _searchInUsersListByUsername = usersStore.searchInUsersListByUsername;
  const _setUsernameSearch = usersStore.setUsernameSearch;
  const _usernameSearch = usersStore.usernameSearch.value;

  const _user = usersStore.user.value;

  useEffect(() => {
    _getUsersList();
  }, [_getUsersList]);

  useEffect(() => {
    _searchInUsersListByUsername();
  }, [_searchInUsersListByUsername, _usernameSearch]);

  return (
    <div
      className='modal fade modal-lg'
      id='exampleModal'
      tabIndex={-1}
      aria-labelledby='exampleModalLabel'
      aria-hidden='true'
      modal-dialog-centered
      modal-dialog-scrollable
    >
      <div className='modal-dialog'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h1
              className='modal-title fs-5'
              id='exampleModalLabel'
            >
              Users
            </h1>
            <button
              type='button'
              className='btn-close'
              data-bs-dismiss='modal'
              aria-label='Close'
            ></button>
          </div>
          <div className='modal-body'>
            <div className='mb-3'>
              <input
                type='text'
                className='form-control'
                id='usersSearch'
                placeholder='search by username'
                onChange={(e) => {
                  _setUsernameSearch(e.target.value);
                }}
              />
            </div>

            <ul className='users__list'>
              {_usersList.map((user) => {
                return (
                  <li key={user.id}>
                    <div className='details'>
                      <img
                        src='https://ik.imagekit.io/nv2j2amfx9/avatar'
                        alt='profile_picture'
                      />
                      <h3>{user.username}</h3>
                    </div>

                    <button
                      onClick={() => {
                        getOrCreateDiscussion(_user?.id, user.id);
                      }}
                      data-bs-dismiss='modal'
                    >
                      Message
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsersListModal;
