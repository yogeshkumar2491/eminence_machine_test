import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {removeUser} from "../utils/store/slices/userSlice";

const Header = () => {
    const dispatch = useDispatch(),
        user = useSelector((store) => store.user)

    function logOut() {
        dispatch(removeUser())
    }

    return (
        <div>
            <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-6">
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-sm lg:flex-grow">
                        <a href="javascript:void(0)"
                           className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                            Home
                        </a>
                    </div>
                    <div>
                        <span to="/" onClick={user ? logOut : undefined}
                              className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                            {user ? "Logout" : "Sign In / Sign Up"}
                        </span>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Header