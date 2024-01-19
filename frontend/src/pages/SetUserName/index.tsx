import React from 'react';

const SetUsernamePage = () => {
  return (
    <>
      <div className='style__centered'>
        <form>
          <h4>Set your username</h4>
          <div className='mb-3'>
            <input
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
