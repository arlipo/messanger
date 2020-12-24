const io = require('socket.io')(5000)


io.on('connection', socket => {
    const id = socket.handshake.query.id
    socket.join(id)
    console.log("connect " + id)
    socket.on('send-message', ({recipients, text}) => {
        console.log("send it from serv")
        recipients.forEach(recipient => {
            const newRecipients = recipients.filter(r => r !== recipient)
            newRecipients.push(id)
            socket.broadcast.to(recipient).emit('receive-message', {
                recipients: newRecipients, sender: id, text
            })
        });
    })
})