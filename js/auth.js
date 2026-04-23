import { auth, provider, signInWithPopup, signOut, onAuthStateChanged } from './config.js';

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
        window.location.href = 'index.php';
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed: " + error.message);
    }
};

// Logout Function
export const logout = async () => {
    try {
        await signOut(auth);
        Parse.User.logOut();
        window.location.href = 'login.php';
    } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed: " + error.message);
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

    onAuthStateChanged(auth, (user) => {
        const path = window.location.pathname;
        const isLoginPage = path.includes('login.php');

        if (user) {
            // User is signed in
            if (isLoginPage) {
                window.location.href = 'index.php';
            } else {
                 // Ensure Parse user is logged in
                 const currentUser = Parse.User.current();
                 if (!currentUser) {
                     syncUserToBack4App(user);
                 }
            }
        } else {
            // User is signed out
            if (!isLoginPage) {
                window.location.href = 'login.php';
            }
        }
    });
});
