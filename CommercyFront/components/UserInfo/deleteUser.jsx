'use client';

import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import PopupDelete from '../deletePermanetly';

export default function DeleteUser({ setAuth }) {
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [respuesta, setRespuesta] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }

            const decodeToken = jwtDecode(token);
            const userId = decodeToken._id;
            const emailUser = decodeToken.email;

            console.log(userId);
            console.log(emailUser);
            setEmail(emailUser);

            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.delete(`http://localhost:3000/api/user/deleteUser/${userId}`);
            setShowPopup(false);

            console.log('Delete successful:', response.data);
            if (response.data) {
                setRespuesta('Account deleted successfully');
                setAuth(null, null);
                localStorage.removeItem('token');
                localStorage.removeItem('role');
                router.push('/');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            setError('Delete failed');
        }
    };

    return (
        <div>
            <button
                onClick={() => setShowPopup(true)}
                className="text-red-700 border-2 border-solid border-red-700 rounded-md p-2 font-semibold hover:bg-red-700 hover:text-white"
            >
                Delete Account
            </button>
            {showPopup && (
                <PopupDelete
                    message={`Are you sure you want to delete user with email: ${email}?`}
                    onConfirm={handleSubmit}
                    onCancel={() => setShowPopup(false)}
                />
            )}
            {error && <p className='text-red-500'>{error}</p>}
            {respuesta && <p className='text-green-500'>{respuesta}</p>}
        </div>
    );
}
