const logger = require('../logger')
const { chat } = require('../db')

const home = ({ userId }) => new Promise((resolve, reject) =>
    chat.findPersonalChats(userId)
        .then(chats => {
            chats = chats.map(x => ({
                userId: x.UserId,
                firstName: x.FirstName,
                lastName: x.LastName
            }))
            resolve(chats)
        })
        .catch(reject))

module.exports = {
    home,
}
