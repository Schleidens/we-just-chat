import React from 'react';

import './style.scss';

const LoginPage = () => {
  return (
    <>
      <main className='login__page'>
        <div className='login'>
          <button className='btn btn-dark'>Login with google</button>
        </div>
      </main>
    </>
  );
};

export default LoginPage;
