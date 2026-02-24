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
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-background/70 backdrop-blur-xl border-b border-border/50 px-6 flex items-center justify-between"
    >
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]">
          N
        </div>
        <span className="font-bold text-lg tracking-tight text-foreground">NFCwear</span>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors duration-200">Home</Link>
        <Link to="/platform" className="hover:text-foreground transition-colors duration-200">Plattform</Link>
        <Link to="/solutions" className="hover:text-foreground transition-colors duration-200">Lösungen</Link>
        <Link to="/sustainability" className="hover:text-foreground transition-colors duration-200">Nachhaltigkeit</Link>
        <Link to="/shop" className="hover:text-foreground transition-colors duration-200">Shop</Link>
        <Link to="/pricing" className="hover:text-foreground transition-colors duration-200">Preise</Link>
        <Link to="/about" className="hover:text-foreground transition-colors duration-200">About Us</Link>
      </div>

      <div className="flex items-center gap-4">
        <ModeToggle />
        <Link to="/login" className="hidden md:block">
          <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-full px-6 shadow-[0_4px_14px_rgba(37,99,235,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(37,99,235,0.35)]">
            Login
          </Button>
        </Link>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-muted-foreground">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border/50 p-6 flex flex-col gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.06)] lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
          <Link to="/" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/platform" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Plattform</Link>
          <Link to="/solutions" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Lösungen</Link>
          <Link to="/sustainability" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Nachhaltigkeit</Link>
          <Link to="/shop" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Shop</Link>
          <Link to="/pricing" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>Preise</Link>
          <Link to="/about" className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors" onClick={() => setIsOpen(false)}>About Us</Link>
          <div className="h-px bg-border/50 my-2" />
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
