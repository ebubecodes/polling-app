"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/contexts/auth-context";
import { supabase } from "@/lib/supabase-client";

export function Header() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/polls" && pathname.startsWith("/polls")) {
      return true;
    }
    return pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      setIsDropdownOpen(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto max-w-6xl h-16 flex items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-foreground">
            polling-app
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-sm">
            <Link 
              href="/polls" 
              className={`transition-colors font-medium ${
                isActive("/polls") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              My Polls
            </Link>
            <Link 
              href="/polls/new" 
              className={`transition-colors font-medium ${
                isActive("/polls/new") 
                  ? "text-primary" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Create Poll
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button asChild variant="outline" size="sm">
                <Link href="/polls/new">Create Poll</Link>
              </Button>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-secondary-foreground hover:bg-secondary/80 transition-colors"
                >
                  {user.email?.[0]?.toUpperCase() || 'U'}
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-50">
                    <div className="py-1">
                      <div className="px-4 py-2 text-sm text-muted-foreground border-b border-border">
                        {user.email}
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Click outside to close dropdown */}
      {isDropdownOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsDropdownOpen(false)}
        />
      )}
    </header>
  );
}


