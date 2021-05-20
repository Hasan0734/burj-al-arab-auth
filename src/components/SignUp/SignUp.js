import firebase from "firebase/app";
import "firebase/auth";
import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { useHistory, useLocation } from "react-router";
import { UserContext } from '../../App';
import { firebasrInitialize } from "../Login/Login";
import './SignUp.css'

 firebasrInitialize()


const SignUp = () => {
    const [loggedInUser, setLoggedInUser] = useContext(UserContext)
    const history = useHistory()
    const location = useLocation()
    const { from } = location.state || { from: { pathname: "/" } };

    const { register, handleSubmit,  formState: { errors } } = useForm();
  const onSubmit = data => {
    const {email, password} =  data
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((res) => {
       updateUserName(data.name)
      const{ email} = res.user;
      const signedInUser = {name: data.name, email}
      setLoggedInUser(signedInUser)
      history.replace(from);
      
    })
    .catch((error) => {
      
      var errorMessage = error.message;
      // ..
      console.log(errorMessage)
    });
  };
  
 const updateUserName = (name) => {
    const user = firebase.auth().currentUser;
user.updateProfile({
  displayName: name,
 
}).then((res) => {
  console.log('user is updated', name)
}).catch((error) =>  {
 console.log(error.message)
});
}
 

    return (
        <form className="input-form" onSubmit={handleSubmit(onSubmit)}>  
      
      
      <input className="input-box" {...register("name", { required: true })} placeholder="Your name" />
      {errors.name && <span className='error'>This name is required</span>}
      <input className="input-box" {...register("email", { required: true })} placeholder="Your email" />
      {errors.email && <span className='error'>This email is required</span>}
      <input type="password" className="input-box" {...register("password", { required: true })} placeholder="Your password" />
      {errors.password && <span className='error'>This password is required</span>}
  
      <input className="submit" type="submit" />
    </form>
    );
};

export default SignUp;