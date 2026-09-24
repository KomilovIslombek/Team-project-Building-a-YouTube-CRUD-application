
let user = JSON.parse(window.localStorage.getItem('youtube:user')) || null
let href = window.location.pathname.replace('/', '')

export async function protect(res = {}) {
    try {
        const token = user?.token || '';

        if (!token && href !== 'register.html' && href !== 'login.html') {
            return window.location.href = "/register.html";
        }

        if (!token) {
            console.log('no token', href);
            
            return 'no token';
            // return res.status(401).json({ message: 'Not authorized, no token found' });
        }

        const { username, password } = user
        const foundUser = await axios.post('https://n30-youtube-api.onrender.com/login', { username, password })
        if(!foundUser.data) return window.location.href = "/register.html";

        if(href === 'admin.html') return;
        
        return window.location.href = "/admin.html";

    } catch (err) {
        // Covers both an invalid signature (tampered token) and an expired token
        console.error('Auth middleware error:', err.message);
        return res = { status: 401, message: 'Not authorized, invalid or expired token' };
    }
}
