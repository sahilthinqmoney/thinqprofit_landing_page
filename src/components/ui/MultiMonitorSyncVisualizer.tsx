import { useState, useEffect } from 'react'
import { Monitor, ExternalLink, Zap, CheckCircle2, ArrowRightLeft } from 'lucide-react'

interface SymbolData {
  name: string
  price: string
  change: string
  isUp: boolean
  bids: { price: string; qty: string }[]
  asks: { price: string; qty: string }[]
  chartPoints: string
}

const SYMBOLS: Record<string, SymbolData> = {
  'NIFTY 50': {
    name: 'NIFTY 50',
    price: '24,780.50',
    change: '+142.20 (+0.58%)',
    isUp: true,
    bids: [
      { price: '24,780.20', qty: '450' },
      { price: '24,779.80', qty: '1,200' },
      { price: '24,779.10', qty: '850' },
    ],
    asks: [
      { price: '24,781.00', qty: '620' },
      { price: '24,781.50', qty: '940' },
      { price: '24,782.20', qty: '1,100' },
    ],
    chartPoints: 'M0,45 Q30,25 60,35 T120,15 T180,28 T240,10',
  },
  BANKNIFTY: {
    name: 'BANKNIFTY',
    price: '52,410.80',
    change: '+310.40 (+0.60%)',
    isUp: true,
    bids: [
      { price: '52,410.00', qty: '320' },
      { price: '52,408.50', qty: '780' },
      { price: '52,405.00', qty: '610' },
    ],
    asks: [
      { price: '52,412.00', qty: '490' },
      { price: '52,414.50', qty: '830' },
      { price: '52,416.00', qty: '1,050' },
    ],
    chartPoints: 'M0,50 Q30,40 60,20 T120,30 T180,12 T240,5',
  },
  FINNIFTY: {
    name: 'FINNIFTY',
    price: '23,150.25',
    change: '-18.60 (-0.08%)',
    isUp: false,
    bids: [
      { price: '23,149.80', qty: '290' },
      { price: '23,148.50', qty: '540' },
      { price: '23,147.00', qty: '820' },
    ],
    asks: [
      { price: '23,151.00', qty: '410' },
      { price: '23,152.20', qty: '670' },
      { price: '23,153.80', qty: '950' },
    ],
    chartPoints: 'M0,15 Q30,30 60,25 T120,40 T180,35 T240,48',
  },
}

export default function MultiMonitorSyncVisualizer() {
  const [activeSymbol, setActiveSymbol] = useState<string>('NIFTY 50')
  const [isSyncing, setIsSyncing] = useState<boolean>(false)
  const [lastOrderTime, setLastOrderTime] = useState<string>('13:04:11.208')

  const currentData = SYMBOLS[activeSymbol]

  const handleSymbolChange = (sym: string) => {
    if (sym === activeSymbol) return
    setIsSyncing(true)
    setActiveSymbol(sym)

    // Update timestamp
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    const ms = String(now.getMilliseconds()).padStart(3, '0')
    setLastOrderTime(`${hh}:${mm}:${ss}.${ms}`)

    setTimeout(() => {
      setIsSyncing(false)
    }, 450)
  }

  // Auto switch symbol every 4 seconds for a dynamic live preview feel
  useEffect(() => {
    const keys = Object.keys(SYMBOLS)
    const interval = setInterval(() => {
      setActiveSymbol((prev) => {
        const nextIdx = (keys.indexOf(prev) + 1) % keys.length
        return keys[nextIdx]
      })
      setIsSyncing(true)
      setTimeout(() => setIsSyncing(false), 450)
    }, 4500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative w-full max-w-[620px] mx-auto select-none">
      {/* Dynamic Sync Beam Highlight */}
      <div
        className={`absolute inset-0 z-0 rounded-3xl bg-gradient-to-r from-accent/20 via-cyan-500/15 to-accent/20 blur-2xl transition-opacity duration-500 ${
          isSyncing ? 'opacity-100 scale-105' : 'opacity-40'
        }`}
      />

      <div className="relative z-10 grid gap-4 sm:gap-5">
        {/* MONITOR 1: Main Browser Window */}
        <div className="group rounded-2xl border border-white/15 bg-surface/90 p-4 sm:p-5 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:border-white/30">
          {/* Browser Chrome Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="ml-2 flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-mono text-fg-muted">
                <Monitor className="h-3 w-3 text-cyan-400" />
                <span>Screen 1 • Browser</span>
              </span>
            </div>

            {/* Symbol Switcher Tabs */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10">
              {Object.keys(SYMBOLS).map((sym) => (
                <button
                  key={sym}
                  onClick={() => handleSymbolChange(sym)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all ${
                    activeSymbol === sym
                      ? 'bg-accent/20 text-fg border border-accent/40 shadow-sm'
                      : 'text-fg-muted hover:text-fg hover:bg-white/5'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>

          {/* Monitor 1 Content: Live Price & Mini Wave Chart */}
          <div className="mt-4 flex items-center justify-between">
            <div>
              <div className="text-xs font-mono text-fg-muted uppercase tracking-wider">
                {currentData.name} Index
              </div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-bold font-mono tracking-tight text-fg">
                  {currentData.price}
                </span>
                <span
                  className={`text-xs font-mono font-medium ${
                    currentData.isUp ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {currentData.change}
                </span>
              </div>
            </div>

            {/* Mini SVG Live Wave Chart */}
            <div className="relative h-12 w-32 overflow-hidden">
              <svg className="h-full w-full" viewBox="0 0 240 60" fill="none">
                <path
                  d={currentData.chartPoints}
                  stroke={currentData.isUp ? '#34d399' : '#f87171'}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* SYNC CONNECTOR BADGE */}
        <div className="flex items-center justify-between px-2 text-xs font-mono text-fg-muted">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className={`h-3.5 w-3.5 text-accent ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Multi-Monitor Event Bus</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-0.5 text-[11px] font-semibold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>0ms Sync • Instant</span>
          </div>
        </div>

        {/* MONITOR 2: Popped-Out 2nd Monitor Window */}
        <div
          className={`group relative rounded-2xl border border-white/20 bg-surface/95 p-4 sm:p-5 backdrop-blur-2xl shadow-2xl transition-all duration-300 ${
            isSyncing ? 'border-accent/60 scale-[1.01]' : 'border-white/15'
          }`}
        >
          {/* Top Bar for Pop-Out Window */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-lg border border-accent/30 bg-accent/15 px-2.5 py-1 text-[11px] font-mono text-accent">
                <ExternalLink className="h-3 w-3" />
                <span>Screen 2 • Popped Out</span>
              </span>
            </div>

            <span className="flex items-center gap-1.5 text-[11px] font-mono text-fg-muted">
              <Zap className="h-3 w-3 text-amber-400" />
              <span>Routed in milliseconds</span>
            </span>
          </div>

          {/* Monitor 2 Content: Synced Order Depth & Latency Stream */}
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs font-mono">
            {/* Bids Ladder */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/90 pb-1 border-b border-white/5">
                Bids (Buy)
              </div>
              {currentData.bids.map((b, i) => (
                <div key={i} className="flex justify-between text-fg-muted">
                  <span className="text-emerald-400 font-semibold">{b.price}</span>
                  <span>{b.qty}</span>
                </div>
              ))}
            </div>

            {/* Asks Ladder */}
            <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-1.5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-400/90 pb-1 border-b border-white/5">
                Asks (Sell)
              </div>
              {currentData.asks.map((a, i) => (
                <div key={i} className="flex justify-between text-fg-muted">
                  <span className="text-rose-400 font-semibold">{a.price}</span>
                  <span>{a.qty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Order Log */}
          <div className="mt-3 rounded-xl border border-white/10 bg-black/50 p-2.5 font-mono text-[11px] text-fg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-fg-muted">sent {lastOrderTime}</span>
            </div>
            <div className="flex items-center gap-1.5 text-accent font-semibold">
              <span>acknowledged</span>
              <span className="text-[10px] opacity-75">(+32ms)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
