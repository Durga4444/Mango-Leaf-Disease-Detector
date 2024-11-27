/* === Imports === */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getAuth,createUserWithEmailAndPassword,
    signInWithEmailAndPassword,signOut,onAuthStateChanged,
    GoogleAuthProvider,signInWithPopup,updateProfile} from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA10gQJ8rGa825YVW_GUFYOxhRcrmgTziE",
    authDomain: "first-firebase-a71ca.firebaseapp.com",
    projectId: "first-firebase-a71ca",
    storageBucket: "first-firebase-a71ca.appspot.com",
    messagingSenderId: "596469610646",
    appId: "1:596469610646:web:b2bc92e3f91868c0686ab7"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

/* === UI === */

/* == UI - Elements == */

const viewLoggedOut = document.getElementById("logged-out-view")
const viewLoggedIn = document.getElementById("logged-in-view")

const signInWithGoogleButtonEl = document.getElementById("sign-in-with-google-btn")

const emailInputEl = document.getElementById("email-input")
const passwordInputEl = document.getElementById("password-input")

const signInButtonEl = document.getElementById("sign-in-btn")
const createAccountButtonEl = document.getElementById("create-account-btn")

const signOutButtonEl = document.getElementById("sign-out-btn")
const profile = document.getElementById(".\profile-img")
const greeting = document.getElementById("greet")
profile.addEventListener('click',showProfilePicture)

const updateProfileButtonEl = document.getElementById("update-profile-btn")

/* == UI - Event Listeners == */

signInWithGoogleButtonEl.addEventListener("click", authSignInWithGoogle)

signInButtonEl.addEventListener("click", authSignInWithEmail)
createAccountButtonEl.addEventListener("click", authCreateAccountWithEmail)

signOutButtonEl.addEventListener("click", authSignOut)
/* === Main Code === */

onAuthStateChanged(auth, (user) => {
    if (user) {
        showLoggedInView()
        showUserGreeting(greeting,user)
        
    } else {
        showLoggedOutView() 
    }
})
function clearAuthFields() {
	clearInputField(emailInputEl)
	clearInputField(passwordInputEl)
}

function showProfilePicture(imgElement, user) {
    const photoURL = user.photoURL
    
    if (photoURL) {
        imgElement.src = photoURL
    } else {
        imgElement.src = "bangalore.jpeg"
    }
}

function showUserGreeting(element, user) {
    const displayName = user.displayName
    
    if (displayName) {
        const userFirstName = displayName.split(" ")[0]
        
        element.textContent = `Hello ${userFirstName}  `
    } else {
        element.textContent = `Hello friend`
    }
}

/* === Functions === */

/* = Functions - Firebase - Authentication = */

function authSignInWithGoogle() {
    signInWithPopup(auth, provider)
        .then((result) => {
            console.log("Signed in with Google")
        }).catch((error) => {
            console.error(error.message)
        })
}

function authSignInWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value
    
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            clearAuthFields()
        })
        .catch((error) => {
            console.error(error.message)
        })
}

function authCreateAccountWithEmail() {
    const email = emailInputEl.value
    const password = passwordInputEl.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            clearAuthFields()
        })
        .catch((error) => {
            console.error(error.message) 
        })
}

function authSignOut() {
    signOut(auth)
        .then(() => {
        }).catch((error) => {
            console.error(error.message)
        })
}

function authUpdateProfile() {
    const newDisplayName = displayNameInputEl.value
    const newPhotoURL = photoURLInputEl.value
    
    updateProfile(auth.currentUser, {
            displayName: newDisplayName,
            photoURL: newPhotoURL
        }).then(() => {
            console.log("Profile updated")
        }).catch((error) => {
            console.error(error.message)
        })
}

/* == Functions - UI Functions == */

function showLoggedOutView() {
    hideView(viewLoggedIn)
    showView(viewLoggedOut)
}

function showLoggedInView() {
    hideView(viewLoggedOut)
    showView(viewLoggedIn)
}

function showView(view) {
    view.style.display = "flex" 
}

function hideView(view) {
    view.style.display = "none"
}

function clearInputField(field) {
	field.value = ""
}

