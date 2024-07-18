import React, { createContext, useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createAxios from "../utils/axios";
const API = createAxios();
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [userId, setUserId] = useState();

  GoogleSignin.configure({
    webClientId:
      "283644597986-6bpm3qm5ot1rrmhie7do9kn326raeiu1.apps.googleusercontent.com",
  });

  // const checkFinish = async ()  => {
  //   const UserLoggedInData = await AsyncStorage.getItem("UserLoggedInData");
    
  //   if (UserLoggedInData) {
  //     if(UserLoggedInData && user){
  //       setFinish(true)
  //       console.log("Finish!: ")

  //     }else {
  //       setFinish(null);
  //       console.log("Noooo!")

  //     }
       
  //     // let udata = JSON.parse(UserLoggedInData);
  //     // return udata;
  //     // console.log("Finish!: ", UserLoggedInData)
      
  //   }
  //   // else {
  //   //   setFinish(null);
  //   //   console.log("Noooo!")
  //   // }

  // }
  // useEffect(() => {
  //   checkFinish(user);
  // }, [user, isStorageUpdated]);

  // const onAuthStateChanged = async (user) => {
  //   setUser(user);
  //   if (initializing) {
  //     // setTimeout(()=>{setInitializing(false)},1500) ;
  //     if (user) {
  //       try {
  //         await loginSystem(user);
  //       } catch (error) {
  //         console.error('Error during login system: ', error);
  //       } finally {
  //         setInitializing(false);
  //       }
  //     } else {
  //       try {
  //         await AsyncStorage.removeItem('UserLoggedInData');
  //       } catch (error) {
  //         console.error('Error removing user data: ', error);
  //       } finally {
  //         setInitializing(false);
  //       }
  //     }
  //   }
  // };

  const onAuthStateChanged = async (user) => {
    console.log("Auth state changed:", user);
    setUser(user);

    try {
      if (initializing) {
        console.log("Initializing...at ");
        // setTimeout(()=> setInitializing(false), 1500)
        // setInitializing(false);
        if (user) {
          console.log("User is authenticated:", user);
          try {
            await loginSystem(user);
            // setInitializing(false);
          } catch (error) {
            console.error('Error during login system: ', error);
          } finally {
            // console.log("Setting initializing to false");
            // setInitializing(false);
          }
        } else {
          console.log("No user authenticated");
          try {
            await AsyncStorage.removeItem('UserLoggedInData');
            // setInitializing(false);
  
          } catch (error) {
            console.error('Error removing user data: ', error);
          } finally {
            // console.log("Setting initializing to false");
            // setInitializing(false);
          }
        }
      }
    } catch (error) {
      console.log(error)
    } finally {
      setInitializing(false)
      console.log("Setting initializing to false at finally");

    }


  };



  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const loginSystem = async (user) => {
    try {
      const response = await API.post('/account/login', {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      });
      if(response){
        console.log('User saved to database: ', response.data.data);
        await AsyncStorage.setItem('UserLoggedInData', JSON.stringify(response.data.data));
        setUserId(response.data.data._id)
      }
    } catch (error) {
      console.error('Error saving user to database: ', error);
    }
  };

  const signInWithGoogle = async () => {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  };

  const signOut = async () => {
    await auth().signOut();
    await GoogleSignin.signOut();
    setUser(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider value={{userId, user, initializing, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
