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
    },
    id: {
        type: String,
        required: true
    }
})

checklistItemSchema.methods.toJSON = function () {
    const checklistItem = this
    const checklistItemObject = checklistItem.toObject()

    delete checklistItemObject.__v
    delete checklistItemObject._id

    return checklistItemObject
}

const ChecklistItem = mongoose.model('checklistItem', checklistItemSchema)

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        default: '',
        trim: true
    },
    id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: '',
        trim: true
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
    delete cardObject._id

    return cardObject
}

const Card = mongoose.model('Card', cardSchema)

const listSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    id: {
        type: String,
        required: true
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
    delete listObject._id

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
    id: {
        type: String,
        required: true
    },
    errMsg: {
        type: String,
        default: ''
    },
    lists: [listSchema],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

boardSchema.methods.toJSON = function () {
    const board = this
    const boardObject = board.toObject()

    delete boardObject.__v
    delete boardObject._id
    delete boardObject.owner

    return boardObject
}

const Board = mongoose.model('Board', boardSchema)

module.exports = {
    Board,
    List,
    Card,
    ChecklistItem
}