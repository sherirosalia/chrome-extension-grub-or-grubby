// document.querySelector('img[src*="stars"]').parentElement.parentElement.append('hi there')
// <meta itemprop="name" content="Tang Huo Kung Fu Spicy Hot Pot">
// document.querySelector('img[src*="stars"]').parentElement.parentElement.insertAdjacentHTML("beforebegin", '<h3 style="color:blue">hi there</h3>');

// let name=document.querySelector('meta[itemprop="name"]:not(#sitename)').content;
let name = document.querySelector('[class*="heading--inline"]').textContent;
let url=document.querySelector('img[src*="maps.googleapis.com/"]').src;
let coords = new URLSearchParams(url).get('center');
let coordinates= coords.split(',');
// console.log(name, coordinates)


// let query_url = "https://data.lacounty.gov/resource/6ni6-h5kp.json?$where=within_circle(geocoded_column,34.061791,-118.290424,50)&$q=subway";
let query_url = "https://data.lacounty.gov/resource/6ni6-h5kp.json?$where=within_circle(geocoded_column,"+ coords +",100)&$q=" + encodeURIComponent(name) +"&$order=activity_date DESC";
console.log(query_url)

var xhr = new XMLHttpRequest();

xhr.onreadystatechange = inspectionsReady
// xhr.onreadystatechange = handleStateChange; // Implemented elsewhere.
xhr.open("GET", query_url, true);
xhr.send();
// document.querySelector('img[src*="stars"]').parentElement.parentElement.insertAdjacentHTML(
//     "beforebegin", '<div>' + 
//     '<h3 style="color:blue">hi there</h3>' + 
//     '<p>' + name + '</p>' +
//     '<p>' + coordinates + '</p>' 
//     + '</div>'   
// );

function inspectionsReady() {
    if (this.readyState == 4 && this.status == 200) {
       // Typical action to be performed when the document is ready:
    //    document.getElementById("demo").innerHTML = xhttp.responseText;
    // console.log(JSON.parse(xhr.responseText)[0]['serial_number'])
    inspectionsList=JSON.parse(xhr.responseText)
    if (inspectionsList.length==0){

        document.querySelector('img[src*="stars"]').parentElement.parentElement.insertAdjacentHTML(
            "beforebegin", '<div>' + 
            '<h3 style="color:blue">No Inspections Found</h3>' 
            + '</div>'   
        );


    } else {
        let serialNumber = JSON.parse(xhr.responseText)[0]['serial_number'];
        longDate = JSON.parse(xhr.responseText)[0]['activity_date'];
        inspectionDate=longDate.substring(0,longDate.indexOf('T'))
        let violationURL = "https://data.lacounty.gov/resource/8jyd-4pv9.json?serial_number=" + serialNumber;
    
        var vioRequest = new XMLHttpRequest();
        // avoiding pyramid of doom and defining function 'vioReady' outside.
        // chose to put put xmlhttprequest before calling 'vioReady' and 'send' after
        // for best practice to avoid a "race condition" (give js all the info it needs to know in order to get
        // task finished before it actually has to do the task)
        vioRequest.onreadystatechange = vioReady

        vioRequest.open("GET", violationURL, true);
        vioRequest.send();

     } //end of else statement
        
    }
};

function vioReady (){

    if (this.readyState == 4 && this.status == 200){
        let violationsList = JSON.parse(this.responseText);
        let listOfCodes = []
            for (x of violationsList) {
                listOfCodes.push(x['violation_code']);
            }
            //statement in case no violations found
            if(listOfCodes.length==0){
                document.querySelector('img[src*="stars"]').parentElement.parentElement.insertAdjacentHTML(
                    "beforebegin", '<div>' + 
                    '<h3 style="color:blue">No violations on last inspection</h3>' +                     
                    '<p> Inspection Date: '+ inspectionDate + '</p>' +
                    '</div>'   
                );

            } else{

            document.querySelector('img[src*="stars"]').parentElement.parentElement.insertAdjacentHTML(
                "beforebegin", '<div>' + 
                '<h3 style="color:blue">Violation Codes for This Restaurant</h3>' + 
                '<p>' + listOfCodes + '</p>' 
                
                + '<p> <a href="http://publichealth.lacounty.gov/eh/docs/RefGuideFoodInspectionReport.pdf">Violation Codes Document</a> </p>' +
                 '<p> Inspection Date: '+ inspectionDate + '</p>' +
                '</div>'   
            );

            } //end of else statement

        
    }

    

};