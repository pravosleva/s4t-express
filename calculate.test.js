describe('GET /projects/cargo-3d', () => {
  it('should respond cargo params', (done) => {
    chai.request(server)
    .get('GET /calculate?brand=thermocold&model=test&wagonCarryingCapacity=20000&length=1000&width=1000&height=1000&weight=1800&addSize=50&wagonLength=13600&wagonWidth=2450&wagonHeight=3000&maxInWagon=13&maxRowsInWagon_byWagonWidth=2&maxRowsInWagon_byWagonLength=50&maxFloorsInWagon=1&eqPrice=&accssPrice=&multiplier=0.3&cargoType=thermocold_chillers')
    .end((err, res) => {
      // there should be no errors
      should.not.exist(err);
      // there should be a 200 status code
      res.status.should.equal(200);
      // the response should be JSON
      res.type.should.equal('application/json');
      // the JSON response body should have a
      // key-value pair of {"status": "success"}
      res.body.status.should.eql('success');
      // the JSON response body should have a
      // key-value pair of {"data": 1 user object}
      res.body.data[0].should.include.keys(
        'result'
      );
      done();
    });
  });
});
