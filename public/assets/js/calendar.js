

$(document).ready(function () {

    
    var date = new Date();
    var d = date.getDay();
    var m = date.getMonth();
    var y = date.getFullYear();
    console.log(date);

    function createPillEvents(pillObj) {

        function createOneDayOfEvents(eventDate, freq, freqInterval, startTime, pillName) {
            let duration = (freq * freqInterval);

            let endTime = startTime + duration;

            for (var i = 0; i <= duration; i + freqInterval) {
                let eventTime = startTime + i;

                createEvent(eventDate, eventTime, pillName);
            }
        };

        for (var i = 0; i <= daysOfEventsCreated; i++) {
            let splitArray= pillObj.dateCreated.split("-");
            let dayWithTime = array[2];
            let anotherArray = dayWithTime.split("T");
            let newDay = parseInt(anotherArray[0]) + i;
            anotherArray.splice(0, 1, newDay);
            let rebuiltDayTime = anotherArray.join("");
            splitArray.splice(2, 1, rebuiltDayTime);
            let newDateSting = splitArray.join("-");
            let eventDate = newDateSting;

            createOneDayOfEvents(eventDate, pillObj.freq, pillObj.freqInterval, pillObj.timeStarted, pillObj.name);
        }

        // This is intended to increment one day based upon the date created
    }

    // for (var pill in resp){

    //     //pass the "pill" (which is an object containing all our info) to our function we defined above

    //     createPillEvents(pill)

    //     //and now we are done!

    // }; 
    
    
    // ^^^ do we need to push the events into the events array within this function?



    // page is now ready, initialize the calendar...

    var calendarObject = {
        url: "#",
        // themeSystem: "jquery-ui",
        color: 'black',     // an option!
        textColor: 'orange', // an option!
        backgroundColor: "red",
        selectable: true,
        editable: true,
        contentHeight: 200,
        noEventDefault: "No Pills Scheduled",
        header: {
            left: "prev, next, today",
            center: 'addEventButton',
            right: "listDay,month"
        },
        defaultView: "listDay",
        views: {
            month: { // name of view
                titleFormat: 'MMMM YYYY'
                // other view-specific options here
            },
            day: {
            }
        },
        events: [],
    }

    //this is the function that will sit at the center of your big function. you will create events and push them into calendarObject.events
    calendarObject.events.push(
        {
            title: 'Test',
            // start: new Date(y, m, 23, 18, 30),
            start: '2018-11-24T12:40:00',
            dosage: "200 mg",
            quantity: "2",
            allDay: false
        }
    );
    //this is just a second example here
    calendarObject.events.push(
        {
            title: 'Viagra',
            start: '2018-11-24T12:52:00',
            dosage: "200 mg",
            quantity: "2",
            allDay: false // will make the time show
        }
    );


    $(document).ready(function () {
        //this is the function that you trigger to render your calendars. pass it your fully built calendar object and your good to go
        $('#calendar').fullCalendar(calendarObject);
    })

});




$(document).ready(function () {
    $.ajax({
        method: "GET",
        url: '/api/user_pills',
        dataType: 'json',
        data: {
            // our hypothetical feed requires UNIX timestamps
            start: start.unix(),
            end: end.unix()
        }
        ,
        success: function (doc) {
            var events = [];
            $(doc).find('event').each(function () {
                events.push({
                    title: $(this).attr('title'),
                    start: $(this).attr('start') // will be parsed
                });
            });
            callback(events);
        }
    }).then(function (resp) {
        console.log(resp)
    });
});
        // $(document).ready(function () {
//     var date = new Date();
//     var d = date.getDay();
//     var m = date.getMonth();
//     var y = date.getFullYear();

//     function createPillEvents(pillObj) {

    //         function createOneDayOfEvents(eventDaqte, freq, freqInterval, startTime, pillName) {
        //             let duration = (freq * freqInterval);

        //             let endTime = startTime + duration;

        //             for(var i = 0; i <= duration; i + freqInterval) {
            //                 let eventTime = startTime + i;

            //                 createEvent(eventDate, eventTime, pillName)
            //             }
            //         }
            //     }


            //     $(".submitButton").on("click", function() {
                //         $.ajax({
                    //             method: "GET",
                    //             url: '/api/user_pills',
//             dataType: 'json',
//             data: {
    //                 // our hypothetical feed requires UNIX timestamps
    //                 start: start.unix(),
//                 end: end.unix()
//             }
//             ,
//             success: function (doc) {
//                 var events = [];
//                 $(doc).find('event').each(function () {
//                     events.push({
//                         title: $(this).attr('title'),
//                         start: $(this).attr('start') // will be parsed
//                     });
//                 });
//                 callback(events);
//             }
//         }).then(function(resp) {
//             console.log(resp)
//         });
//     });


//     // page is now ready, initialize the calendar...

//     $('#calendar').fullCalendar({
//         url: "#",
//         // themeSystem: "jquery-ui",
//         color: 'black',     // an option!
//         textColor: 'orange', // an option!
//         backgroundColor: "red",
//         selectable: true,
//         editable: true,
//         contentHeight: 200,
//         noEventDefault: "No Pills Scheduled",
//         header: {
//             left: "prev, next, today",
//             center: 'addEventButton',
//             right: "listDay,month"
//         },
//         customButtons: {
//             addEventButton: {
//                 text: 'Add a Pill',
//                 textColor: 'orange',
//                 click: function () {
//                     var dateStr = prompt('Enter a date in YYYY-MM-DD format');
//                     var date = moment(dateStr);

//                     if (date.isValid()) {
//                         $('#calendar').fullCalendar('renderEvent', {
//                             title: 'dynamic event', //Name of pill
//                             start: date, //date provided by user, in unix
//                             allDay: false
//                         });
//                         alert('Great. Now, update your database...');
//                     } else {
//                         alert('Invalid date.');
//                     }
//                 }
//             }
//         },
//         // buttons for switching between views
//         defaultView: "listDay",
//         views: {
//             month: { // name of view
//                 titleFormat: 'MMMM YYYY'
//                 // other view-specific options here
//             },
//             day: {

//             }
//         },

//         events: function (start, end, timezone, callback) {

//         },

//         events: [

//             {
//                 title: 'Test',
//                 // start: new Date(y, m, 23, 18, 30),
//                 start: '2018-11-20T12:40:00',
//                 dosage: "200 mg",
//                 quantity: "2",
//                 allDay: false
//             },
//             {
//                 title: 'Flonase',
//                 start: '2018-11-20T12:30:00',
//                 dosage: "200 mg",
//                 quantity: "2",
//                 allDay: false
//             },
//             {
//                 title: 'Viagra',
//                 start: '2018-11-20T12:52:00',
//                 dosage: "200 mg",
//                 quantity: "2",
//                 allDay: false // will make the time show
//             },
//             {
//                 title: 'Viagra',
//                 start: '2018-11-23T12:52:00',
//                 dosage: "200 mg",
//                 quantity: "2",
//                 allDay: false // will make the time show
//             },
//             {
//                 title: 'Viagra',
//                 start: '2018-11-24T12:52:00',
//                 dosage: "200 mg",
//                 quantity: "2",
//                 allDay: false // will make the time show
//             },
//             {
//                 title: 'Viagra',
//                 start: '2018-11-25T12:52:00',
//                 dosage: "200 mg",
//                 quantity: "2",
//                 allDay: false // will make the time show
//             }
//         ],
//         // eventRender: function (event, element) {
//         //     element.qtip({
//         //         content: event.description
//         //     });
//         // }

//     });
// });