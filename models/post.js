require.paths.unshift('vendor/mongoose');
var mongoose = require('mongoose').Mongoose;
 
mongoose.model('Post', {
  properties: ['author', 'title', 'body']
});