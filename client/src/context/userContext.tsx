import { createContext, ReactNode, useLayoutEffect, useState } from "react";
import { UserAuth } from "../auth/userAuth";
import { useDispatch, useSelector } from "react-redux";
import { SetToken, UpdateUser } from "../redux/store";
import Cookies from "js-cookie";

export interface contextType {
    isAuth: boolean,
    setAuth: React.Dispatch<React.SetStateAction<boolean>>,
    logout: () => void
}

const UserContext = createContext<contextType | null>(null)


const UserContextProvider = ({ children }: { children: ReactNode }) => {

    const accessToken = useSelector((state: any) => state.userToken)
    const disaptchFun = useDispatch()

    const [isAuth, setAuth] = useState<boolean>(accessToken ? true : false)

    useLayoutEffect(() => {

        const checkAuth = async () => {
            const newAccesstoken = await UserAuth(accessToken)
            if (newAccesstoken) {
                alert(newAccesstoken)
                disaptchFun(SetToken(newAccesstoken))
                Cookies.set('accessToken',newAccesstoken)
                fetch('http://localhost:3000/getUser', { method: 'POST', credentials: 'include' })
                    .then(async (res) => {
                        if (res.status === 401) {
                            // checkAuth()
                            alert("ayyyy")
                        }else if(res.status === 404){
                            // logout()
                        }
                        else {
                            const data = await res.json()  
                            disaptchFun(UpdateUser(data.user))
                        }
                    })
                    .catch((err) => {
                        console.log(err)
                    })
            } else {
                // logout()
                alert("hahah")
            }
        }

        checkAuth()

    }, [isAuth])

    //logout
    const logout = () => {
        disaptchFun(SetToken(null))
        disaptchFun(UpdateUser(null))
        Cookies.remove('accessToken')
        Cookies.remove('refreshToken')
        setAuth(false)
    }

    return (
        <UserContext.Provider value={{ isAuth, setAuth, logout }}>
            {children}
        </UserContext.Provider>
    );
}

export {
    UserContext,
    UserContextProvider
}