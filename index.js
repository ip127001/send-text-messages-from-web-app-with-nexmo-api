const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io'); 

const nexmo = new Nexmo({
    apiKey: '7c300ba3',
    apiSecret: 'd0d28993f9493d08'
}, {debug: true});

const app = express();

app.set('view engine', 'html');
app.engine('html', ejs.renderFile);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) => {
    console.log(req.body);
    const number = req.body.number;
    const text = req.body.text;

    nexmo.message.sendSms('Nexmo', number, text, function(err, responseData){
        if(err) {
            console.log(err);
        } else {
            console.dir(responseData);
            //get data from response
            const data = {
                id: responseData.messages[0]['message-id'],
                number: responseData.messages[0]['to']
            }
            io.emit('smsStatus', data);
            //emit to the client
        }
    }
);
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`server started on port ${port} `);
});

const io = socketio(server);
io.on('connection', (socket) => {
    console.log('Connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    });
});