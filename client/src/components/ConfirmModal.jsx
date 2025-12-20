import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { AlertTriangle, X } from 'lucide-react'

const MotionDiv = motion.div

const toneStyles = {
  danger: {
    iconBg: 'bg-red-500/10',
    iconBorder: 'border-red-500/20',
    iconColor: 'text-red-400',
    confirmBtn: 'bg-red-600 hover:bg-red-500 shadow-red-500/20',
  },
  warning: {
    iconBg: 'bg-amber-500/10',
    iconBorder: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    confirmBtn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20',
  },
  info: {
    iconBg: 'bg-indigo-500/10',
    iconBorder: 'border-indigo-500/20',
    iconColor: 'text-indigo-400',
    confirmBtn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20',
  },
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  details,
  items,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  tone = 'warning', // 'danger' | 'warning' | 'info'
  isLoading = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null

  const styles = toneStyles[tone] || toneStyles.warning

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onCancel}
        >
          <MotionDiv
            initial={{ scale: 0.98, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-zinc-900 border border-white/10 w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-black/0 pointer-events-none" />

            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onCancel}
                className="p-2 bg-black/20 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-colors backdrop-blur-md border border-white/5"
                aria-label="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            <div className="relative z-10 p-6">
              <div className="flex items-start gap-4">
                <div
                  className={clsx(
                    'shrink-0 w-12 h-12 rounded-full flex items-center justify-center border',
                    styles.iconBg,
                    styles.iconBorder
                  )}
                >
                  <AlertTriangle className={clsx(styles.iconColor)} size={22} />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white leading-tight">
                    {title}
                  </h3>
                  {message && (
                    <p className="text-zinc-300 mt-2 leading-relaxed">
                      {message}
                    </p>
                  )}
                  {details && (
                    <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4">
                      <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
                        Importante
                      </div>
                      <div className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">
                        {details}
                      </div>
                    </div>
                  )}

                  {Array.isArray(items) && items.length > 0 && (
                    <div className="mt-4 bg-black/30 border border-white/10 rounded-xl p-4">
                      <div className="text-xs uppercase tracking-widest text-zinc-500 font-bold mb-2">
                        Elementos afectados
                      </div>
                      <ul
                        className={clsx(
                          'space-y-2',
                          items.length > 8 && 'max-h-48 overflow-y-auto pr-1'
                        )}
                      >
                        {items.map((item, idx) => (
                          <li
                            key={`${item.subtitle || item.title}-${idx}`}
                            className="flex flex-col gap-0.5"
                          >
                            <div className="text-sm font-semibold text-white leading-snug">
                              {item.title}
                            </div>
                            {item.subtitle && (
                              <div className="text-xs text-indigo-300 font-mono break-all">
                                {item.subtitle}
                              </div>
                            )}
                            {item.meta && (
                              <div className="text-xs text-zinc-400 leading-relaxed">
                                {item.meta}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  disabled={isLoading}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-colors border border-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={clsx(
                    'px-4 py-2 text-white rounded-lg font-bold transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed',
                    styles.confirmBtn
                  )}
                >
                  {isLoading ? 'Procesando…' : confirmText}
                </button>
              </div>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  )
}
