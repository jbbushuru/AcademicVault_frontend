// src/app/auth.tsx

import React, { useState } from 'react';
import Login from "../screens/Login";
import SignUp from "../screens/Signup";

export default function Auth(){
    const [hasAccount, setHasAccount] = useState(false);
   
    if (hasAccount)
        return <Login onSwitchToSignup={() => setHasAccount(false)} />
     
    else
        return <SignUp onSwitchToLogin={() => setHasAccount(true)} />

}