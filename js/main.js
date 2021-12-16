var userId;
var Token;
//var site_id = 2;
var serverURL = "https://demo.virtuoso.mc3.com";
var nsm_meeting_data;
var _menuObjects;
var passRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
var CONST_INITIATINGPAGE = "virtuoso_nl_initiating_page";
var CONST_WEBLINKURL = "VirtuosoDemoNewLoginPortal_weblinkurl";
var CONST_WEBLINKMENUOBJECT = "menuobject_VirtuosoNewLoginPortal";
if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (typeof position !== 'number' || !isFinite(position)
            || Math.floor(position) !== position || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}

$(document).ready(function (e, f) {
    'use strict';
    window.localStorage.removeItem(CONST_INITIATINGPAGE);
    window.localStorage.removeItem(CONST_WEBLINKURL);
    window.localStorage.removeItem(CONST_WEBLINKMENUOBJECT);

    getServerDateTime();
    _myScreenWidth = $('#ptest').width();
    CheckOtherComponent();
    $("login_label").text("ENTER USER ID");
    $("#login_section").hide();
    $("#support_section").hide();
    $("#aaq_section").hide();
    $("#microsite_container_top").hide();
    $("#banner_img").hide();

    $("#microsite_container_top").hide();
    $("#photo_gall").hide();
    $("#invalid_login").hide();
    $("#login_label").show();

 if(login==1)
    document.getElementById("login_section").style.visibility = "visible";
   // document.getElementById("support_section").style.visibility = "visible";
   // document.getElementById("aaq_section").style.visibility = "visible";
    //document.getElementById("microsite_container_top").style.visibility = "visible";


    nsm_meeting_data = window.localStorage.getItem("VirtuosoDemoNewLoginPortalLocalData");
    try {
        nsm_meeting_data = jQuery.parseJSON(nsm_meeting_data);
    } catch (error) {

    }

    if (nsm_meeting_data) {
        if (nsm_meeting_data.user_id.trim() == "" || nsm_meeting_data.token.trim() == "" || nsm_meeting_data.content_group.trim() == "") {
            checkLocalLoginID();
        }
        else {
            userId = nsm_meeting_data.user_id;
            Token = nsm_meeting_data.token;
            contentgroupname = nsm_meeting_data.content_group;
            event_id = nsm_meeting_data.current_event_data.id;
            validateToken(Token);
        }
    }
    else {
        checkLocalLoginID();
    }
    document.body.scrollTop = 0;

});


var clickCompleted = true;
var _loginactive = true;

function loginClick(e) {
    var dataobj = e.dataset;
    var tempuser = "";
    var temppass = "";
    var newpass = "";
    switch (("" + dataobj.mode)) {
        case "0":
            tempuser = $("#loginid").val().trim();
            temppass = $("#user_pass").val().trim();
            var complexicyMatches = passRegex.test(temppass);
            if (!complexicyMatches) {
                // alert("Password must contain:\nAt least 1 uppercase character\nAt least 1 number\nAt least 8 characters long\n\nPlease try again.");
                $("#alert_msg").html("<strong>Password must contain:</strong><br><ul><li>At least 1 uppercase character</li><li>At least 1 number</li><li>At least 8 characters long</li><li>Please try again.</li></ul>");
                $("#alertMsgTriggerBtn").click();
                return;
            }
            if (tempuser.length <= 0 || temppass.length <= 0) {
                return;
            }
            break;
        case "1": case "3":
            tempuser = $("#loginid").val().trim();
            if (tempuser.length <= 0) {
                return;
            }
            break;
        case "2":
            tempuser = $("#loginid").val().trim();
            temppass = $("#user_pass").val().trim();
            newpass = $("#user_confirm_pass").val().trim();
            var complexicyMatches = passRegex.test(newpass);
            if (!complexicyMatches) {
                // alert("Password must contain \nAt least 1 uppercase character\nAt least 1 number\nAt least 8 characters long\n\nPlease try again.");
                $("#alert_msg").html("<strong>Password must contain:</strong><br><ul><li>At least 1 uppercase character</li><li>At least 1 number</li><li>At least 8 characters long</li><li>Please try again.</li></ul>");
                $("#alertMsgTriggerBtn").click();
                return;
            }
            if (tempuser.length <= 0 || temppass.length <= 0 || newpass.length <= 0) {
                return;
            }

            break;
    }


    if (!clickCompleted) {
        return;
    }
    $("#invalid_login").hide();
    $("#login_label").show();


    clickCompleted = false;


    switch (("" + dataobj.mode)) {
        case "0":
            // if (nsm_meeting_data.token.length > 0) {
            //     validateToken(nsm_meeting_data.token);
            // }
            // else {
            // }
            /** User name password */
            validateuser(tempuser, temppass);
            break;
        case "1":
            /**New user */
            checkID(tempuser);
            // verifyLogin(tempuser);
            break;
        case "2":
            verifyAccess(tempuser, temppass, newpass);
            break;
        case "3":
            verifyLogin(tempuser);
            break;
    }
}



function newUser(e) {
    var dataobj = e.dataset;
    var submitdataObj = $("#loginSubmit")[0].dataset;
    $("#invalid_login").hide();
    $("#login_label").show();



    switch (("" + dataobj.mode)) {
        case "0":

            $("#user_pass").hide();
            $("#loginid").attr("placeholder", "User ID");
            $("#login_label").text("Enter Valid User ID");
            $("#user_confirm_pass").val("").hide();
            $("#newuser_text").text("Existing user? Click here to login.");
            dataobj.mode = "1";
            submitdataObj.mode = "1";
            break;

        case "1":
            $("#user_pass").show();
            $("#loginid").attr("placeholder", "User ID");
            $("#login_label").text("Please Sign In");
            $("#user_confirm_pass").val("").hide();
            $("#newuser_text").text("New User? Click here to setup your account.");
            dataobj.mode = "0";
            submitdataObj.mode = "0";
            break;
    }


}

function forgetPassword(e) {
    nsm_meeting_data = {
        user_id: "",
        access_code: "",
        token: "",
        content_group: "",
        eventsData: [],
        current_event_data: {}
    }
    saveLocalSiteData(nsm_meeting_data);

    var dataobj = $("#newuser_text")[0].dataset;
    var submitdataObj = $("#loginSubmit")[0].dataset;
    $("#invalid_login").hide();
    $("#login_label").show();

    $("#user_pass").hide();
    $("#loginid").attr("placeholder", "User ID");
    $("#login_label").text("Enter Valid User ID");
    $("#newuser_text").text("Existing user? Click here to login.");
    dataobj.mode = "1";
    submitdataObj.mode = "3";


}




function checkID(u) {
    var payload = {
        user_id: u
    }

    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/login/userhasaccount",
        data: payload,
        context: { data: payload },
        success: function (response) {
            if (response == 0 || response == "0" || response == "" || response == undefined) {
                $("#invalid_login").hide().text("Login Incorrect. Please try again.");
                verifyLogin(this.data.user_id);
            }
            else if (response == 1 || response == "1") {
                $("#invalid_login").text("User already exist.").show();
                $("#login_label").hide();
                $("#invalid_login").show();
                clickCompleted = true;
            }
        },
        error: function (err) {
            clickCompleted = true;
            $("#login_label").hide();
            $("#invalid_login").text("User already exist.").show();
        }
    });
}

function verifyLogin(userid) {
    //
    //Login not recognized. Please enter a valid MUD ID.
    var payload = {
        user_id: userid
    }

    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/login/newuserpassword",
        data: payload,
        context: { data: payload },
        success: function (response) {
            //response = "1";

            if (response == 0 || response == "0" || response == "" || response == undefined) {
                $("#login_label").hide();
                $("#invalid_login").show();
                clickCompleted = true;
            }
            else if (response == 1 || response == "1") {
                userId = this.data.user_id;
                nsm_meeting_data.user_id = userId;
                saveLocalSiteData(nsm_meeting_data);
                $("#heading_txt").css("background-image", "url(images/Login.png)"); //.text("ACCESS CODE");
                //$("#login_label").text("Please Sign In");
                //$("#login_label").show();

                $("#loginid").show();
                $("#user_pass").val("").show().attr("placeholder", "Temporary Password");
                $("#newuser_text").click();
                $("#user_confirm_pass").val("").show().attr("placeholder", "New Password");
                var ele = $("#loginSubmit");
                var dataobj = ele[0].dataset;
                dataobj.mode = "2";
                clickCompleted = true;
                // alert("An email has been sent to you with further instructions.");
                $("#alert_msg").text("An email has been sent to you with further instructions.");
                $("#alertMsgTriggerBtn").click();

            }
        }
    });
}


function verifyAccess(u, tp, np) {

    var payload = {
        password: np,
        old_password: tp,
        user_id: u
    }

    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/login/updateuserpassword",
        data: payload,
        context: { data: payload },
        success: function (response) {

            if (response == 0 || response == "0" || response == "" || response == undefined) {
                $("#invalid_login").text("Incorrect User Id or Password entered. Please try again.");
                //$("#newuser_text").click();
                $("#login_label").hide();
                clickCompleted = true;
                $("#invalid_login").show();
            }
            else {

                Token = jQuery.parseJSON(response).token;
                nsm_meeting_data.token = Token;
                saveLocalSiteData(nsm_meeting_data);
                validateToken(Token);
            }
        },
        error: function (err) {
            $("#invalid_login").text("Incorrect User Id or Password entered. Please try again.");
            //$("#newuser_text").click();
            //$("#user_confirm_pass").show();
            $("#login_label").hide();
            clickCompleted = true;
            $("#invalid_login").show();
        }
    });
}

function validateuser(u, p) {

    var payload = {
        user_id: u,
        password: p,
    }

    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/login/userlogin",
        data: payload,
        context: { data: payload },
        success: function (response) {
            if (response == 0 || response == "0" || response == "" || response == undefined) {
                $("#invalid_login").text("Incorrect User Id or Password entered. Please try again.");
                //$("#newuser_text").click();
                $("#login_label").hide();
                clickCompleted = true;
                $("#invalid_login").show();
            }
            else {

                Token = jQuery.parseJSON(response).token;
                nsm_meeting_data.token = Token;
                saveLocalSiteData(nsm_meeting_data);
                validateToken(Token);
            }
        },
        error: function (err) {
            $("#invalid_login").text("Incorrect User Id or Password entered. Please try again.");
            //$("#newuser_text").click();
            //$("#user_confirm_pass").show();
            $("#login_label").hide();
            clickCompleted = true;
            $("#invalid_login").show();
        }
    });
}

function validateToken(t) {
    var payload = {
        token: t
    }

    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/login/validateusertoken",
        data: payload,
        context: { data: payload },
        success: function (response) {
            response = jQuery.parseJSON(response);
            if (response == 0 || response == "0" || response == "" || response == undefined) {
                //$("#invalid_login").text("Incorrect User Id or Password entered. Please try again.");
                //$("#newuser_text").click();
                $("#login_label").show();
                clickCompleted = true;
                //$("#invalid_login").show();
                $("#login_section").show();
                // alert("In-valid session. Please Sign in.");
                $("#alert_msg").text("In-valid session. Please Sign in.");
                $("#alertMsgTriggerBtn").click();
            }
            else {
                userId = response.user_id;
                nsm_meeting_data.user_id = userId;
                saveLocalSiteData(nsm_meeting_data);
                getEventID();
            }
        },
        error: function (err) {
            //$("#invalid_login").text("Incorrect User Id or Password entered. Please try again.");
            //$("#newuser_text").click();
            $("#login_label").show();
            clickCompleted = true;
            //$("#invalid_login").show();
            $("#login_section").show();
            // alert("In-valid session. Please Sign in.");
            $("#alert_msg").text("In-valid session. Please Sign in.");
            $("#alertMsgTriggerBtn").click();

        }
    });
}


function getEventID() {
    //Login not recognized. Please enter a valid MUD ID.
    var payload = {
        user_id: userId,
        token: Token
    }
    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/events/getuserevents",
        data: payload,
        context: { data: payload },
        success: function (response) {
            //response = [{"id":"1","name":"Default - Test 1","content_path":"\/content\/test1\/Default___Test_1\/"}];
            var parseData = jQuery.parseJSON(response);

            if (parseData.length >= 1) {
                nsm_meeting_data.eventsData = parseData;

                if (parseData.length == 1) {
                    event_id = parseData[0].id; // event_id
                    nsm_meeting_data.current_event_data = parseData[0];
                    getContentGroup();
                }
                else {
                    // implementation for multiple events
                }
                saveLocalSiteData(nsm_meeting_data);
            }
            else {

            }



        },
        error: function (err) {
            // $("#invalid_login").text("Incorrect code. Please try again.");
            // alert("There is no event assigned to your credential. Please contact support.");
            $("#alert_msg").text("There is no event assigned to your credential. Please contact support.");
            $("#alertMsgTriggerBtn").click();
            clickCompleted = true;
            $("#login_label").show();
            //$("#invalid_login").show();
            $("#login_section").show();
        }
    });
}

function getContentGroup() {
    //Login not recognized. Please enter a valid MUD ID.
    var payload = {
        user_id: userId,
        event_id: event_id,
        token: Token
    }

    $.ajax({
        type: "POST",
        url: "https://demo.virtuoso.mc3.com/download/content",
        data: payload,
        context: { data: payload },
        success: function (response) {
            //response = "1";
            var parseData = response.trim().split(",");
            var valid = false;
            if (parseData.length > 2 && parseData[1].trim().length > 0) {
                valid = true;
                contentgroupname = parseData[1].trim();
                //contentgroupname = "Manager";
                nsm_meeting_data.content_group = contentgroupname;
                saveLocalSiteData(nsm_meeting_data);
                //setTimeout(renderMenuContents, 2);
            }

            if (!valid) {
                // $("#invalid_login").text("Incorrect code. Please try again.");
                // alert("No content assigned to your credential. Please contact support.");
                $("#alert_msg").text("No content assigned to your credential. Please contact support.");
                $("#alertMsgTriggerBtn").click();
                $("#login_label").hide();
                $("#invalid_login").show();
                clickCompleted = true;
                $("#login_section").show();

            }
            else {

                $("#login_section").hide();
                $("#invalid_login").text("Login Incorrect. Please try again.");
                $("#login_label").text("Please Sign In");
                $("#heading_txt").css("background-image", "url(images/Login.png)");//.text("ACCESS CODE");
                // $("#access_code").text("");
                // $("#access_code").hide();
                $("#invalid_login").hide();
                $("#login_label").show();
                $("#loginid").val("").show();
                $("#user_pass").val("").show();
                $("#user_confirm_pass").val("").hide();

                clickCompleted = true;

                var ele = $("#loginSubmit");
                var dataobj = ele[0].dataset;
                dataobj.mode = "0";

                checkLocalLoginID();
            }
        },
        error: function (err) {
            // $("#invalid_login").text("Incorrect code. Please try again.");
            // alert("No content assigned to your credential. Please contact support.");
            $("#alert_msg").text("No content assigned to your credential. Please contact support.");
                $("#alertMsgTriggerBtn").click();
            clickCompleted = true;
            $("#login_label").show();
            // $("#invalid_login").show();
            $("#login_section").show();

        }
    });
}

function checkLocalLoginID() {
    var bonus_mode = true;
    if (nsm_meeting_data) {
        if (nsm_meeting_data.user_id.trim() == "" || nsm_meeting_data.token.trim() == "" || nsm_meeting_data.content_group.trim() == "") {
            $("#footer_top").hide();
            $("#banner_img").hide();

            $("#microsite_container_top").hide();
            $("#login_section").show();
        }
        else {
         
         
         
            window.location.href="speed-round.html";
         
            userId = nsm_meeting_data.user_id;
            Token = nsm_meeting_data.token;
            contentgroupname = nsm_meeting_data.content_group;
            event_id = nsm_meeting_data.current_event_data.id;
            _loginactive = false;
            $("#login_section").hide();
            document.body.scrollTop = 0;
            // $("footer").css("position", "static");
            $("#footer_top").show();
            $("#banner_img").show();


            var jsElm = document.createElement("script");
            jsElm.type = "application/javascript";
            //{"id":"1","name":"Default - Test 1","content_path":"\/content\/test1\/Default___Test_1\/"}
            var _src = nsm_meeting_data.current_event_data.content_path + "data/menu.js";
            jsElm.src = serverURL + _src + '?version=' + localStorage.launchCount;
            document.body.appendChild(jsElm);
            jsElm.onload = function () {
                renderMenuContents();
            }
            // renderMenuContents();
            $("#microsite_container_top").show();
        }
    }
    else {
        nsm_meeting_data = {
            user_id: "",
            access_code: "",
            token: "",
            content_group: "",
            eventsData: [],
            current_event_data: {}
        }
        saveLocalSiteData(nsm_meeting_data);
        $("#footer_top").hide();
        $("#banner_img").hide();

        $("#microsite_container_top").hide();
        $("#login_section").show();
    }
}



var _serverdate;
function getServerDateTime() {
 
 _serverdate = getCurrentDate();
 /*
    $.ajax({
        type: "POST",
        url: "https://virtuoso.mc3tt.comtabletop/datetime/getdatetime",
        success: function (data) {
            _serverdate = data;
            // renderMenuContents();
            // if (getDateDiff(dataobject.expirationdate, data) <= 0) {
            // } 
        },
        error: function (err) {
            _serverdate = getCurrentDate();
            // renderMenuContents();
            // if (getDateDiff(dataobject.expirationdate, getCurrentDate()) <= 0) {
            // } 
        }
    });
    */
}

function getDateDiff(expirationdate, currentdate) {
    //var date1 = new Date(getCurrentDate());
    var date1 = new Date(currentdate);
    var date2 = new Date(expirationdate);
    //console.log(`expireation date = ${date2} -- current date = ${date1}`);
    var timeDiff = (date2.getTime() - date1.getTime());
    //console.log(`current time = ${date1.getTime()}  -- expiration time = ${date2.getTime()}`);
    var diffDays = (timeDiff / (1000 * 3600 * 24)); //Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return diffDays;
}

function getCurrentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours();
    var min = today.getMinutes();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }
    if (hh < 10) {
        hh = '0' + hh;
    }
    if (min < 10) {
        min = "0" + min;
    }

    today = mm + '/' + dd + '/' + yyyy + " " + hh + ":" + min;
    return today;
}

function parseAccessDate(accessdate) {
    //  20200319115900
    var _year = accessdate.substr(0, 4);
    var _month = accessdate.substr(4, 2);
    var _day = accessdate.substr(6, 2);
    var _hrs = accessdate.substr(8, 2);
    var _mins = accessdate.substr(10, 2);
    var _sec = accessdate.substr(12, 2);
    return (_month + '/' + _day + '/' + _year + " " + _hrs + ":" + _mins + ":" + _sec);
}

function to2digits(n) {
    if (n > 10) return n;
    return "0" + n;
}

function msToTime(date_future, date_now) {
    date_future = new Date(date_future);
    date_now = new Date(date_now);
    // get total seconds between the times
    var delta = Math.abs(date_future - date_now) / 1000;

    // calculate (and subtract) whole days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;

    // calculate (and subtract) whole hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;

    // calculate (and subtract) whole minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;

    // what's left is seconds
    var seconds = delta % 60;
    var array = [days, to2digits(hours), to2digits(minutes), to2digits(seconds)];

    //console.log(`expireation date = ${date2} -- current date = ${date1}`);
    var timeDiff = (date_future.getTime() - date_now.getTime());
    //console.log(`current time = ${date1.getTime()}  -- expiration time = ${date2.getTime()}`);
    var diffDays = (timeDiff / (1000 * 3600 * 24)); //Math.ceil(timeDiff / (1000 * 3600 * 24));
    //console.log(`date diff = ${diffDays} =`);
    return { dayDifference: diffDays, remainingTime: array };


}























function scrollToLastLocation() {
    document.body.scrollTop = currrentLocation;
}

function showSupportForm() {
    $("#banner_img").hide();
    $("#microsite_container_top").hide();
    $("#login_section").hide();
    $("#aaq_section").hide();
    $("#aaQ").val("");
    $("#aaq_section .form-row").show();
    $("#aaq_section .form-row.success").hide();
    $("#support_section").show();

}
function closeSupportForm() {
    $("#support_section").hide();
    $("#support_section .form-row").show();
    $("#support_section .form-row.success").hide();
    if (_loginactive) {
        $("#banner_img").hide();
        $("#microsite_container_top").hide();
        $("#login_section").show();
    }
    else {
        $("#login_section").hide();
        $("#banner_img").show();
        $("#microsite_container_top").show();
    }
    scrollToLastLocation();
}

var currrentLocation = 0;
function showAaqForm() {
    $("#banner_img").hide();
    $("#microsite_container_top").hide();
    $("#aaq_section").show();
    try {
        currrentLocation = document.documentElement.scrollTop || document.body.scrollTop;
    } catch (error) { }
}

function closeAaqForm() {
    $("#aaq_section").hide();
    $("#aaq_section .form-row").show();
    $("#aaq_section .form-row.success").hide();
    $("#banner_img").show();
    $("#aaQ").val("");
    $("#microsite_container_top").show();
    scrollToLastLocation();
}

function submitAaqForm() {
    var aaQuestion = $("#aaQ").val().trim();

    if (aaQuestion.length > 0) {
        var payload = event_id + "&&" + userId + "&&" + encodeURIComponent(aaQuestion) + "&&General" + getDateTime();
        payload = { 'connectdata': payload };
        //  eventid&&user_id&&data&&category&&datetime
        $.ajax({
            type: "POST",
            url: "https://virtuoso.mc3tt.com/tabletop/connect/addconnect",
            data: payload,
            context: { data: payload },
            success: function (response) {
                $("#aaq_section .form-row").hide();
                $("#aaq_section .form-row.success").show();
            },
            error: function (err) {
                $("#aaq_section .form-row").show();
                $("#aaq_section .form-row.success").hide();
            }
        });
    }
    else {
        // alert("Please enter your question.");
        $("#alert_msg").text("Please enter your question.");
                $("#alertMsgTriggerBtn").click();
    }
}


function getDateTime() {
    var time = new Date();
    date = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
    return date;
}

function submitSupportForm() {

    var name = $("#inputname").val().trim();
    var email = $("#inputEmail").val().trim();
    var phone = $("#inputPhone").val().trim();
    var issue = $("#inputIssue").val().trim();
    var isvalidEmail = ValidateEmail(email);

    if (name.length > 0 && phone.length > 0 && issue.length > 0 && isvalidEmail) {
        var payload = {
            to: "tabletop_support@mc3.com",
            replyto: email,
            subject: "Paratek 2020 NSM Portal Support",
            body: "Name : " + name + "\nE-mail : " + email + "\nPhone : " + phone + "\nIssue Description : " + issue + ""
        }
        $.ajax({
            type: "POST",
            url: "https://virtuoso.mc3tt.com/tabletop/mail/sendmail",
            data: payload,
            context: { data: payload },
            success: function (response) {
                $("#support_section .form-row").hide();
                $("#support_section .form-row.success").show();
            },
            error: function (err) {
                $("#support_section .form-row").show();
                $("#support_section .form-row.success").hide();
            }
        });
    }
    else {
        // if(!isvalidEmail){
        //     alert("Please enter valid email.");
        // }else{
        // alert("Please enter all fields.");
        $("#alert_msg").text("Please enter all fields.");
                $("#alertMsgTriggerBtn").click();
        // }

    }
}

function ValidateEmail(emailtxt) {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailtxt.match(mailformat)) {
        return true;
    }
    else {
        return false;
    }
}


function renderMenuContents() {
    _menuObjects = loadMenu(contentgroupname);
    createContents();

    // $("video").on("play", function (e, f) {
    //     var videonumber = this.dataset;
    //     _currentVideoPlaying = "video_" + videonumber.videoid;
    // });


    // $("video").on("ended", function (e, f) {
    //     _currentVideoPlaying = undefined;
    // });

}

function closeVideo() {
    var ele = document.getElementById("nsm_video_player");
    ele.pause();
    $("#video_title").text("");
    // _currentVideoPlaying = undefined;
}

function showPhotoGall() {
    $("#photo_gall").show();
}

function postUtilizationData(param_item_type, param_item_id) {
    $.post("https://virtuoso.mc3tt.com/tabletop/utilization/addaccess",
        {
            user_id: nsm_meeting_data.user_id,
            event_id: event_id,
            type: param_item_type,
            item_id: param_item_id
        });
}

function htmlDecode(value) {
    return $("<textarea/>").html(value).text();
}


var _timerTiles = [];
function createContents() {
    var i = 0;
    var runningcounter = 0;
    var counter = 0;
    _timerTiles = [];
    _myScreenWidth = $('#ptest').width();
    var td_class = "";
    if (_myScreenWidth == 2) {
        td_class = "col-6";
    }
    else {
        td_class = "col-sm-4";
    }
    //console.log(_myScreenWidth)
    // var _totalCount = _menuObjects.subMenus["Menu1"].length;
    var _totalCount = _menuObjects.mainMenu.length;
    var content_path = serverURL + nsm_meeting_data.current_event_data.content_path + "content/";
    for (var contentKey in _menuObjects.mainMenu) {
        menu = _menuObjects.mainMenu[contentKey];
        //_menuObjects.mainMenu[contentKey].forEach(function (menu) {

        //var _photo = '<img src="images/thumbs/tile' + i + '.jpg" data-image="images/big/tile'+i+'.jpg" data-description="" style="display:none;">';
        //var _photo = '<img src="images/thumbs/tile' + (i+2) + '.jpg" data-image="images/big/tile' + (i+2) + '.jpg" data-description="" style="display:none">';
        //$("#pic_gallery").append(_photo);


        var _cardURl = menu.URL;

        if (menu.Type.trim().toLowerCase() == "content") {
            _cardURl = (content_path + menu.URL);
        }


        var title_text = "";
        var card_description = "";
        var card_subtitle = "";
        var tile_access_code = menu.AccessCode.trim().toLowerCase();
        if (tile_access_code == "none") {
            tile_access_code = "";
        }
        i++;
        var first_card_padding = "";
        if (i == 1) {
            first_card_padding = "padding-top: 0 !important;";
            //first_card_padding = "";
        }
        else {
            first_card_padding = "";
        }

        var _titleClass = "h4";



        var card_hr = '<div class="pin-line img-hr-small"></div>';
        if (i <= 2 || _myScreenWidth > 1) {
            card_hr = "";
        }


        /* Content launch button */
        var content_launch_button = '';
        if (_cardURl.trim().toLowerCase().endsWith("00.html")) {
            content_launch_button = "";
        }
        /* Content launch buttong end */


        //var currentSize = $('#ptest').css('font-size');
        //var newSize = parseFloat(currentSize) * 1.2;
        var newSize = 18;
        var card_details = menu.Name.split("**");
        try {
            if (card_details.length >= 1) {
                card_subtitle = card_details[0].trim();
            }
            if (card_details.length >= 2) {
                card_description = card_details[1].trim();
            }
            // if (card_details.length >= 3) {
            //     card_description = card_details[2].trim();
            // }
        } catch (error) { }

        var _tileImage = content_path + menu.Icon;
        // if (menu.Icon.trim().length == 0) {
        //     menu.Icon = "Virtual_HappyHour.png";
        // }
        //_tileImage = "images/tiles/" + menu.Icon;


        if (i == 1) {
            //$("#main_header").css("background-image", "url(" + _tileImage + ")");
            // return;
            continue;
        }
        else if (i == 2) {
            var _elem = $("#banner_img"); //.css("background-image", "url(" + _tileImage + ")");
            //data-title="' + card_subtitle + '"  data-accesscode="' + tile_access_code + '" data-itemid="' + menu.ItemID 
            //+ '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '
            var _bnrDataObj = _elem[0].dataset;
            _bnrDataObj.title = card_subtitle;
            _bnrDataObj.accesscode = tile_access_code;
            _bnrDataObj.itemid = menu.ItemID;
            _bnrDataObj.itemtype = menu.Type;
            _bnrDataObj.url = _cardURl;
            // return;
            continue;
        }
        else if (_cardURl.trim().toLowerCase().endsWith(".mp4") || _cardURl.trim().toLowerCase().endsWith(".mp3") || _cardURl.trim().toLowerCase().endsWith(".m4v")) {
            //var site_card = '<div id="card' + i + '"  class="col-md-3 col-sm-4 p-3 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><p class="card-title text-center ' + _titleClass + '" style="color:#000 !important; text-transform: uppercase;">' + title_text + '</p><img data-toggle="modal" data-target="#modal-video" src="' + _tileImage + '?' + Date.now() + '" class="card-img card-trigger" data-videoid="' + i + '" data-accesscode="' + tile_access_code +'"  data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"><h4 class="card-subtitle" style="color:#000 !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="text-align:center;color:#454545 !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            var site_card = '<div id="card' + i + '"  class="col-md-3 ' + td_class + ' p-2 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><img data-toggle="modal" data-target="#modal-video" src="' + _tileImage + '?' + Date.now() + '" class="card-img card-trigger" data-title="' + card_subtitle + '" data-videoid="' + i + '" data-accesscode="' + tile_access_code + '"  data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"><h4 class="card-subtitle" style="color:#fff !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="line-height: initial;text-align:center;color:#ffffff !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            $("#site_card_container").append(site_card);
        }
        else if (_cardURl.trim().toLowerCase().endsWith("aaq.html")) {
            //var site_card = '<div id="card' + i + '"  class="col-md-3 col-sm-4 p-3 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><p class="card-title text-center ' + _titleClass + '" style="color:#000 !important; text-transform: uppercase;">' + title_text + '</p><div style="background-image: url('+ _tileImage +'?' + Date.now() + ');" class="card-img aaq-tile card-trigger" data-accesscode="' + tile_access_code +'" data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"></div><h4 class="card-subtitle" style="color:#000 !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="text-align:center;color:#454545 !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            var site_card = '<div id="card' + i + '"  class="col-md-3 ' + td_class + ' p-2 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><div style="background-image: url(' + _tileImage + '?' + Date.now() + ');" class="card-img aaq-tile card-trigger" data-title="' + card_subtitle + '"  data-accesscode="' + tile_access_code + '" data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"></div><h4 class="card-subtitle" style="color:#fff !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="line-height: initial;text-align:center;color:#ffffff !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            $("#site_card_container").append(site_card);
        }
        else if (tile_access_code.length > 0) {
            // need to check access code time 
            tile_access_code = "20200331115900";
            var day = 0;
            var hrs = 0;
            var min = 0;
            var sec = 0;
            var linkopen = 0;
            var showtimer = "none";
            var access_date = parseAccessDate(tile_access_code);
            // var datedifference = getDateDiff(access_date, _serverdate);
            var _time = msToTime(access_date, _serverdate);

            if (_time.dayDifference > 0) {
                //not available
                _timerTiles.push("card" + i);
                //showtimer = "initial";
                day = _time.remainingTime[0];
                hrs = _time.remainingTime[1];
                min = _time.remainingTime[2];
                sec = _time.remainingTime[3];
                //_tileImage = content_path + menu.IconL;
            }
            else {
                var linkopen = 1;
                _tileImage = content_path + menu.IconL;
                //_tileImage = "images/tiles/" + menu.Icon;
            }
            //var site_card = '<div id="card' + i + '"  class="col-md-3 col-sm-4 p-3 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><div style="background-image: url(' + _tileImage + '?' + Date.now() + ');" class="card-img aaq-tile card-trigger" data-accesscode="' + tile_access_code + '" data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"></div><h4 class="card-subtitle" style="color:#000 !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="text-align:center;color:#454545 !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            var site_card = '<div id="card' + i + '"  class="col-md-3 ' + td_class + ' p-2 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><div style="background-image: url(' + _tileImage + '?' + Date.now() + ');" class="card-img aaq-tile card-trigger" data-title="' + card_subtitle + '"  data-linkopen="' + linkopen + '" data-accesscode="' + tile_access_code + '" data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"><div class="countdown-timer" style="display:' + showtimer + '"><div><span>' + day + '</span></div><div><span>' + hrs + '</span></div><div><span>' + min + '</span></div><div><span>' + sec + '</span></div><h4 class="card-subtitle" style="color:#fff !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="line-height: initial;text-align:center;color:#ffffff !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            $("#site_card_container").append(site_card);
        }
        else {
            //var site_card = '<div id="card' + i + '"  class="col-md-3 col-sm-4 p-3 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><p class="card-title text-center ' + _titleClass + '" style="color:#000 !important; text-transform: uppercase;">' + title_text + '</p><img src="' + _tileImage + '?' + Date.now() + '" class="card-img card-trigger" data-accesscode="' + tile_access_code +'" data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"><h4 class="card-subtitle" style="color:#000 !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="text-align:center;color:#454545 !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            var site_card = '<div id="card' + i + '"  class="col-md-3 ' + td_class + ' p-2 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><img src="' + _tileImage + '?' + Date.now() + '" class="card-img card-trigger" data-title="' + card_subtitle + '"  data-accesscode="' + tile_access_code + '" data-itemid="' + menu.ItemID + '" data-itemtype="' + menu.Type + '" data-url="' + _cardURl + '"><h4 class="card-subtitle" style="color:#fff !important;">' + card_subtitle + '</h4><p class="card-text text-muted" style="line-height: initial;text-align:center;color:#ffffff !important; font-size:0.9em;padding-left: 15px; padding-right: 14px;">' + htmlDecode(card_description) + '</p></div></div></div>' + card_hr;
            $("#site_card_container").append(site_card);
        }
        counter++;
        runningcounter++;
        //if (counter == _myScreenWidth || ((_totalCount - runningcounter) < _myScreenWidth && _totalCount == runningcounter)) {

        if ((_myScreenWidth > 1) && ((counter == _myScreenWidth) || ((_totalCount - runningcounter) < _myScreenWidth && _totalCount == runningcounter))) {
            $("#site_card_container").append('<div class="pin-line img-hr-big"></div>');
            counter = 0;
        }

        // });

        // var site_card = '<div id="card99"  class="col-md-3 col-sm-4 p-3 nsm-card" style="position:relative;"><div class="card border-0 mb-md-0"><div class="card-body" style="padding:0 !important;"><p class="card-title text-center h4" style="color:#000 !important; text-transform: uppercase;">Dummy Video Vipul</p><img data-toggle="modal" data-target="#modal-video" src="images/Video.png?' + Date.now() + '" class="card-img card-trigger" data-videoid="99"  data-itemid="9999" data-itemtype="content" data-url="images/myvideo.mp4"><h4 class="card-subtitle" style="color:#000 !important;">SubTitle from Vipul</h4><p class="card-text text-muted" style="text-align:center;color:#454545 !important; font-size:13px;padding-left: 15px; padding-right: 14px;"> Description of video tile added by vipul for testing. Not suer how much contents should I add to test this.</p></div></div></div>';
        // $("#site_card_container").append(site_card);

    }

    $(".card-trigger").on("click", function (e, f) {
        var dataobj = this.dataset;
        var _type = dataobj.itemtype.trim().toLowerCase();
        var _url = dataobj.url.trim();
        if (_url.toLowerCase().endsWith("00.html")) {
            return;
        }
        if (dataobj.accesscode.trim().length > 0 && (dataobj.linkopen == "0" || dataobj.linkopen == 0)) {
            return;
        }
        //postUtilizationData(dataobj.itemtype, dataobj.itemid);
        if (_type == "submenu") {
            var _weblinkMenuObj = _menuObjects.subMenus[_url];
            var tempobj = { "weblinkarr": [] };
            var _weblink = "";
            for (var contentKey in _weblinkMenuObj) {

                var menu = _weblinkMenuObj[contentKey];
                tempobj.weblinkarr.push({
                    "Name": menu.Name,
                    "Type": menu.Type,
                    "URL": menu.URL,
                    "AccessCode": menu.AccessCode,
                    "Updated": menu.Updated,
                    "ItemID": menu.ItemID,
                    "Description": menu.Description,
                    "Icon": menu.Icon,
                    "IconL": menu.IconL,
                    "Mobile": menu.Mobile,
                    "Breadcrumbs": menu.Breadcrumbs,
                    "Parent": menu.Parent,
                    "id": menu.id
                });
                if (menu.URL.toLowerCase().startsWith("embed-")) {
                    var _urllink = menu.URL.split("embed-");
                    window.localStorage.setItem(CONST_WEBLINKURL, _urllink[1]);
                    // return;
                }
            }
            localStorage.setItem(CONST_WEBLINKMENUOBJECT, JSON.stringify(tempobj));
            window.localStorage.setItem(CONST_INITIATINGPAGE, 1);
            // window.open((_url + "" + userId), "_blank", "fullscreen=no,location=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=yes,titlebar=yes");
            window.location.href = "weblinkviewer.html";
        }
        else if (_url.toLowerCase().endsWith(".mp4") || _url.toLowerCase().endsWith(".mp3") || _url.toLowerCase().endsWith(".m4v")) {
            var videoele = document.getElementById("nsm_video_player");
            // var videodataobj = videoele.dataset;
            // videodataobj.videoid = dataobj.videoid;
            videoele.src = dataobj.url;
            $("#video_title").text(dataobj.title);
            videoele.play();
        }
        else if (_url.toLowerCase().startsWith("embed-")) {
            // window.open((_url + "" + userId), "_blank", "fullscreen=no,location=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=yes,titlebar=yes");
            var _urllink = _url.split("embed-");
            window.localStorage.setItem(CONST_WEBLINKURL, _urllink[1]);
            window.location.href = "weblinkviewer.html";
        }
        else if (_url.toLowerCase().startsWith("https://www.webcastregister.live")) {
            // window.open((_url + "" + userId), "_blank", "fullscreen=no,location=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=yes,titlebar=yes");
            window.localStorage.setItem(CONST_WEBLINKURL, _url);
            window.location.href = "weblinkviewer.html";
        }
        else if (_url.toLowerCase().endsWith("aaq.html")) {
            showAaqForm();
        }
        else if (_url.toLowerCase().endsWith("photo_album.html")) {
            showPhotoAlbum();
        }
        else if (_url.toLowerCase().endsWith(".pdf")) {
            window.location.href = "pdf_viewer/web/viewer.html?file=" + encodeURIComponent(_url);
        }
        else {
            window.open(_url, "_blank", "fullscreen=no,location=yes,scrollbars=yes,toolbar=yes,menubar=yes,location=yes,titlebar=yes");
        }

    });

    setTimeout(setupGallery, 100);
}


function showPhotoAlbum() {
    $("#img_gallery_trigger").click();
}

function setupGallery() {
    var _photo_cont = $("#pic_gallery");
    _photo_cont.empty();
    for (var i = 0; i < photo_data.length; i++) {
        var _photolink = '<img src="photo_album/' + photo_data[i] + '" data-image="photo_album/' + photo_data[i] + '" data-description="" style="display:none" alt="">';
        _photo_cont.append(_photolink);
    }

    setTimeout(function () {
        $("#pic_gallery").unitegallery();
    },
        200);

}

function saveLocalSiteData(sitedata) {
    window.localStorage.setItem("VirtuosoDemoNewLoginPortalLocalData", JSON.stringify(sitedata));
}
function removeLocalData() {
    window.localStorage.removeItem("VirtuosoDemoNewLoginPortalLocalData");
}

function gotoTop() {
    //document.body.scrollTop = 0;
    //document.documentElement.scrollTop = 0;
    $('html, body').animate({
        scrollTop: 0
    }, 300);
    return false;
}

function updateLoginBtnState(btn) {
    //console.log("i am in text change.");
    var _btn = $("#btn_login_submit");
    if (btn.value.length > 0) {
        _btn.css("background-image", "url('images/site/Submit.png')");
        _btn.css("pointer-events", "all");
    }
    else {
        _btn.css("background-image", "url('images/site/Submit_inactive.png')");
        _btn.css("pointer-events", "none");

    }
}

function scrollToLocation(ele) {
    var dataobj = ele.dataset;
    var target = $(dataobj.scrollto);
    if (target.length) {
        $('html,body').animate({
            scrollTop: target.offset().top
        }, 250);
    }
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


var siteItemID = "";
var siteItemType = "";
function loadMenu(groupname) {
    var parsedData = JSON.parse(menuJSON);
    var data = parsedData['Menu' + groupname]
    var subMenus = [],
        mainMenu = [];
    var menuJsonish = data;
    //first turn this into an actual array instead of this silly, non Json stuff
    $.each(menuJsonish, function (e) {

        var name = e.valueOf();
        var eachMenu = {};

        if (e != "MenuSettings") { //skip MenuSettings
            if (e != 'Menu1') {
                eval("subMenus." + e + " = []");
            }
            $.each(menuJsonish[name], function (element) {

                var menuArray = [];

                $.each(menuJsonish[name][element], function (item) {
                    var currentItem = menuJsonish[name][element][item];
                    var k = currentItem[0].valueOf();;
                    var v = currentItem[1].valueOf();
                    menuArray[k] = v;
                });
                //add a proper ID
                if (menuArray['Name'].trim().toLowerCase() == "microsite url") {
                    siteItemType = menuArray["Type"];
                    siteItemID = menuArray["ItemID"];
                }
                menuArray['id'] = menuArray['URL'].replace(/[^a-z0-9]/gi, '_').toLowerCase();
                //menuNameKey.push({ "menuID": menuArray.id, "name": menuArray.Name });
                if (e == 'Menu1') {
                    mainMenu.push(menuArray);
                    //eval("subMenus." + e + ".push(menuArray)");
                } else {
                    eval("subMenus." + e + ".push(menuArray)");
                }
            });
        }
    });
    return {
        mainMenu: mainMenu,
        subMenus: subMenus
    };
}

$(function () {

    var note = $('#note'),
        ts = new Date(2020, 2, 25),
        newYear = false;

    if ((new Date()) > ts) {
        // The new year is here! Count towards something else.
        // Notice the *1000 at the end - time must be in milliseconds
        ts = (new Date()).getTime() + 10 * 24 * 60 * 60 * 1000;
        newYear = false;
    }

    $('#countdown').countdown({
        timestamp: ts,
        callback: function (days, hours, minutes, seconds) {

            var message = "";

            //message += days + " day" + ( days==1 ? '':'s' ) + ", ";
            //message += hours + " hour" + ( hours==1 ? '':'s' ) + ", ";
            message += minutes + " minute" + (minutes == 1 ? '' : 's') + " and ";
            message += seconds + " second" + (seconds == 1 ? '' : 's') + " <br />";

            if (newYear) {
                message += "left until the new year!";
            }
            else {
                message += "left to 10 days from now!";
            }

            note.html(message);
        }
    });

});


var _myScreenWidth = 0;
$(window).resize(function () {

    var _tempmyScreenWidth = $('#ptest').width();
    if (_tempmyScreenWidth != _myScreenWidth) {
        _myScreenWidth = _tempmyScreenWidth;
        var _elements = $("#site_card_container .nsm-card");
        if (_myScreenWidth == 2) {
            _elements.addClass("col-6").removeClass("col-sm-4");
        }
        else {
            if (_elements.hasClass("col-6")) {
                _elements.removeClass("col-6").addClass("col-sm-4");
            }
        }

        setTimeout(CheckOtherComponent, 2);

        var _class = "";
        if (_myScreenWidth <= 2) {
            // _class = "img-hr-small";
            _class = "img-hr-big"
        }
        else {
            _class = "img-hr-big"
        }
        var counter = 0;
        var runningcounter = 0;
        $("#site_card_container .pin-line").remove();
        var _totalCount = $("#site_card_container .nsm-card").length;
        $("#site_card_container .nsm-card").each(function (ind, ele) {
            counter++;
            runningcounter++;
            if (counter == _myScreenWidth || ((_totalCount - runningcounter) < _myScreenWidth && _totalCount == runningcounter)) {
                $('<div class="pin-line ' + _class + '"></div>').insertAfter("#" + ele.id);
                counter = 0;
            }

        });
    }
});

function CheckOtherComponent() {
    console.log(_myScreenWidth);
    if (_myScreenWidth >= 3) {
        $("#header_img").attr("src", "images/Header_Desktop.png?v=" + Date.now());
        $("#banner_img").attr("src", "images/Banner_Desktop.gif?v=" + Date.now());
    }
    else {
     //mobile
        $("#header_img").attr("src", "images/Header_Desktop.png?v=" + Date.now());
        $("#banner_img").attr("src", "images/Header_Desktop.gif?v=" + Date.now());

    }
}