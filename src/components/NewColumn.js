import React, { useContext, useState, useEffect } from 'react';
import uuid from 'uuid/v1'
import { BoardContext } from '../contexts/BoardContext';
import { addList } from '../actions/boardActions'

const NewColumn = ({ boardId }) => {

  const [listTitle, setListTitle] = useState('')
  const [inputVisible, setInputVisible] = useState(false)

  const { boardsDispatch } = useContext(BoardContext)

  const handleChange = (e) => {
    setListTitle(e.target.value)
  }

  const sendData = (title) => {
    const id = uuid()

    boardsDispatch({
      type: 'ADD_LIST',
      boardId,
      list: {
        title,
        boardId,
        id,
        cards: []
      }
    })
    addList({
      boardId,
      list: {
        title,
        id,
        boardId
      }
    }).then((result) => {
      return
    }).catch((e) => {
      console.log(e)
      boardsDispatch({
        type: 'EDIT_BOARD',
        boardId,
        updates: {
          errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
        }
      })
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!listTitle) {
      sendData('Untitled Column')

      setListTitle('')
      setInputVisible(false)
    } else {
      sendData(listTitle)

      setListTitle('')
      setInputVisible(false)
    }
  }

  const handleBlur = (e) => {
    if (!listTitle) {
      setInputVisible(false)
    } else {
      sendData(listTitle)

      setListTitle('')
      setInputVisible(false)
    }
  }

  const handleClickOutside = (e) => {
    const container = document.getElementById('form-container')

    if (container && !container.contains(e.target)) {
      handleBlur()
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  })

  return (
    <div className="new-column">
      { inputVisible ? (
          <div id="form-container" className="pop-up-form" >
            <form onSubmit={handleSubmit}>
              <input 
                type="text" 
                placeholder="Enter list title" 
                value={listTitle} 
                onChange={handleChange} 
                className="new-column-input"  
                onBlur={handleBlur}
                autoFocus 
              />
            </form> 
          </div>
        ) : (
          <div className="add-new-column" id="add-column" onClick={() => setInputVisible(true)}>
            <span>+ Add column</span> 
          </div>
        )
      }        
    </div>
  );
}
 
export default NewColumn;