import { Response, Request, response } from "express";
import path from 'path'
import User from "../../schema/user";
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";

// admin login
export const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email: email, isAdmin: true })
        if (!user) return res.status(401).json({ msg: 'Incorrect Email' })

        const isPasswordVerified = await bcrypt.compare(password, user.password)
        if (!isPasswordVerified) return res.status(401).json({ msg: 'Incorrect password' })

        const payload = { admin_id: user._id }
        const accessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET_ADMIN as string, { expiresIn: '5m' })
        const refreshToken = Jwt.sign(payload, process.env.JWT_REFRESH_SECRET_ADMIN as string, { expiresIn: '7d' })

        res.status(200).json({ accessToken, refreshToken })

    } catch (err) {
        console.log(err)
    }
}

// verify access token
export const verifyToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] as string
        console.log(token);
        

        if (!token) return res.sendStatus(401)

        const isVerified = Jwt.verify(token, process.env.JWT_ACEESS_SECRET_ADMIN as string)
        if (!isVerified) return res.sendStatus(401)

        res.sendStatus(200)

    } catch (err) {
        console.log(err)
    }
}

// refresh access token
export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const adminRefreshToken = req.headers['authorization']?.split(' ')[1] as string
        console.log(adminRefreshToken);
        
        if (!adminRefreshToken) return res.sendStatus(401)

        const isRefreshTokenVerfied = Jwt.verify(adminRefreshToken, process.env.JWT_REFRESH_SECRET_ADMIN as string)
        if (!isRefreshTokenVerfied) return res.sendStatus(401)

        const payload = { admin_id: (isRefreshTokenVerfied as any).admin_id }
        const newAccessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET_ADMIN as string, { expiresIn: '5m' })

        res.json({ newAccessToken })

    } catch (err) {
        console.log(err)
    }
}

// get admin data 
export const getAdmin = async (req: Request, res: Response): Promise<any> => {
    try {
        const adminAccessToken = req.headers['authorization']?.split(' ')[1] as string
        console.log(adminAccessToken);
        
        if (!adminAccessToken) return res.sendStatus(401)

        const isVerified = Jwt.verify(adminAccessToken, process.env.JWT_ACEESS_SECRET_ADMIN as string)
        if (!isVerified) return res.sendStatus(401)

        let adminId = (isVerified as any).admin_id
        const admin = await User.findOne({ _id: adminId })

        res.status(200).json({ admin })

    } catch (err) {
        console.log(err)
    }
}

// get all users data
export const getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const {adminAccessToken} = req.cookies
        if (!adminAccessToken) return res.sendStatus(401)

        const isVerified = Jwt.verify(adminAccessToken, process.env.JWT_ACEESS_SECRET_ADMIN as string)
        if (!isVerified) return res.sendStatus(401)

        const users = await User.find({ isAdmin: false })
        res.json({ users })

    } catch (err) {
        console.log(err)
    }
}

// delete user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    try {

        const adminAccessToken = req.headers['authorization']?.split(' ')[1] as string
        if (!adminAccessToken) return res.sendStatus(401)

        const isVerified = Jwt.verify(adminAccessToken, process.env.JWT_ACEESS_SECRET_ADMIN as string)
        if (!isVerified) return res.sendStatus(401)

        const { userId } = req.query
        await User.deleteOne({ _id: userId })
        res.json({ msg: 'Successfully Deleted' })


    } catch (err) {
        console.log(err)
    }
}

// delete user
export const addUser = async (req: Request, res: Response): Promise<any> => {
    try {

        const adminAccessToken = req.headers['authorization']?.split(' ')[1] as string
        if (!adminAccessToken) return res.sendStatus(401)

        const isVerified = Jwt.verify(adminAccessToken, process.env.JWT_ACEESS_SECRET_ADMIN as string)
        if (!isVerified) return res.sendStatus(401)

        const { name, email, password, image } = req.body

        const emailInUse = await User.findOne({ email })
        if (emailInUse) return res.status(409).json({ msg: 'Email already exists' })

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ email, name, password: hashedPassword, image })
        await newUser.save()

        res.json({ newUser, msg: 'User Added Successfully' })

    } catch (err) {
        console.log(err)
    }
}

// edit user

export const editUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const adminAccessToken = req.headers['authorization']?.split(' ')[1] as string
        if (!adminAccessToken) return res.sendStatus(401)

        const isVerified = Jwt.verify(adminAccessToken, process.env.JWT_ACEESS_SECRET_ADMIN as string)
        if (!isVerified) return res.sendStatus(401)

        const { id, name, email, image } = req.body

        const emailInUse = await User.findOne({ _id: { $ne: id }, email })
        if (emailInUse) return res.status(409).json({ msg: 'Email already exists' })

        await User.updateOne({ _id: id }, { $set: { name: name, email: email, image: image } })
        res.status(200).json({ msg: 'Sucessfully Updated' })

    } catch (err) {
        console.log(err)
    }
}