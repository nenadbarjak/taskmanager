import React, { useState, useRef, useContext, useEffect } from 'react';
import '../styles/ListHeader.css'
import { BoardContext } from '../contexts/BoardContext';
import { deleteList, editListTitle } from '../actions/boardActions'

const ListHeader = ({ title, boardId, listId }) => {

  const [titleInput, setTitleInput] = useState(title)
  const [inputVisible, setInputVisible] = useState(false)
  const [optionsVisible, setOptionsVisible] = useState(false)

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

    setInputVisible(false)
  }

  const handleBlur = () => {
    if (!titleInput) {
      sendData('Untitled Column')

      setInputVisible(false)
    } else {
      sendData(titleInput)

      setInputVisible(false)
    }
  }

  const titleInputContainer = useRef()
  const listOptions = useRef()

  const handleClickOutsideInput = (e) => {
    if (titleInputContainer.current && !titleInputContainer.current.contains(e.target)) {
      setInputVisible(false)
    }
  }

  const showListOptions = (e) => {
    e.stopPropagation()

    setOptionsVisible(true)
    
  }
  const closeListOptions = (e) => {
    if (listOptions.current && !listOptions.current.contains(e.target)) {
      setOptionsVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', closeListOptions)

    return () => document.removeEventListener('mousedown', closeListOptions)
  })

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutsideInput)

    return () => document.removeEventListener('mousedown', handleClickOutsideInput)
  })

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
    <div className="column-header" onClick={() => setInputVisible(true)}>
      {inputVisible ? (
        <div id="titleInputContainer" ref={titleInputContainer} className="list-title-input">
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            autoFocus 
            id="listTitleInput" 
            className="list-title-input-text" 
            value={titleInput} 
            onChange={handleChange} 
            onBlur={handleBlur} 
          />
        </form>
        </div>
      ) : (
        <div>
          <span>{title}</span>
          <div className="column-header-options" onClick={showListOptions}>
            <span className="fas fa-ellipsis-h"></span>
          </div>
          { optionsVisible && (
            <div id="listOptions" ref={listOptions} className="list-options-content">
              <div onClick={removeList}><span style={{color: 'red'}}>Delete Column</span></div>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
 
export default ListHeader;