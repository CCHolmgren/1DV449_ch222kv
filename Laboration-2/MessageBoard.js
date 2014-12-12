var docCookies = {
    getItem: function (sKey) {
        if (!sKey) { return null; }
        return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
    },
    setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
        if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
        var sExpires = "";
        if (vEnd) {
            switch (vEnd.constructor) {
                case Number:
                    sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
                    break;
                case String:
                    sExpires = "; expires=" + vEnd;
                    break;
                case Date:
                    sExpires = "; expires=" + vEnd.toUTCString();
                    break;
            }
        }
        document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        return true;
    },
    removeItem: function (sKey, sPath, sDomain) {
        if (!this.hasItem(sKey)) { return false; }
        document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
        return true;
    },
    hasItem: function (sKey) {
        if (!sKey) { return false; }
        return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
    },
    keys: function () {
        var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
        for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
        return aKeys;
    }
};
var MessageBoard = {

    messages: [],
    textField: null,
    messageArea: null,
    lastSeen: docCookies.getItem("lastSeen"),

    init: function (e) {

        MessageBoard.textField = $("#inputText");
        MessageBoard.nameField = $("#inputName");
        MessageBoard.messageArea = $("#messagearea");
        console.log(MessageBoard.textField);
        console.log(MessageBoard.nameField);
        console.log(MessageBoard.messageArea);

        // Add eventhandlers
        document.getElementById("inputText").onfocus = function (e) {
            this.className = "focus";
        }
        document.getElementById("inputText").onblur = function (e) {
            this.className = "blur"
        }
        document.getElementById("buttonSend").onclick = function (e) {
            MessageBoard.sendMessage();
            return false;
        }
        document.getElementById("buttonLogout").onclick = function (e) {
            MessageBoard.logout();
            return false;
        }

        MessageBoard.textField.onkeypress = function (e) {
            if (!e) var e = window.event;

            if (e.keyCode == 13 && !e.shiftKey) {
                MessageBoard.sendMessage();

                return false;
            }
        }

    },
    getMessages: function () {
        console.log("INNE");
        $.ajax({
            dataType:"json",
            type: "GET",
            async: true,
            url: "functions.php",
            timeout:50000,
            data: {function: "getMessages", lastSeen: MessageBoard.lastSeen || 0},
            success: function(data){
                console.log(data);
                //data = JSON.parse(data);
                for (var mess in data) {
                    MessageBoard.lastSeen = data[mess]["serial"];
                    docCookies.setItem("lastSeen", MessageBoard.lastSeen, 0);
                    console.log(MessageBoard.lastSeen);
                    var obj = data[mess];
                    var text = obj.name + " said:\n" + obj.message;
                    var mess = new Message(text, new Date());
                    var messageID = MessageBoard.messages.push(mess) - 1;
                    console.log(MessageBoard.messages);
                    MessageBoard.renderMessage(messageID);
                }
                document.getElementById("nrOfMessages").innerHTML = MessageBoard.messages.length;
                setTimeout(MessageBoard.getMessages, 200);
            },
            error: function(jqXHR, textStatus, errorThrown){
                //alert("error" + textStatus + errorThrown);
                setTimeout(MessageBoard.getMessages, 2000);
            }
        });/*.done(function (data) { // called when the AJAX call is ready
            console.log(data);
            //data = JSON.parse(data);
            for (var mess in data) {
                MessageBoard.lastSeen = data[mess]["serial"];
                console.log(MessageBoard.lastSeen);
                var obj = data[mess];
                var text = obj.name + " said:\n" + obj.message;
                var mess = new Message(text, new Date());
                var messageID = MessageBoard.messages.push(mess) - 1;
                console.log(MessageBoard.messages);
                MessageBoard.renderMessage(messageID);

            }
            document.getElementById("nrOfMessages").innerHTML = MessageBoard.messages.length;

        });*/
    },
    sendMessage: function () {

        if (MessageBoard.textField.value == "") return;

        // Make call to ajax
        $.ajax({
            type: "POST",
            url: "functions.php",
            data: {"function":"add","name":MessageBoard.nameField[0].value, "message":MessageBoard.textField[0].value, "csrf_token":document.getElementById("csrf_token").value},
            success: function(msg, textstatus, jqXHR){
                console.log(MessageBoard.nameField);
                console.log(MessageBoard);
            },
            error: function(msg, textStatus, errorThrown){
                alert("The message was not saved because of a " + errorThrown + " error.");
                console.log(msg, textStatus, errorThrown);
            }
        }).done(function (data) {
            MessageBoard.nameField[0].value = "";
            MessageBoard.textField[0].value = "";
            //alert(data);
            /*$("#messagearea").prepend('<div class="message">' +
                '<a href="#" class="clock">' + '</a>' +
                '<p>'+MessageBoard.nameField.value+' said:<br>'+MessageBoard.textField.value+'</p>' +
                '<span>13:41:01</span>' +
                '<span class="clear"></span>' +
            '</div>');*/
            //alert("Your message is saved! Reload the page for watching it");
        });

    },
    renderMessages: function () {
        // Remove all messages
        MessageBoard.messageArea.innerHTML = "";

        // Renders all messages.
        for (var i = 0; i < MessageBoard.messages.length; ++i) {
            MessageBoard.renderMessage(i);
            MessageBoard.lastSeen = i;
        }

        document.getElementById("nrOfMessages").innerHTML = MessageBoard.messages.length;
    },
    renderMessage: function (messageID) {
        // Message div
        var div = document.createElement("div");
        div.className = "message";

        // Clock button
        aTag = document.createElement("a");
        aTag.href = "#";
        aTag.classList.add("clock");
        aTag.onclick = function () {
            MessageBoard.showTime(messageID);
            return false;
        }

        //var imgClock = document.createElement("img");
        //imgClock.src = "pic/clock.png";
        //imgClock.alt = "Show creation time";

        //aTag.appendChild(imgClock);
        div.appendChild(aTag);

        // Message text
        var text = document.createElement("p");
        text.innerHTML = MessageBoard.messages[messageID].getHTMLText();
        div.appendChild(text);

        // Time - Should fix on server!
        var spanDate = document.createElement("span");
        spanDate.appendChild(document.createTextNode(MessageBoard.messages[messageID].getDateText()))

        div.appendChild(spanDate);

        var spanClear = document.createElement("span");
        spanClear.className = "clear";

        div.appendChild(spanClear);

        //MessageBoard.messageArea.appendChild();
        MessageBoard.messageArea.prepend(div)
    },
    removeMessage: function (messageID) {
        if (window.confirm("Vill du verkligen radera meddelandet?")) {

            MessageBoard.messages.splice(messageID, 1); // Removes the message from the array.

            MessageBoard.renderMessages();
        }
    },
    showTime: function (messageID) {

        var time = MessageBoard.messages[messageID].getDate();

        var showTime = "Created " + time.toLocaleDateString() + " at " + time.toLocaleTimeString();

        alert(showTime);
    },
    logout: function () {
        window.location = "index.php";
    }
}
