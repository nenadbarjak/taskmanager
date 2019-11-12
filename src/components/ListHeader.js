import React, { useState, useRef, useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { deleteList, editListTitle } from '../actions/boardActions'

const ListHeader = ({ title, boardId, listId }) => {

  const [titleInput, setTitleInput] = useState(title)

  const { boardsDispatch } = useContext(BoardContext)

  const handleChange = (e) => {
    setTitleInput(e.target.value)
  }

  const sendErrMesg = () => {
    boardsDispatch({
      type: 'EDIT_BOARD',
      boardId,
      updates: {
        errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
      }
    })
  }

  const sendData = (title) => {
    boardsDispatch({
      type: 'EDIT_LIST_TITLE',
      boardId,
      listId,
      title
    })

    editListTitle(boardId, listId, { title }).then((result) => {
      return
    }).catch((e) => {
      console.log(e)
      
      sendErrMesg()
    })
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()

    closeInput()
  }

  const handleBlur = () => {
    if (!titleInput) {
      sendData('Untitled Column')

      closeInput()
    } else {
      sendData(titleInput)

      closeInput()
    }
  }

  const titleInputContainer = useRef()
  const listTitleInput = useRef()
  const listOptions = useRef()

  const showInput = () => {
    titleInputContainer.current.style.display = 'block'
    listTitleInput.current.focus()
  }
  const closeInput = () => {
    titleInputContainer.current.style.display = 'none'
  }

  const showListOptions = (e) => {
    e.stopPropagation()
    listOptions.current.style.display = 'flex'

    const closeListOptions = (e) => {
      if (!e.target.matches('.column-header-options')) {
        if (listOptions.current) {listOptions.current.style.display = 'none'}
        document.removeEventListener('click', closeListOptions)
      }
    }
    document.addEventListener('click', closeListOptions)
  }

  const removeList = (e) => {
    e.stopPropagation()

    boardsDispatch({
      type: 'REMOVE_LIST',
      boardId,
      listId
    })

    deleteList(boardId, listId).then((result) => {
      return
    }).catch((e) => {
      console.log(e)
      
      sendErrMesg()
    })   
  }
  return (
    <>
      <div className="column-header" onClick={showInput}>
        <span>{title}</span>
        <div className="column-header-options" onClick={showListOptions}>
          <span className="fas fa-ellipsis-h"></span>
        </div>
        <div ref={listOptions} className="list-options-content">
          <div onClick={removeList}><span style={{color: 'red'}}>Delete Column</span></div>
        </div>
      </div>
      <div ref={titleInputContainer} className="list-title-input">
        <form onSubmit={handleSubmit}>
          <input type="text" ref={listTitleInput} className="list-title-input-text" value={titleInput} onChange={handleChange} onBlur={handleBlur} />
        </form>
      </div>
    </>
  );
}
 
export default ListHeader;