"use client"

interface ResultsCardProps {
  results: {
    item_name: string
    recommended_order_quantity: number
  } | null
  errorMessage?: string | null
}

export default function ResultsCard({ results, errorMessage }: ResultsCardProps) {
  return (
    <div className="h-full">
      <div className="relative h-full rounded-3xl border border-cyan-400/40 bg-slate-950/70 text-slate-50 shadow-[0_0_40px_rgba(56,189,248,0.4)] backdrop-blur-2xl overflow-hidden group">
        {/* neon glow */}
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -right-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/35 blur-3xl" />
          <div className="absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-fuchsia-500/30 blur-3xl" />
        </div>

        <div className="relative z-10 p-5 lg:p-10 h-full flex flex-col justify-center">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70 mb-2 text-center">
              Recommended Order Quantity
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight text-center mb-8">
              Smart Replenishment Insight
            </h2>

            {errorMessage ? (
              <div className="mx-auto max-w-md rounded-2xl border border-red-400/60 bg-red-950/50 px-6 py-4 shadow-[0_0_30px_rgba(248,113,113,0.35)] animate-fadeInUp">
                <p className="text-sm font-semibold text-red-300 mb-1">Error</p>
                <p className="text-sm text-red-100 leading-relaxed">{errorMessage}</p>
              </div>
            ) : results ? (
              <div className="flex flex-col items-center gap-6 animate-fadeInUp">
                <div className="relative flex items-center justify-center">
                  <div className="absolute h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />
                  <div className="relative flex flex-col items-center">
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80 mb-3">
                      Recommended Order
                    </p>
                    <p className="text-6xl lg:text-7xl font-extrabold tracking-[0.16em] text-cyan-100 drop-shadow-[0_0_35px_rgba(56,189,248,0.75)]">
                      {results.recommended_order_quantity
                        ? Number(results.recommended_order_quantity).toLocaleString(undefined, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })
                        : "--"}
                    </p>
                    <p className="mt-2 text-sm text-cyan-200/80">units</p>
                  </div>
                </div>

                <div className="w-full max-w-md rounded-2xl bg-slate-900/70 border border-cyan-400/30 px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400 mb-1">
                      Item Name
                    </p>
                    <p className="text-md font-medium text-cyan-300 truncate">
                      {results.item_name || "—"}
                    </p>
                  </div>
                  <span className="rounded-full bg-slate-800/80 px-3 py-1 text-[11px] uppercase tracking-wide text-cyan-300">
                    Forecast v0.1
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center lg:py-16 text-center gap-3">
                <div className="w-24 h-24 rounded-full bg-slate-900/70 border border-dashed border-cyan-400/40 flex items-center justify-center mb-2 shadow-[0_0_25px_rgba(56,189,248,0.4)]">
                  <div className="text-4xl">📊</div>
                </div>
                <p className="text-base font-medium text-slate-100">
                  Start by entering your inventory details
                </p>
                <p className="text-sm text-slate-400 max-w-xs">
                  We’ll calculate an optimal order quantity and highlight the item name here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
