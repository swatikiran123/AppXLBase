angular.module('appFilters', [])

.filter('DateFormat', function myDateFormat(){
  return function(text,format){
		//ToDo: This part ignore timezone. To be improved in case timezone to be included
		var dt = moment.utc(text).format(format);
		return dt.toString();
  }
})

.filter('DateRange', function myDateFormat(){
  return function(d1,d2,format){
		//ToDo: This part ignore timezone. To be improved in case timezone to be included
		var dt1 = moment.utc(d1);
		var dt2 = moment.utc(d2);

		var duration = moment.duration(dt2.diff(dt1));
		var days = duration.asDays();

		if(days > 1){
			return dt1.toString() + ", 1 day";
		}
		else {

			return parse("%s - %s, %s days", dt1.toString(), dt2.toString(), days );
		}
  }
})

.filter('duration', function () {

  return function (toDate, fromDate) {
			var duration = "Invalid duration";
			var d1 = moment(fromDate);
			var d2 = moment(toDate);
			var ms = moment.duration(d2.diff(d1));
			var span = ms.asMinutes();
			if (span < 120)
				duration = span + " min(s)";
			else {
				span = ms.asHours();
				if (span < 24)
					duration = span + " hr(s)";
					else {
						span = Math.round(ms.asDays());
						duration = span + " day(s)";
					}
			}

			return duration;
  };
});
