window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        location.replace('/login');
    } else {
        const socket = io.connect('http://localhost:3000');

        //const submitBtn = document.querySelector('#submit-btn');
        const textField = document.querySelector('#message-text');
        const text = document.querySelector('#text');
        const textLength = text.innerHTML.length;

        let usersArr = [];

        //const messageListElem = document.querySelector('#message-list');

        socket.emit('UserEnteredChannel', { token: jwt });

        socket.on('UserConnected', payload => {

            const newUserLogin = payload.user;
            if (usersArr.indexOf(newUserLogin) === -1) {
                usersArr.push(newUserLogin);
                const users = document.querySelector('#race-users');
                const newUser = document.createElement('div');
                const newUserSpan = document.createElement('span');
                newUserSpan.innerHTML = newUserLogin;
                newUser.appendChild(newUserSpan);
                const newUserProgress = document.createElement('progress');
                newUserProgress.classList.add('progress');
                newUserProgress.value = 0;
                newUserProgress.max = 100;
                newUser.appendChild(newUserProgress);
                users.appendChild(newUser);
            } else {
                console.log('bad');
            }
        });

        textField.addEventListener('input', ev => {
            socket.emit('changeText', { message: textField.value, token: jwt });
        });

        socket.on('myTextChange', payload => {
            console.log(payload);
            const newH1 = document.querySelector('#status');
            const myTextLength = textField.value.length;
            console.log(myTextLength);
            console.log(text.innerHTML);
            if (text.innerHTML.indexOf(payload.message) === 0) {
                newH1.innerHTML = `${Math.round(myTextLength / textLength * 100)}%`;
                const myProgress = document.getElementById("race-users").firstElementChild;
                myProgress.lastChild.value = myTextLength;
                const users = document.querySelector('#race-users').children;
                let usersList = payload.usersProgress;
                for (let i = 0, child; child = users[i]; i++) {
                    for (let j = 0; j < usersList.length; j++) {
                        if (usersList[j].user === child.textContent)
                            child.lastChild.value = usersList[j].value;
                    }
                }
            } else {
                newH1.innerHTML = 'bad';
            }


            //messageListElem.appendChild(newLi);
        });

    }

}
