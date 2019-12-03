import React, { useState, useContext } from 'react';
import { Redirect } from 'react-router-dom'
import uuid from 'uuid/v1'
import { BoardContext } from '../contexts/BoardContext';
import { addBoard } from '../actions/boardActions';

const AddBoard = ({ history }) => {
    

    const { auth, boardsDispatch } = useContext(BoardContext)

    const [title, setTitle] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        const id = uuid()

        boardsDispatch({
            type: 'ADD_BOARD',
            board: {
                title,
                id,
                isActive: true,
                lists: []
            }
        })

        addBoard({
            title,
            id,
            isActive: true
        }).then((res) => {
            history.push('/')
        }).catch((e) => {
            console.log(e)

            boardsDispatch({
                type: 'EDIT_BOARD',
                boardId: id,
                updates: {
                  errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
                }
            })
        })
    }
    if (!auth.token) {
        return (
            <Redirect to='/signin' />
        )
    }

    return (  
        <div className="login-form-container">
            <h3 className="login-header">Add New Board</h3>
            <form onSubmit={handleSubmit}>
                <div className="input-wrapper">
                    <input 
                        type="text"
                        value={title}
                        required
                        className="login-input"
                        placeholder="Board Title"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <button className="login-button">Add Board</button>
                </div>
            </form>
        </div>
    );
}
 
export default AddBoard;