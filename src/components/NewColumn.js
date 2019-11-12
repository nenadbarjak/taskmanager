import React, { useContext, useState } from 'react';
import uuid from 'uuid/v1'
import { BoardContext } from '../contexts/BoardContext';
import { addList } from '../actions/boardActions'

const NewColumn = ({ boardId }) => {

  const [listTitle, setListTitle] = useState('')

  const openForm = () => {
    document.getElementById('testing').style.display = 'block'
    document.getElementById('testinput').focus()
  }
  const closeForm = () => {
    document.getElementById('testing').style.display = 'none' 
  }

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
      closeForm()
    } else {
      sendData(listTitle)

      setListTitle('')
      closeForm()
    }
  }

  const handleBlur = (e) => {
    if (!listTitle) {
      closeForm()
    } else {
      sendData(listTitle)

      setListTitle('')
      closeForm()
    }
  }

  return (
    <div className="new-column">
      <div className="add-new-column" id="add-column" onClick={openForm}>+ Add column</div>
        <div id="testing" className="pop-up-form" >
          <form onSubmit={handleSubmit}>
            <input id="testinput" type="text" placeholder="Enter list title" value={listTitle} onChange={handleChange} className="new-column-input"  onBlur={handleBlur} />

          </form> 
        </div>
    </div>
  );
}
 
export default NewColumn;