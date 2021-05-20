import firebase from "firebase/app";
import React, { useContext, useState } from "react";
import "firebase/auth";
import firebaseConfig from "./firebase.config";
import { UserContext } from "../../App";
import { useHistory, useLocation } from "react-router";
import './Login.css'
import { useForm } from "react-hook-form";

export const firebasrInitialize = () => {
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
  }
};
const Login = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [error, setError] = useState('')
  const history = useHistory();
  const location = useLocation();
  const { from } = location.state || { from: { pathname: "/" } };


  const handleGoogleSignIn = () => {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((res) => {
        const { displayName, email } = res.user;
        const signedInUser = { name: displayName, email };
        setLoggedInUser(signedInUser);
        history.replace(from);
      })
      .catch((error) => {
        var errorMessage = error.message;
        setError(errorMessage)
        console.log(errorMessage);
      });
  };

  const {register,handleSubmit,formState: { errors }} = useForm();
    const onSubmit = (data) => {
    const { email, password } = data;
      
   if(signInInfo){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((res) => {
      updateUserName(data.name);
      const { email } = res.user;
      const signedInUser = { name: data.name, email };
      setLoggedInUser(signedInUser);
      history.replace(from);
    })
    .catch((error) => {
      var errorMessage = error.message;
      setError(errorMessage)
      console.log(errorMessage);
    });    
   }

      firebase.auth().signInWithEmailAndPassword(data.email, data.password)
    .then((res) => {
      const {displayName, email} = res.user;
      const signedInUser = {name: displayName, email}
      setLoggedInUser(signedInUser)
      history.replace(from);

    })
    .catch((error) => {
     
      var errorMessage = error.message;
      setError(errorMessage)
      console.log(errorMessage)
    });
  };
  const updateUserName = (name) => {
    const user = firebase.auth().currentUser;
    user
      .updateProfile({
        displayName: name,
      })
      .then((res) => {
        console.log("user is updated", name);
      })
      .catch((error) => {
       console.log(error.message)
      });
  };

  const [signInInfo, setSignInInfo] = useState(true)

  return (
    <div>
      <div style={{margin:'auto', width: '300px'}}>
       <h1>Welcome</h1>
      <button onClick={handleGoogleSignIn}>Google Sign in</button>
      <button onClick={() => setSignInInfo(false)}>Sign in </button>
      <button onClick={() => setSignInInfo(true)}>Sign up</button>
      </div>


   <form className="input-form" onSubmit={handleSubmit(onSubmit)}>
      {
        signInInfo && (<div><input className="input-box" {...register("name", { required: true })} placeholder="Your name"/>
           {errors.name && <span className="error">This name is required</span>}
           </div>
           )
      }
       <input
          className="input-box"
          {...register("email", { required: true })}
          placeholder="Your email"
        />
        {errors.email && <span className="error">This email is required</span>}
        <input
          type="password"
          className="input-box"
          {...register("password", { required: true })}
          placeholder="Your password"
        />
        {errors.password && (
          <span className="error">This password is required</span>
        )}

        <input className="submit" type="submit" value = {signInInfo ? 'Sign up': 'Sign in' } />
        <p className="error">{error}</p>
      </form>
          
    </div>
  );
};

export default Login;
