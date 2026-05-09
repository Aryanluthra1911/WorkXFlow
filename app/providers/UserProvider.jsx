'use client'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useUserStore from '@/store/user/useUserstore'
import api from '@/lib/axios'

const UserProvider = ({ children }) => {
    const { data: session, status } = useSession()
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)

    useEffect(() => {
        const isLoggingOut = sessionStorage.getItem("isLoggingOut");

        if (isLoggingOut === "true") return;

        if (status !== "authenticated") return;
        if (!session?.user?.email || user) return;

        const fetchUser = async () => {
            try {
                const res = await api.get('/Dashboard/fetchUserData', {
                    params: { email: session.user.email }
                })
                setUser(res.data.data)
            } catch (err) {
                console.error(err)
            }
        }

        fetchUser()
    }, [session, user, status])

    return children
}

export default UserProvider