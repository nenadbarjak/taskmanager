import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import Navbar from './components/Navbar';
import Board from './components/Board';
import Modal from 'react-modal'
import ModalContent from './components/ModalContent';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import AddBoard from './components/AddBoard';
import ErrorMessage from './components/ErrorMessage'
import { setAxiosToken } from './services/axiosPreset'
import { BoardContext } from './contexts/BoardContext';

Modal.setAppElement('#root')

function App() {
  const { auth, authDispatch } = useContext(BoardContext)

  const tokenJSON = localStorage.getItem('TM_App_token')
  const token = JSON.parse(tokenJSON)
  setAxiosToken(token) 

  if (token && !auth.token) {
    authDispatch({
      type: 'LOGIN',
      token
    })
  }

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <ErrorMessage />
        <Switch>
          <Route exact path='/' component={Board} />
          <Route path='/signin' component={SignIn} />
          <Route path='/signup' component={SignUp} />
          <Route path='/addboard' component={AddBoard} />
        </Switch>
        <ModalContent />
      </div> 
    </BrowserRouter>
      
  );
}

export default App;
