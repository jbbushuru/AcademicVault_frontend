// src/app/auth.tsx

import Login from "../screens/Login";
import SignUp from "../screens/Signup";

const hasAccount = false;
export default function Auth(){
   
    if (hasAccount)
        return <Login/>
     
    else
        return <SignUp/>

}