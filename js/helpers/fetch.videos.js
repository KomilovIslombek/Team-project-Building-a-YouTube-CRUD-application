import { getUserFromStorage } from "./hepler.js";

const myFiles_api = 'https://youtube-backend-4-n5uz.onrender.com/files/my';
let videosList = document.querySelector('.videos-list-wrapper')
const user = getUserFromStorage() || null

videosList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.delete-icon')
    if (deleteButton) {
        removeVideo(deleteButton.dataset.fileId)
        return
    }

    const editButton = event.target.closest('.edit-icon')
    if (editButton) {
        openEditModal(editButton.dataset.fileId, editButton.dataset.title)
    }
})

export async function fetchVideos() {
    try {
        const {data: {data}} = await axios.get(myFiles_api, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        })

        console.log('fetch videos');
        videosList.innerHTML = '';

        for (const video of data) {
            let videoEl = `<li class="video-item">
                    <div class="video-preview-wrapper">
                        <video controls src="${video.viewFile}"></video>
                        <div class="video-actions">
                            <button class="edit-icon" type="button" data-file-id="${video.fileId}" data-title="${video.videoInput}" aria-label="Edit video title">Edit</button>
                            <button class="delete-icon" type="button" data-file-id="${video.fileId}" aria-label="Delete video">&times;</button>
                        </div>
                    </div>
                    <p class="content">${video.videoInput}</p>
                </li>`;

            videosList.innerHTML += videoEl
        }      

        console.log(data);       

    } catch (error) {
        if (axios.isAxiosError(error)) {
      
            if (error.response) {
                
                // The server responded with a status code outside the 2xx range
                console.error('Error Data in fetch.videos:', error.response.data);    // Server error payload (e.g., { message: "Invalid password" })
            }
        }
    }
}

async function removeVideo(fileId) {
    console.log('removeVideo', fileId);
    
    try {
        await axios.delete('https://youtube-backend-4-n5uz.onrender.com/files', {
            headers: {
                Authorization: `Bearer ${user.token}`
            },
            data: {
                fileId
            }
        })

        await fetchVideos()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error deleting video:', error.response.data)
        }
    }
}

function openEditModal(fileId, title) {
    const modal = document.querySelector('#editVideoModal')
    const titleInput = document.querySelector('#editVideoTitle')

    modal.dataset.fileId = fileId
    titleInput.value = title
    modal.showModal()
    titleInput.focus()
}

const editModal = document.querySelector('#editVideoModal')
const editForm = document.querySelector('#editVideoForm')
const cancelEditButton = document.querySelector('#cancelEdit')

cancelEditButton.addEventListener('click', () => editModal.close())

editForm.addEventListener('submit', async (event) => {
    event.preventDefault()

    const fileId = editModal.dataset.fileId
    const videoInput = document.querySelector('#editVideoTitle').value.trim()
    if (!videoInput) return

    try {
        await axios.put('https://youtube-backend-4-n5uz.onrender.com/files', {
            fileId,
            videoInput
        }, {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        })

        editModal.close()
        await fetchVideos()
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error updating video:', error.response.data)
        }
    }
})