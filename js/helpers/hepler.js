export function trimValue(value) {
    if(!value) throw new Error('value is not defined');

    return value.trim().toLowerCase();
}

export function getUserFromStorage() {
    const user = JSON.parse(window.localStorage.getItem('youtube:user'));
    if(!user) { 
        console.log('user is not located in the storage')
        return;
    }
    
    return user
}

export function setUserToStorage(data, password) {
    if(!data) throw new Error('func/setUserToStorage: Data is not defined');

    window.localStorage.setItem('youtube:user', JSON.stringify({...data.data, token: data.token, password}))
}

export function logOut() {
    window.localStorage.removeItem('youtube:user')
    window.location.href = '/index.html';
}
