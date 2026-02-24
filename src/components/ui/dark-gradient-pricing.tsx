import { motion } from "framer-motion"
import { Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Link } from "react-router-dom"

interface BenefitProps {
  text: string
  checked: boolean
}

const Benefit = ({ text, checked }: BenefitProps) => {
  return (
    <div className="flex items-center gap-3">
      {checked ? (
        <span className="grid size-4 place-content-center rounded-full bg-primary text-sm text-primary-foreground">
          <Check className="size-3" />
        </span>
      ) : (
        <span className="grid size-4 place-content-center rounded-full dark:bg-zinc-800 bg-zinc-200 text-sm dark:text-zinc-400 text-zinc-600">
          <X className="size-3" />
        </span>
      )}
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}

interface PricingCardProps {
  tier: string
  price: string
  bestFor: string
  CTA: string
  benefits: Array<{ text: string; checked: boolean }>
  className?: string
  href?: string
}

export const PricingCard = ({
  tier,
  price,
  bestFor,
  CTA,
  benefits,
  className,
  href,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group"
    >
      <Card
        className={cn(
          "relative h-full w-full overflow-hidden border transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)]",
          "dark:border-zinc-700/50 dark:bg-gradient-to-br dark:from-zinc-950/50 dark:to-zinc-900/80",
          "border-zinc-200/50 bg-gradient-to-br from-zinc-50/50 to-zinc-100/80",
          "p-6",
          className
        )}
      >
        <div className="flex flex-col items-center border-b pb-6 dark:border-zinc-700/50 border-zinc-200/50">
          <span className="mb-6 inline-block text-foreground font-bold tracking-tight">
            {tier}
          </span>
          <span className="mb-3 inline-block text-4xl font-extrabold tracking-tight">
            {price}
          </span>
          <span className="dark:bg-gradient-to-br dark:from-zinc-200 dark:to-zinc-500 bg-gradient-to-br from-zinc-700 to-zinc-900 bg-clip-text text-center text-transparent text-sm">
            {bestFor}
          </span>
        </div>
        <div className="space-y-4 py-9">
          {benefits.map((benefit, index) => (
            <Benefit key={index} {...benefit} />
          ))}
        </div>
        {href ? (
          <Link to={href} className="w-full block">
            <Button
              className={cn(
                "w-full transition-all duration-300",
                tier === "Business" && "shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
              )}
              variant={tier === "Business" ? "default" : "ghost"}
            >
              {CTA}
            </Button>
          </Link>
        ) : (
          <Button
            className={cn(
              "w-full transition-all duration-300",
              tier === "Business" && "shadow-[0_4px_14px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]"
            )}
            variant={tier === "Business" ? "default" : "ghost"}
          >
            {CTA}
          </Button>
        )}
      </Card>
    </motion.div>
  )
}
