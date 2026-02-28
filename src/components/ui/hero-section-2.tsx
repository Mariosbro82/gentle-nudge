'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { Navbar } from '@/components/marketing/navbar'
import { InteractiveDemoDashboard } from '@/components/marketing/interactive-demo-dashboard'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring' as const,
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    const shouldReduceMotion = useReducedMotion()
    const [isCursorActive, setIsCursorActive] = useState(false)

    const cursorX = useMotionValue(-200)
    const cursorY = useMotionValue(-200)
    const cursorXSpring = useSpring(cursorX, { stiffness: 160, damping: 28, mass: 0.5 })
    const cursorYSpring = useSpring(cursorY, { stiffness: 160, damping: 28, mass: 0.5 })

    return (
        <>
            <Navbar />
            <main className="overflow-hidden">
                <section>
                    <div
                        className="relative pt-24 md:pt-36"
                        onMouseMove={(event) => {
                            if (shouldReduceMotion) return
                            const rect = event.currentTarget.getBoundingClientRect()
                            cursorX.set(event.clientX - rect.left)
                            cursorY.set(event.clientY - rect.top)
                            setIsCursorActive(true)
                        }}
                        onMouseLeave={() => setIsCursorActive(false)}
                    >
                        {!shouldReduceMotion && (
                            <motion.div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
                                <motion.div
                                    className="absolute h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,hsl(var(--primary)/0.24)_0%,hsl(var(--primary)/0.1)_38%,transparent_72%)] blur-2xl"
                                    style={{ x: cursorXSpring, y: cursorYSpring, opacity: isCursorActive ? 1 : 0 }}
                                    transition={{ opacity: { duration: 0.25 } }}
                                />
                                <motion.div
                                    className="absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/35 bg-primary/10"
                                    style={{ x: cursorXSpring, y: cursorYSpring, opacity: isCursorActive ? 0.85 : 0 }}
                                    transition={{ opacity: { duration: 0.2 } }}
                                />
                            </motion.div>
                        )}

                        <AnimatedGroup
                            variants={transitionVariants}
                            className="absolute inset-0 -z-10"
                        >
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-56 w-full max-w-lg bg-primary/20 blur-3xl rounded-full" />
                        </AnimatedGroup>

                        <div className="absolute inset-0 -z-10 size-full [background:radial-gradient(125%_125%_at_50%_10%,transparent_40%,hsl(var(--primary))_100%)] opacity-20" />

                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup
                                    variants={transitionVariants}
                                    className="flex flex-col items-center"
                                >
                                    <Link
                                        to="/pricing"
                                        className="hover:bg-primary/10 glass-card group mx-auto flex max-w-fit items-center gap-4 rounded-full border border-border/50 px-5 py-2 text-sm transition-all duration-300"
                                    >
                                        <span className="text-foreground">Sonderpreisträger 2025 🏆</span>
                                        <ChevronRight className="size-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
                                    </Link>

                                    <h1 className="mt-8 max-w-4xl text-balance text-5xl font-extrabold md:text-7xl lg:mt-16 text-foreground tracking-tight leading-[1.05]">
                                        Kleidung, die{' '}
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-zinc-900 dark:from-blue-400 dark:via-purple-400 dark:to-white">
                                            verbindet.
                                        </span>
                                    </h1>

                                    <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-muted-foreground leading-relaxed">
                                        Die SaaS-Plattform für smarte Corporate Fashion. Verwandeln Sie jeden Hoodie in eine Revenue Machine mit messbarem ROI.
                                    </p>

                                    <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row">
                                        <div>
                                            <Button
                                                size="lg"
                                                className="rounded-full px-6 text-base shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
                                                asChild
                                            >
                                                <Link to="/login">
                                                    <span className="text-nowrap">Jetzt starten</span>
                                                    <ChevronRight className="ml-1 size-4" />
                                                </Link>
                                            </Button>
                                        </div>

                                        <Button
                                            size="lg"
                                            variant="ghost"
                                            className="rounded-full px-6 text-base transition-all duration-300 hover:-translate-y-0.5"
                                            asChild
                                        >
                                            <Link to="/contact">
                                                Demo buchen
                                            </Link>
                                        </Button>
                                    </div>
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                item: {
                                    hidden: { opacity: 0, y: 20 },
                                    visible: {
                                        opacity: 1,
                                        y: 0,
                                        transition: { type: 'spring' as const, bounce: 0.3, duration: 2 },
                                    },
                                },
                            }}
                            className="relative mx-auto mt-16 max-w-5xl px-6"
                        >
                            <InteractiveDemoDashboard />
                        </AnimatedGroup>
                    </div>
                </section>

                <section className="py-16 md:py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                                Mögliche Integrationen
                            </p>
                        </div>
                        <div className="mx-auto mt-10 flex max-w-4xl flex-wrap items-center justify-center gap-x-12 gap-y-8 opacity-50 hover:opacity-70 transition-opacity duration-300">
                            <img src="/assets/integrations/salesforce.png" alt="Salesforce" className="h-6 object-contain grayscale" />
                            <img src="/assets/integrations/hubspot.png" alt="HubSpot" className="h-6 object-contain grayscale" />
                            <img src="/assets/integrations/pipedrive.png" alt="Pipedrive" className="h-6 object-contain grayscale" />
                            <img src="/assets/integrations/zapier.png" alt="Zapier" className="h-6 object-contain grayscale" />
                        </div>
                    </div>
                </section>

            </main>
        </>
    )
}
