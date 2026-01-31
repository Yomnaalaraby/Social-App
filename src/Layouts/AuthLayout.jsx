import React from 'react'
import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
    return <main className="min-h-screen bg-sky-50">
        <Outlet></Outlet>
    </main>
}
