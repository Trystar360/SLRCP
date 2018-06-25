var curWeekRef;
var userRef = database.ref('Users');
var daysRef;
var card = '';
var weekKey;
var people;
var eventRef = database.ref('Events');


function showWeek(key) {
    $('#weeks').hide();

    curWeekRef = database.ref('Weeks/' + key);
    weekKey = key;

    loadDays();

    loadEvents(key);

    $('.barr').append('<li><a href="#!" id="removeWeek" onclick="removeWeek()" ><i class="material-icons">delete_forever</i></a></li>');
}

function loadDays() {
    curWeekRef.on('value', gotDataDays, errDataDays);
}

function gotDataDays(data) {

    var days = data.val().days;
    var keys = Object.keys(days);

    for (var i = 0; i < keys.length; i++) {
        //console.log(days[i]);
        card += '<div class="row">\
        <div class="col s0 m2 l2"> </div>\
        <div class="col s12 m8 l8">\
          <div class="card blue-grey darken-1">\
            <div class="card-content white-text">\
              <span class="card-title">'+ days[i] + '</span>\
              <div id="'+ days[i] + 'Space" class="daySpace">\
              </div>\
            </div>\
            <div class="card-action">\
              <a href="#!" onclick="addEventBtn(\''+ days[i] + weekKey + '\')">Add Event</a>\
            </div>\
          </div>\
        </div>\
        <div class="col s0 m2 l2"> </div>\
      </div>';

        $("#weekPage").append(card);
        card = '';

        loadUsers(days[i]);

        // if (i == keys.length - 1) {
        // $("#weekPage").html(card);
        // card = '';
        //}

    }
}

function addEventBtn(day) {


    $('#newEventModal').modal('open');
    $('#dayId').html('Day ID:' + day);
    return false;
}

function addEventSubmit() {
    var name = $('#nameInput').val();
    var timeStart = $('#timeStartInput').val();
    var timeEnd = $('#timeEndInput').val();
    var desc = $('#eventInput').val();
    var day = $('#dayId').html().substring(7);

    if (name != '' && timeStart != '' && timeEnd != '' && desc != '' && day != '') {

        // console.log(name);
        // console.log(timeStart);
        // console.log(timeEnd);
        // console.log(desc);
        // console.log(day);

        newEvent(name, timeStart, timeEnd, desc, day);

        $('#nameInput').val('');
        $('#timeStartInput').val('');
        $('#timeEndInput').val('');
        $('#eventInput').val('');
    } else {
        M.toast({ html: 'Please fill out all fields' })
    }
}


function newEvent(name, start, end, desc, day) {
    $('.events').html('');
    var eventData = {
        Name: name,
        StartTime: start,
        EndTime: end,
        Event: desc,
        Day: day,
        ID: generatePushID()
    };
    eventRef.push(eventData);
}


function errDataDays() {
    console.log("Error!");
    console.log(err);
}


function getPeople() {

}

var dayUserList =
    '<table>\
        <thead>\
            <tr>\
                <th>Name</th>\
                <th>Working</th>\
            </tr>\
        </thead>\
        <tbody>';

var tableEnd = '</tbody> </table>';
var first = true;
var listDay;
function loadUsers(day) {
    listDay = day;
    userRef.on('value', gotDataUsers, errDataUsers);
}

function gotDataUsers(data) {
    var users = data.val();
    var keys = Object.keys(users);

    for (var i = 0; i < keys.length; i++) {
        if (!users[keys[i]].admin) {
            var id = keys[i] + listDay + weekKey;
            id = id.replace(/\s/g, '');
            dayUserList += '<tr>\
        <td><a href="#!" class="white-text" style="width: 15%" onclick="showUserClick(\'' + keys[i] + '\', \'' + weekKey + '\')">'+ keys[i] + '</a></td>\
        <td>\
        <ul id="'+ id + '" class="events">\
        </ul>\
          </tr>';

            if (first) {
                $('#nameDropdown').append('\
                <li>\
                    <a href="#!">' + keys[i] + '</a>\
                </li>\
            ')

                people = keys;
                ac();

                first = false;
            }
        }


        if (i == keys.length - 1) {
            $('#' + listDay + 'Space').html(dayUserList + tableEnd);
            dayUserList = '<table>\
            <thead>\
                <tr>\
                    <th>Name</th>\
                    <th>Working</th>\
                </tr>\
            </thead>\
            <tbody>';
        }

    }
}



function errDataUsers() {
    console.log("Error!");
    console.log(err);
}

function addUser(name) {
    var data = {
        [name]: {
            admin: false,
            pass: ""
        }
    }

    userRef.update(data);
}

function ac() {
    autocomplete(document.getElementById("nameInput"), people);
}
var thisWeek;
function loadEvents(week) {
    eventRef.on('value', gotDataEvents, errDataEvents);
    thisWeek = week;
}


var test;
function gotDataEvents(data) {
    var weekEvents = [];

    var events = data.val();
    var keys = Object.keys(events);

    for (var i = 0; i < keys.length; i++) {

        var day = events[keys[i]].Day
        var week = "-" + day.split("-").pop();
        if (thisWeek == week) {
            weekEvents.push(events[keys[i]]);
        }

        // console.log(thisWeek);
        // console.log(week);

        // var name 
        // var start 
        // var end 
        // var event 

    }

    console.log(weekEvents);
    test = weekEvents;
    for (var i = 0; i < weekEvents.length; i++) {
        var curEvent = weekEvents[i];
        var listName = curEvent.Name + curEvent.Day;
        listName = listName.replace(/\s/g, '');

        var eventCs = curEvent.Event + " from " + curEvent.StartTime + " - " + curEvent.EndTime;

        var event = '\
        <li> <a class="white-text" href="#!" onclick="edit(\''+ curEvent.ID + '\')"> ' + eventCs + '</a></li>';

        $('#' + listName).append(event);


    }
}

function errDataEvents(err) {
    console.log(err);
}

// $('#removeWeek').click(function(){
//     console.log("Test");
//     curWeekRef.push(null);
// });

function removeWeek() {
    // console.log(weekKey);
    var ref = database.ref('Weeks/' + weekKey).remove();
    location.reload();
}

    var n;
    var s;
    var e;
    var d;
    var day;
    var idd;
    var kkey;
function edit(id){
    var event;
    var ref = database.ref();
    ref.child('Events').orderByChild('ID').equalTo(id).on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            event =  data;
        });
    });
    console.log(event.key);
     kkey = event.key;
    event = event.val();

    $('#editEventModal').modal('open');

    $('#nameInputE').val(event.Name);
    $('#timeStartInputE').val(event.StartTime);
    $('#timeEndInputE').val(event.EndTime);
    $('#eventInputE').val(event.Event);
    $('#dayIdE').html('Day ID:' + event.Day);
    idd = event.ID;

     
     console.log(id);

    
    
}

function updateEventClick(){
    n = $('#nameInputE').val();
     s = $('#timeStartInputE').val();
     e = $('#timeEndInputE').val();
     d = $('#eventInputE').val();
     day = $('#dayIdE').html().substring(7);
     
     console.log(event);
    updateEvent(n, s, e, d, day, kkey, idd);
}



function updateEvent(name, start, end, desc, day, key, id) {
// console.log(name);
// console.log(start);
// console.log(end);
// console.log(desc);
// console.log(day);
// console.log(key);
// console.log(id);

var UeventRef = database.ref('Events/'+ key);
    console.log(key);
    $('.events').html('');
    var eventData = {
        Name: name,
        StartTime: start,
        EndTime: end,
        Event: desc,
        Day: day,
        ID: id
    };
    UeventRef.update(eventData);

}

function removeEventClick(){
    console.log(kkey);
    var ref = database.ref('Events/'+ kkey).remove();
    $('.events').html('');
    loadEvents(weekKey);
}

function reload(){
    location.reload();
}

function showUserClick(userKey, weekKey){
    var clickName;
    var userEvents = [];
    var userWeekEvents = [];
    clickName = userKey;
    var hours = 0;
    $('.ues').html('');
    console.log(userKey);
   
    
    var ref = database.ref();
    ref.child('Events').orderByChild('Name').equalTo(userKey).on("value", function(snapshot) {
        snapshot.forEach(function(data) {
            userEvents.push(data.val());
        });
    });

    
    for(var i = 0; i < userEvents.length; i++){
        console.log(userEvents[i].Day.substring(userEvents[i].Day.indexOf('-')) + " - " + weekKey);
        if(userEvents[i].Day.substring(userEvents[i].Day.indexOf('-')) == weekKey){
            userWeekEvents.push(userEvents[i]);
        }
    }
    
 
    for(var i = 0; i < userWeekEvents.length; i++){

        var curE = userWeekEvents[i];
        var ued = curE.Day
        var day = ued.substr(0, ued.indexOf('-')); 
        var event = curE.Event + " from " + curE.StartTime + " - " + curE.EndTime;
        
        console.log(event);

        var item = '<li> <a class="black-text" href="#!" onclick="edit(\''+ curE.ID + '\')"> ' + event + '</a></li><li></li>';
        //var day;
        
        $('#userModal').modal('open');
        $('.usersName').html(curE.Name);
        switch(day){
            case 'Sunday': 
            day = '.userSun';
            break;
            case 'Monday':
            day = '.userMon';
            break;
            case 'Tuesday':
            day = '.userTues';
            break;
            case 'Wednsday':
            day = '.userWed';
            break;
            case 'Thursday':
            day = '.userThur';
            break;  
            case 'Friday':
            day = '.userFri';
            break;
            case 'Saturday':
            day = '.userSat';
            break;
        }

        console.log(day);
        
        $(day).append(item);

        console.log(curE.StartTime + " - " + curE.EndTime);
        hours += getHours(curE.StartTime, curE.EndTime);

        

    }
    console.log(hours);
    if(hours < 1){
        M.toast({ html: clickName + ' Doesnt have anything scheduled for this week!' });
    }
    $('.userHours').html(hours.toFixed(2));
}
