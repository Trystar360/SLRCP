var weekRef = database.ref('Weeks');
var weeksHtml = '';
//Addin a new week to databaseus
function loadWeeksN(){
    weekRef.on('value',gotDataN, errDataN);
}

function gotDataN(data){

    var weeks = data.val();
    var keys = Object.keys(weeks);
    for(var i = 0; i < keys.length; i++){
        var html = '';
        var k = keys[i];
        var name = weeks[k].Name;
        var key = k;
        weeksHtml += '<a href="#!" onclick="showWeekN(\''+ k +'\')" class="collection-item">'+ name + '</a>'
        if(i == keys.length -1){
            //weeksHtml += html;
            $("#weeksN").html(weeksHtml);
            weeksHtml = '';
        }
        
    }
}

function errDataN(){
    console.log("Error!");
    console.log(err);
}

var thisWeek;
function loadEventsN(week) {
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
var curWeekRef;
var weekKey;
function showWeekN(key) {
    $('#weeks').hide();

    curWeekRef = database.ref('Weeks/' + key);
    weekKey = key;

    showUserClick(userName, weekKey);

}


