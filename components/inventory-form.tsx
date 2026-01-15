"use client"

import type React from "react"

import { useState } from "react"

interface InventoryFormProps {
  onSubmit: (data: {
    item_name: string
    current_balance: number
    consumption: number
    cogs: number
  }) => void
}

export default function InventoryForm({ onSubmit }: InventoryFormProps) {
  const [formData, setFormData] = useState({
    item_name: "",
    current_balance: "",
    consumption: "",
    cogs: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.item_name.trim()) {
      newErrors.item_name = "اسم المنتج مطلوب"
    }
    const currentBalance = Number.parseFloat(formData.current_balance)
    if (!formData.current_balance || Number.isNaN(currentBalance) || currentBalance < 0) {
      newErrors.current_balance = "الرصيد الحالي يجب أن يكون صفر أو أكبر"
    } else if (currentBalance > 100000) {
      newErrors.current_balance = "الرصيد الحالي يجب ألا يزيد عن 100000"
    }
    const consumption = Number.parseFloat(formData.consumption)
    if (!formData.consumption || Number.isNaN(consumption) || consumption <= 0) {
      newErrors.consumption = "الاستهلاك يجب أن يكون رقمًا أكبر من صفر"
    }
    const cogs = Number.parseFloat(formData.cogs)
    if (!formData.cogs || Number.isNaN(cogs) || cogs <= 0) {
      newErrors.cogs = "تكلفة البضاعة المباعة يجب أن تكون رقمًا أكبر من صفر"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) return

    onSubmit({
      item_name: formData.item_name,
      current_balance: Number.parseFloat(formData.current_balance),
      consumption: Number.parseFloat(formData.consumption),
      cogs: Number.parseFloat(formData.cogs),
    })

    setFormData({
      item_name: "",
      current_balance: "",
      consumption: "",
      cogs: "",
    })
  }

  return (
    <div className="h-full">
      <form
        onSubmit={handleSubmit}
        className="relative h-full rounded-3xl border border-cyan-400/40 bg-slate-950/70 text-slate-50 shadow-[0_0_40px_rgba(34,211,238,0.35)] backdrop-blur-2xl overflow-hidden group"
      >
        {/* neon border glow */}
        <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute -left-24 -top-24 h-56 w-56 rounded-full bg-cyan-400/30 blur-3xl" />
          <div className="absolute -right-24 -bottom-24 h-56 w-56 rounded-full bg-fuchsia-500/25 blur-3xl" />
        </div>

        <div className="relative z-10 p-4 lg:p-10 h-full flex flex-col">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70 mb-2">
              Inventory Input
            </p>
            <h2 className="text-2xl lg:text-3xl font-semibold tracking-tight">
              Item Configuration
            </h2>
            <div className="mt-3 h-px w-20 bg-gradient-to-r from-cyan-400 via-sky-400 to-transparent" />
          </div>

          <div className="space-y-5 flex-1">
            {/* Item Name */}
            <div className="relative">
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                Item Name
              </label>
              <input
                type="text"
                name="item_name"
                value={formData.item_name}
                onChange={handleChange}
                placeholder="Quantum Sensor Array"
                className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-300/80 transition-all duration-300 ${
                  errors.item_name
                    ? "border-red-400/80 focus:ring-red-400/60"
                    : "border-slate-700/80"
                }`}
              />
              {errors.item_name && <p className="text-sm text-red-400 mt-1 animate-fadeInUp">{errors.item_name}</p>}
            </div>

            {/* Current Balance */}
            <div className="relative">
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                Current Balance
              </label>
              <input
                type="number"
                name="current_balance"
                value={formData.current_balance}
                onChange={handleChange}
                placeholder="1,250 units"
                className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-300/80 transition-all duration-300 ${
                  errors.current_balance
                    ? "border-red-400/80 focus:ring-red-400/60"
                    : "border-slate-700/80"
                }`}
              />
              {errors.current_balance && <p className="text-sm text-red-400 mt-1 animate-fadeInUp">{errors.current_balance}</p>}
            </div>

            {/* Consumption */}
            <div className="relative">
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                Consumption
              </label>
              <input
                type="number"
                name="consumption"
                value={formData.consumption}
                onChange={handleChange}
                placeholder="300 units / month"
                className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-300/80 transition-all duration-300 ${
                  errors.consumption
                    ? "border-red-400/80 focus:ring-red-400/60"
                    : "border-slate-700/80"
                }`}
              />
              {errors.consumption && <p className="text-sm text-red-400 mt-1 animate-fadeInUp">{errors.consumption}</p>}
            </div>

            {/* COGS */}
            <div className="relative">
              <label className="block text-xs font-semibold tracking-wide uppercase text-slate-400 mb-2">
                COGS (Cost of Goods Sold)
              </label>
              <input
                type="number"
                name="cogs"
                value={formData.cogs}
                onChange={handleChange}
                placeholder="$75 / unit"
                className={`w-full rounded-xl border bg-slate-900/70 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 shadow-inner shadow-cyan-500/10 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-300/80 transition-all duration-300 ${
                  errors.cogs
                    ? "border-red-400/80 focus:ring-red-400/60"
                    : "border-slate-700/80"
                }`}
              />
              {errors.cogs && <p className="text-sm text-red-400 mt-1 animate-fadeInUp">{errors.cogs}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold tracking-wide text-slate-950 shadow-[0_0_25px_rgba(34,211,238,0.55)] transition-transform duration-300 hover:scale-[1.02] active:scale-95 relative overflow-hidden group/btn"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-500" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              <span>Calculate Recommended Order</span>
            </span>
          </button>

          <p className="mt-4 text-[11px] text-slate-400/80 text-center">
            Data is securely sent to the forecasting engine to compute optimal order quantity.
          </p>
        </div>
      </form>
    </div>
  )
}
