const texts = [

    "The search will find the word even within words in the text. Therefore, if we’re searching for the word “able” then we’ll find it in “comfortable” and “tablet”. The search will be case-insensitive. The algorithm is based on the naïve string search approach. This means that since we’re naïve about the nature of the characters in the word and the text string, we’ll use brute force to check every location of the text for an instance of the search word.",
    "If you are feeling hungry and don’t know where to head to fill your stomach in Nagoya, I will tell you the 6 Must-try restaurants that you have to visit. Nagoya is one of Japan’s three largest cities and is well known for its rich history. The city is also well known for its delicious cuisine, with delightful dishes that will transport you to a place full of aromas and flavors.",
    "While is not located in Nagoya’s heart but close to it, I felt that I have to include it due to its delicious burgers. Located in Kiyosu, next to Kirin Beer Nagoya Factory, makes it a great place to enjoy a lunch or dinner after doing the tour inside the factory. Most of their dishes are made to combine perfectly with a beer or even sake, and the price is quite affordable, you can enjoy a delicious Teriyaki chicken burger for only 950 yen, or you can opt for a course that comes with unlimited drinks.",
    "One of my favorite places to enjoy a delicious Japanese bowl dish for lunch in Sakae, after a morning shopping around. The lunch menu is affordable and it has many options to choose from, for example, the set in the photo it cost 1,200 yen and is called BBQ Gohan, that is basically pork, vegetables, and rice accompanied by a bowl of miso soup, and warabi mochi as a dessert.",
    "The dishes are delicious and the most popular one is the Taiwan ramen style, that is quite spicy and will cost you 630 yen. If you want to try their popular dish but don’t like too spicy, you can order the American version that is less spicy."

];

function countDown() {
    let newTime = new Date().getTime();
    newTime += 40000;

    let x = setInterval(function () {

        let now = new Date().getTime();

        let distance = newTime - now;
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countDown").innerHTML = seconds + 's';

        if (distance < 0) {
            location.replace('/done');
            clearInterval(x);
            document.getElementById("countDown").innerHTML = "EXPIRED";
        }
    }, 1000);
}


window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
        location.replace('/login');
    } else {
        const socket = io.connect('http://localhost:3000');

        countDown();

        const textField = document.querySelector('#message-text');
        const text = document.querySelector('#text');
        text.innerHTML = texts[Math.floor(Math.random() * 4)];
        const textLength = text.innerHTML.length;

        let usersArr = [];

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
            }
        });

        textField.addEventListener('input', ev => {
            socket.emit('changeText', { message: textField.value, token: jwt });
        });

        socket.on('myTextChange', payload => {
            const newH1 = document.querySelector('#status');
            const myTextLength = textField.value.length;
            const nextCharacter = text.innerHTML[myTextLength];
            console.log(nextCharacter);
            const myText = document.getElementById('myText');
            myText.innerHTML = 'Next character: ' + nextCharacter;
            myText.style.color = 'red';
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
        });
    }
    //Self-invoking function

    let helper = (() => {
        const socket = io.connect('http://localhost:3000');
        let helperTexts = [
            'Стадіон, так стадіон... Сьогоднішня гонка буде проходити на одному з найбільших стадіонів Binary Stadium. Телетрансляція буде на всіх світових телеканалах. Учасники готувались дуже довго і готові показати на що вони здатні.',
            'В нас є фаворит, і це ',
            " Учасник закінчив гонку і п'є смізі на фініші !!! І це учасник по імені ",
            "Одному з учасників залишилось зовсім трішки до фінішу. Чи не спіткнеться він. Це гравець з ніком "
        ];
        let jokes = [
            'Анекдот: Добра порада чоловікам. На ніч потрібно випивати 3-5 літрів пива, опухле обличчя з ранку легше голити!',
            'Анекдот: У жіночий гуртожиток вночі через вікно заліз насильник. Під ранок він плакав і просився до мами!',
            "Анекдот: Об'ява: На виробництво пухирчастої плівки потрібні працівники з великою силою волі.",
            'Анекдот: Не гроші псують людину, а їх недолік!'
        ];

        const textField = document.querySelector('#message-text');
        const text = document.querySelector('#text');

        const helperText = document.getElementById('referee-text');
        // Pure func.
        let changeText = (text, mockText, winner = '') => {
            text.innerHTML = mockText + winner;
        };

        //Currying and self-invoking function
        let curriedChangeText = _.curry(changeText);
        let start = (() => curriedChangeText(helperText)(helperTexts[0]))();

        let halfMinuteInfo = () => {
            let max = 0;
            let maxUser = '';
            socket.emit('raceInfo');
            socket.on('raceResults', payload => {
                payload.usersProgress.forEach(element => {
                    if (element.value >= max) {
                        max = element.value;
                        maxUser = element.user;
                        changeText(helperText, helperTexts[1], maxUser);
                    }
                });
            });
        }
        //Proxy Pattern

        let proxied = halfMinuteInfo;
        halfMinuteInfo = () => {
            console.log('Proxy Pattern');
            return proxied.apply(this, arguments);
        }

        let beforeFinish = () => {
            const jwt = localStorage.getItem('jwt');
            socket.emit('beforeFinish', { token: jwt });
            socket.on('userBeforeFinish', payload => {
                changeText(helperText, helperTexts[3], payload.myLogin);
            });
        }

        let finish = () => {
            const jwt = localStorage.getItem('jwt');
            socket.emit('finished', { token: jwt });
            socket.on('userFinished', payload => {
                changeText(helperText, helperTexts[2], payload.myLogin);
            });
        };

        setInterval(function () {
            let randomNum = Math.floor(Math.random() * 4);
            changeText(helperText, jokes[randomNum]);
        }, 8000);

        setInterval(function () {
            halfMinuteInfo()
        }, 30000);

        if ((textField.innerHTML.length + 30) === text.innerHTML.length) beforeFinish();
        if (textField.innerHTML.length === text.innerHTML.length) finish();

    })();

}
