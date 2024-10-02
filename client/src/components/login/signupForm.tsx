import Input from "../input/input"
import google from '../../assets/google.jpg'
import loading from '../../assets/loading.svg'

interface propType{
    setName:React.Dispatch<React.SetStateAction<string>>
    setEmail:React.Dispatch<React.SetStateAction<string>>
    setpassword:React.Dispatch<React.SetStateAction<string>>
    nameInput:string
    emailInput:string
    passwordInput:string
    handleMove:()=>void
    handleSubmit:(event:React.FormEvent)=>void
    styleFormSignUp:React.CSSProperties,
    isCreate:boolean
}

function SignupForm({nameInput,setName,emailInput,setEmail,passwordInput,setpassword,handleMove,handleSubmit,styleFormSignUp,isCreate}:propType) {
    return (
            <div style={styleFormSignUp} className='flex flex-col justify-center gap-2 p-2 sm:p-5 md:p-8 lg:p-10 pt-2 sm:pt-5 md:pt-10 px-5 absolute top-0 h-full w-full'>
                <div className='flex flex-col'>
                    <p className='text-black text-center text-2xl font-medium p-2 pl-0 tracking-wider'>Create an Account</p>
                    <p className='text-center font-medium text-black text-sm tracking-widest'>Create Read Update Delete</p>
                </div>
                <form className='flex flex-col gap-5' action="" onSubmit={handleSubmit}>
                    <Input input={nameInput} setInput={setName} id='name' type='text' label='Name' />
                    <Input input={emailInput} setInput={setEmail} id='email' type='text' label='Email' />
                    <Input input={passwordInput} setInput={setpassword} id='password' type='password' label='Password' />
                    {!isCreate && <button type='submit' className='p-3 rounded-md bg-black text-white text-base font-base'>Sign In</button>}
                    {isCreate && <div className='p-6 rounded-md bg-black flex justify-center items-center relative'>
                        <img className="w-6 absolute animate-spin" src={loading} alt="" />
                    </div>}
                    <div className='flex gap-2 justify-center items-center relative p-2 rounded-md bg-white border-2 border-black border-opacity-15 w-full'>
                        <img className='w-7 h-7' src={google} alt="" />
                        <button type='button' className=' text-black text-base font-base font-medium'>Sign In with Google</button>
                    </div>
                </form>
                <p onClick={handleMove} className='text-black text-center text-base'>Already have an account?<span className='pl-2 mt-2 cursor-pointer font-medium text-base'>SignIn</span></p>
            </div>
    )
}

export default SignupForm
