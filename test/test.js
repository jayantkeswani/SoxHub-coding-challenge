var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../app');
var should = chai.should();

chai.use(chaiHttp);

describe("Validate JSON", function() {

    it('should returns JSON object on /calculate-crons POST', function(done) {
        var json = {
            "start_date": "2016-02-01T08:00:00.000Z",
            "end_date": "2016-02-28T08:00:00.000Z",
            "frequencies": [{
                    "name": "Monthly",
                    "crons": ["0 0 0 25 * *"]
                },
                {
                    "name": "BiWeekly",
                    "crons": ["0 0 0 20 * *", "0 0 0 10 * *", "0 0 0 10 * *"]
                },
                {
                    "name": "Weekly",
                    "crons": ["0 0 0 * * 5"]
                },
                {
                    "name": "Quarterly",
                    "crons": ["0 0 0 25 3 *", "0 0 0 27 6 *", "0 0 0 30 9 *", "0 0 0 22 12 *", "0 0 0 25 3 *"]
                }
            ]
        };
        var response_json = {

            "Monthly": ['2016-02-25T08:00:00.000Z'],
            "Weekly": ['2016-02-05T08:00:00.000Z',
                '2016-02-12T08:00:00.000Z',
                '2016-02-19T08:00:00.000Z',
                '2016-02-26T08:00:00.000Z'
            ],
            "BiWeekly": ['2016-02-10T08:00:00.000Z', '2016-02-20T08:00:00.000Z'],
            "Quarterly": []
        };

        chai.request(server)
            .post('/calculate-crons')
            .send(json)
            .set('Accept', 'application/json')
            .end(function(err, res) {
                res.should.have.status(200);
                res.body.should.have.property('Monthly');
                res.body.should.have.property('Weekly');
                res.body.should.have.property('BiWeekly');
                res.body.should.have.property('Quarterly');
                done();
            });
    });
});
