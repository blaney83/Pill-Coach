
$(document).ready(function () {
    var date = new Date();
    var d = date.getDay();
    var m = date.getMonth();
    var y = date.getFullYear();
    
    // page is now ready, initialize the calendar...

    $('#calendar').fullCalendar({
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
        customButtons: {
            addEventButton: {
              text: 'Add a Pill',
              textColor: 'orange',
              click: function() {
                var dateStr = prompt('Enter a date in YYYY-MM-DD format');
                var date = moment(dateStr);
      
                if (date.isValid()) {
                  $('#calendar').fullCalendar('renderEvent', {
                    title: 'dynamic event', //Name of pill
                    start: date, //date provided by user, in unix
                    allDay: false
                  });
                  alert('Great. Now, update your database...');
                } else {
                  alert('Invalid date.');
                }
              }
            }
          },
        // buttons for switching between views
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
                title: 'Flonase',
                start: '2018-11-20T12:52:00',
                dosage: "200 mg",
                quantity: "2",
                allDay: false // will make the time show
            },
            {
                title: 'Flonase',
                start: '2018-11-23T12:52:00',
                dosage: "200 mg",
                quantity: "2",
                allDay: false // will make the time show
            },
            {
                title: 'Flonase',
                start: '2018-11-24T12:52:00',
                dosage: "200 mg",
                quantity: "2",
                allDay: false // will make the time show
            },
            {
                title: 'Flonase',
                start: '2018-11-25T12:52:00',
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