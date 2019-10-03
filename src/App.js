import React from 'react';
import Navbar from './components/Navbar';
import Board from './components/Board';
import Modal from 'react-modal'
import ModalContent from './components/ModalContent';


Modal.setAppElement('#root')

function App() {

  return (
    <div className="App">
      <Navbar />
        <Board />
        <ModalContent />
    </div>   
  );
}

export default App;
