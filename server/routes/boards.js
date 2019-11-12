const express = require('express')
const router = new express.Router()
const { Board, Card, List, ChecklistItem } = require('../models/board')

// Get all boards
router.get('/boards', async (req, res) => {
    try {
        const boards = await Board.find({})
        res.send(boards)
    } catch (e) {
        res.status(500).send()
    }
})

// Add a new board
router.post('/boards', async (req, res) => {
    const board = new Board({
        ...req.body
    })

    try {
        await board.save()
        res.status(201).send(board)
    } catch (e) {
        res.status(400).send()
    }
})
// TODO: Delete board and Edit Board Title

// Add a new list
router.post('/boards/lists', async (req, res) => {   
    const list = new List(req.body.list)
    
    try {
        const board = await Board.findOne({ id: req.body.boardId })       
        if (!board) {
            return res.status(404).send()
        }
        
        board.lists.push(list)
        
        await board.save()
        res.status(201).send(list)
    } catch (e) {
        res.status(400).send()
    }
})

// Edit list title
router.patch('/boards/:boardId/lists/:listId', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.params.boardId })
        if (!board) {
            return res.status(404).send()
        }

        const list = board.lists.find(list => list.id === req.params.listId)       
        if (!list) {
            return res.status(404).send()
        }

        list.title = req.body.title

        await board.save()
        res.send(list)
    } catch (e) {
        res.status(500).send()
    }
})

//Delete a list
router.delete('/boards/:boardId/lists/:listId', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.params.boardId })
        if (!board) {
            return res.status(404).send()
        }

        const index = board.lists.findIndex(list => list.id === req.params.listId)
        if (index === -1) {
            return res.status(404).send()
        }

        const list = board.lists.splice(index, 1)
        
        await board.save()
        res.send(list[0])
    } catch (e) {
        res.status(500).send(e)
    }
})

//Add a new card
router.post('/boards/lists/cards', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.body.boardId })
        if (!board) {
            return res.status(404).send()
        }

        const list = board.lists.find((list) => list.id === req.body.listId)
        
        if (!list) {
            return res.status(404).send()
        }

        const card = new Card(req.body.card)

        list.cards = [
            card,
            ...list.cards
        ]

        await board.save()
        res.status(201).send(card)
    } catch (e) {
        res.status(500).send()
    }  
})

// Edit card
router.patch('/boards/:boardId/lists/:listId/cards/:cardId', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.params.boardId })
        if (!board) {
            return res.status(404).send()
        }


        const list = board.lists.find(list => list.id === req.params.listId)
        if (!list) {
            return res.status(404).send()
        }

        const updates = Object.keys(req.body)
        const card = list.cards.find(card => card.id === req.params.cardId)

        updates.forEach((update) => {
            req.body[update] === null ? card[update] = undefined : card[update] = req.body[update]
        })
        
        await board.save()
        res.send(card)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete a card
router.delete('/boards/:boardId/lists/:listId/cards/:cardId', async (req, res) => {    
    try {
        const board = await Board.findOne({ id: req.params.boardId })
        if (!board) {
            return res.status(404).send()
        }

        const list = board.lists.find(list => list.id === req.params.listId)
        if (!list) {
            return res.status(404).send()
        }

        const index = list.cards.findIndex((card) => card.id === req.params.cardId)
        if (index === -1) {
            return res.status(404).send()
        }

        const card = list.cards.splice(index, 1)

        await board.save()
        res.send(card[0])
    } catch (e) {
        res.status(500).send(e)
    }  
})

// Add Checklist item
router.post('/boards/lists/cards/checklist', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.body.boardId })
        if (!board) {
            res.status(404).send()
        }

        const list = board.lists.find(list => list.id === req.body.listId)
        if (!list) {
            res.status(404).send()
        }

        const card = list.cards.find(card => card.id === req.body.cardId)
        if (!card) {
            res.status(404).send()
        }

        const item = new ChecklistItem(req.body.checklistItem)
        
        card.checklist = [
            ...card.checklist,
            item
        ]

        await board.save()
        res.status(201).send(item)
    } catch (e) {
        res.status(500).send()
    }
})

// Edit checklist item
router.patch('/boards/:boardId/lists/:listId/cards/:cardId/checklist/:checklistItemId', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.params.boardId })
        if (!board) {
            return res.status(404).send()
        }

        const list = board.lists.find(list => list.id === req.params.listId)
        if (!list) {
            return res.status(404).send()
        }
       
        const card = list.cards.find(card => card.id === req.params.cardId)
        if (!card) {
            res.status(404).send()
        }

        const item = card.checklist.find(item => item.id === req.params.checklistItemId)
        if (!item) {
            res.status(404).send()
        }

        const updates = Object.keys(req.body)
        updates.forEach(update => item[update] = req.body[update])

        await board.save()
        res.send(item)
    } catch (e) {
        res.status(500).send()
    }
})

// Delete a checklist item
router.delete('/boards/:boardId/lists/:listId/cards/:cardId/checklist/:checklistItemId', async (req, res) => {    
    try {
        const board = await Board.findOne({ id: req.params.boardId })
        if (!board) {
            return res.status(404).send()
        }

        const list = board.lists.find(list => list.id === req.params.listId)
        if (!list) {
            return res.status(404).send()
        }

        const card = list.cards.find(card => card.id === req.params.cardId)
        if (!card) {
            res.status(404).send()
        }

        const index = card.checklist.findIndex((item) => item.id === req.params.checklistItemId)
        if (index === -1) {
            return res.status(404).send()
        }
        
        const item = card.checklist.splice(index, 1)

        await board.save()
        res.send(item[0])
    } catch (e) {
        res.status(500).send(e)
    }  
})

// Drag and drop happened
router.patch('/drag', async (req, res) => {
    try {
        const board = await Board.findOne({ id: req.body.boardId })
            if (!board) {
                res.status(404).send()
            }

        // Dragging lists
        if (req.body.type === 'list') {          
            const list = board.lists.splice(req.body.droppableIndexStart, 1)
            board.lists.splice(req.body.droppableIndexEnd, 0, ...list)

            await board.save()
            res.send()
        }

        // In the same list
        if (req.body.droppableIdStart === req.body.droppableIdEnd) {
            const list = board.lists.find(list => list.id === req.body.droppableIdStart)
            if (!list) {
                return res.status(404).send()
            }

            const card = list.cards.splice(req.body.droppableIndexStart, 1)           
            list.cards.splice(req.body.droppableIndexEnd, 0, ...card)          

            await board.save()
            res.send()
        }
        // Other list
        if (req.body.droppableIdStart !== req.body.droppableIdEnd) {
            const listStart = board.lists.find(list => list.id === req.body.droppableIdStart)
            if (!listStart) {
                return res.status(404).send()
            }

            const card = listStart.cards.splice(req.body.droppableIndexStart, 1)

            const listEnd = board.lists.find(list => list.id.toString() === req.body.droppableIdEnd)
            card[0].listId = req.body.droppableIdEnd

            listEnd.cards.splice(req.body.droppableIndexEnd, 0, ...card)

            await board.save()
            res.send()
        }
    } catch (e) {
        res.status(500).send()
    }  
})

module.exports = router