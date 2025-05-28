import React, { useState, useEffect, createContext, useContext } from 'react';
import { validateToken } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('authToken') || '');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isValidating, setIsValidating] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (token) {
            validateUserToken(token);
        } else {
            setIsAuthenticated(false);
            setIsAdmin(false);
        }
    }, [token]);

    const validateUserToken = async (tokenToValidate) => {
        setIsValidating(true);
        try {
            const result = await validateToken(tokenToValidate);
            if (result.valid) {
                setIsAuthenticated(true);
                localStorage.setItem('authToken', tokenToValidate);
                // Assume API returns role info; adjust based on your API
                setIsAdmin(result.data?.role === 'admin' || false);
            } else {
                setIsAuthenticated(false);
                setIsAdmin(false);
                localStorage.removeItem('authToken');
                setToken('');
            }
        } catch (error) {
            console.error('Token validation error:', error);
            setIsAuthenticated(false);
            setIsAdmin(false);
            localStorage.removeItem('authToken');
            setToken('');
        } finally {
            setIsValidating(false);
        }
    };

    const login = async (newToken) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken('');
        setIsAuthenticated(false);
        setIsAdmin(false);
        localStorage.removeItem('authToken');
    };

    const setAdminStatus = (adminStatus) => {
        setIsAdmin(adminStatus);
    };

    const value = {
        token,
        isAdmin,
        isAuthenticated,
        isValidating,
        login,
        logout,
        setAdminStatus,
        validateUserToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};