
var userName;
var userPass;
var user;
var match = false;
var userAdmin = false;
var userPassword;
var userTest;

function loginBtn() {
    userName = $('#name').val();
    userPass = $('#pass').val();

    login(userName, userPass);
};

function login(name, pass) {
    var loggedINName;
    var usersRef = database.ref('Users');
    usersRef.on('value', function (snapshot) {
        snapshot.forEach(function (users) {
            if (name == users.key) {
                enteredName = users.key;
                match = true;
                loggedInName = users;
                testPassword(loggedInName);
                return true;
            }

        });
        if (match == false) {
            M.toast({ html: 'Not a user!' })
        }
    });


}

function testPassword(user) {
    var ref = database.ref('Users/' + user.key + '/pass');

    ref.on('value', function (snapshot) {

        userPassword = snapshot.val();
    });

    if (userPassword == userPass) {
        testAdmin(user);
    } else {
        M.toast({ html: 'Wrong Password!' })
    }
}

function testAdmin(user) {
    var ref = database.ref('Users/' + user.key + '/admin');
    ref.on('value', function (snapshot) {

        userAdmin = snapshot.val();
    });

    if (userAdmin == true) {
        adminLogin();
    } else {
        nonAdminLogin();
    }

}
function nonAdminLogin() {
    document.getElementById("page1").style.display = 'none';
    document.getElementById("nonAdminPage").style.display = 'block';
    loadWeeksN();


}

function adminLogin() {
    document.getElementById("page1").style.display = 'none';
    document.getElementById("adminPage").style.display = 'block';
    loadWeeks();
}

document.getElementById("pass").addEventListener("keydown", function (e) {
    if (e.keyCode === 13) {
        loginBtn();
    }
});

function nonAdLogin(userKey){
    var hours = 0;
    $('.ues').html('');
    var userEvents = [];
    
    var ref = database.ref();
    ref.child('Events').orderByChild('Name').equalTo(userKey).on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            userEvents.push(data.val());
        });
    });
    

    for(var i = 0; i < userEvents.length; i++){

        var curE = userEvents[i];
        var ued = userEvents[i].Day
        var day = ued.substr(0, ued.indexOf('-')); 
        var event = curE.Event + " from " + curE.StartTime + " - " + curE.EndTime;
        
        console.log(event);

        var item = '<li> <a class="black-text" href="#!" onclick="edit(\''+ curE.ID + '\')"> ' + event + '</a></li>';
        var day;
        
        $('#userModal').modal('open');
        $('.usersName').html(curE.Name);
        switch(day){
            case 'Sunday': 
            day = '#userSun';
            break;
            case 'Monday':
            day = '#userMon';
            break;
            case 'Tuesday':
            day = '#userTues';
            break;
            case 'Wednsday':
            day = '#userWed';
            break;
            case 'Thursday':
            day = '#userThur';
            break;  
            case 'Friday':
            day = '#userFri';
            break;
            case 'Saturday':
            day = '#userSat';
            break;
        }

        console.log(day);
        
        $(day).append(item);

        console.log(curE.StartTime + " - " + curE.EndTime);
        hours += getHours(curE.StartTime, curE.EndTime);

        

    }
    console.log(hours);
    $('#userHours').html(hours.toFixed(2));
}
