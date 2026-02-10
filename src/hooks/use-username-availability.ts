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
    const [isDirty, setIsDirty] = useState(false)

    // Debounce the username change to avoid too many requests
    const debouncedUsername = useDebounce(username, 500)

    // Sync state when initialUsername changes (e.g. after profile load or save)
    // Only sync if the user hasn't started typing yet (not dirty)
    useEffect(() => {
        if (!isDirty) {
            setUsername(initialUsername)
            setStatus('idle')
            setMessage('')
        }
    }, [initialUsername, isDirty])

    useEffect(() => {
        // Skip if empty or same as initial (for editing existing profile)
        if (!debouncedUsername) {
            setStatus('idle')
            setMessage('')
            return
        }

        // Case-insensitive comparison with initial username
        if (initialUsername && debouncedUsername.toLowerCase() === initialUsername.toLowerCase()) {
            setStatus('idle') // Treat as idle if it's the current username
            setMessage('Das ist Ihr aktueller Benutzername.')
            return
        }

        // Basic validation
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
                // Use the RPC function (already case-insensitive in DB)
                const { data: isAvailable, error } = await supabase.rpc('check_slug_availability', {
                    slug_to_check: debouncedUsername
                })

                if (error) throw error

                if (isAvailable) {
                    setStatus('available')
                    setMessage('Benutzername ist verfügbar!')
                } else {
                    setStatus('taken')
                    setMessage('Dieser Benutzername ist bereits vergeben.')
                }
            } catch (error) {
                console.error('Error checking username availability:', error)
                setStatus('error')
                setMessage('Fehler bei der Überprüfung.')
            }
        }

        checkAvailability()
    }, [debouncedUsername, initialUsername])

    const checkUsername = (newUsername: string) => {
        setIsDirty(true)
        setUsername(newUsername)

        if (!newUsername) {
            setStatus('idle')
            setMessage('')
        } else if (initialUsername && newUsername.toLowerCase() === initialUsername.toLowerCase()) {
            setStatus('idle')
            setMessage('Das ist Ihr aktueller Benutzername.')
        } else {
            setStatus('loading')
            setMessage('...')
        }
    }

    const reset = () => {
        setUsername(initialUsername)
        setIsDirty(false)
        setStatus('idle')
        setMessage('')
    }

    return {
        username,
        status,
        isChecking: status === 'loading',
        isAvailable: status === 'available' || (username.toLowerCase() === initialUsername.toLowerCase() && username !== ""),
        message,
        checkUsername,
        reset
    }
}
