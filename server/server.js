const io = require('socket.io')(5000)
const mongo = require('mongodb').MongoClient

const mongourl = 'mongodb://127.0.0.1/whatsup-clone'

mongo.connect(mongourl, { useUnifiedTopology: true }, (err, db) => {
    if (err) throw err;

    console.log("db connected....")

    io.on('connection', socket => {
        const id = socket.handshake.query.id
        socket.join(id)
        socket.on('send-message', ({recipients, text}) => {
            recipients.forEach(recipient => {
                const newRecipients = recipients.filter(r => r !== recipient)
                newRecipients.push(id)
                socket.broadcast.to(recipient).emit('receive-message', {
                    recipients: newRecipients, sender: id, text
                })
            })
        })
    })
})