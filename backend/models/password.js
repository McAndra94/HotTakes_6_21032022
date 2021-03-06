const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();

passwordSchema
.is().min(6)                                    
.has().uppercase(1)                              
.has().lowercase(1)                              
.has().digits(1)                                 
.has().not().spaces()                           
.is().not().oneOf(['Passw0rd', 'Password123']); 

module.exports = passwordSchema;
