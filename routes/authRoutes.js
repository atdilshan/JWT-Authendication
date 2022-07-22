const express = require("express");

const authRoutes = express.Router();
const User = require("../models/User");
const {hashGenerate} = require("../helpers/hashing");
const {hashValidator} = require("../helpers/hashing");
const {tokenGenerator} = require("../helpers/token");
const authVerify = require("../helpers/authVerify");

// User signup http request 
authRoutes.post("/signup", async (req, res) => {
    try{
        const hashPassword = await hashGenerate(req.body.password);
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            role:"0",
            statuses:"1" // statuses=0(blocked), statuses=1(active)
        });
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error){
        res.send(error)
    }
});

// Vehicle owner register http request 
authRoutes.post("/register", async (req, res) => {
    try{
        const hashPassword = await hashGenerate(req.body.password);
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            role:"1",
            statuses:"2" // statuses=0(blocked), statuses=1(active), statuses=2(pending)
        });
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error){
        res.send(error)
    }
});


// Admin register http request
// this is for super admin
authRoutes.post("/admin-register", async (req, res) => {
    try{
        const hashPassword = await hashGenerate(req.body.password);
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword,
            role:"2",
            statuses:"2" // statuses=0(blocked), statuses=1(active), statuses=2(pending for accepted)
        });
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error){
        res.send(error)
    }
});

// User, vehicle owner, admin signin http request
authRoutes.post("/signin", async (req, res) => {
    try{
        const existingUser = await User.findOne({email:req.body.email});
        if(!existingUser){
            res.send("Email is invalid!");
        }else{
            const checkUser = await hashValidator(req.body.password, existingUser.password);
            if(!checkUser){
                res.send("Password is invalid");
            } else {
                const token = await tokenGenerator(existingUser.email);
                res.cookie("jwt", token, {httpOnly:true})
                if(existingUser.role == 0){
                    res.send(`User Login successful! Your Token is ` + token);
                }else if(existingUser.role == 1){
                    res.send(`Vehicle Owner Login successful! Your Token is ` + token);
                }else{
                    res.send(`Admin Login successful! Your Token is ` + token);
                }
            }
        }        
    } catch (error) {
        res.send(error);
    }
})

// check protected route
authRoutes.get("/protected", authVerify, (req, res) => {
    res.send("I am protected route")
})

// logout http request
authRoutes.get("/logout", (req, res) => {
    res.clearCookie('jwt', {httpOnly: true});
    res.send('Logout Successfull!');
})


module.exports = authRoutes;