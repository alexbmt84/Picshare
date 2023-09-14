// Handlebars functions

const Handlebars = require('handlebars');

Handlebars.registerHelper('gte', function(a, b) {
  return a >= b;
});

// Define the 'eq' helper
Handlebars.registerHelper('eq', function (value1, value2, options) {
  if (value1 === value2) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});



module.exports = Handlebars;



