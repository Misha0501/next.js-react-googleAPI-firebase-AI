"use client"
import {createContext, useContext, useEffect, useState} from 'react';
import {setCookie} from 'cookies-next';
import {onAuthStateChanged,} from 'firebase/auth';
import {firebaseClientAuth} from '@/app/lib/firebase/configClient';


export const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
                                        children,
                                    }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebaseClientAuth, async (user) => {
            if (user) {
                setUser(user);
                const token = await user.getIdToken();
                setCookie('authToken', token);
            } else {
                setUser(null);
                setCookie('authToken', '');
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};