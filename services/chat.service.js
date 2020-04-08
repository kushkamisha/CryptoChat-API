const { chat } = require('../db')
const { dateToLabel } = require('../utils')
const { toEth } = require('../utils/bc')

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
                lastName: x.LastName,
                avatar: x.AvatarBase64,
                lastMsgText: x.MessageText,
                lastMsgTime: x.CreatedAt
            }))
            chats = chats.map(obj => {
                obj.lastMsgTime = dateToLabel(obj.lastMsgTime)
                return obj
            })
            resolve(chats)
        })
        .catch(reject))

const messages = chatId => new Promise((resolve, reject) =>
    Promise.all([
        chat.getTotalAmount(chatId),
        chat.getMessages(chatId)
    ])
        .then(([totalAmount, msgs ]) => {
            msgs = msgs.map(x => ({
                msgId: x.ChatMessageId,
                userId: x.UserId,
                text: x.MessageText,
                isRead: x.IsRead,
                time: `${x.CreatedAt}`.slice(16, 21)
            }))
            if (totalAmount.length)
                resolve([toEth(totalAmount[0].TransactionAmountWei), msgs])
            else
                resolve([undefined, msgs])
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

const totalEthAmount = chatId => new Promise((resolve, reject) =>
    chat.getTotalAmount(chatId)
        .then(totalAmount =>
            resolve(totalAmount.length ?
                `${toEth(totalAmount[0].TransactionAmountWei)}` : 0))
        .catch(reject))

const addMessage = ({ chatId, userId, text }) => {
    console.log({ chatId, userId, text })
    return new Promise((resolve, reject) =>
        Promise.all([
            chat.addMessage(chatId, userId, text),
            chat.getChatUsers(chatId),
            chat.getTotalAmount(chatId)
        ])
            .then(([
                [{ CreatedAt, ChatMessageId }],
                chatUsers,
                totalAmount
            ]) => {
                const amount = totalAmount.length ?
                    `${toEth(totalAmount[0].TransactionAmountWei)}` :
                    undefined
                resolve({
                    chatMsgId: ChatMessageId,
                    createdAt: `${CreatedAt}`.slice(16, 21),
                    chatUsers,
                    amount
                })
            })
            .catch(reject))
        }

const getMessageById = msgId => chat.getMessageById(msgId)

const readMessages = (chatId, userId) => chat.readMessages(chatId, userId)

module.exports = {
    chatsList,
    messages,
    unreadMessages,
    totalEthAmount,
    addMessage,
    getMessageById,
    readMessages,
}
