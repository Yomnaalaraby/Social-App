import React, { useContext } from 'react'
import { AuthContext } from '../Context/AuthContext'
import { Navigate } from 'react-router-dom'

export default function AuthRoute({ children }) {
    const { token } = useContext(AuthContext)
    if (token) {
        return <Navigate to={'/'} />
    } else {
        return children
    }
    return (
        <div>AuthRoute</div>
    )
}
