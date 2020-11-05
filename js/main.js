var ics = function(e, t) {
    "use strict"; {
        if (!(navigator.userAgent.indexOf("MSIE") > -1 && -1 == navigator.userAgent.indexOf("MSIE 10"))) {
            void 0 === e && (e = "default"), void 0 === t && (t = "Calendar");
            var r = -1 !== navigator.appVersion.indexOf("Win") ? "\r\n" : "\n",
                n = [],
                i = ["BEGIN:VCALENDAR", "PRODID:" + t, "VERSION:2.0"].join(r),
                o = r + "END:VCALENDAR",
                a = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
            return {
                events: function() {
                    return n
                },
                calendar: function() {
                    return i + r + n.join(r) + o
                },
                addEvent: function(t, i, o, l, u, s) {
                    if (void 0 === t || void 0 === i || void 0 === o || void 0 === l || void 0 === u) return !1;
                    if (s && !s.rrule) {
                        if ("YEARLY" !== s.freq && "MONTHLY" !== s.freq && "WEEKLY" !== s.freq && "DAILY" !== s.freq) throw "Recurrence rrule frequency must be provided and be one of the following: 'YEARLY', 'MONTHLY', 'WEEKLY', or 'DAILY'";
                        if (s.until && isNaN(Date.parse(s.until))) throw "Recurrence rrule 'until' must be a valid date string";
                        if (s.interval && isNaN(parseInt(s.interval))) throw "Recurrence rrule 'interval' must be an integer";
                        if (s.count && isNaN(parseInt(s.count))) throw "Recurrence rrule 'count' must be an integer";
                        if (void 0 !== s.byday) {
                            if ("[object Array]" !== Object.prototype.toString.call(s.byday)) throw "Recurrence rrule 'byday' must be an array";
                            if (s.byday.length > 7) throw "Recurrence rrule 'byday' array must not be longer than the 7 days in a week";
                            s.byday = s.byday.filter(function(e, t) {
                                return s.byday.indexOf(e) == t
                            });
                            for (var c in s.byday)
                                if (a.indexOf(s.byday[c]) < 0) throw "Recurrence rrule 'byday' values must include only the following: 'SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'"
                        }
                    }
                    var g = new Date(l),
                        d = new Date(u),
                        f = new Date,
                        S = ("0000" + g.getFullYear().toString()).slice(-4),
                        E = ("00" + (g.getMonth() + 1).toString()).slice(-2),
                        v = ("00" + g.getDate().toString()).slice(-2),
                        y = ("00" + g.getHours().toString()).slice(-2),
                        A = ("00" + g.getMinutes().toString()).slice(-2),
                        T = ("00" + g.getSeconds().toString()).slice(-2),
                        b = ("0000" + d.getFullYear().toString()).slice(-4),
                        D = ("00" + (d.getMonth() + 1).toString()).slice(-2),
                        N = ("00" + d.getDate().toString()).slice(-2),
                        h = ("00" + d.getHours().toString()).slice(-2),
                        I = ("00" + d.getMinutes().toString()).slice(-2),
                        R = ("00" + d.getMinutes().toString()).slice(-2),
                        M = ("0000" + f.getFullYear().toString()).slice(-4),
                        w = ("00" + (f.getMonth() + 1).toString()).slice(-2),
                        L = ("00" + f.getDate().toString()).slice(-2),
                        O = ("00" + f.getHours().toString()).slice(-2),
                        p = ("00" + f.getMinutes().toString()).slice(-2),
                        Y = ("00" + f.getMinutes().toString()).slice(-2),
                        U = "",
                        V = "";
                    y + A + T + h + I + R != 0 && (U = "T" + y + A + T, V = "T" + h + I + R);
                    var B, C = S + E + v + U,
                        j = b + D + N + V,
                        m = M + w + L + ("T" + O + p + Y);
                    if (s)
                        if (s.rrule) B = s.rrule;
                        else {
                            if (B = "rrule:FREQ=" + s.freq, s.until) {
                                var x = new Date(Date.parse(s.until)).toISOString();
                                B += ";UNTIL=" + x.substring(0, x.length - 13).replace(/[-]/g, "") + "000000Z"
                            }
                            s.interval && (B += ";INTERVAL=" + s.interval), s.count && (B += ";COUNT=" + s.count), s.byday && s.byday.length > 0 && (B += ";BYDAY=" + s.byday.join(","))
                        }(new Date). toISOString();
                    var H = ["BEGIN:VEVENT", "UID:" + n.length + "@" + e, "CLASS:PUBLIC", "DESCRIPTION:" + i, "DTSTAMP;VALUE=DATE-TIME:" + m, "DTSTART;VALUE=DATE-TIME:" + C, "DTEND;VALUE=DATE-TIME:" + j, "LOCATION:" + o, "SUMMARY;LANGUAGE=en-us:" + t, "TRANSP:TRANSPARENT", "END:VEVENT"];
                    return B && H.splice(4, 0, B), H = H.join(r), n.push(H), H
                },
                download: function(e, t) {
                    if (n.length < 1) return !1;
                    t = void 0 !== t ? t : ".ics", e = void 0 !== e ? e : "calendar";
                    var a, l = i + r + n.join(r) + o;
                    // downloadFile({
                    //     filename: e+t,
                    //     content: l
                    // })
                    // // var blob = new Blob([ options.content ], {type : "text/x-vCalendar;charset=" + document.characterSet});
                    var blob = new Blob([ l ], {type : "text/x-vCalendar;charset=" + document.characterSet});

                    chrome.downloads.download({
                        url: window.URL.createObjectURL(blob),
                        filename: e + t
                    })
                    //return saveAs(a, e + t), l
                },
                build: function() {
                    return !(n.length < 1) && i + r + n.join(r) + o
                }
            }
        }
        console.log("Unsupported Browser")
    }
};

var expressions = [
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2}, [0-9]{4} [0-9]{1,2}:[0-9]{1,2} (AM|PM) [A-Z]{2,3}/g,
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2}, [0-9]{2,4}/g,
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2},[0-9]{2,4}/g,
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2} - [0-9]{1,2}, [0-9]{2,4}/g,
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2}-[0-9]{1,2}/g,
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2} - [0-9]{1,2}/g,
    /\s*[0-9]{1,2}[\/][0-9]{1,2}[\/][0-9]{2,4}/g,
    /\s*(Jan(uary)?|Feb(ruary)?|Mar(ch)?|Apr(il)?|May|Jun(e)?|Jul(y)?|Aug(ust)?|Sep(tember)?|Oct(ober)?|Nov(ember)?|Dec(ember)?) [0-9]{1,2}, [0-9]{1,2}:[0-9]{1,2} (AM|PM)?( [A-Z]{2,3})?/g
]
var formates = [
    ['MMMM DD, YYYY hh:mm A',true], 
    ['MMMM DD, YYYY',true], 
    ['MMMM DD,YYYY',true], 
    ['MMMM DD - DD, YYYY',false,1], 
    ['MMMM DD-DD',false,2], 
    ['MMMM DD - DD',false,3], 
    ['DD/MM/YYYY',true],
    ['MMM DD, hh:mm A z',true]
]
var title;
var html;
var activeTabURL;
var extractedText;
var eventDates = [];
var outputFormat = 'MMM DD, YYYY hh:mma';
$(document).ready(function(){
    const blob = new Blob(['test'], { type: 'text/plain' });
    chrome.tabs.captureVisibleTab(function(screenshotUrl) {
        let image = document.getElementById('image');
        image.src = screenshotUrl
        image.crossOrigin = "Anonymous";

        const startOCR = async () => {
            //const image = document.getElementById('image');
            const result = document.getElementById('result');
            const { createWorker } = Tesseract;
            const worker = createWorker({
                workerPath: chrome.runtime.getURL('js/worker.min.js'),
                langPath: chrome.runtime.getURL('traineddata'),
                corePath: chrome.runtime.getURL('js/tesseract-core.wasm.js'),
                logger: m => {
                    $("#result").show();
                    $("#result").find("#progress").val(m.progress);
                    $("#result").find("#message").html(m.status);
                }
            });
          
            await worker.load();
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data: { text } } = await worker.recognize(image);
            console.log(text)
            $("#result").hide();
            var ocrText = text;
            extractedText = text;
            $.each(expressions,function(index,expression){
                var res =ocrText.match(expression);
                if(res){
                    $.each(res,function(i,val){
                        ocrText = ocrText.replace(val,"");
                        eventDates.push(convertToDate(formates[index],val));
                    });
                }
            });

            $("#output").show();
            $("#subject").html(title)
            $.each(eventDates,function(i,date){
                var eventType = "Full Day";
                if(date.length > 1){
                    eventType = "Regular";
                }
                $("table tbody").append("<tr><td>"+date.join(" to ")+"</td><td><a target='_blank' href='#' id='createEventGoogle' data-index='"+i+"'>Google</a> | <span target='_blank' href='#' id='createEventOutlook' data-index='"+i+"' style='color: #007bff;cursor:pointer'>Outlook</span></td></tr>");
                $("#createEventGoogle[data-index='"+i+"']").click(function(){
                    chrome.tabs.create({ url: openCreateEvent(i) });
                });
                $("#createEventOutlook[data-index='"+i+"']").click(function(){
                    var details = "URL:" + activeTabURL;
                    var dates = eventDates[i];
                    cal = ics();
                    if(dates.length == 1){
                        var from = moment(dates[0],outputFormat).format("MM/DD/YYYY hh:mm a");
                        var to = moment(dates[0],outputFormat).add(1, 'hours').format("MM/DD/YYYY hh:mm a");
                        cal.addEvent(title, details, '', from, to);
                    }else if(dates.length == 2){
                        var from = moment(dates[0],outputFormat).format("MM/DD/YYYY hh:mm a");
                        var to = moment(dates[1],outputFormat).format("MM/DD/YYYY hh:mm a");
                        cal.addEvent(title, details, '', from, to);
                    }
                    cal.download(title);
                });
            });
            await worker.terminate();
        }

        image.onload = startOCR
    });
});
chrome.tabs.query({active: true}, function(tabs) {
    var tab = tabs[0];
    activeTabURL = tab.url;
    title = tab.title;
    console.log(tab)
    chrome.tabs.executeScript(tab.id, {
        code: 'document.querySelector("body").innerHTML'
    }, display_h1);
});
function display_h1 (results){
    var html = results;
}
function convertToDate(format,date){
    date = date.trim();
    if(format[1]){
        return [moment(date,format[0]).format(outputFormat)];
    }else{
        if(format[2] == 1){
            var stdFormat = 'MMMM DD,YYYY hh:mm A'
            var parts = date.split(/\W+/);
            var from = parts[0]+" "+parts[1]+","+parts[3]+" 08:00 AM";
            var to = parts[0]+" "+parts[2]+","+parts[3]+" 05:00 PM";
            return [moment(from,stdFormat).format(outputFormat),moment(to,stdFormat).format(outputFormat)]
        }else if(format[2] == 2 || format[2] == 3){
            var stdFormat = 'MMMM DD hh:mm A'
            var parts = date.split(/\W+/);
            var from = parts[0]+" "+parts[1]+" 08:00 AM";
            var to = parts[0]+" "+parts[2]+" 05:00 PM";
            return [moment(from,stdFormat).format(outputFormat),moment(to,stdFormat).format(outputFormat)]
        }
    }
}

function getSubject(para,word){
    const regex = "/[^.\n]*"+word+"[^.\n]*/igm";
    
    // The substituted value will be contained in the result variable
    const result = para.match(regex);
    console.log(result)
    if(result){
        return result[0];
    }else return para;

}

function openCreateEvent(i){
    var dates = eventDates[i];
    var details = "URL:" + activeTabURL;
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    var url = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title);
    if(dates.length == 1){
        var from = moment(dates[0],outputFormat).format("YYYYMMDDTHHmmss");
        var to = moment(dates[0],outputFormat).add(1, 'hours').format("YYYYMMDDTHHmmss");
        url = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&details="+details+"&dates="+from+"/"+to+"&ctz="+tz;
    }else if(dates.length == 2){
        var from = moment(dates[0],outputFormat).format("YYYYMMDDTHHmmss");
        var to = moment(dates[1],outputFormat).format("YYYYMMDDTHHmmss");
        url = "https://www.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(title)+"&details="+details+"&dates="+from+"/"+to+"&ctz="+tz;
    }
    console.log(url);
    return (url);
}
function openURL(newURL){
    chrome.browserAction.onClicked.addListener(function(activeTab){
      chrome.tabs.create({ url: newURL });
    });
}