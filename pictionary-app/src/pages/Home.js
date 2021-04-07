import React from 'react';
import Header from '../components/Header/header';
import UserInfo from '../components/UserInfo/userInfo';
import HowToPlay from '../components/HowToPlay/howToPlay';
import About from '../components/About/about';

const Home = () => {
    return (<div>
        <Header />
        <UserInfo />
        <HowToPlay />
        <About />
    </div>);
}

export default Home;
