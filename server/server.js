const io = require('socket.io')(5000)
const mongo = require('mongodb').MongoClient

const mongourl = 'mongodb://127.0.0.1'

mongo.connect(mongourl, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err;
    const db = client.db('messenger')

    console.log("db connected....")

    io.on('connection', socket => {
        const id = socket.handshake.query.id
        socket.join(id)
        db.collection("users").updateOne({ userId: id }, { $set: { userId: id }, $inc: { connection: 1 } }, { upsert: true })

        socket.on('send-message', ({ recipients, text }) => {
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