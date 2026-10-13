import { setUserToStorage, trimValue } from '../helpers/hepler.js';
import { protect } from '../middleware/auth.middleware.js';

protect()


const REGISTER_API = `https://youtube-backend-4-n5uz.onrender.com/register`
const registerFormEl = document.querySelector('#registerForm')
const errorEl = document.querySelector('#errorMessage')
errorEl.textContent = ''

registerFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log(e.target.avatar.files);
    const formData = new FormData()
    
    let username = trimValue(e.target.username.value)
    let password = trimValue(e.target.password.value)
    let avatar = e.target?.avatar?.files[0]

    if(!username || !password || !avatar) 
        return alert('username, password and avatar is required');
    
    formData.append('username', username)
    formData.append('password', password)
    // if(avatar) 
        formData.append('file', avatar)


    try {
        const {data} = await axios.post(REGISTER_API, formData)
        
        console.log(data);
        
        if(!data.token) return console.error('token is not defined');

        setUserToStorage(data, password)
        window.location.href = '/admin.html';
        
    } catch (error) {
        if (axios.isAxiosError(error)) {
      
            if (error.response) {
                errorEl.textContent = error?.response?.data?.message
                
                // The server responded with a status code outside the 2xx range
                console.error('Error Data in register:', error.response.data);    // Server error payload (e.g., { message: "Invalid password" })
            }
        }
    }

})