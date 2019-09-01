const authController = {};
const Users = require("../models/user.model");
var jwt = require('jsonwebtoken');

authController.login = async (req, res) => {
     if (!req.body.password ||!req.body.email ) {
        res.status(500).send({
            message: 'Email or Password missing'
        });
    }
    else{
        try {

      const {email,password}= req.body;


        auth = await Users.findOne({email: email,password: password});

        if(auth){
         const token = jwt.sign({
  data: auth
}, 'extrasweetsecret', { expiresIn: '7d' });
        res.status(200).send({
            code: 200,
            message: 'Successful',
            data: token
        });
        }
else{
     res.status(422).send({
            code: 422,
            message: 'User not found'
        });
        }
}

     catch (error) {
        console.log('error', error);
        return res.status(500).send(error);
    }
    }
};
authController.setupAdmin = async (req, res) => {
   
const body = {
    name : "PMIS Chief Executive Officer",
    id : 00001,
    password : "123456",
    email : "admin@admin.com",
    role : "Chief Executive Officer",
}
        Users.create(body, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                var data = {
                    code: 200,
                    message: 'Admin has been created. Now you can login via admin@admin.com password: 123456',
                    data: result
                };
                res.status(200).send(data);
            }
        });
   };


module.exports = authController;