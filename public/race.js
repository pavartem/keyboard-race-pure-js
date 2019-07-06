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
        const myProgress = document.querySelector('#myProgress');
        myProgress.max = textLength;

        //const messageListElem = document.querySelector('#message-list');

        textField.addEventListener('input', ev => {
            socket.emit('submitMessage', { message: textField.value, token: jwt });
        });

        socket.on('myTextChange', payload => {

            const newH1 = document.querySelector('#status');
            const myTextLength = textField.value.length;
            console.log(myTextLength);
            if (text.innerHTML.indexOf(payload.message) === 0) {
                newH1.innerHTML = `${Math.round(myTextLength / textLength * 100)}%`;
                myProgress.value = myTextLength;

            } else {
                newH1.innerHTML = 'bad';
            }
            //messageListElem.appendChild(newLi);
        });

    }

}
