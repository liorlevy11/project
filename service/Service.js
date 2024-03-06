const NodeCache = require('node-cache');

const userController = require("./userControler")
const filesController = require("./filesControler")


async function upLoadFile(email,file) {
  if( !userController.isLogin(email)){ throw new Error("have to be logged in first");}
  return filesController.upLoadFile(email,file);
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
