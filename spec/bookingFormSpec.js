describe("Testing with HTML Fixtures", function() {

   beforeEach(function() {
        fixture = '<div id="formPlayers">Test Value</div>'
        setFixtures(fixture);
   })

  it("test that the DOM element exists as initialised", function() {
    expect($('#formPlayers')).toBeInDOM();
    expect($('#formPlayers')).toHaveText('Test Val');
  })

  // it("test that the function empties the DOM element", function() {
  //   clearPlayers();
  //   expect($('#formPlayers')).toHaveText('');
  // })

})