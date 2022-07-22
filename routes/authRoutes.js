const express = require("express");

const authRoutes = express.Router();
const User = require("../models/User");
const {hashGenerate} = require("../helpers/hashing");
const {hashValidator} = require("../helpers/hashing");
const {tokenGenerator} = require("../helpers/token");
const authVerify = require("../helpers/authVerify");

authRoutes.post("/signup", async (req, res) => {
    try{
        const hashPassword = await hashGenerate(req.body.password);
        const user = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashPassword
        });
        const savedUser = await user.save();
        res.send(savedUser);
    } catch (error){
        res.send(error)
    }
});

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
                // res.send("Login success!");
                const token = await tokenGenerator(existingUser.email);
                res.cookie("jwt", token, {httpOnly:true})
                res.send(token);
            }
        }        
    } catch (error) {
        res.send(error);
    }
})

authRoutes.get("/protected", authVerify, (req, res) => {
    res.send("I am protected route")
})

module.exports = authRoutes;