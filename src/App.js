import React from 'react';
import './App.css';
import Header from './header/header'
import Footer from './footer/footer'
import Main from './main/main'

export default function App() {
  return (
    <div id="app">
      <Header/>
      <Main/>
      <Footer/>
    </div>
  );
}
