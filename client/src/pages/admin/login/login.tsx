import Input from '../../../components/input/input'
import { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../../../context/adminContext'
import Cookies from 'js-cookie'
import loading from '../../../assets/loading.svg'
import pic from '../../../assets/pic4.jpg'
import { useDispatch } from 'react-redux'
import { SetAdminToken } from '../../../redux/store'

function Login() {

    const [emailInput, setEmail] = useState<string>('')
    const [passwordInput, setpassword] = useState<string>('')
    const [isLogin, setLogin] = useState<boolean>(false)
    const adminContext = useContext(AdminContext)
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const disapatchFun = useDispatch()

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        const obj = {
            email: emailInput,
            password: passwordInput
        }

        setLogin(true)
        fetch('https://mycrud-react-server.vercel.app/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        })
            .then(async (res) => {
                return await res.json()
            })
            .then((data) => {
                if (data.accessToken && data.refreshToken) {
                    setEmail('')
                    setpassword('')
                    Cookies.set('adminAccessToken', data.accessToken)
                    Cookies.set('adminRefreshToken', data.refreshToken, {path:'/',sameSite:'None',secure:true})
                    disapatchFun(SetAdminToken(data.accessToken))
                    adminContext?.setAuth(true)
                } else {
                    setLogin(false)
                    alert(data.msg)
                }
            })
            .catch((err) => {
                setLogin(false)
                console.log(err)
            })
    }


    return (
        <div className='h-screen w-screen bg-white flex justify-center items-center overflow-hidden'>
            <div style={{
                backgroundColor: 'white',
                boxShadow: '0.01rem 0.05rem 1rem 0.2rem lightgrey'
            }} className='grid sm:grid-cols-1 md:grid-cols-2 w-screen sm:w-screen md:w-[90%] lg:w-[70%] h-screen sm:h-full md:h-[550px] rounded-none md:rounded-3xl overflow-hidden'>

                {/* div 1 */}
                <div className='flex flex-col justify-center gap-5 sm:gap-5 p-2 sm:p-5 md:p-8 lg:p-10 pt-2 sm:pt-5 md:pt-10 px-5 h-full w-full'>
                    <div className='flex flex-col'>
                        <p className='text-black text-center text-2xl font-medium p-2 pl-0 tracking-wider'>Welcome Admin</p>
                        <p className='text-center font-medium text-black text-sm tracking-widest'>Create Read Update Delete</p>
                    </div>
                    <form className='flex flex-col gap-5' onSubmit={handleSubmit}>
                        <Input input={emailInput} setInput={setEmail} id='email_signin' type='text' label='Email' />
                        <Input input={passwordInput} setInput={setpassword} id='password_signin' type='password' label='Password' />
                        {!isLogin && <button type='submit' className='p-3 rounded-md bg-black text-white text-base font-base'>Sign In</button>}
                        {isLogin && <div className='p-6 rounded-md bg-black flex justify-center items-center relative'>
                            <img className="w-6 absolute animate-spin" src={loading} alt="" />
                        </div>}
                    </form>
                </div>

                {/* div 2 */}
                {!isSmallScreen && <div>
                    <img src={pic} className='object-cover h-full w-full' alt="" />
                </div>}

            </div>
        </div>
    )
}

export default Login
