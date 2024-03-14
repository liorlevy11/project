const NodeCache = require('node-cache');

const userController = require("./userControler")
const filesController = require("./filesControler")


async function upLoadFile(email, file) {
  if (!userController.isLogin(email)) {
    throw new Error("Have to be logged in first");
  }
  
  // Return a Promise that resolves with the result of upload
  return new Promise((resolve, reject) => {
    filesController.upLoadFile(email, file, (result) => {
      //console.log(result)
      resolve(result);
    });
  });
}



async function register(email, password, name){
  await userController.register(email, password, name);
}


async function login( email, password ){
  await userController.login(email, password);
 }

 function logout(email) {
  userController.logout(email);
 }


module.exports = {
  upLoadFile,
  register,
  login,
  logout
};
