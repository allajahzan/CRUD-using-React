import { Router } from "express";
const route = Router()

import { login, refreshToken, verifyToken, getAdmin, getUsers, deleteUser , addUser, editUser} from "../../controller/admin/admin";

// admin login
route.post('/login',login)

// verify token
route.post('/verifyToken', verifyToken)

//refresh accesstoken
route.post('/refreshToken', refreshToken)

// get admin
route.get('/getAdmin', getAdmin)

// get all users
route.get('/getUsers', getUsers)

// add users
route.post('/addUser', addUser)

// edit users
route.patch('/editUser', editUser)

// delete users
route.delete('/deleteUser', deleteUser)

export default route