/**
 * The necessary code for using the firebase database is below. This needs to be included
 *
 */
(function(){
const config = {
    apiKey: "AIzaSyDiUcBb8L5PHUCMs3NQTbK6tv-FzGQrUHs",
    authDomain: "cosmet-users.firebaseapp.com",
    databaseURL: "https://cosmet-users.firebaseio.com",
    projectId: "cosmet-users",
    storageBucket: "cosmet-users.appspot.com",
    messagingSenderId: "8164921910"
  };
  firebase.initializeApp(config);
  //grab the information from the html 
  const txtEmail = document.getElementById("txtEmail");
  const txtPassword = document.getElementById("txtPassword");
  const btnLogin = document.getElementById("btnLogin");
  const btnSignup = document.getElementById("btnSignup");
  const btnLogout = document.getElementById("btnLogout");
  const getBtn = document.getElementById("getBtn");
//Event listener for the login button
  btnLogin.addEventListener('click', e => {
        const email = txtEmail.value;//get the email
        const password = txtPassword.value;//get the password
        const auth = firebase.auth();
        //return a promise to sign in the user
        const promise = auth.signInWithEmailAndPassword(email, password);//sign the user in using the email and password
        //if not able to do so log the error to the console
        promise.catch(e => console.log(e.message));    
        
  });
  //event listener for the signup button
  btnSignup.addEventListener('click', e => {
    const email = txtEmail.value;
    const password = txtPassword.value;
    const auth = firebase.auth();
    //returns a promise; A promise is a task that may not be fulfilled yet, in this case : to create a new user
    const promise = auth.createUserWithEmailAndPassword(email, password);//creates a new user using their email and password
    //if the promise is unfulfilled log an error to the console
    promise.catch(e => console.log(e.message));   
});
//Listener for the state change, will trigger whenever user changes
firebase.auth().onAuthStateChanged(currentUser => {
    if(currentUser){
        console.log(currentUser);
        var uid = firebase.auth().currentUser.uid;//get the current user's id
        firebase.database().ref().child('users').child(uid).set({//create a new node with their unique id
        userId : uid,//set the userid to their id
        email : currentUser.email//set the email as their email
        })

    }
    else{
        console.log("not logged in");//if they are not logged in log to console
    }
});
//event handler for the signout button
btnLogout.addEventListener('click', e =>{
    firebase.auth().signOut();
});

}());

//function below deals with getting and displaying data from the database
function getData(){
    const preObject = document.getElementById("users");
    const list = document.getElementById("list");
    const dbRefObject = firebase.database().ref().child("users");
    const dbRefList = dbRefObject.child('uid');
    dbRefObject.on('value', snap => {
        preObject.innerText = JSON.stringify(snap.val(), null, 3);//sets the display to 3 lines, showing the string values of the Json data
    });
    //realtime database updates the display automatically when data is added
    dbRefList.on('child_added', snap => {
    const li = document.createElement('li');//creates a new list item for the new child
    li.innerText = snap.val();//sets the inner text to the value of the added data
    li.id = snap.key;
    list.appendChild(li);//adds to the end of the current list
    });
    //updates when data is changed
    dbRefList.on('child_changed', snap => {
        const lichanged = document.getElementById(snap.key);
        lichanged.innerText = snap.val();
    })
    //updates when data is removed
    dbRefList.on('child_removed', snap => {
        const liToRemove = document.getElementById(snap.key);
        liToRemove.remove();
    })
}

