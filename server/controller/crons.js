var parser = require('cron-parser');

exports.crons = function(request, response) {

    return_respose(request.body);

    function return_respose(body) {
        objects = get_bjects();
        calendar = objects[0];
        response_json = objects[1];
        options = objects[2];

        calendar_create();
        process_corn_strings();
        Sorting();

        // Return Calendar, response and options object
        function get_bjects() {

            var calendar = {
                Monthly: [],
                Weekly: [],
                BiWeekly: [],
                Quarterly: []
            };

            var response_json = {
                Monthly: [],
                Weekly: [],
                BiWeekly: [],
                Quarterly: []
            };

            var start_date = new Date(body.start_date);
            var end_date = new Date(body.end_date);

            var options = {
                currentDate: new Date(start_date),
                endDate: new Date(end_date),
                iterator: true
            };
            return [calendar, response_json, options];
        }

        // Processing response body to create an Object (Calendar)
        function calendar_create() {
            for (var i in body.frequencies) {
                if (body.frequencies[i].name == 'Monthly') {
                    for (var m in body.frequencies[i].crons) {
                        if (calendar.Monthly.indexOf(body.frequencies[i].crons[m]) < 0) {
                            calendar.Monthly.push(body.frequencies[i].crons[m]);
                        }
                    }
                } else if (body.frequencies[i].name == 'Weekly') {
                    for (var w in body.frequencies[i].crons) {
                        if (calendar.Weekly.indexOf(body.frequencies[i].crons[w]) < 0) {
                            calendar.Weekly.push(body.frequencies[i].crons[w]);
                        }
                    }
                } else if (body.frequencies[i].name == 'BiWeekly') {
                    for (var b in body.frequencies[i].crons) {
                        if (calendar.BiWeekly.indexOf(body.frequencies[i].crons[b]) < 0) {
                            calendar.BiWeekly.push(body.frequencies[i].crons[b]);
                        }
                    }
                } else {
                    for (var q in body.frequencies[i].crons) {
                        if (calendar.Quarterly.indexOf(body.frequencies[i].crons[q]) < 0) {
                            calendar.Quarterly.push(body.frequencies[i].crons[q]);
                        }
                    }
                }
            }
        }

        // Processing cron strings
        function process_corn_strings() {
            for (var cal in calendar) {
                for (var k in calendar[cal]) {
                    try {
                        var interval = parser.parseExpression(calendar[cal][k], options);
                        while (true) {
                            try {
                                var obj = interval.next();
                                if (cal == 'Monthly') {
                                    response_json.Monthly.push(obj.value.toString());
                                } else if (cal == 'Weekly') {
                                    response_json.Weekly.push(obj.value.toString());
                                } else if (cal == 'BiWeekly') {
                                    response_json.BiWeekly.push(obj.value.toString());
                                } else {
                                    response_json.Quarterly.push(obj.value.toString());
                                }
                            } catch (e) {
                                break;
                            }
                        }
                    } catch (err) {
                        console.log('Error: ' + err.message);
                    }
                }
            }
        }

        //Sorting and conversion of TimeStamps to ISO-8601
        function Sorting() {
            for (var l in response_json) {
                response_json[l].sort(function(a, b) {
                    return a.split(" ")[2] - b.split(" ")[2];
                });
                for (var p in response_json[l]) {
                    response_json[l][p] = new Date(response_json[l][p]).toISOString();
                }
            }
        }

    //Send Response
        response.send(response_json);

    }
};
