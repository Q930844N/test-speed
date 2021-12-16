var eventId = event_id;
var userId = user_id;
var activityId = activity_id;
var speedRoundCookie;
var round = 0;
var firstRoundDone = false;
var currentQAs = [];
var totalQACount = currentQAs.length;
var offlineData = [];
var activities = [];
var pointScore = 0;
var timeScore = 0;
var totalScore = pointScore + timeScore;
var duration = 120;
var durationTimer = null;
var previousDurationTimer = null;
var durationLeft = duration;
var actname = "Activity" + activityId;
var personalhighscore = 0;
var counteruser = 0;
var totalhighscoreusers = 0;
var correctpoint = 100;

$(function () {
    activityJSON = activityJSON.replace(/o\t/g, "");
    window.localStorage.setItem("activity", JSON.stringify(jQuery.parseJSON(activityJSON)[actname]));
    FastClick.attach(document.body);
    var act = jQuery.parseJSON(activityJSON)[actname];
    console.log(act);
    var inst = act["ActivityInfo"][5][1];
    $("#activity_inst_text").html(inst);
    if (activityId == 7) {
        duration = 60;
        $('.counter').text('1' + ':' + '00');
    }
    //activityTitle();
});

function activityTitle() {
    switch (activityId) {

        case '33':
            if (mobileCheck() == false)
                $('#activity_inst_title').html("Welcome to the VxPop Speed Round 1");
            else
                $('#activity_inst_title').html("Welcome to the VxPop<br/> Speed Round 1")
            break;
        case '34':
            if (mobileCheck() == false)
                $('#activity_inst_title').html("Welcome to the VxPop Speed Round 2")
            else
                $('#activity_inst_title').html("Welcome to the VxPop<br/> Speed Round 2")
            break;
        case '35':
            if (mobileCheck() == false)
                $('#activity_inst_title').html("Welcome to the VxPop Speed Round 3")
            else
                $('#activity_inst_title').html("Welcome to the VxPop<br/> Speed Round 3")
            break;
        case '36':
            if (mobileCheck() == false)
                $('#activity_inst_title').html("Welcome to the VxPop Speed Round 4")
            else
                $('#activity_inst_title').html("Welcome to the VxPop<br/> Speed Round 4")
            break;

    }
}

function saveCookies() {
    speedRoundCookie = {
        currentQAs: currentQAs,
        totalQACount: totalQACount,
        totalScore: totalScore,
        pointScore: pointScore,
        durationLeft: durationLeft,
        activities: activities,
        offlineData: offlineData,
        personalhighscore: personalhighscore,
        round: round
    }
    window.localStorage.setItem("ltenSpeedRoundCookie" + localvar, JSON.stringify(speedRoundCookie));
}

function restoreCookies() {
    speedRoundCookie = jQuery.parseJSON(window.localStorage.getItem("ltenSpeedRoundCookie" + localvar));
    if (speedRoundCookie) {
        currentQAs = speedRoundCookie.currentQAs;
        totalQACount = speedRoundCookie.totalQACount;
        totalScore = speedRoundCookie.totalScore;
        pointScore = speedRoundCookie.pointScore;
        durationLeft = speedRoundCookie.durationLeft;
        personalhighscore = speedRoundCookie.personalhighscore,
            duration = durationLeft / 1000;
        activities = speedRoundCookie.activities;
        offlineData = speedRoundCookie.offlineData;
        round = speedRoundCookie.round;
    }
}

function postWith(url, data, callbackFunction) {
    if (isOnline()) {
        $.ajax({
            type: "POST",
            url: url,
            data: data,
            success: function (response) {
                if (typeof callbackFunction == 'function') {
                    callbackFunction.call(this, response);
                }
                return response;
            },
            error: function (err) {

                return 'error';
            }
        });
    } else {
        if (typeof callbackFunction == 'function') {
            callbackFunction.call(this, 'Offline');
        }
    }
}

function showLeaderBoard() {
    if (isOnline()) {
        var data = {
            activity_id: activityId,
            event_id: eventId,
            token: token
        };
        postWith("/activities-csc/gethighscores3", data, function (response) {

            if (response.trim() != 'null') {
                var top5 = $.parseJSON(response).slice(0, 5);
                $(".leaderboard.desktop").empty();
                var strdata = '';
                strdata = '<div class="counts"><h2>TOP 5</h2></div>';
                var arrkey = ['1ST', '2ND', '3RD', '4TH', '5TH'];

                $(".leaderboard").html(strdata);

                $.each(top5, function (key, userScore) {
                    var active = "";
                    var visible = "hidden";
                    if (key == 0) {
                        active = "active";
                        visible = "visible";
                    }

                    $(".leaderboard").append(
                        '<div class="counts ' + active + 'users user-' + key + '" ><label style="width:115px;"><font color="#FFF">' + arrkey[key] + ' | </font><font color="#FFF">' + userScore.score + '</font></label><br/><label class="name" style="color:#FFF !important;">' + userScore.user_name + '</label></div>');
                });


                if (top5.length > 0) {
                    totalhighscoreusers = top5.length;
                    var total = parseInt(totalhighscoreusers);
                    if (total < 5) {
                        for (var key = total; key < 5; key++) {

                            var active = "";
                            var visible = "hidden";
                            if (key == 0) {
                                active = "active";
                                visible = "visible";
                            }

                            $(".leaderboard").append(
                                '<div class="counts ' + active + ' users user-' + key + '" ><label style="width:115px;"><font color="#FFF">' + arrkey[key] + ' | </font><font color="#FFF">0</font></label><br/><label class="name" style="color:#FFF !important;"></label></div>'
                            );


                        }
                    }

                } else {

                    for (var key = 0; key < 5; key++) {

                        var active = "";
                        var visible = "hidden";
                        if (key == 0) {
                            active = "active";
                            visible = "visible";
                        }

                        $(".leaderboard").append(
                            '<div class="counts ' + active + ' users user-' + key + '" ><label style="width:115px;"><font color="#FFF">' + arrkey[key] + ' | </font><font color="#FFF">0</font></label><br/><label class="name" style="color:#FFF !important;"></label></div>'
                        );



                    }

                }

                setMobileHighScore();
            }
        });
    }
}


function rotateusers() {


    $('.mobile .users').removeClass('active');
    $('.mobile .user-' + counteruser).addClass('active');
    counteruser++;

    if (counteruser == 3 || parseInt(counteruser) == parseInt(totalhighscoreusers))
        counteruser = 0;
}

function setMobileHighScore() {

    var i = 1;

    setTimeout(function rotateusers() {
        $('.mobile .users').removeClass('active');
        $('.mobile .user-' + counteruser).addClass('active');
        counteruser++;


        if (counteruser == 5 || parseInt(counteruser) == parseInt(totalhighscoreusers))
            counteruser = 0;

        var d = new Date();
        // console.log(i+'--'+d);
        i++;
        setTimeout(rotateusers, 3000);

    }, 3000);
}

function showPersonalHighScore() {
    var data = {
        activity_id: activityId,
        user_id: userId,
        event_id: eventId,
        token: token
    };

    if (!speedRoundCookie) {
        postWith("/activities-csc/gethighscorebyuserid2", data, function (response) {

            if (response.trim() != '') {
                personalhighscore = response;
                $('.high-score').text(response);
            }
            else {
                personalhighscore = 0;
                $('.high-score').text(0);
            }
        });
    } else {

        personalhighscore = speedRoundCookie.personalhighscore;
        $('.high-score').text(personalhighscore || '0');

    }
}

function postScores(scores, callbackFunction) {
    var promises = [];
    $.each(scores, function (key, activity) {
        if (activity.questionId == 0) {
            return;
        }
        var data = {
            activity_id: activityId,
            event_id: eventId,
            user_id: userId,
            question_id: activity.questionId,
            answer_id: activity.answerId,
            answer_text: "",
            score: activity.score,
            round: round,
            token: token
        };
        var promise = $.ajax({
            type: "POST",
            url: '/activities/addactivitycompetition/',
            data: data,
            success: function () {
            },
            error: function (err) {

            }
        });

        promises.push(promise);
    });

    if (typeof callbackFunction == 'function') {
        $.when.apply(null, promises).done(function () {
            callbackFunction.call(this);
        });
    }
}

function showCongo() {

    //$("footer.support-footer").hide();

    $('.next_btn_st').hide();
    $('.next_btn_st').css('display', 'none');
    $('.question').empty();
    $('.answers').empty();
    $('.result').css('background', 'transparent');
    $('.result').html('');
    $('.question-side').hide();
    $('.congo-side').show();
    $('.start_btn').show();
    //alert(durationTimer);
    clearTimeout(durationTimer);
    //$('.counter').text(mins + ':' + twoDigits( secs ));

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }
    // console.log('previousDurationTimer', previousDurationTimer);
    // console.log('duration', duration);
    // console.log('durationLeft', durationLeft);
    // console.log('durationTimer', durationTimer);
    // console.log('pointScore', pointScore);
    // console.log('correctpoint', correctpoint);
    // console.log('totalQACount', totalQACount);
    // console.log('currentQAs.length', currentQAs.length);

    time = new Date(durationLeft);
    mins = time.getUTCMinutes();
    secs = time.getUTCSeconds();

    // console.log('mint: ', mins, 'seconds: ', secs);
    var remainingSeconds = (mins == 1 ? 60 : 0) + secs - 1
    // console.log('remainingSeconds', remainingSeconds)

    if (pointScore > 0) {
        var bonusScore = (pointScore / correctpoint / (totalQACount - currentQAs.length)) * 500;
        // var speedBonus = ((duration - (durationTimer - previousDurationTimer)) * 25);
        var speedBonus = remainingSeconds * 25;
        bonusScore = Math.round(bonusScore + speedBonus);
    }
    else {
        var bonusScore = 0;
    }



    // var bonusScore = (correctpoint / (totalQACount - currentQAs.length)).toFixed(2) * 500;
    // var  bonusScore = 0;
    totalScore = pointScore + bonusScore;
    $('.total-score').text(totalScore + ' Points');
    $('.correct-points').text(Math.round(bonusScore));
    var subsequent = window.localStorage.getItem("ltenSubsequent" + localvar);
    if (!subsequent) {
        var bonusActivity = {
            questionId: 0,
            answerId: 0,
            score: bonusScore,
            round: round
        };
        activities.push(bonusActivity);

        var flaghighscore = false;
        if (parseInt(totalScore) > parseInt(personalhighscore) && round < 4) {
            personalhighscore = totalScore;
            flaghighscore = true;
        }

        if (isOnline()) {
            postScores(activities, function () {
                showLeaderBoard();
                showPersonalHighScore();
            });
            if (flaghighscore) {
                if (round < 4) {
                    $.ajax({
                        type: "POST",
                        url: '/activities-csc/updateuserhighscore',
                        data: {
                            user_id: userId,
                            event_id: eventId,
                            activity_id: activityId,
                            question_id: 9999,
                            answer_id: 9999,
                            score: totalScore,
                            token: token
                        },
                        success: function (response) {
                            showLeaderBoard();
                            showPersonalHighScore();
                        },
                        error: function (err) {

                        }
                    });
                }
            }

        } else {
            offlineData.push(activities);
        }
    }
    else {
        if (parseInt(totalScore) > parseInt(personalhighscore))
            personalhighscore = totalScore;
    }

    saveCookies();
    window.localStorage.setItem("ltenSubsequent" + localvar, true);
    //  var downTimer = setInterval(function() {
    if (durationLeft < 1000) {
        // clearTimeout(downTimer);
        // return;
    } else {
        time = new Date(durationLeft -= 1000);
        mins = time.getUTCMinutes();
        secs = time.getUTCSeconds();
        $('.counter').text(mins + ':' + twoDigits(secs));
    }
    //}, 10);

    $('.app').css('background', 'url(./images/SR1_Congrats.png)');
    $('.total-score').text(totalScore + ' Points');
    $('.correct-answers').text(pointScore / correctpoint + '/' + (totalQACount - currentQAs.length));
    $('.correct-points').text(Math.round(bonusScore));
    $('.bonus-score').text(Math.round(bonusScore));
    $('.current-score').text(totalScore);


    if (round < 4) {
        $('.high-score').text(personalhighscore);
    }

    $('.support-footer').css('background-color', '#00bcff');

    $('.next_btn_st').hide();
    $('.next_btn_st').css({ 'display': 'none' });
    $('.next_btn_st').css('display', 'none');

    if (round == 3 || round > 3) {
        $("#again_btn").hide();
        $("#start_btn").hide();
    }

    // This function will call api for add completion
    // console.log('firstRoundDone: ', firstRoundDone)
    // console.log('round: ', round)
    if (!firstRoundDone && round == 1) {
        addCompletion();
    }

}

function countdown(elementName) {
    var element, endTime, mins, secs, msLeft, time;

    function twoDigits(n) {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer() {
        msLeft = endTime - (+new Date);
        durationLeft = msLeft;
        saveCookies();
        if (msLeft < 11000) {
            element.style.color = '#e2345f';
        }

        if (msLeft < 1000) {
            element.style.color = '#e2345f';
            element.innerHTML = "0:00";
            $('.next_btn_st').addClass('hide');
            // console.log('showCongo1')
            showCongo();
        } else {


            time = new Date(msLeft);
            mins = time.getUTCMinutes();
            secs = time.getUTCSeconds();
            element.innerHTML = mins + ':' + twoDigits(secs);
            durationTimer = setTimeout(updateTimer, time.getUTCMilliseconds() + 500);

        }

    }

    element = document.getElementById(elementName);
    endTime = (+new Date) + 1000 * duration;
    updateTimer();
}

function getQAs() {
    var activity = jQuery.parseJSON(activityJSON)[actname];

    var QAArray = [];
    $.each(activity, function (key, question) {
        if (key === 'ActivityInfo') {
            return;
        }
        if (typeof question[5] != 'undefined') {

            var answers = [];
            $.each(question[5][1].split('&&'), function (key, answerAndIds) {
                answers.push(answerAndIds.split('||'));
            });

            QAArray.push({
                id: question[0][1],
                question: question[2][1],
                answers: answers,
                correct: question[4][1]
            });
        }
    });
    totalQACount = QAArray.length;

    /**
     * Randomize questions and answers array
     */
    for (var i = QAArray.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = QAArray[i];
        QAArray[i] = QAArray[j];
        QAArray[j] = temp;
    }

    return QAArray;
}

function showQA(QA) {
    $('.question').empty();
    $('.answers').empty();
    $('.result').css('background', 'transparent');
    $('.result').html('');
    // $('.support-footer').css('background-image', 'linear-gradient(#085452,#085452)');
    $('.support-footer').css('background-color', '#00bcff');
    //$('.next_btn_st').show();

    if (QA) {
        //Next Question Button appearing before the question is answered
        // $('.next_btn_st').show();
        $('.question').html(QA.question);

        $.each(QA.answers, function (i, answer) {
            var index = String.fromCharCode('A'.charCodeAt(0) + i);
            $(".answers").append(
                "<p key='" + answer[0] + "' correct='" + QA.correct + "'><span>" + index + ".</span>" + answer[1] + "</p>"
            );
        });

    } else {
        $('.next_btn_st').hide();
        // console.log('showCongo2')
        showCongo()
    }
}

function goGame() {

    $('.question-side').show();
    $('.current-score').text(totalScore);
    $(".checkout-btn").remove();
    $('#start_btn').remove();

    $('#again_btn').hide();
    $('.congo-side').hide();
    $('.info-side').show();
    countdown("counter");

    var firstQA = currentQAs[0];
    showQA(firstQA);

}

function applyModuleColor() {

}

$(document).ready(function () {
    'use strict';
    _myScreenWidth = $('#ptest').width();
    applyModuleColor();


    var subsequent = window.localStorage.getItem("ltenSubsequent" + localvar);
    /* if (!subsequent) {
         window.localStorage.removeItem("ltenSubsequent" + localvar);
         window.localStorage.removeItem("bsr1SpeedRoundCookie" + localvar);
         window.localStorage.removeItem("ltenSpeedRoundCookie" + localvar);
     }
 */
    $(".hdreset").off('click').on('click', function () {

        window.localStorage.removeItem('ltenSpeedRoundCookie' + localvar);
        $.ajax({
            type: "POST",
            url: '/activities-csc/updateuserhighscore',
            data: {
                user_id: userId,
                event_id: eventId,
                activity_id: activityId,
                question_id: 9999,
                answer_id: 9999,
                score: 0
            },
            success: function (response) {
                window.location.href = "./speed-round.html";
            },
            error: function (err) {

            }
        });

    });


    $("#return-btn").click(function () {
        window.location.href = "../index.html";
    });

    showLeaderBoard();
    showPersonalHighScore();
    restoreCookies();
    firstRoundDone = round > 0 ? true : false;

    $('#start_btn').show();
    $('.info-side').show();
    $('.app').css('background-image', 'url(./images/SR1_Instructions.png)');
    if (speedRoundCookie) {
        $('.instruction-text').hide();
        goGame();

    }

    $(".start_btn").click(function () {

        durationLeft = 0;
        previousDurationTimer = durationTimer ? durationTimer : 0;

        $('.instruction-text').hide();
        var activityInfo = jQuery.parseJSON(window.localStorage.getItem("activity"))['ActivityInfo'];
        firstRoundDone = round > 0 ? true : false;
        round++;
        // console.log('round: ', round);
        window.localStorage.removeItem('ltenSubsequent' + localvar);

        pointScore = 0;
        totalScore = pointScore;
        if (activityId == 7) {
            duration = 60;
        } else {
            duration = 120;
        }

        currentQAs = getQAs();
        activities = [];

        $("#again_btn").hide();
        $('.next_btn_st').show();
        $('.next_btn_st').removeClass('hide');

        //Next Question Button appearing before the question is answered
        $('.next_btn_st').hide();
        goGame();
    });


    $(document).on('click', '.answers p', function () {
        if ($(this).hasClass('disabled')) {
            return false;
        }
        $(this).css('font-weight', 'bold');
        $(this).css('font-family', 'ProximaNovaBold');
        var answer = $(this).attr('key');
        var correctAnswer = $(this).attr('correct');

        var activity = {};
        if (answer === correctAnswer) {
            $(this).css('color', '#75be2f');

            $('.result').css('color', '#fff');

            // $('.support-footer').css('background-image', 'linear-gradient(#208262,#208262)');
            $('.support-footer').css('background-color', '#75be2f');
            $('.next_btn_st').addClass('enabled');
            //$('.result').css('background', 'url(./images/Buttons/Correct.png) no-repeat');
            $('.result').html('CORRECT')
            pointScore += correctpoint;
            totalScore = pointScore;
            $('.current-score').text(totalScore);

            activity['score'] = correctpoint;
        } else {

            $(this).css('color', '#d51111');

            $('p[key="' + correctAnswer + '"]').css('font-weight', 'bold');

            // $('.support-footer').css('background-image', 'linear-gradient(#cd0000,#cd0000)');
            $('.support-footer').css('background-color', '#d51111');
            $('p[key="' + correctAnswer + '"]').css('color', '#75be2f');
            $('p[key="' + correctAnswer + '"]').css('font-family', 'ProximaNovaBold');
            // $('.result').css('background', 'url(./images/Buttons/Incorrect.png) no-repeat');
            $('.result').html('INCORRECT');
            $('.result').css('color', '#fff');
            activity['score'] = 0;
        }
        $('.next_btn_st').removeClass('disabled');

        $('.answers p').css("pointer-events", "none");
        $('.answers p').addClass("disabled");
        //Next Question Button appearing before the question is answered
        $('.next_btn_st').show();

        var currentQA = currentQAs.shift();
        activity['questionId'] = currentQA.id;
        activity['answerId'] = answer;
        activity['round'] = round;
        activities.push(activity);

        saveCookies();
    });

    $(".next_btn_st").click(function () {
        if ($(this).hasClass('disabled'))
            return;

        var nextQA = currentQAs[0];
        showQA(nextQA);
        $('.next_btn_st').addClass('disabled');
        $('.next_btn_st').removeClass('enabled');
        //Next Question Button appearing before the question is answered
        $('.next_btn_st').hide();
        $('.answers p').css("pointer-events", "auto");
    });

    CheckOtherComponent();

});



function CheckOtherComponent() {
    console.log(_myScreenWidth);
    if (_myScreenWidth >= 3) {
        $("#header_img").attr("src", "images/Header_Desktop.png?v=" + Date.now());
    }
    else {
        $("#header_img").attr("src", "images/Header_Mobile.png?v=" + Date.now());
    }
}

function addCompletion() {
    var achievedMilestones = { "itemID": activityId, "type": "module", "completed": "true" };

    localStorage.setItem("achievedMilestones", JSON.stringify(achievedMilestones));

    // $.post("/completion/addCompletionBadge", { token: token, user_id: userId, item_id: activityId, event_id: eventId, item_type: 'module' }, function (data) {

    //     console.log(data);

    // });

    var completionData = {
        token: token,
        user_id: userId,
        event_id: eventId,
        item_id: activityId,
        item_type: 'module'
    }
    // console.log('completionData', completionData)

    $.ajax({
        type: "POST",
        url: '/completion/addcompletion',
        data: completionData,
        success: function (response) {
            console.log('response add completetion: ', response);
        },
        error: function (err) {
            console.log('response add completetion err: ', err);
        }
    });

}

function mobileCheck() {

    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

var _myScreenWidth = 0;
$(window).resize(function () {
    activityTitle();
    var _tempmyScreenWidth = $('#ptest').width();
    if (_tempmyScreenWidth != _myScreenWidth) {
        _myScreenWidth = _tempmyScreenWidth;
        CheckOtherComponent();
    }
});
