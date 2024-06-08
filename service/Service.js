const NodeCache = require('node-cache');

const userController = require("./userControler")
const filesController = require("./filesControler")


async function upLoadFile(email, file, model="default") {

    if (!userController.isLogin(email)) {
        throw new Error("Have to be logged in first");
    }

    // Add validation for email format, file name, etc.
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error("Invalid email format");
    }
    if (!file || !file.name) {
        throw new Error("File must have a name");
    }
    if (file.name === '') {
        throw new Error("File name cannot be empty");
    }

    // Return a Promise that resolves or rejects based on the upload result
    return new Promise((resolve, reject) => {
        filesController.upLoadFile(email, file, model, (result) => {
            // Add checks for the result here
            if (result === null) {
                reject(new Error("File upload returned null result"));
            } else if (result === '') {
                reject(new Error("File upload returned empty result"));
            } else if (typeof result !== 'string') {
                reject(new Error("File upload returned non-string result"));
            } else {
                resolve(result);
            }
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
