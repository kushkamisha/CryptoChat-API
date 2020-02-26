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

const messages = ({ chatId }) => new Promise((resolve, reject) =>
    chat.getMessages(chatId)
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

module.exports = {
    chatsList,
    messages,
}
