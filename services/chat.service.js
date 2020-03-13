const logger = require('../logger')
const { chat } = require('../db')

const chatsList = ({ userId }) => new Promise((resolve, reject) =>
    chat.getPersonalChats(userId)
        .then(chats => {
            chats = chats.map(x => ({
                userId: x.UserId,
                chatId: x.ChatId,
                chatType: x.ChatType,
                fromUser: x.FromUser,
                toUser: x.ToUser,
                firstName: x.FirstName,
                lastName: x.LastName
            }))
            resolve(chats)
        })
        .catch(reject))

const messages = chatId => new Promise((resolve, reject) =>
    chat.getMessages(chatId)
        .then(msgs => {
            msgs = msgs.map(x => ({
                userId: x.UserId,
                text: x.MessageText,
                isRead: x.IsRead,
                time: `${x.CreatedAt}`.slice(16, 21)
            }))
            resolve(msgs)
        })
        .catch(reject))

const unreadMessages = (chatId, userId) => new Promise((resolve, reject) =>
    chat.getUnreadMessages(chatId, userId)
        .then(msgs => {
            msgs = msgs.map(x => ({
                userId: x.UserId,
                text: x.MessageText,
                time: `${x.CreatedAt}`.slice(16, 21)
            }))
            resolve(msgs)
        })
        .catch(reject))


const addMessage = ({ chatId, userId, text }) =>
    new Promise((resolve, reject) =>
        Promise.all([
            chat.addMessage(chatId, userId, text),
            chat.getChatUsers(chatId)
        ])
            .then(([[{ CreatedAt }], chatUsers]) => {
                resolve({ createdAt: `${CreatedAt}`.slice(16, 21), chatUsers })
            })
            .catch(reject))

// const readMessages = ({ chatId, userId }) => {}

const getMessageById = msgId => chat.getMessageById(msgId)

module.exports = {
    chatsList,
    messages,
    unreadMessages,
    addMessage,
    getMessageById,
}
