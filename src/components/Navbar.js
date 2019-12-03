import React, { useContext, useRef, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom'
import Select from 'react-select'
import { BoardContext } from '../contexts/BoardContext';
import { setAxiosToken } from '../services/axiosPreset'
import { logOut, logOutAll, deleteUser } from '../actions/authActions'
import { editBoard, deleteBoard } from '../actions/boardActions'

const Navbar = () => {
  
  const { boards, boardsDispatch, auth, authDispatch } = useContext(BoardContext)
  const boardsList = useRef() 

  const [boardListVisible, setBoardListVisible] = useState(false)

  const [optionsVisible, setOptionsVisible] = useState(false)
  const optionsList = useRef()

  const showBoardList = () => {
    setBoardListVisible(true)
    
    if (boardsList.current) {
      boardsList.current.focus()
    }

  }

  const closeBoardsList = () => {
    setBoardListVisible(false)
  }

  const showOptions = () => {
    // if (!optionsList.current) {
    //   setOptionsVisible(true)
    // }    
    setOptionsVisible(true)
  }

  const hideOptions = (e) => {
    const options = document.getElementById('header-options')

    if (options && !options.contains(e.target)) {
      setOptionsVisible(false)
    }
    // console.log(options)
    // if (optionsList.current && !optionsList.current.contains(e.target)) {
    //   setOptionsVisible(false)
    // }
  }

  useEffect(() => {
    document.addEventListener('mousedown', hideOptions)

    return () => document.removeEventListener('mousedown', hideOptions)
  })

  const board = boards && boards.length > 0 && boards.find(board => board.isActive)

  const sendErrMsg = () => {
    boardsDispatch({
      type: 'EDIT_BOARD',
      boardId: board.id,
      updates: {
        errMsg: 'ERROR! COULD NOT CONNECT TO DATABASE. PLEASE REFRESH THE PAGE AND TRY AGAIN.'
      }
    })
  }

  const logout = () => {
    logOut()
      .then((res) => {
        localStorage.removeItem('TM_App_token')

        setAxiosToken()

        authDispatch({ type: 'LOGOUT' })

        window.location.assign('/')
      })
      .catch((e) => {
        console.log(e)

        sendErrMsg()
      })
  }

  const logoutAll = () => {
    logOutAll().then((res) => {
      localStorage.removeItem('TM_App_token')

      setAxiosToken()

      authDispatch({ type: 'LOGOUT' })

      window.location.assign('/')
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })
  }

  const deactivateAccount = () => {
    deleteUser()
      .then((res) => {
        localStorage.removeItem('TM_App_token')

        setAxiosToken()

        authDispatch({ type: 'LOGOUT' })

        window.location.assign('/')
      })
      .catch((e) => {
        console.log(e)

        sendErrMsg()
      })
  }

  const handleBoardChange = (e) => {
    if (!e.value) {
      return
    }

    boardsDispatch({
      type: 'SWITCH_BOARDS',
      boardId: e.value
    })

    editBoard(e.value, { isActive: true }).then((res) => {
      if (window.location.pathname.length > 1) {
        window.location.assign('/')
      }
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })

    setBoardListVisible(false)
  }

  const removeBoard = () => {
    boardsDispatch({
      type: 'REMOVE_BOARD',
      boardId: board.id
    })

    deleteBoard(board.id).then((res) => {
      window.location.assign('/')
    }).catch((e) => {
      console.log(e)

      sendErrMsg()
    })  
  }

  return (
    <nav className="nav-wrapper white navbar">
      <div className="header-container">
        <div>
          <NavLink to='/' className="title-logo"><h1 className="header-main-title">Task Manager</h1></NavLink>
          <p>( Trello / Asana / Kanban board )</p>
        </div>
        {auth.token && (<>
          <div className="header-middle">
            <div className="header-middle-top">
              {
                boardListVisible ? (
                  <div className="boards-select">
                    <Select
                      ref={boardsList} 
                      options={boards.map((board) => ({value: board.id, label: board.title}))}
                      onBlur={closeBoardsList}                
                      defaultValue={board ? {value: board.id, label: board.title} : null}
                      defaultMenuIsOpen
                      onChange={handleBoardChange}
                      autoFocus
                    />
                  </div>
                ) : (
                  <div >
                    <h4>{board ? board.title : 'Select board'}<i onClick={showBoardList} className="angle-down fas fa-angle-down"></i></h4>                
                  </div>
                )
              }           
            </div> 
            <div className="header-middle-bottom"> 
              <NavLink to='/addboard'><button className="add-board-btn">Add New board</button></NavLink>
            </div>
        </div>

        <div className="header-right">
          <div onClick={showOptions}>
            <i className="fas fa-bars fa-lg"></i>
          </div>
          {optionsVisible && (
            <div id="header-options" ref={optionsList} className="header-options">
              <Link to='/addboard'  className="options-addboard">
                <div>
                  <span>Add New Board</span>               
                </div>
              </Link>
              <div onClick={removeBoard}>
                <span style={{color: 'red'}}>Delete Board</span>
              </div>
              <div onClick={logout}>
                <span>Logout</span>
              </div>
              <div onClick={logoutAll}>
                <span>Logout From All Devices</span>
              </div>
              <div onClick={deactivateAccount}>
                <span style={{color: 'red'}}>Deactivate Account</span>
              </div>
            </div>
            )
          }
        </div>  
        </>)
      }     
      </div>
    </nav>
  )
}
 
export default Navbar;