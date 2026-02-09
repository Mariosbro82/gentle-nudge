import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-white/5 bg-white/5 dark:bg-black/5 backdrop-blur-xl px-6 flex items-center justify-between"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          N
        </div>
        <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-white">NFCwear</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
        <Link to="/platform" className="hover:text-blue-500 transition-colors">Plattform</Link>
        <Link to="/solutions" className="hover:text-blue-500 transition-colors">Lösungen</Link>
        <Link to="/sustainability" className="hover:text-blue-500 transition-colors">Nachhaltigkeit</Link>
        <Link to="/shop" className="hover:text-blue-500 transition-colors">Shop</Link>
        <Link to="/pricing" className="hover:text-blue-500 transition-colors">Preise</Link>
        <Link to="/about" className="hover:text-blue-500 transition-colors">About Us</Link>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <Link to="/login" className="hidden md:block">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            Login
          </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-zinc-600 dark:text-zinc-300">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white dark:bg-black border-b border-white/10 p-6 flex flex-col gap-4 shadow-2xl lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link to="/" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/platform" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>Plattform</Link>
          <Link to="/solutions" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>Lösungen</Link>
          <Link to="/sustainability" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>Nachhaltigkeit</Link>
          <Link to="/shop" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/pricing" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>Preise</Link>
          <Link to="/about" className="text-lg font-medium text-zinc-600 dark:text-zinc-300" onClick={() => setIsOpen(false)}>About Us</Link>
          <div className="h-px bg-white/10 my-2" />
          <Link to="/login" onClick={() => setIsOpen(false)}>
            <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-full">
              Login
            </Button>
          </Link>
        </div>
      )}
    </motion.nav>
  );
}
