'use strict';

module.exports = function(req, res, next){
  let response = req.body.Body.split(' ');
  if(response[0].toLowerCase() === 'yes'){
    req.subscribe = true;
  }
  console.log('Subscribe: ' ,req.subscribe);
  return next();
};
