import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const ToastContext = createContext({
  toast: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((type, message, description = '') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, message, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const toast = useCallback((msg, desc) => addToast('info', msg, desc), [addToast]);
  const success = useCallback((msg, desc) => addToast('success', msg, desc), [addToast]);
  const error = useCallback((msg, desc) => addToast('error', msg, desc), [addToast]);
  const info = useCallback((msg, desc) => addToast('info', msg, desc), [addToast]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast, success, error, info }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm pointer-events-none font-mono text-xs">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                'pointer-events-auto p-3.5 rounded-lg border shadow-2xl flex items-start gap-3',
                t.type === 'success' && 'bg-[#101A18] border-[#D9FF35]/40 text-[#F3F5F2]',
                t.type === 'error' && 'bg-red-950/90 border-red-500/40 text-red-200',
                t.type === 'info' && 'bg-[#0D1218] border-white/[0.12] text-[#F3F5F2]'
              )}
            >
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#D9FF35] shrink-0 mt-0.5" />}
              {t.type === 'error' && <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-[#A2AAA7] shrink-0 mt-0.5" />}

              <div className="flex-1 overflow-hidden">
                <p className="font-semibold text-xs leading-tight">{t.message}</p>
                {t.description && <p className="text-[11px] text-[#A2AAA7] mt-0.5">{t.description}</p>}
              </div>

              <button
                type="button"
                onClick={() => removeToast(t.id)}
                className="text-[#626B69] hover:text-[#F3F5F2] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const Toaster = ToastProvider;

export function useToast() {
  return useContext(ToastContext);
}
