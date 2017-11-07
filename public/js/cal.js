$(document).ready(function() {

    // page is now ready, initialize the calendar...
    var data;
    data = $.get("/vieweventsjson", function(data1, status) {
      return data1;
    });

    alert(data[0]);


    $('#calendar').fullCalendar({
        // put your options and callbacks here
    })

});
