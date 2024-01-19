import React from 'react';
import './style.scss';
import { BounceLoader } from 'react-spinners';

const Loader = () => {
  return (
    <>
      <div className='loader-wrap'>
        <BounceLoader color='#36d7b7' />
      </div>
    </>
  );
};

export default Loader;
