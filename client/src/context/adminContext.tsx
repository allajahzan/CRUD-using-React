import { createContext, ReactNode, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AdminAuth } from "../auth/adminAuth";
import Cookies from "js-cookie";
import { SetAdminToken, UpdateAdmin } from "../redux/store";

interface contextType {
    isAuth: boolean,
    setAuth: React.Dispatch<React.SetStateAction<boolean>>,
    logout: () => void
}

const AdminContext = createContext<contextType | null>(null)


const AdminContexetProvider = ({ children }: { children: ReactNode }) => {

    const accessToken = useSelector((state: any) => state.adminToken)
    const disaptchFun = useDispatch()

    const [isAuth, setAuth] = useState<boolean>(accessToken ? true : false)

    useLayoutEffect(() => {

        const checkAdminAuth = async () => {
            AdminAuth(accessToken)
                .then((newAccessToken) => {
                    if (newAccessToken) {
                        disaptchFun(SetAdminToken(newAccessToken))
                        Cookies.set('adminAccessToken', newAccessToken)

                        fetch('/admin/getAdmin', { method: 'GET', credentials: 'include' })
                            .then(async (res) => {
                                if (res.status === 401) {
                                    checkAdminAuth()
                                } else {
                                    const data = await res.json()
                                    disaptchFun(UpdateAdmin(data.admin))
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                            })

                    } else {
                        logout()
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        }

        checkAdminAuth()

    }, [isAuth])

    // logout
    const logout = () => {
        disaptchFun(SetAdminToken(null))
        disaptchFun(UpdateAdmin(null))
        Cookies.remove('adminAccessToken')
        Cookies.remove('adminRefreshToken')
        setAuth(false)
    }

    return (
        <AdminContext.Provider value={{ isAuth, setAuth, logout }}>
            {children}
        </AdminContext.Provider>
    )
}

export {
    AdminContext,
    AdminContexetProvider
}



