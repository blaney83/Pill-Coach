
$(document).ready(function () {
    
    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
        editable: true,
        color: 'black',     // an option!
        textColor: 'yellow', // an option! 
        selectable: true,
        contentHeight: 200,
        default: "No events to display",
        header: {
            left: "prev",
            center: 'listMonth,month',
            right: "next"
        },

        // buttons for switching between views
        defaultView: "listWeek",
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
                title: 'Advil',
                start: '2018-11-20T12:40:00',
                dosage: "200 mg",
                quantity: "2",
                allDay: false
            },
            {
                title: 'Flonase',
                start: '2018-11-20T12:30:00',
                dosage: "200 mg",
                quantity: "2",
                allDay: false
            },
            {
                title: 'Viagra',
                start: '2018-11-20T12:52:00',
                dosage: "200 mg",
                quantity: "2",
                allDay: false // will make the time show
            }
        ],
        // eventRender: function (event, element) {
        //     element.qtip({
        //         content: event.description
        //     });
        // }

    });
});