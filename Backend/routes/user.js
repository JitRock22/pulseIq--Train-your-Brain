const express=require('express');
const router=express.Router();
const {sendOTP,registerUser,loginUser,getinfo,resetMatch,resetStat}=require('../controllers/userController');

router.post('/register',registerUser);
router.post('/sendOTP',sendOTP);
router.post('/login',loginUser);
router.get('/aboutUser',getinfo);
router.get('/reset',resetMatch);
router.post('/resetStat/:id',resetStat);
// router.post('/login-verify');



module.exports=router;