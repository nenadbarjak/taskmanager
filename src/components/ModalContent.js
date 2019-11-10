import React, { useContext } from 'react';
import Modal from 'react-modal'
import { BoardContext } from '../contexts/BoardContext';
import { editCard } from '../actions/boardActions'
import ModalHeader from './ModalHeader';
import ModalTitleAssignDue from './ModalTitleAssignDue'
import ModalDescription from './ModalDescription';
import ModalChecklist from './ModalChecklist';


const ModalContent = () => {

  const { boards, boardsDispatch } = useContext(BoardContext)

  const board = boards.length > 0 && boards.find(board => board.isActive)
  const list = board && board.lists.find((list) => {
    const card = list && list.cards.find(card => card.modalVisible)
    return card
  })
  const card = list && list.cards.find(card => card.modalVisible)
  
  const closeModal = () => {
    editCard(board._id, card.listId, card._id, {modalVisible: null}).then((result) => {
      boardsDispatch({
        type: 'EDIT_CARD',
        boardId: board._id,
        listId: result.data.listId,
        cardId: result.data._id,
        updates: {
          modalVisible: result.data.modalVisible
        }
      })
    }).catch((e) => {
      console.log(e)
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
          <ModalHeader card={card} boardId={board._id} />
          <ModalTitleAssignDue card={card} boardId={board._id} />
          <ModalDescription card={card} boardId={board._id} />
          <ModalChecklist card={card} boardId={board._id} />
        </div>
      }
    </Modal>
  );
}
 
export default ModalContent;