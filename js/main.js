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
var url;
var extractedText;
var eventDates = [];
var outputFormat = 'DD/MM/YYYY hh:mm A';
$(document).ready(function(){
    $("#start-btn").click(function(){
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
                    $("table tbody").append("<tr><td>"+date.join(" to ")+"</td><td><a target='_blank' href='"+openCreateEvent(i)+"'>Create Event</a></td></tr>");
                });
                await worker.terminate();
            }

            image.onload = startOCR
        });

    });
});
chrome.tabs.query({active: true}, function(tabs) {
    var tab = tabs[0];
    url = tab.url;
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
        if(format[2] == 1 || format[2] == 3){
            var stdFormat = 'MMMM DD,YYYY'
            var parts = date.split("/[\s,]+/");
            var from = parts[0]+" "+parts[1]+","+parts[3];
            var to = parts[0]+" "+parts[2]+","+parts[3];
            return [moment(from,stdFormat).format(outputFormat),moment(to,stdFormat).format(outputFormat)]
        }else if(format[2] == 2){
            var stdFormat = 'MMMM DD'
            var parts = date.split("/[\s,]+/");
            var from = parts[0]+" "+parts[1];
            var to = parts[0]+" "+parts[2];
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
    var details = "URL:" + url;
    var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if(dates.length == 1){
        var from = moment(dates[0],outputFormat).format("YYYYMMDDThhmmss");
        var to = moment(dates[0],outputFormat).add(1, 'hours').format("YYYYMMDDThhmmss");
        return "https://www.google.com/calendar/render?action=TEMPLATE&text="+title+"&details="+details+"&dates="+from+"/"+to+"&ctz="+tz;
    }else if(dates.length == 2){
        var from = moment(dates[0],outputFormat).format("YYYYMMDDThhmmss");
        var to = moment(dates[1],outputFormat).format("YYYYMMDDThhmmss");
        return "https://www.google.com/calendar/render?action=TEMPLATE&text="+title+"&details="+details+"&dates="+from+"/"+to+"&ctz="+tz;
    }else{
        return "https://www.google.com/calendar/render?action=TEMPLATE&text="+title;
    }

}
function openURL(newURL){
    chrome.browserAction.onClicked.addListener(function(activeTab){
      chrome.tabs.create({ url: newURL });
    });
}