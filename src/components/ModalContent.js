import React, { useContext } from 'react';
import Modal from 'react-modal'
import '../styles/ModalContent.css'
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'
import ModalHeader from './ModalHeader';
import ModalTitleAssignDue from './ModalTitleAssignDue'
import ModalDescription from './ModalDescription';
import ModalChecklist from './ModalChecklist';
import ErrorMessage from './ErrorMessage';


const ModalContent = () => {

  const { boards, boardsDispatch } = useContext(BoardContext)

  const board = boards.length > 0 && boards.find(board => board.isActive)

  const list = board && board.lists.find((list) => {
    const card = list && list.cards.find(card => card.modalVisible)
    return card
  })
  const card = list && list.cards.find(card => card.modalVisible)
  
  const closeModal = () => {
    boardsDispatch({
      type: 'EDIT_CARD',
      boardId: board.id,
      listId: card.listId,
      cardId: card.id,
      updates: {
        modalVisible: !card.modalVisible
      }
    })

    editCard(board.id, card.listId, card.id, {modalVisible: !card.modalVisible}).then((result) => {
      return
    }).catch((e) => {
      console.log(e)

      boardsDispatch({
        type: 'EDIT_BOARD',
        boardId: board.id,
        updates: {
          errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
        }
      })
    })
  }
 
  return (
    <Modal
      isOpen={card && card.modalVisible}
      onRequestClose={closeModal}
      className="card-modal"
      overlayClassName="card-modal-overlay"
    >
      {card && card.modalVisible && 
        <div className="modal-content">
          <ErrorMessage />
          <ModalHeader card={card} boardId={board.id} />
          <ModalTitleAssignDue card={card} boardId={board.id} />
          <ModalDescription card={card} boardId={board.id} />
          <ModalChecklist card={card} boardId={board.id} />
        </div>
      }
    </Modal>
  );
}
 
export default ModalContent;