"use client";
import React from "react";

type DecodedToken = {
  id?: string | number;
  name?: string;
  username?: string;
  mobile?: string;
  email?: string | null;
  [key: string]: unknown;
};

function base64UrlToBase64(input: string) {
  // Replace base64url chars and add padding
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const pad = b64.length % 4 === 2 ? "==" : b64.length % 4 === 3 ? "=" : "";
  return b64 + pad;
}

function safeDecodeJwt(token: string): DecodedToken | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const b64 = base64UrlToBase64(payload);
    const json = typeof window !== "undefined" ? window.atob(b64) : Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function getAvatarUrl(seed: string) {
  const encoded = encodeURIComponent(seed || "neo-user");
  return `https://i.pravatar.cc/150?u=${encoded}`;
}

export default function UserMenu() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [token, setToken] = React.useState<string | null>(null);
  const [storedUser, setStoredUser] = React.useState<any>(null);
  const decoded = React.useMemo(() => (token ? safeDecodeJwt(token) : null), [token]);

  React.useEffect(() => {
    try {
      const t = localStorage.getItem("token");
      setToken(t);
      const u = localStorage.getItem("user");
      setStoredUser(u ? JSON.parse(u) : null);
    } catch {}
  }, []);

  React.useEffect(() => {
    async function fetchProfile() {
      if (!token) return;
      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 401) {
          // token expired/invalid
          try { localStorage.removeItem("token"); localStorage.removeItem("user"); } catch {}
          window.location.reload();
          return;
        }
        if (!res.ok) return;
        const profile = await res.json();
        setStoredUser(profile);
        try { localStorage.setItem("user", JSON.stringify(profile)); } catch {}
      } catch {}
    }
    fetchProfile();
  }, [token]);

  if (!decoded && !storedUser) return null;

  const displayName = (storedUser?.name || storedUser?.username) || decoded?.name || decoded?.username || "Player";
  const email = (storedUser?.email as string) || (decoded?.email as string) || undefined;
  const username = (storedUser?.username as string) || (decoded?.username as string) || undefined;
  const avatar = getAvatarUrl(username || displayName);

  function handleLogout() {
    try { localStorage.removeItem("token"); } catch {}
    try { localStorage.removeItem("user"); } catch {}
    window.location.href = "/";
  }

  return (
    <div className="relative">
      <button
        className="flex items-center gap-2 rounded-full border border-zinc-800/60 bg-black/40 px-2 py-1 text-left text-sm text-white hover:bg-black/60"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <img src={avatar} alt={displayName} className="h-8 w-8 rounded-full" />
        <span className="hidden sm:block max-w-[140px] truncate">{displayName}</span>
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border border-zinc-800/60 bg-zinc-950/95 text-sm text-white shadow-2xl backdrop-blur"
        >
          <div className="border-b border-zinc-800/60 px-4 py-3">
            <p className="text-xs text-zinc-400">Signed in as</p>
            <p className="truncate font-medium">{email || username || displayName}</p>
          </div>
          <div className="grid gap-1 p-1">
            <a className="rounded-md px-3 py-2 hover:bg-zinc-800/50" href="/profile">My Profile</a>
            <a className="rounded-md px-3 py-2 hover:bg-zinc-800/50" href="/tower">My Tower</a>
            <a className="rounded-md px-3 py-2 hover:bg-zinc-800/50" href="/tournaments/history">Tournament History</a>
            {/* <a className="rounded-md px-3 py-2 hover:bg-zinc-800/50" href="/wallet">Wallet &amp; NeoCoins</a> */}
            {/* <a className="rounded-md px-3 py-2 hover:bg-zinc-800/50" href="/settings">Settings</a> */}
            <button onClick={handleLogout} className="rounded-md px-3 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300">
              Log Out
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}


