import { Router } from "express";
const route = Router()
import { server, addUser, editUser, getUser, signInUser, verifyToken , refreshToken} from "../../controller/client/user";

// get server
route.get('/',server)

// signup
route.post('/user', addUser)

// signin
route.post('/userLogin',signInUser)

// get user 
route.post('/getUser', getUser)

// edit user
route.patch('/editUser', editUser)

// verify token
route.post('/verifyToken', verifyToken)

//refresh accesstoken
route.post('/refreshToken', refreshToken)

export default route