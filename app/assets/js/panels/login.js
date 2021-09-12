const { auth } = require('./assets/js/utils.js');
const id = {
  "email": "luuxis", //votre email minecraft
  "password": "" //votre mot de passe minecraft

}

auth.login(id.email, id.password)
