var express = require("express");
var router = express.Router();

const credentials = {

    email: "admin@gmail.com",
    password: "admin",
    device1: "rpi",
    device2: "app"
}


router.post('/login',(req,res) => {
if(req.body.email == credentials.email && req.body.password == credentials.password && req.body.device == credentials.device1)
{

req.session.user = req.body.email;
res.redirect('/route/broadcast');
// res.end("Login Succesful!");
}
else if(req.body.email == credentials.email && req.body.password == credentials.password && req.body.device == credentials.device2){

    
req.session.user = req.body.email;
res.redirect('/route/dashboard');
}

else
{
    res.end("Invalid Username and Password");
}

});


router.get('/broadcast', (req,res) => {
if(req.session.user)
{
    res.render('broadcast');
}
});



router.get('/dashboard', (req,res) => {
    if(req.session.user)
    {
        res.render('dashboard');
    }
    });


router.get('/try', (req,res) => {
        if(req.session.user)
        {
            res.render('try');
        }
        });
        
    


    


module.exports = router;