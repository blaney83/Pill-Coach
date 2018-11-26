

function createPillEvents(pillObj) {
    console.log(pillObj)

    let eventsPromise = new Promise(function (resolve, reject) {
        let eventsArr = [];
        console.log("this is inside the object" + pillObj)
        let daysOfEventsCreated = pillObj.quantity / pillObj.frequency_amount;

        for (var i = 0; i <= daysOfEventsCreated; i++) {
            console.log("this is firing" + pillObj)
            let missingT = pillObj.initial_time.split(" ");
            let fullCalFormat = missingT.join("T")
            let splitArray = fullCalFormat.split("-");
            let dayWithTime = splitArray[2];
            let anotherArray = dayWithTime.split("T");
            let newDay = parseInt(anotherArray[0]) + i;
            anotherArray.splice(0, 1, newDay);
            let rebuiltDayTime = anotherArray.join("T");
            splitArray.splice(2, 1, rebuiltDayTime);
            let newDateSting = splitArray.join("-");
            let eventDate = newDateSting;

            createOneDayOfEvents(eventDate, pillObj.frequency_amount, pillObj.frequency_time, pillObj.start_time, pillObj.rx_name);
        };

        function createOneDayOfEvents(eventDate, freq, freqInterval, startTime, pillName) {
            console.log(freq)
            console.log(freqInterval)
            let duration = (freq * freqInterval);
            console.log("this is firing" + eventDate)
            console.log(duration)
            for (var i = 0; i < duration;) {

                let unixArray = eventDate.split("T")
                let timeArray = unixArray[1].split(":")
                let eventTime = parseInt(startTime) + i;
                timeArray.splice(0, 1, eventTime)
                let timeString = timeArray.join(":")
                unixArray.splice(1, 1, timeString)
                unixRebuilt = unixArray.join("T")

                let doseEvent = {
                    title: pillName,
                    start: unixRebuilt,
                    allDay: false,
                }
                console.log("day events firing" + doseEvent)
                eventsArr.push(doseEvent)
                i = i + freqInterval;
            }
        };

        resolve(eventsArr);
    })

    // This is intended to increment one day based upon the date created

    let sendObject = eventsPromise.then(result => {
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
                left: "prev, next",
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
            events: [
                {
                    title: 'Test',
                    // start: new Date(y, m, 23, 18, 30),
                    start: '2018-11-25T12:40:00',
                    dosage: "200 mg",
                    quantity: "2",
                    allDay: false
                }
            ],
        };

        // calendarObject.events.push(result);
        return (calendarObject)
    })
    console.log(sendObject)
    return (sendObject)
}
