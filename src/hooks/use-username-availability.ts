import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useDebounce } from '@/hooks/use-debounce'

export type AvailabilityStatus = 'idle' | 'loading' | 'available' | 'taken' | 'invalid' | 'error'

interface UseUsernameAvailabilityResult {
    username: string
    status: AvailabilityStatus
    isChecking: boolean
    isAvailable: boolean
    message: string
    checkUsername: (username: string) => void
    reset: () => void
}

export function useUsernameAvailability(initialUsername: string = ''): UseUsernameAvailabilityResult {
    const [username, setUsername] = useState(initialUsername)
    const [status, setStatus] = useState<AvailabilityStatus>('idle')
    const [message, setMessage] = useState('')

    // Debounce the username change to avoid too many requests
    const debouncedUsername = useDebounce(username, 500)

    useEffect(() => {
        // Skip if empty or same as initial (for editing existing profile, pass initialUsername as current one)
        if (!debouncedUsername) {
            setStatus('idle')
            setMessage('')
            return
        }

        // Basic validation
        // Allow A-Z, a-z, 0-9, -, _
        const isValidFormat = /^[a-zA-Z0-9_-]+$/.test(debouncedUsername)
        if (!isValidFormat) {
            setStatus('invalid')
            setMessage('Nur Buchstaben, Zahlen, Bindestriche und Unterstriche erlaubt.')
            return
        }

        if (debouncedUsername.length < 3) {
            setStatus('invalid')
            setMessage('Mindestens 3 Zeichen erforderlich.')
            return
        }

        // Check availability
        const checkAvailability = async () => {
            setStatus('loading')
            setMessage('Prüfe Verfügbarkeit...')

            try {
                // Use the RPC function we created
                const { data: isAvailable, error } = await supabase.rpc('check_slug_availability', {
                    slug_to_check: debouncedUsername
                })

                if (error) {
                    throw error
                }

                if (isAvailable) {
                    setStatus('available')
                    setMessage('Benutzername ist verfügbar!')
                } else {
                    // If we are editing our own profile, checking our current username should effectively be "available" (not taken by someone else)
                    // But here we are just checking raw availability. The consuming component should handle "if username === initialUsername then it's fine".
                    // However, for simplicity, let's assume this hook is for checking NEW usernames.
                    // If initialUsername is provided and matches debouncedUsername, we can say it's valid (it's yours)
                    if (initialUsername && debouncedUsername === initialUsername) {
                        setStatus('available')
                        setMessage('Das ist Ihr aktueller Benutzername.')
                    } else {
                        setStatus('taken')
                        setMessage('Dieser Benutzername ist bereits vergeben.')
                    }
                }
            } catch (error) {
                console.error('Error checking username availability:', error)
                setStatus('error')
                setMessage('Fehler bei der Überprüfung via Netzwerk.')
            }
        }

        checkAvailability()
    }, [debouncedUsername, initialUsername])

    const checkUsername = (newUsername: string) => {
        setUsername(newUsername)
        // Instant feedback for empty
        if (!newUsername) {
            setStatus('idle')
            setMessage('')
        } else {
            // Set to loading immediately to show something is happening before debounce
            setStatus('loading')
            setMessage('...')
        }
    }

    const reset = () => {
        setUsername('')
        setStatus('idle')
        setMessage('')
    }

    return {
        username,
        status,
        isChecking: status === 'loading',
        isAvailable: status === 'available',
        message,
        checkUsername,
        reset
    }
}
