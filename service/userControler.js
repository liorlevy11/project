const NodeCache = require('node-cache');

const userCache = new NodeCache();
const loginUserCache = new NodeCache();


//register
async function register(email, password,name){
    const cacheKey = `${email}`;
    if(userCache.get(cacheKey)){
      throw new Error("User with this mail already exists");
    }
    if (!email || !password || !name ) {
      throw new Error("Missing required attributes");
    }
    
    const cacheData = {
      password,
      name,
      email
    };
    userCache.set(cacheKey, cacheData);
  }

  
  
  //login
  async function login( email, password ){
    // Check if the email and password match the registered user
   const cacheKey = `${email}`;
    const user= userCache.get(cacheKey);
    if( user.email!==email )
    throw new Error( "Invalid email" );
   if (user.password !== password) {
    throw new Error( "Invalid password" );}
    const cacheData = {
      password,
      email
    };
    loginUserCache.set(cacheKey, cacheData);
    
   }
  
  //logout
   function logout(email) {
    const cacheKey = `${email}`;
    loginUserCache.del(cacheKey);
   }

function isLogin(email) {
    const cacheKey = `${email}`;
    return loginUserCache.get(cacheKey);
}
function getUserData(email) {
  const userKey = `${email}`;
  return userCache.get(userKey);
}   

module.exports = {
  register,
  login,
  logout,
  isLogin,
  getUserData
};

