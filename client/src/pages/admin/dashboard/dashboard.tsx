import { useSelector } from 'react-redux';
import NavbarComponent from '../../../components/navbar/admin/navbar_admin';
import pic from '../../../assets/pic1.jpg'
import loading from '../../../assets/loading.svg'

function Dashboard() {

  const admin = useSelector((state: any) => state.admin)

  return (
    <div style={{
      backgroundImage: `url(${pic})`,
      backgroundSize: 'cover',
    }} className="h-screen w-full bg-white relative flex items-center justify-center">
      <div className='w-screen h-screen flex justify-center items-center'>
        <NavbarComponent />

        <div className='flex flex-col gap-2 items-center'>
          {admin &&
            <>
              <p className='text-4xl text-white font-extrabold p-2'>{admin?.name}</p>
              <p className='bg-clip-text text-white text-xl'>{admin?.email}</p>
            </>
          }
          {!admin &&
            <>
              <img className='w-10 animate-spin' src={loading} alt="" />
            </>
          }
        </div>
      </div>
    </div>
  )
}

export default Dashboard
