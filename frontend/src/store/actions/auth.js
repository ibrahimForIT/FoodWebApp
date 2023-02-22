import * as actionTypes from './actionTypes';
import axios from 'axios';
import { message, notification } from 'antd';



export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = token => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token
    }
}

export const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    }
}

export const logout = () => {
   
    
  //  axios.get('http://localhost:8000/rest-auth/logout/')
    //.then ( () => {
       // message.success('Logged out Successfully');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('id');
        localStorage.removeItem('token');
        
   /* })
    .catch(err => {
        message.error('Fail to Logout');
        console.log("Logout ERROR!! ", err);
    })
   */
    return {
        type: actionTypes.AUTH_LOGOUT
    };
}

export const checkAuthTimeout = expirationDate => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationDate *1000)
    }
}

export const authLogin = (username, password, remember) => {
    return dispatch => {
        dispatch(authStart());
        axios.post('http://localhost:8000/rest-auth/login/', {
            id_field: username,
            password: password
        }).then (res => {
            console.log(res);
            message.success('Logged in Successfully');
            const token = res.data.key;
            let expirationDate= new Date();
            {
                remember===false?
                expirationDate= new Date (new Date().getTime() + 3600 *1000)
                :
                expirationDate= new Date (new Date().getTime() + 3600 *1000 * 24);
            }
            localStorage.setItem('token',token);
            localStorage.setItem('expirationDate',expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
            console.log(localStorage.getItem('token'));
            axios.post('http://localhost:8000/api/id-by-key/', 
            {
              Content: {
                key: token
            } }, {
                headers: {
                    'Authorization': `token ${localStorage.getItem('token')}`
                }
          })
          .then(res => {
              localStorage.setItem('id', res.data.id );
              console.log(res.data.id);
              console.log("Profile id ",localStorage.getItem('id'))
          }).catch(err => {
            message.error('Fail to get id');
            
        })
        })
        .catch(err => {
            message.error('Fail to Login');
            dispatch(authFail(err))
        })
        
    }
}


export  const  authSignup = ( email , password1, password2, first_name, last_name, phone_no) => {
    return dispatch => {
        dispatch(authStart());
        console.log("HELLOW HERE!");
        axios.post('http://127.0.0.1:8000/rest-auth/registration/', {
            email: email,
            password1: password1,
            password2: password2,
            phone_no: phone_no,
            first_name: first_name,
            last_name: last_name,
        }).then (res => {
            const token = res.data.key;
            message.success('Please Contact us to complete the login process and confirm your email address');
            console.log(res.data.key);
            const expirationDate= new Date (new Date().getTime() + 3600 *1000);
            localStorage.setItem('token',token);
            localStorage.setItem('expirationDate',expirationDate);
            dispatch(authSuccess(token));
            dispatch(checkAuthTimeout(3600));
            message.success('Registeres Successfully');
            notification.open({
                message: 'Registeres Successfully',
                description:
                  'We send a message has a confirmation link to confirm your Email',
                onClick: () => {
                  console.log('Notification Clicked!');
                },
              });
        })
        .catch(err => {
            message.error('Fail to Register');
            console.log(err);
            dispatch(authFail(err));
        })
    }
}
export const authCheckState = () => {
    return dispatch => {
        const token= localStorage.getItem('token');
        if (token === undefined) {
            dispatch(logout());
            
        } else {
            const expirationDate= new Date(localStorage.getItem('expirationDate'))
            if (expirationDate <= new Date() ) {
                dispatch(logout());
              
            } else {
                console.log('dddsssssssssssssssssssssssssssss');
                dispatch(authSuccess(token));
                dispatch(checkAuthTimeout( (expirationDate.getTime() - new Date().getTime()) /1000) );
            }
        }
    }
}