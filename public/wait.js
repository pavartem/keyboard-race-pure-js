window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        location.replace('/login');
    } else {
        let newTime = new Date().getTime();
        newTime += 10000;

        let x = setInterval(function () {

            let now = new Date().getTime();

            let distance = newTime - now;
            let seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById("countDown").innerHTML = seconds + 's';

            if (distance < 0) {
                location.replace('/race');
                clearInterval(x);
                document.getElementById("countDown").innerHTML = "EXPIRED";
            }
        }, 1000);
    }
}
