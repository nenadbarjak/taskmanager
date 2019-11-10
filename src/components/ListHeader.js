import React, { useState, useRef, useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext';
import { deleteList, editListTitle } from '../actions/boardActions'

const ListHeader = ({ title, boardId, listId }) => {

  const [titleInput, setTitleInput] = useState(title)

  const { boardsDispatch } = useContext(BoardContext)

  const handleChange = (e) => {
    setTitleInput(e.target.value)
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    closeInput()
  }

  const handleBlur = () => {
    if (!titleInput) {
      editListTitle(boardId, listId, {title: 'Untitled Column'}).then((result) => {
        boardsDispatch({
          type: 'EDIT_LIST_TITLE',
          boardId,
          listId: result.data._id,
          title: result.data.title
        })
      }).catch((e) => {
        console.log(e)
      })

      closeInput()
    } else {
      editListTitle(boardId, listId, {title: titleInput}).then((result) => {
        boardsDispatch({
          type: 'EDIT_LIST_TITLE',
          boardId,
          listId: result.data._id,
          title: result.data.title
        })
      }).catch((e) => {
        console.log(e)
      })
      
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
    deleteList(boardId, listId).then((result) => {

      boardsDispatch({
        type: 'REMOVE_LIST',
        boardId,
        listId: result.data._id
      })
    }).catch((e) => {
      console.log(e)
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