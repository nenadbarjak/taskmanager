import React, { useContext, useState } from 'react';
import uuid from 'uuid/v1'
import { ListContext } from '../contexts/ListContext';

const NewColumn = () => {
  const [listTitle, setListTitle] = useState('')

  const openForm = () => {
    document.getElementById('testing').style.display = 'block'
    document.getElementById('testinput').focus()
  }
  const closeForm = () => {
    document.getElementById('testing').style.display = 'none' 
  }

  const { listsDispatch } = useContext(ListContext)

  const handleChange = (e) => {
    setListTitle(e.target.value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!listTitle) {
      listsDispatch({
        type: 'ADD_LIST',
        list: {
          title: 'Untitled Column',
          id: uuid(),
          tasks: []
        }
      });
      setListTitle('')
      closeForm()
    } else {
      listsDispatch({
        type: 'ADD_LIST',
        list: {
          title: listTitle,
          id: uuid(),
          tasks: []
        }
      });
      setListTitle('')
      closeForm()
    }
  }

  const handleBlur = (e) => {
    if (!listTitle) {
      closeForm()
    } else {
      listsDispatch({
        type: 'ADD_LIST',
        list: {
          title: listTitle,
          id: uuid(),
          tasks: []
        }
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