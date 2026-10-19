import { useState } from "react"
import {
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { FaRegUser } from "react-icons/fa"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../firebase"
import { doc, setDoc } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { RiLockPasswordLine } from "react-icons/ri"
import { MdOutlineMarkEmailUnread } from "react-icons/md"
import { IoIosArrowRoundForward } from "react-icons/io"

function Signup() {
    const[error,setError]=useState({})
    const[loading,setLoading]=useState(false)
    const[userForm,setFormData]=useState({
        username:"",
        email:"",
        password:"",
    })

    const navigate = useNavigate()

    function handleFieldUpdate(e){
        const{name,value}=e.target;
        setFormData((formInput)=>({
            ...formInput, [name]:value
        }));

        setError((prevErrors)=>({
            ...prevErrors,
            [name]:""
        }))
    }

    async function handleSignup(e){
        e.preventDefault();

        const newErrors ={};

        const{username,email,password}=userForm;
        if(!username.trim()){
            newErrors.username = "Please enter username"
        }
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
            const userCredentials = await createUserWithEmailAndPassword(auth,email,password);
            if(userCredentials.user){
                const newUser ={
                    username,
                    email,
                    registeredOn: userCredentials.user.metadata.creationTime,
                    userId: userCredentials.user.uid
                }
                const docRef = doc(db,"users",userCredentials.user.uid);
                await setDoc(docRef,newUser);
                navigate('/login')
                toast.success("Account created")
            }
            
        } catch (err) {
            setError(err.message)
            
        }finally{
            setLoading(false)
        }

    }


  return (
    <div className="signupDiv">
        <form onSubmit={handleSignup}>
            <h2>Signup</h2>
            <FormControl>
                <FormLabel><FaRegUser />Username</FormLabel>
                <Input type='text' name="username" placeholder="john doe" value={userForm.username} onChange={handleFieldUpdate} />
                {error.username && <p className="errMsg">{error.username}</p>}
            </FormControl>

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
                <p>Already have an account? <Link  to='/login' >Login</Link></p>
            <button className="signupbtn">{loading ? "Signing up...":<><IoIosArrowRoundForward />Signup</>}</button>
        </form>
    </div>
  )
}

export default Signup