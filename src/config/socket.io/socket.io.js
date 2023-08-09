const { Server } = require("socket.io")

module.exports = socketIO = function (server) {
    const io = new Server(server)
    io.on('connection', (socket) => {
        console.log('A user connected')
        socket.on('on-chat', (msg) => {
            io.emit('user-chat', msg)
        })
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        })
    })
}

