"use client";
import LandingPage from "@/app/page";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import React, { useEffect, useState } from "react";
import { PlaceholdersAndVanishInput } from "../ui/placeholders-and-vanish-input";
import UserMenu from "./UserMenu";

    const placeholders = [
      "Search tournaments 🔎",
      
      "Look for upcoming events 🎮",
      "Search organizers 👤",
    
    ];
    
 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
  };

export function NavbarMain() {
  const navItems = [
    {
      name: "Tournaments",
      link: "/tournaments",
    },
    {
      name: "Towers",
      link: "/towers",
    },
    {
      name: "Leaderboard",
      link: "/leaderboard",
    },
    {
      name: "Become Organizer",
      link: "/organizer-info",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    try {
      setHasToken(Boolean(localStorage.getItem("token")));
    } catch {}
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "token") {
        setHasToken(Boolean(e.newValue));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div className="relative w-full">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <PlaceholdersAndVanishInput
              placeholders={placeholders}
              onChange={handleChange}
              onSubmit={onSubmit}
            />
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {hasToken ? (
              <UserMenu />
            ) : (
              <>
                <a href="/auth/login"><NavbarButton variant="secondary">Login</NavbarButton></a>
                <a href="/auth/signup"><NavbarButton variant="dark">Signup</NavbarButton></a>
              </>
            )}
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-metal hover:text-white transition-colors duration-200"
              >
                <span className="block">{item.name}</span>
              </a>
            ))}
            <div className="flex w-full flex-col gap-4">
              {hasToken ? (
                <UserMenu />
              ) : (
                <>
                  <a href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavbarButton variant="dark" className="w-full">Login</NavbarButton>
                  </a>
                  <a href="/auth/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <NavbarButton variant="dark" className="w-full">Signup</NavbarButton>
                  </a>
                </>
              )}
            </div>
          </MobileNavMenu>
        </MobileNav>
      
      </Navbar>
    </div>
  );
}


