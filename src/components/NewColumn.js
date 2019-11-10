import React, { useContext, useState } from 'react';
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

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!listTitle) {
      addList({
        boardId, 
        list: {
          title: 'Untitled Column',
          boardId
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_LIST',
          boardId: result.data.boardId,
          list: result.data
        })
      }).catch((e) => {
        console.log(e)
      })
      setListTitle('')
      closeForm()
    } else {
      addList({
        boardId, 
        list: {
          title: listTitle,
          boardId
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_LIST',
          boardId: result.data.boardId,
          list: result.data
        })
      }).catch((e) => {
        console.log(e)
      })
      setListTitle('')
      closeForm()
    }
  }

  const handleBlur = (e) => {
    if (!listTitle) {
      closeForm()
    } else {
      addList({
        boardId, 
        list: {
          title: listTitle,
          boardId
        }
      }).then((result) => {
        boardsDispatch({
          type: 'ADD_LIST',
          boardId: result.data.boardId,
          list: result.data
        })
      }).catch((e) => {
        console.log(e)
      })
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