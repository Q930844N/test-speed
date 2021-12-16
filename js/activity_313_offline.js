function isOnline() {
    var isOnline;
    if (navigator.onLine) {
        isOnline = true;
    } else {
        isOnline = false;
    }
    return isOnline;
}

function submitOfflineData(offlineData, callbackFunction) {
    if(offlineData.length && typeof callbackFunction == 'function')
    {
        if (isOnline()) {
            $.each(offlineData, function( key, data ) {
                callbackFunction.call(this, data);
            });
            var speedRoundCookie = jQuery.parseJSON(window.localStorage.getItem("bsr1SpeedRoundCookie" + localvar));
            if (speedRoundCookie.offlineCompletion) {
                speedRoundCookie.offlineCompletion = false;
                window.localStorage.setItem("bsr1SpeedRoundCookie" + localvar, JSON.stringify(speedRoundCookie));
                $.ajax({
                    type: "POST",
                    url: '/completion/addcompletion',
                    data: {
                        user_id: userId,
                        event_id: eventId,
                        item_id: 2,
                        item_type: "module"
                    },
                    success: function() {},
                    error: function() {}
                });
            }
        }
    }
}