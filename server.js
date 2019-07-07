const path = require('path');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const jwt = require('jsonwebtoken');
const passport = require('passport');
const bodyParser = require('body-parser');
const users = require('./users.json');

require('./passport.config');

server.listen(3000);

app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/race', function (req, res) {
  res.sendFile(path.join(__dirname, 'race.html'));
});

app.get('/wait', function (req, res) {
  res.sendFile(path.join(__dirname, 'waiting.html'));
});

app.get('/done', function (req, res) {
  res.sendFile(path.join(__dirname, 'done.html'));
});

app.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', function (req, res) {
  const userFromReq = req.body;
  const userInDB = users.find(user => user.login === userFromReq.login);
  if (userInDB && userInDB.password === userFromReq.password) {
    const token = jwt.sign(userFromReq, 'someSecret', { expiresIn: '24h' });
    res.status(200).json({ auth: true, token });
  } else {
    res.status(401).json({ auth: false });
  }
});

let usersProgress = [];

io.on('connection', socket => {

  socket.on('UserEnteredChannel', payload => {
    const myLogin = jwt.decode(payload.token).login;
    console.log('Mylogin: ', myLogin);
    usersProgress.push({ user: myLogin, value: 0 });
    console.log(usersProgress);
    socket.broadcast.emit('UserConnected', { user: myLogin });
    socket.emit('UserConnected', { user: myLogin });
  });
  socket.on('changeText', payload => {
    const { message, token } = payload;
    const userLogin = jwt.decode(token).login;
    socket.broadcast.emit('UserConnected', { user: userLogin });
    socket.emit('UserConnected', { user: userLogin });
    let userToChange = usersProgress.filter(x => x.user === userLogin)[0];
    if (userToChange) {
      userToChange.value = message.length;
    }
    console.log(usersProgress);

    socket.broadcast.emit('myTextChange', { message, user: userLogin, usersProgress: usersProgress });
    socket.emit('myTextChange', { message, user: userLogin, usersProgress });
  });
  socket.on('raceEnded', () => {
    socket.broadcast.emit('raceResults', { usersProgress });
    socket.emit('raceResults', { usersProgress });
  });
});