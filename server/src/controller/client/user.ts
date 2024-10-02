import { Response, Request } from "express";
import path from 'path'
import User from "../../schema/user";
import bcrypt from 'bcrypt'
import Jwt from "jsonwebtoken";

// server 
export const server = async (req: Request, res: Response) => {
    res.sendFile(`${path.join(__dirname, '..', '..', 'server.html')}`)
}

// verify access token
export const verifyToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const token = req.headers['authorization']?.split(' ')[1] as string
        console.log(token);

        if (!token) return res.sendStatus(401)

        const isVerified = Jwt.verify(token, process.env.JWT_ACEESS_SECRET as string)
        if (!isVerified) return res.sendStatus(401)

        res.sendStatus(200)

    } catch (err) {
        console.log(err)
    }
}

// refresh access token
export const refreshToken = async (req: Request, res: Response): Promise<any> => {
    try {
        const { refreshToken } = req.cookies
        console.log(refreshToken);
        
        if (!refreshToken) return res.sendStatus(401)

        const isRefreshTokenVerfied = Jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string)
        if (!isRefreshTokenVerfied) return res.sendStatus(401)

        const payload = { user_id: (isRefreshTokenVerfied as any).user_id }
        const newAccessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET as string, { expiresIn: '5m' })

        res.json({ newAccessToken })

    } catch (err) {
        console.log(err)
    }
}

// add user
export const addUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body

        const isUser = await User.findOne({ email })
        if (isUser) {
            return res.status(401).json({ msg: 'Email already exists' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = new User({ name, email, password: hashedPassword })
        await user.save()
        res.status(200).json({ msg: 'Successfully created an account' })
    }
    catch (err) {
        console.log(err)
    }
}

// signin user
export const signInUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email:email,isAdmin:false})
        if (!user) {
            return res.status(401).json({ msg: 'Incorrect email' })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ msg: 'Incorrect password' })
        }

        const payload = { user_id: user._id }
        const accessToken = Jwt.sign(payload, process.env.JWT_ACEESS_SECRET as string, { expiresIn: '5m' })
        const refreshToken = Jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '7d' })

        res.status(200).json({ accessToken, refreshToken, msg: 'Successfully Verified' })

    } catch (err) {
        console.log(err)
    }
}

// get user
export const getUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { accessToken } = req.cookies
        console.log(req.cookies);
        
        if (!accessToken) return res.sendStatus(401)

        const isTokenVerified = Jwt.verify(accessToken, process.env.JWT_ACEESS_SECRET as string)
        if (!isTokenVerified) return res.sendStatus(401)

        const userId = (isTokenVerified as any).user_id

        const user = await User.findOne({ _id: userId })
        if(!user) return res.sendStatus(404)

        res.status(200).json({ user })

    } catch (err) {
        console.log(err)
    }
}

// edit user
export const editUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, image } = req.body;
        const { accessToken } = req.cookies;

        if (!accessToken) return res.sendStatus(401); 

        const decodedToken = Jwt.verify(accessToken, process.env.JWT_ACEESS_SECRET as string);
        if (!decodedToken) return res.sendStatus(401); 

        const userId = (decodedToken as any).user_id;

        const emailInUse = await User.findOne({ _id: { $ne: userId }, email, isAdmin: false });
        if (emailInUse) return res.status(409).json({ msg: 'Email already exists' });

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: { name, email, image } },
            { new: true } 
        );

        if (!user) return res.sendStatus(404); 

        res.status(200).json({ updatedUser: user, msg: 'Successfully Updated' });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
};
