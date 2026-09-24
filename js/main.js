import { getUserFromStorage } from "./helpers/hepler.js"


const users_api = 'https://youtube-backend-4-n5uz.onrender.com/users';
const files_api = 'https://youtube-backend-4-n5uz.onrender.com/files';
const usersList = document.querySelector("#users-list")
const avatarWrapper = document.querySelector(".avatar-img-wrapper")
const videosList = document.querySelector(".iframes-list")
const user = getUserFromStorage() || null
const selectedUserStorageKey = 'youtube:selected-user-id'

if(user) {
    avatarWrapper.setAttribute('href', '/admin.html')

    avatarWrapper.querySelector('img').src = user.profileImg
}

async function fetchVideos(selectedUser = null) {
    try {
        const {data: {data: files}} = await axios.get(files_api)
        if (!selectedUser) {
            renderVideos(files)
            return
        }

        const selectedUserId = String(selectedUser.id ?? selectedUser.userId ?? selectedUser._id)
        const selectedUsername = selectedUser.username
        const relatedVideos = files.filter((file) => {
            const fileUserId = file.userId ?? file.user_id ?? file.user?.userId ?? file.user?.id ?? file.user?._id
            return fileUserId !== undefined
                ? String(fileUserId) === selectedUserId
                : file.username === selectedUsername || file.user?.username === selectedUsername
        })

        renderVideos(relatedVideos)
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            console.error('Error fetching user videos:', error.response.data)
        }
    }
}

function renderVideos(videos) {
    videosList.innerHTML = ''

    for (const video of videos) {
        const videoUser = video.user ?? {}
        const profileImg = videoUser.profileImg ?? 'https://cdn-icons-png.flaticon.com/512/146/146031.png'
        const videoDate = video.data ?? ''
        const videoTime = video.time ?? ''
        const videoSize = video.size ? `${video.size} MB` : ''

        videosList.insertAdjacentHTML('beforeend', `<li class="iframe">
                <video class="video-preview" src="${video.viewFile}" controls preload="metadata"></video>
                <div class="iframe-footer">
                    <img src="${profileImg}" alt="${videoUser.username ?? 'User'} avatar">
                    <div class="iframe-footer-text">
                        <h3 class="iframe-title">${video.videoInput ?? 'Untitled video'}</h3>
                        <p class="channel-name">${videoUser.username ?? 'Unknown user'}</p>
                        <time class="uploaded-time">${videoDate}${videoDate && videoTime ? ' | ' : ''}${videoTime}</time>
                        <a class="download" href="${video.downloadLink ?? video.viewFile}" download>
                            <span>${videoSize || 'Download'}</span>
                            <img src="./img/download.png" alt="Download">
                        </a>
                    </div>
                </div>
            </li>`)
    }
}

function setActiveUser(userId) {
    document.querySelectorAll('#users-list .channel').forEach((channel) => {
        channel.classList.toggle('active', channel.dataset.id === String(userId))
    })
}

window.addEventListener('DOMContentLoaded', async () => {
    try {
        const {data: {data}} = await axios.get(users_api)

        for (const member of data) {
            const userId = member.id ?? member.userId ?? member._id
            let userHTML = `<li class="channel user-member" data-id="${userId}" data-username="${member.username}">
                        <a href="#">
                            <img src="${member.profileImg ?? 'https://cdn-icons-png.flaticon.com/512/146/146031.png'}" alt="channel-icon"
                                width="30px" height="30px">
                            <span>${member.username}</span>
                        </a>
                    </li>`
            usersList.insertAdjacentHTML('beforeend', userHTML)
        }

        usersList.addEventListener('click', async (event) => {
            const homeItem = event.target.closest('#homeButton')
            if (homeItem) {
                event.preventDefault()
                localStorage.removeItem(selectedUserStorageKey)
                setActiveUser('main')
                await fetchVideos()
                return
            }

            const userItem = event.target.closest('.user-member')
            if (!userItem) return

            event.preventDefault()
            const selectedUser = data.find((member) => String(member.id ?? member.userId ?? member._id) === userItem.dataset.id)
            if (!selectedUser) return

            localStorage.setItem(selectedUserStorageKey, userItem.dataset.id)
            setActiveUser(userItem.dataset.id)
            await fetchVideos(selectedUser)
        })

        const savedUserId = localStorage.getItem(selectedUserStorageKey)
        const savedUser = data.find((member) => String(member.id ?? member.userId ?? member._id) === savedUserId)
        if (savedUser) {
            setActiveUser(savedUserId)
            await fetchVideos(savedUser)
        } else {
            setActiveUser('main')
            await fetchVideos()
        }

    } catch (error) {
        if (axios.isAxiosError(error)) {
      
            if (error.response) {
                // The server responded with a status code outside the 2xx range
                console.error('Error Data in main.js:', error.response.data);    // Server error payload (e.g., { message: "Invalid password" })
            }
        }
    }
})

