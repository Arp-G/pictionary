/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unescaped-entities */
/*
This 404 page is taken from https://codepen.io/linux/pen/OjmeKP
since I suck at css
*/
import React from 'react';
import { Link } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';
import './NotFound.scoped.scss';

const NotFound = () => (
  <div className="mainbox">
    <div className="err">4</div>
    <FaQuestionCircle className="far icn-spinner" />
    <div className="err2">4</div>
    <div className="msg">
      Maybe this page moved? Got deleted? Is hiding out in quarantine? Never existed in the first place?
      <p>
        Let's go <Link to="/">home</Link> and try from there.
      </p>
    </div>
  </div>
);

export default NotFound;
