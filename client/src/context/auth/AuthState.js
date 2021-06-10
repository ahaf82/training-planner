import React, { useReducer } from 'react';
import axios from 'axios';
import AuthContext from './authContext';
import authReducer from './authReducer';
import setAuthToken from '../../utils/setAuthToken'
import {
    REGISTER_SUCCESS,
    REGISTER_FAIL,
    RESET_PASSWORD,
    MEMBER_LOADED,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT,
    CLEAR_ERRORS
} from '../types';

const AuthState = props => {
    const initialState = {
        token: localStorage.getItem('token'),
        isAuthenticated: null,
        loading: true,
        member: null,
        role: null,
        error: null
    };

    const [state, dispatch]  = useReducer(authReducer, initialState);

    // load Member
    const loadMember = async() => {
        if(localStorage.token) {
            setAuthToken(localStorage.token);
        }

        try {
            const res = await axios.get('/api/auth');
            dispatch({
                type: MEMBER_LOADED,
                payload: res.data
            })
        } catch (error) {
            console.log(error);
            dispatch({
                type: AUTH_ERROR
            })
        }
    };

    // Register user
    const register = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };   
            
        try {
            const res = await axios.post('/api/member', formData, config);
            dispatch({
                type: REGISTER_SUCCESS,
                payload: res.data
            });

            loadMember();
        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                type: REGISTER_FAIL,
                payload: error.response.data.msg
            })
        }
    }


    // Login Member
    const login = async formData => {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };   
            
        try {
            const res = await axios.post('/api/auth', formData, config);
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data
            });

            loadMember();
        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                type: LOGIN_FAIL,
                payload: error.response.data.msg
            })
        }
    }

    //reset Password
    const resetPassword = async (email) => {   
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };   
                     
        try {
            console.log("tretre");
            const res = await axios.post('/api/auth/request-password-reset', email, config);
            console.log("result", res)
            dispatch({
                type: RESET_PASSWORD,
                payload: res.data
            })
        } catch (error) {
            console.log(error.response.data.msg);
            dispatch({
                type: REGISTER_FAIL,
                payload: error.response.data.msg
            })
        }
    }



    // Logout
    const logout = () => dispatch({ type: LOGOUT});

    // Clear Errors
    const clearErrors = () => dispatch({ type: CLEAR_ERRORS });


    return (
        <AuthContext.Provider
            value={{
                token: state.token,
                isAuthenticated: state.isAuthenticated,
                loading: state.loading,
                member: state.member,
                role: state.role,
                error: state.error,
                register,
                loadMember,
                login,
                logout,
                clearErrors,
                resetPassword
            }}>
            {props.children}
        </AuthContext.Provider>
    )
};

export default AuthState;