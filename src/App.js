import React from 'react';
import './App.css';
import Header from './header/header'
import Footer from './footer/footer'
import Main from './main/main'

let onClickClearPaperPass
const onClickClearPaper = () => {
    onClickClearPaperPass()
}
const setClearPaper = (func) => {
    onClickClearPaperPass = func
}

export default function App() {
  return (
    <div id="app">
      <Header onClickClearPaper={onClickClearPaper}/>
      <Main setClearPaper={setClearPaper}/>
      <Footer/>
    </div>
  );
}
