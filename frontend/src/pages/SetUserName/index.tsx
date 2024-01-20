import React, { useState } from 'react';
import usersStore from '../../store/users.store';

const SetUsernamePage = () => {
  const [userName, setUserName] = useState<string>('');

  const _setUsername = usersStore.setUsername;

  return (
    <>
      <div className='style__centered'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            _setUsername(userName);
          }}
        >
          <h4>Set your username</h4>
          <div className='mb-3'>
            <input
              onChange={(e) => setUserName(e.target.value)}
              type='text'
              className='form-control'
              id='username'
              placeholder='john_doe'
            />
          </div>

          <button
            type='submit'
            className='btn btn-primary w-100'
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default SetUsernamePage;
