function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    //Simple check for empty username and password
    if (username === "" || password === "") {
        alert("Please enter a username and password");
        return;
    }

    //Just a simple check for the username and password (not secure at all, just for the sake of the example)
    if (username !== "applicant_003" || password !== "appl_3") {
        alert("Invalid username or password");
        return;
    }
        

    //Send login request
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/session", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var json = JSON.parse(xhr.responseText);
            console.log("Login successful");

            
            var sessionUID = json.data.uid;
            
            //Send session UID and redirect after successful sending
            sendSessionUID(sessionUID);
        }
    };

    var data = JSON.stringify({
        "model": {
            "timeout": 259200
        },
        "auth": [
            [
                "password",
                {
                    "username": username,
                    "password": password
                }
            ]
        ]
    });

    xhr.send(data);
}

function sendSessionUID(sessionUID) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/authenticate", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Session UID sent successfully");
            //Set sessionUID in sessionStorage
            window.sessionStorage.setItem('session_id', sessionUID);
            //Redirect to getDiaries.html after successful sending
            window.location.href = "diaries.html";
        }
    };

    var data = JSON.stringify({
        "model": {
            "uid": sessionUID,
            "username": "applicant_003",
        }
    });
    xhr.send(data);
}
