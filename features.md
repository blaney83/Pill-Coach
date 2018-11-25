
## Space for future features:

    Administrator access:
        If a user had Admin access, the modal displayed to the user would have a button for adding data. In much of the same way that Wikipedia allows contributions, a trusted user (upon being presented with an "empty" page) could follow the provided link to an external source (like webMD or WikiPedia), and copy information pertaining to the empty section. Side effects, for example, could be copied and then the user could click the button on the modal, insert the additional information, and hit submit to write or "update" the missing area in the db.


        CALENDAR FLOW:

        IN ROUTES FILE
        On page load (get("/")), find all Pills where userId = currentUserId;
        Return that info on response object.

        IN CALENDAR.JS
        $.ajax({
            method: "GET",
            url: "/"
        }).then(function(resp){
            console.log(resp)       //will show all pills associated with user and include all the pill data(freq, quantity, start time, AND date created)

            //create function that creates events for each pill
            function createPillEvents(pillObj){

                //imagine that pillObj is our pill object being passed in
                //it will contain pillObj.freq, pillObj.quantity, pillObj.dateCreated, pillObj.timeStarted, pillObj.freqInterval, pillObj.name

                #1st thing we need to know is how many events we will be creating per day. We will create x events = to the frequency.
                // lets write a function for creating one days worth of events

                function createOneDayOfEvents(eventDate, freq, freqInterval, startTime, pillName){        //remember these are all burritos until we call this function later and pass it values

                    //lets make a duration variable
                    let duration = (freq * freqInterval)

                    //lets calculate end time
                    let endTime = startTime + (freq * freqInterval)     //this will give us the endtime; ex: freq= 3, freqInterval= 3hours, start = 10AM, endTime = 10AM + (3 * 3hours) = 7pm endtime (or 19:00)

                    //now lets create a loop to create an event starting at start time, and continue until end time
                    for(i = 0; i <= duration; i + freqInterval){

                        let eventTime = startTime + i       //this will increment by the eventTime by the freqInterval each time it runs until i = duration)
                        createEvent(eventDate, eventTime, pillName)

                        //believe it or not, thats all we need for this function! We will call it in our next loop
                    }
                }

                #2nd thing we need to know is how many days we will be creating events for. We will need a new variable for this.
                let daysOfEventsCreated = pillObj.quantity/pillObj.freq (ex: 30 pills/ 3 a day = 10 days of events)

                vvvvvvvvvvvvvvv Now we are ready for our loop vvvvvvvv
                //this loop will run once for each day of the month we need events on
                for(i = 0; i <= daysOfEventsCreated; i ++){

                    let eventDate = pillObj.dateCreated + i(days in day format, basically this function needs to increment the unix formated date by one each time the loop fires, this value is the day we are creating events for.)

                    // now we need to run our createOneDayOfEventsFunction
                    
                    createOneDayOfEvents(eventDate, pillObj.freq, pillObj.freqInterval, pillObj.timeStarted, pillObj.name)
                }

                //all of the code above this point is our function definition. we will call it below                

            }

            //so now we will loop through all of our pills that came back with our response and run that function
            // this code might look foreign, but its an object loop. Basically for every key in an object (for every pill in our response){ run a function }

            for (var pill in resp){

                //pass the "pill" (which is an object containing all our info) to our function we defined above

                createPillEvents(pill)

                //and now we are done!

            }
        })

        #3 RUN THAT SAME FUNCTION FOR NEW PILLS ADDED TO DB

        $.ajax({
            method: "POST",
            url: "api/routes"
        }).then(function(response){

            createPillEvents(response.Pill)

            //and thats it!

        })

        KEEP IN MIND:

        These AJAX functions will be triggered by different things:

            the get request will be triggered on page load,

            the post request will be linked to an event listener on the "submit new pill" button.


    LMK if you have any questions!