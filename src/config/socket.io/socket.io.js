const { Server } = require("socket.io")
const Message = require('../../app/models/message')

module.exports = socketIO = function (server) {
    const io = new Server(server)
    io.on('connection', async (socket) => {

        // get initial message from database
        const messages = await Message.find().sort('-createdAt')
        socket.on('initialMessages', async function (data) {
            const messages = await Message.find({})
            io.emit('initialMessages', messages)
        })

        socket.on('newMessage', async (msg) => {
            const message = new Message(msg)
            await message.save()

            io.emit('newMessage', message)
        })
        socket.on('disconnect', () => {
        })
    })
}

