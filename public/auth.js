window.onload = () => {

    const jwt = localStorage.getItem('jwt');
    if (jwt) {
        location.replace('/wait');
    } else {
        location.replace('/login');
    }

}
