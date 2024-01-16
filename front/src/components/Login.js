import {useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import Header from "./Header";
import Browse from "./Browse";
import {checkValidData} from "../utils/validator";
import {addUser} from "../utils/store/slices/userSlice";
import {API_URL} from "../utils/constants";

const Login = () => {
    const dispatch = useDispatch(), [isSignInForm, setIsSignInForm] = useState(true), [errorMessage, setErrorMessage] = useState(null),
        userName = useRef(null), password = useRef(null), user = useSelector((store) => store.user)

    const toggleSignInForm = () => {
        setErrorMessage(null)
        setIsSignInForm(!isSignInForm)
    }

    const handleFormSubmission = async () => {
        //validate form data
        const message = checkValidData(userName?.current?.value, password?.current?.value,)

        setErrorMessage(message)

        if (message) return;
        const data = {
            userName: userName?.current?.value, password: password?.current?.value,
        }, options = {
            method: 'POST', body: JSON.stringify(data), headers: {
                'Content-Type': 'application/json'
            }
        }

        if (!isSignInForm) {
            const response = await fetch(API_URL + '/api/user/register', options),
                result = await response.json();
            setErrorMessage({apiCall: true, flag: result.error, ...result})
            if (result.error) {
                setErrorMessage({apiCall: true, flag: result.error, ...result})
                return;
            }
            setErrorMessage({apiCall: true, flag: false, message: "Registration Successful, Kindly Login... "})
            userName.current.value = ""
            password.current.value = ""
            setTimeout(() => setErrorMessage(null), 2000)
        } else {
            const response = await fetch(API_URL + '/api/user/login', options),
                result = await response.json();
            setErrorMessage({apiCall: true, flag: result.error, message: result.message})
            if (result.error) return;
            dispatch(addUser({
                ...result.data
            }))
            userName.current.value = ""
            password.current.value = ""
            setTimeout(() => setErrorMessage(null), 2000)
        }
    }

    if (user) {
        return (<>
            <Header/>
            <Browse/>
        </>)
    }

    return (<div>
        <Header/>
        <form onSubmit={(e) => e.preventDefault()}
              className="w-screen md:w-4/12 absolute p-12 bg-black my-2 mx-auto right-0 left-0 text-whote rounded-lg bg-opacity-80">
            <h1 className="font-bold text-3xl py-4">{isSignInForm ? "Sign In" : "Sign Up"}</h1>

            {errorMessage?.apiCall && (<ErrorMessageHTML errorObj={errorMessage}/>)}

            <input type="text" ref={userName} placeholder="Username"
                   className="p-4 my-4 w-full bg-gray-700 rounded-lg"/>
            {errorMessage?.error === "userName" && (<ErrorMessageHTML errorObj={errorMessage}/>)}


            <input type="password" ref={password} autoComplete="new-password" placeholder="Password"
                   className="p-4 my-4 w-full bg-gray-700 rounded-lg"/>
            {errorMessage?.error === "password" && (<ErrorMessageHTML errorObj={errorMessage}/>)}

            <button className="bg-[#e50914] p-4 my-6 w-full rounded-lg" onClick={handleFormSubmission}>
                {isSignInForm ? "Sign In" : "Sign Up"}
            </button>
            <p className="py-4 text-gray-500">
                {isSignInForm ? "New User" : "Already have an account?"}
                <span onClick={toggleSignInForm}
                      className="cursor-pointer text-white">{isSignInForm ? " Sign up now" : " Sign in now"}</span>
            </p>
        </form>
    </div>)
}

export default Login

const ErrorMessageHTML = ({errorObj}) => (
    <p className={`${errorObj?.flag == false ? "text-green-500 " : "text-red-500 "} font-bold text-lg py-2`}>{errorObj?.message}</p>);