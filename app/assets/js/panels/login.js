const { MCAuth, MCLaunch } = require('emc-core-luuxis');
const launcher = new MCLaunch();

let authenticator;

MCAuth.auth("luuxis").then(user => {
  authenticator = user;
  //success
}).catch(error => {
  //error
})