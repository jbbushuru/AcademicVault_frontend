// src/app/auth.tsx

import React, { useState } from 'react';
import Login from "@/src/screens/auth/Login";
import SignUp from "@/src/screens/auth/Signup";

export default function Auth(){
    const [hasAccount, setHasAccount] = useState(true);
   
    if (hasAccount)
        return <Login onSwitchToSignup={() => setHasAccount(false)} />
     
    else
        return <SignUp onSwitchToLogin={() => setHasAccount(true)} />

}