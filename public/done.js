window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        location.replace('/login');
    } else {
        const socket = io.connect('http://localhost:3000');
        socket.emit('raceEnded');


        socket.on('raceResults', payload => {
            const usersListUl = document.getElementById('race-result');
            payload.usersProgress.forEach(element => {
                const newLi = document.createElement('li');
                newLi.innerHTML = `${element.user} - ${element.value} symbols`;
                usersListUl.appendChild(newLi);
            });

        });

        let newTime = new Date().getTime();
        newTime += 5000;

        let x = setInterval(function () {

            let now = new Date().getTime();

            let distance = newTime - now;

            if (distance < 0) {
                location.replace('/wait');
                clearInterval(x);
            }
        }, 1000);


    }
}
