'use client';

import { progressToNextLevel } from '@cortex/shared';
import { motion } from 'framer-motion';
import { LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

import { MAIN_NAV } from '@/lib/navigation';
import { useAuth } from '@/providers/AuthProvider';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, signOut } = useAuth();
  const xpTotal = profile?.xp ?? 0;
  const xp = progressToNextLevel(xpTotal);

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className="glass relative z-10 flex h-screen w-64 shrink-0 flex-col border-r border-white/5">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-white/5 px-5 py-6"
      >
        <motion.div className="flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-lg font-bold text-indigo-300 ring-1 ring-indigo-400/30"
            whileHover={{ scale: 1.05 }}
          >
            C
          </motion.div>
          <motion.div>
            <p className="text-sm font-semibold tracking-wide text-slate-100">
              Cortex OS
            </p>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">
              {profile?.display_name ?? 'Segundo cérebro'}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-5 rounded-xl bg-black/20 p-3 ring-1 ring-white/5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-slate-400">Nível {xp.level}</span>
            <span className="font-medium text-indigo-300">
              {xp.current}/{xp.max} XP
            </span>
          </div>
          <motion.div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-400"
              initial={{ width: 0 }}
              animate={{ width: `${xp.percent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </motion.div>
          <p className="mt-2 text-xs text-amber-400/90">
            🔥 Streak: {profile?.streak_days ?? 0} dias
          </p>
        </motion.div>
      </motion.div>

      <nav className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {MAIN_NAV.map((item, i) => {
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                  active
                    ? 'bg-indigo-500/20 text-indigo-100 ring-1 ring-indigo-400/25'
                    : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${active ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'}`}
                />
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <motion.div
        className="border-t border-white/5 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
        <p className="mt-2 text-center text-[10px] text-slate-600">Cortex OS · todas as áreas</p>
      </motion.div>
    </aside>
  );
}
