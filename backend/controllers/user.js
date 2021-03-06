const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); 
const passwordValidator = require("password-validator")

exports.userSignUp = (req,res,next)=> {
    let passwordSchema = new passwordValidator()
    passwordSchema
    .is().min(6)                                    
    .has().uppercase(1)                              
    .has().lowercase(1)                              
    .has().digits(1)                                 
    .has().not().spaces()                           
    .is().not().oneOf(["Passw0rd", "Password123"]); 
    if(passwordSchema.validate(req.body.password) === false){
        return res.status(400).json({message : "Mot de passe incorrect"})
    }

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(()=> res.status(201).json({message : "Utilisateur crée !"}))
            .catch(error => res.status(400).json({error})); 
    })
    .catch(error => res.status(500).json({error}));
};

exports.userLogin = (req,res,next)=> {
    User.findOne({email: req.body.email})
    .then(user => {if (!user) {
        return res.status(401).json({error: "Utilisateur non trouvé !"});
        }
        bcrypt.compare(req.body.password, user.password)
        .then(valid => {if (!valid) {
            return res.status(401).json({error: "Mot de passe incorrect !"});
            }
            res.status(200).json({
                userId: user._id,
                token: jwt.sign(
                    {userId: user._id},
                    "RANDOM_TOKEN_SECRET",
                    {expiresIn: "24h"}
                )
            });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};