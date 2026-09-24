import { fetchVideos } from "../helpers/fetch.videos.js";
import { protect } from "../middleware/auth.middleware.js";
import { getUserFromStorage, logOut } from "../helpers/hepler.js";

protect()

const getFiles_api = 'https://n30-youtube-api.onrender.com/files';
const user = getUserFromStorage() || null
const errorEl = document.querySelector('#errorMessage')


const videoForm = document.querySelector('#videoForm')

const logoutBtn = document.querySelector('#logoutBtn');
logoutBtn.addEventListener('click', () => {
    
    console.log('logged out')
    logOut()
})

// Fetching my files
fetchVideos(user)

// Attaching the event for adding new video on submit
// videoForm.addEventListener
videoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorEl.classList.add('loading')
    errorEl.textContent = 'Uploading...'

    let title = e.target.video_title.value
    let video_file = e.target.video_file.files[0] || null    
    let formData = new FormData()
   
    console.log(title);
    console.log(video_file);
    if(!title || !video_file) {
        errorEl.textContent = 'Video is required. upload a vide sweetheart)'
        
        return
    }

    formData.append('videoInput', title)
    formData.append('file', video_file)

    try {
        const {data: {data}} = await axios.post(getFiles_api, formData, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })

        if(data) {
            await fetchVideos();
            errorEl.textContent = 'Uploaded a new video'
        }

       console.log('downloaded video', data);       

    } catch (error) {
        if (axios.isAxiosError(error)) {
      
            if (error.response) {
                
                // The server responded with a status code outside the 2xx range
                console.error('Error Data in admin controller - 81 line:', error.response.data);    // Server error payload (e.g., { message: "Invalid password" })
            }
        }
    } finally {
        errorEl.classList.remove('loading')
        errorEl.textContent = ''
    }
})