var userId;
var agenda_data;
var eventsallowed=[];

$(document).ready(function (e, f) {
    checkLocalLoginID();
});

var clickCompleted = true;
function loginClick(e) {
    if(!clickCompleted){
        return;
    }
    $("#invalid_login").hide();
    var tempuser = $("#mudid").val().trim();
    if (tempuser.length <= 0) {
        return;
    }
    clickCompleted = false;
    verifyLogin(tempuser);
}
function returnlogin()
{
 window.location.href="index.html?event_id="+event_id+"&activity_id="+activity_id;
 
}
function verifyLogin(userid) {
    //
    //Login not recognized. Please enter a valid MUD ID.
    var payload = {
        user_id: userid,
        device_id: "0",
        device_type_id: "0"
    }

    $.ajax({
        type: "POST",
        url: "https://virtuoso.mc3tt.com/tabletop/login/verifyusernoac",
        data: payload,
        context: { data: payload },
        success: function (response) {
            if (response == 0 || response == "0" || response == "" || response == undefined) {
                $("#invalid_login").show();
                clickCompleted = true;
            }
            else if (response == 1 || response == "1") {
				        
               userId = this.data.user_id;
			   var NSMMeetingLocalData = {"user_id":userId};
				window.localStorage.setItem("user_id", userId);
				window.localStorage.setItem("NSMMeetingLocalData", JSON.stringify(NSMMeetingLocalData));
				window.location.href="speed-round.html?event_id="+event_id+"&activity_id="+activity_id;
				//getEventList(userId);
             
            }
        },
        error: function (err) {
            clickCompleted = true;
            $("#invalid_login").show();
        }
    });
}

function getEventList(userid)
{
  var payload = {
        user_id: userid
    }
  $.ajax({
        type: "POST",
        url: "https://virtuoso.mc3tt.com/tabletop/download/eventlist",
        data: payload,
        context: { data: payload },
        success: function (response) {
            console.log(response);
         
            var arrResponse=response.split(",");
         
         for(var i=3;i<arrResponse.length;i=i+2)
          {
           eventsallowed.push(arrResponse[i]);
          }
         console.log(eventsallowed);
		
         if(eventsallowed.indexOf(event_id) != '-1')
         {
          getContentGroup(userid,event_id);
         }else
          {
           $('#login_container').html('<h4 class="h4 mb-3 font-weight-normal">You are not currently registered for this initiative. Please contact support.</h4><br/><button id="btn_login_return" onClick="returnlogin();" class="btn btn-lg btn-login-submit font-weight-bold" type="button">RETURN</button>');
		   $('.btn-login-submit').css('background','transparent');
		   $('.btn-login-submit').css('border','2px solid #fff');
          }
         
         
        },
        error: function (err) {
       
        }
    });
 
}
function getContentGroup(userid,eventid)
{
 
  var payload = {
        user_id: userid,
        event_id: eventid,
        
    }

    $.ajax({
        type: "POST",
        url: "https://virtuoso.mc3tt.com/tabletop/download/content",
        data: payload,
        context: { data: payload },
        success: function (response) {
            var arrResponse=response.split(",");
            var content_group=arrResponse[1];
             window.localStorage.setItem("content_group", content_group);
                 saveLocalLoginID(userid);
                 $("#login_container").hide();
                 $("#mudid").text("");
                 clickCompleted = true;
                 $("#loader").show();
               

         
			window.location.href="speed-round.html?event_id="+event_id+"&activity_id="+activity_id;
         
        },
        error: function (err) {
       
        }
    });
}
function checkLocalLoginID() {
    try {
        // userId = window.localStorage.getItem("user_id");    
        var NSMMeetingLocalDataObj = window.localStorage.getItem("NSMMeetingLocalData"); 
		console.log(JSON.parse(NSMMeetingLocalDataObj));	
		var localdata=JSON.parse(NSMMeetingLocalDataObj);
		userId=localdata.user_id;
    } catch (error) {}
    
    if (userId) {
        
		       window.location.href="speed-round.html?event_id="+event_id+"&activity_id="+activity_id;
         
    }
    else {
        $("#login_container").show();

    }
}

function saveLocalLoginID(userId) {
    window.localStorage.setItem("user_id", userId);
}

function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) { // If time format correct
        time = time.slice(1); // Remove full string match value
        time = time.splice(0, 3); // Remove full string match value
        time[4] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
        time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(''); // return adjusted time or original string
}