const mongoose = require('mongoose')

const checklistItemSchema = new mongoose.Schema({
    note: {
        type: String,
        required: true,
        trim: true
    },
    finished: {
        type: Boolean,
        default: false
    }
})

checklistItemSchema.methods.toJSON = function () {
    const checklistItem = this
    const checklistItemObject = checklistItem.toObject()

    delete checklistItemObject.__v

    return checklistItemObject
}

const ChecklistItem = mongoose.model('checklistItem', checklistItemSchema)

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    modalVisible: {
        type: Boolean,
        default: false
    },
    dueDate: {
        type: Number
    },
    assignedTo: {
        type: String
    },
    listId: {
        type: String
    },
    checklist: [checklistItemSchema]
})

cardSchema.methods.toJSON = function () {
    const card = this
    const cardObject = card.toObject()

    delete cardObject.__v

    return cardObject
}

const Card = mongoose.model('Card', cardSchema)

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    boardId: {
        type: String
    },
    cards: [cardSchema]
})

listSchema.methods.toJSON = function () {
    const list = this
    const listObject = list.toObject()

    delete listObject.__v

    return listObject
}

const List = mongoose.model('List', listSchema)

const boardSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: false
    },
    lists: [listSchema],
})

boardSchema.methods.toJSON = function () {
    const board = this
    const boardObject = board.toObject()

    delete boardObject.__v

    return boardObject
}

const Board = mongoose.model('Board', boardSchema)

module.exports = {
    Board,
    List,
    Card,
    ChecklistItem
}