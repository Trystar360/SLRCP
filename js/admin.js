var weekRef = database.ref('Weeks');

function newWeek(name){
    
    var weekData = {
        Name: name,
        days:{
            0: "Sunday",
            1: "Monday",
            2: "Tuesday",
            3: "Wednsday",
            4: "Thursday",
            5: "Friday",
            6: "Saturday",
        }
      };
      weekRef.push(weekData);
}

var weeksHtml = '';
//Addin a new week to databaseus
function loadWeeks(){
    weekRef.on('value',gotData, errData);
}

function gotData(data){

    var weeks = data.val();
    var keys = Object.keys(weeks);
    for(var i = 0; i < keys.length; i++){
        var html = '';
        var k = keys[i];
        var name = weeks[k].Name;
        var key = k;
        weeksHtml += '<a href="#!" onclick="showWeek(\''+ k +'\')" class="collection-item">'+ name + '</a>'
        if(i == keys.length -1){
            //weeksHtml += html;
            $("#weeks").html(weeksHtml);
            weeksHtml = '';
        }
        
    }
}

function errData(){
    console.log("Error!");
    console.log(err);
}

function addWeekClick(){
    var name = $('#newWeekName').val();
    newWeek(name);
    $('#newWeekName').val('');
}
