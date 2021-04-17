import React from 'react';
import ReactLoading from 'react-loading';
import loadingAnimations from '../../constants/loadingTypes';
import { getRandomItem } from '../../helpers/helpers';
import './loading.scss';

const Loading = () => (
  <div className="loadingWrapper">
    <header className="loadingText">Loading...</header>
    <ReactLoading type={getRandomItem(loadingAnimations)} className="loadingAnimation" />
  </div>
);

export default Loading;
