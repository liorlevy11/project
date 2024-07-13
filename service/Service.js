const NodeCache = require('node-cache');

const userController = require("./userControler")
const filesController = require("./filesControler")


async function upLoadFile(email, file, model="default") {
    console.log("3");

    if (!userController.isLogin(email)) {
        throw new Error("Have to be logged in first");
    }
    console.log("3+");
    // Add validation for email format, file name, etc.
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error("Invalid email format");
    }
    console.log("3++");
    if (!file) {
        throw new Error("File must have a exist");
    }
    
    console.log("4");

    // Return a Promise that resolves or rejects based on the upload result
    return new Promise((resolve, reject) => {
        console.log('1 ')
        filesController.upLoadFile(email, file, model, (result) => {
            // Add checks for the result here
            if (result === null) {
                reject(new Error("File upload returned null result"));
            } else if (result === '') {
                reject(new Error("File upload returned empty result"));
            } else if (typeof result !== 'string') {
                reject(new Error("File upload returned non-string result"));
            } else {
                console.log("5");
                resolve(result);
            }
        });
    });

}

async function upLoadFileForMalCheck(email, file) {

    if (!userController.isLogin(email)) {
        throw new Error("Have to be logged in first");
    }

    // Add validation for email format, file name, etc.
    if (!email || typeof email !== 'string' || !email.includes('@')) {
        throw new Error("Invalid email format");
    }
    if (!file) {
        throw new Error("File must have a exist");
    }

    // Return a Promise that resolves or rejects based on the upload result
    return new Promise((resolve, reject) => {
        filesController.upLoadFileForMalCheck(email, file, (result) => {
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
  logout,
  upLoadFileForMalCheck
};
