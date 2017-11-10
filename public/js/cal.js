$(document).ready(function() {

    // page is now ready, initialize the calendar...
   var data; var x;
    data = $.getJSON("/vieweventsjson", function(data1, ) {

      var events=[];
      console.log("hi");
      for (var key in data1) {
      	var x = new Date(data1[key].date);

  events.push({title: data1[key].eventName , start: x})

}

      $('#calendar').fullCalendar({
  events: events}
    );
});
});
