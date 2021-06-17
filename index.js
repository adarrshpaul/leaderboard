// window.FB.getLoginStatus(function (response) {
//     console.log('getLoginStatus: called', response)
// });


window.fbAsyncInit = function () {
    window.FB.init({
        appId: '513213246765464',
        cookie: true,                     // Enable cookies to allow the server to access the session.
        xfbml: true,                     // Parse social plugins on this webpage.
        version: 'v11.0'           // Use this Graph API version for this call.
    });
       window.FB.getLoginStatus(function (response) {
       renderUI();
    });

};

/**
 * Check login-status
 *  On button click 
 *  */
function checkLoginState() {
    window.FB.getLoginStatus(function (response) {
        statusChangeCallback(response);
    });
}

/**
 * Check for the status wheather
 * The user has logged in or not !
 */
function statusChangeCallback(response) {  // Called with the results from FB.getLoginStatus().                   
    // response:  The current login status of the person.
    console.log(response)
    if (response.status === 'connected') {
          /**Post the score */
          window.FB.api('/me', { fields: 'last_name,picture,first_name' }, function (response) {
            if (response.id) {
                postData('https://e1qgd37uc2.execute-api.us-east-1.amazonaws.com/postScore', {
                    "id": response.id,
                    "firstname": response.first_name,
                    "lastname": response.last_name,
                    "score": 47,
                    "profilePic": response.picture.data.url,
                }).then(data => {
                    // JSON data parsed by `data.json()` call
                }).catch(error => { console.log(error) })
            }
    
            document.getElementById('status').innerHTML = 'The score were posted !';
        });
    } else {

        document.getElementById('status').innerHTML = 'Permissions not given !';
    }
}

/**Renders UI based on login-status */
async function renderUI() {
    console.log(333)
    await renderLeaderBoard();
}

function testAPI() {                      // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
    console.log('Welcome!  Fetching your information.... ');

};

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response; // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
    // Default options are marked with *
    const response = await fetch(url);
    return response.json(); // parses JSON response into native JavaScript objects
}

/**An implemenatation function */
async function renderLeaderBoard() {
    try {
        let data = await getData('https://e1qgd37uc2.execute-api.us-east-1.amazonaws.com/getScore');
        let arrayOfUsers = data.result.Items;
        console.log(arrayOfUsers);
        let html = arrayOfUsers.map((object) => {
            return `
        <div>
        <p>${object.id} ${object.firstname} ${object.profilePic} </p>
        <p></p>
        </div>
        `
        }).join('');
        document.querySelector('#root').insertAdjacentHTML("afterbegin", html);
    } catch (error) {
        console.log(error)
    }
}



