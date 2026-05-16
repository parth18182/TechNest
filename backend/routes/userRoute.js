    import express from 'express';
    import {  allUsers, changePassword, forgotPassword, getUserById, login, logout, register, reverify, updateUser, verify, verifyOTP } from '../controller/usercontroller.js'
    import { isAdmin, isAuthenticated } from '../middleware/isAuthenticated.js';
    import { singleUpload } from '../middleware/multer.js';
    const router = express.Router();

    router.post('/register', register);
    router.post('/verify', verify);
    router.post('/reverify', reverify);
    router.post('/login', login);
    router.post('/logout', isAuthenticated, logout);
    router.post('/forgotpassword', forgotPassword);
    router.post('/verifyotp/:email', verifyOTP);
    router.post('/changepassword/:email', changePassword);
    router.post('/allUsers',isAuthenticated,isAdmin,allUsers);
    router.post('/getuser/:userId',getUserById);
    router.put('/updateuser/:id',isAuthenticated,singleUpload,updateUser);

    export default router; 