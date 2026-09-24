import { getUserFromStorage, setUserToStorage, trimValue } from "../helpers/hepler.js"

import { protect } from '../middleware/auth.middleware.js';

protect()


const LOGIN_API = `https://n30-youtube-api.onrender.com/login`
const loginFormEl = document.querySelector('#loginForm')
const errorEl = document.querySelector('#errorMessage')
errorEl.textContent = ''

loginFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();


    let username = trimValue(e.target.username.value)
    let password = trimValue(e.target.password.value)
    
    if(!username || !password) 
        return alert('username and password is required');
    
    try {
        const {data} = await axios.post(LOGIN_API, { username, password })
        
        if(!data.token) return;

        setUserToStorage(data, password)
        window.location.href = '/admin.html';
        
        // errorEl.textContent = 'Successful'
        // console.log('fromStorage', getUserFromStorage());
        // console.log(data);

    } catch (error) {
        if (axios.isAxiosError(error)) {
      
            if (error.response) {
                errorEl.textContent = error?.response?.data?.message
                
                // The server responded with a status code outside the 2xx range
                console.error('Error Data:', error.response.data);    // Server error payload (e.g., { message: "Invalid password" })
            }
        }
    }
    
})



