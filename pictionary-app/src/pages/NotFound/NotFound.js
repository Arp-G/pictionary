/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unescaped-entities */
/*
This 404 page is taken from https://codepen.io/linux/pen/OjmeKP
since I suck at css
*/
import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.scss';

const NotFound = () => (
  <div className="not-found-container">
    <div className="error">
      <p className="p">4</p>
      <span className="dracula">
        <div className="con">
          <div className="hair" />
          <div className="hair-r" />
          <div className="head" />
          <div className="eye" />
          <div className="eye eye-r" />
          <div className="mouth" />
          <div className="blod" />
          <div className="blod blod2" />
        </div>
      </span>
      <p className="p">4</p>
      <div className="page-ms">
        <p className="page-msg"> Oops, the page you're looking for Disappeared </p>
        <button className="go-back"><Link to="/" style={{ textDecoration: 'none' }}>Go back to home</Link></button>
      </div>
    </div>
  </div>
);

export default NotFound;
