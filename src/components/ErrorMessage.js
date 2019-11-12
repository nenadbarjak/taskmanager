import React, { useContext } from 'react';
import { BoardContext } from '../contexts/BoardContext'

const ErrorMessage = () => {
    const { boards } = useContext(BoardContext)

    const board = boards.length > 0 && boards.find(board => board.isActive)

    return (
        <div>
            {board && board.errMsg && <div style={{color: 'red'}}>{board.errMsg}</div>}
        </div>         
    );
}
 
export default ErrorMessage;