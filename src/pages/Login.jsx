import { useState } from "react"
import {
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import {  signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { RiLockPasswordLine } from "react-icons/ri"
import { MdOutlineMarkEmailUnread } from "react-icons/md"
import { IoIosArrowRoundForward } from "react-icons/io"

function Login() {
  const[error,setError]=useState({})
    const[loading,setLoading]=useState(false)
    const[userForm,setFormData]=useState({
        email:"",
        password:"",
    })
    const navigate = useNavigate()

    function handleFieldUpdate(e){
        const{name,value}=e.target;
        setFormData((formInput)=>({
            ...formInput, [name]:value
        }))
        setError((prevErrors)=>({
            ...prevErrors,
            [name]:""
        }))
    }
    async function handleLogin(e){
        e.preventDefault();

        const newErrors ={};
        const{email,password}=userForm;
        if(!email.trim()){
            newErrors.email = "Please enter your email"
        }
        if(!password.trim()){
            newErrors.password = "Please enter your password"
        }
        setError(newErrors)
        if(Object.keys(newErrors).length > 0) return
        try {
            setLoading(true)
            setError({});
            const userCredentials = await signInWithEmailAndPassword(auth,email,password);
            if(userCredentials.user){
                navigate('/')
                toast.success("Login success")
            }        
        } catch (err) {
            setError(err.message)   
        }finally{
            setLoading(false)
        }

    }

  return (
    <div className="loginDiv">
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <FormControl>
                <FormLabel><MdOutlineMarkEmailUnread />Email</FormLabel>
                <Input type='email' name="email" placeholder="johndoe@gmail.com" value={userForm.email} onChange={handleFieldUpdate} />
                { error.email && <p className="errMsg">{error.email}</p>}
            </FormControl>
            <FormControl>
                <FormLabel><RiLockPasswordLine />Password</FormLabel>
                <Input type='password' name="password" placeholder="enter password" value={userForm.password} onChange={handleFieldUpdate} />
                { error.password && <p className="errMsg">{error.password}</p>}
            </FormControl>
            <p>Don't have an account? <Link  to='/signup' >Signup</Link></p>
            <button className="loginbtn">{loading ? "Logging in...":<><IoIosArrowRoundForward fontSize={'20px'}/>Login</>}</button>
        </form>
    </div>
  )
}

export default Login