import React from 'react';
import { useState } from 'react';
import Loader from '../../components/Loader';

import usersStore from '../../store/users.store';

import { handleSignInWithGoogle } from '../../firebase/auth';

import './style.scss';

const LoginPage = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  const _authLoading = usersStore.authLoading.value;

  const handleSignIn = async (): Promise<void> => {
    try {
      setIsDisabled(true);
      await handleSignInWithGoogle();
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Something's wrong try again :)");
      }

      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    } finally {
      setIsDisabled(false);
    }
  };

  return (
    <>
      {!_authLoading && (
        <main className='login__page'>
          <div className='intro'>
            <p>I just chat!</p>
            <p>You just chat!</p>
            <p>
              So ?? <span>We Just Chat :)</span>
            </p>
          </div>
          <div className='login'>
            <div
              onClick={handleSignIn}
              className='btn btn-dark'
              style={
                isDisabled ? { opacity: '0.5', pointerEvents: 'none' } : {}
              }
            >
              {!isDisabled && (
                <div>
                  {' '}
                  <div>
                    SignIn with Google{' '}
                    <img
                      src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg'
                      alt=''
                      className='google-logo'
                    />
                  </div>
                </div>
              )}
              {isDisabled && <div>SignIn.....</div>}
            </div>
            {errorMessage && <div className='error'>{errorMessage}</div>}
          </div>
        </main>
      )}

      {_authLoading && (
        <div className='loader'>
          <Loader />
        </div>
      )}
    </>
  );
};

export default LoginPage;
