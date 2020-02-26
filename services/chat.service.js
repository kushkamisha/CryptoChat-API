const logger = require('../logger')
const { chat } = require('../db')

const chatsList = ({ userId }) => new Promise((resolve, reject) =>
    chat.getPersonalChats(userId)
        .then(chats => {
            chats = chats.map(x => ({
                userId: x.UserId,
                chatId: x.ChatId,
                firstName: x.FirstName,
                lastName: x.LastName
            }))
            resolve(chats)
        })
        .catch(reject))

const messages = ({ chatId, userId, text }) => new Promise((resolve, reject) =>
    chat.getMessages(chatId, userId, text)
        .then(msgs => {
            msgs = msgs.map(x => ({
                userId: x.UserId,
                text: x.MessageText,
                time: `${x.CreatedAt}`.slice(16, 21)
            }))
            console.log({ msgs })
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

const getMessageById = msgId => chat.getMessageById(msgId)

module.exports = {
    chatsList,
    messages,
    addMessage,
    getMessageById,
}
