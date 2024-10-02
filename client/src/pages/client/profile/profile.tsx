import Input from '../../../components/input/input'
import upload from '../../../assets/upload.svg'
import pic from '../../../assets/pic1.jpg'
import NavbarComponent from '../../../components/navbar/client/navbar_client'
import { useContext, useLayoutEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { UserAuth } from '../../../auth/userAuth'
import { SetToken, UpdateUser } from '../../../redux/store'
import Cookies from 'js-cookie'
import { UserContext } from '../../../context/userContext'
import loading from '../../../assets/load.svg'

function Profile() {

    const user = useSelector((state: any) => state.user)
    const accessToken = useSelector((state: any) => state.userToken)
    const dispathFun = useDispatch()

    let [nameInput, setName] = useState<string>('')
    let [emailInput, setEmail] = useState<string>('')
    let [image, setImgae] = useState<string | null>(null)

    useLayoutEffect(() => {
        if (user) {
            setName(user.name)
            setEmail(user.email)
            if (user.image!=='null') {
                setImgae(user.image)
            }
        }
    }, [user])

    let handleImgeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const reader = new FileReader()
            reader.readAsDataURL(event.target.files[0])
            reader.onload = () => {
                setImgae(reader.result as string)
            }
            reader.onerror = (err) => {
                console.log(err)
            }
        }
    }

    const [isUpdate, setUpdate] = useState<boolean>(false)
    const userContext = useContext(UserContext)

    let handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append('name', nameInput)
        formData.append('email', emailInput)
        formData.append('image', image? image : 'null')

        const updateUser = () => {
            UserAuth(accessToken)
                .then((newAccesstoken) => {
                    if (newAccesstoken) {
                        setUpdate(true)
                        dispathFun(SetToken(newAccesstoken))
                        Cookies.set('accessToken', newAccesstoken)

                        fetch('https://mycrud-react-server.vercel.app/editUser', {
                            method: 'PATCH',
                            headers:{
                                 'Authorization': `Bearer ${newAccesstoken}`
                            },
                            body: formData
                        })
                            .then(async (res) => {
                                const data = await res.json()
                                if (res.status === 401) {
                                    updateUser()
                                } else if (res.status === 409) {
                                    setUpdate(false)
                                    alert(data.msg)
                                }
                                else {
                                    dispathFun(UpdateUser(data.updatedUser))
                                    setUpdate(false)
                                }
                            })
                            .catch((err) => {
                                setUpdate(false)
                                console.log(err);
                            })

                    } else {
                        userContext?.logout()
                    }
                })
        }

        updateUser()
    }

    return (
        <div style={{
            backgroundImage: `url(${pic})`,
            backgroundSize: 'cover'
        }} className="h-screen w-full relative flex items-center justify-center overflow-hidden">
            {/* Radial gradient for the container to give a faded look */}
            {/* <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div> */}

            <NavbarComponent />
            <div className='flex flex-col justify-center gap-5 p-10 w-full sm:w-[450px] h-full sm:h-[450px] bg-black bg-opacity-40'>
                {/* <p className='bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-300 text-xl text-center font-base p-2 pl-0'>User Profile</p> */}
                <form className='flex flex-col items-center gap-5' action="" onSubmit={handleSubmit}>
                    {image ?
                        <div className='relative flex justify-center items-center bg-transparent border rounded-full h-36 w-36 mb-5 cursor-pointer overflow-hidden'>
                            <img className='w-full h-full object-cover cursor-pointer' src={image} alt="" />
                            <input accept='image/*' onChange={handleImgeUpload} type="file" className='absolute w-full h-full rounded-full opacity-0' />
                        </div>
                        :
                        <div className='relative p-5 flex justify-center items-center bg-transparent border rounded-full h-36 w-36 mb-5 cursor-pointer'>
                            <img className='w-20 relative top-2 ' src={upload} alt="" />
                            <input accept='image/*' onChange={handleImgeUpload} type="file" className='absolute w-full h-full rounded-full opacity-0' />
                        </div>
                    }
                    <Input color='white' input={nameInput} setInput={setName} id='name' type='text' label='Name' />
                    <Input color='white' input={emailInput} setInput={setEmail} id='email' type='text' label='Email' />
                    {!isUpdate && <button type='submit' className='w-full p-3 rounded-md bg-white text-black text-base font-medium'>Update</button>}
                    {isUpdate && <div className='w-full p-6 rounded-md bg-white flex justify-center items-center relative'>
                        <img className="w-6 absolute animate-spin" src={loading} alt="" />
                    </div>}
                </form>
            </div>
        </div>
    )
}

export default Profile
