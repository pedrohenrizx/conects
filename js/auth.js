import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './config.js';
import { showToast } from './toast.js';

// Elements
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');

// Login Function
export const login = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Sync user to Back4App
        await syncUserToBack4App(user);

        // Redirect to main page
        window.location.href = '/';
    } catch (error) {
        console.error("Login failed:", error);
        showToast("Falha ao fazer login: " + error.message, 'error');
    }
};

// Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
        Parse.User.logOut();
        window.location.href = '/login';
    } catch (error) {
        console.error("Logout failed:", error);
        showToast("Falha ao sair: " + error.message, 'error');
    }
};

// Sync User to Back4App
const syncUserToBack4App = async (firebaseUser) => {
    try {
        // Check if user already exists in Back4App
        const query = new Parse.Query(Parse.User);
        query.equalTo("email", firebaseUser.email);
        let parseUser = await query.first();

        if (!parseUser) {
            // Create new Parse user
            parseUser = new Parse.User();
            parseUser.set("username", firebaseUser.email); // using email as username
            parseUser.set("password", firebaseUser.uid); // using uid as password (hidden from user)
            parseUser.set("email", firebaseUser.email);
            parseUser.set("displayName", firebaseUser.displayName);
            parseUser.set("photoURL", firebaseUser.photoURL);
            parseUser.set("uid", firebaseUser.uid);
            await parseUser.signUp();
        } else {
            // Log in the existing user in Parse
            await Parse.User.logIn(firebaseUser.email, firebaseUser.uid);
            // Optionally update details
            parseUser.set("displayName", firebaseUser.displayName);
            parseUser.set("photoURL", firebaseUser.photoURL);
            await parseUser.save();
        }
    } catch (error) {
        console.error("Error syncing user to Back4App:", error);
        throw error;
    }
};

// Route Protection and Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    if (loginBtn) {
        loginBtn.addEventListener('click', login);
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }

    onAuthStateChanged(auth, async (user) => {
        const path = window.location.pathname;
        const isLoginPage = path === '/login' || path.includes('login.php');

        if (user) {
            // User is signed in
            if (isLoginPage) {
                window.location.href = '/';
            } else {
                 // Ensure Parse user is logged in
                 let currentUser = Parse.User.current();
                 if (!currentUser) {
                     await syncUserToBack4App(user);
                     currentUser = Parse.User.current();
                 }

                 // Update Header UI
                 const profileMenu = document.getElementById('user-profile-menu');
                 const avatarEl = document.getElementById('header-user-avatar');
                 const nameEl = document.getElementById('header-user-name');

                 if (profileMenu && currentUser) {
                     profileMenu.classList.remove('hidden');
                     profileMenu.classList.add('flex');
                     avatarEl.src = currentUser.get('photoURL') || 'https://via.placeholder.com/40';
                     nameEl.textContent = currentUser.get('displayName') || currentUser.get('username');
                 }
            }
        } else {
            // User is signed out
            if (!isLoginPage) {
                window.location.href = '/login';
            }
        }
    });

    // Back to top logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
            } else {
                backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
            }
        });
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});
