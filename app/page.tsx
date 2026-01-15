"use client"

import InventoryForm from "@/components/inventory-form"
import ResultsCard from "@/components/results-card"
import { useState } from "react"

export default function Home() {
  const [results, setResults] = useState<{
    item_name: string
    recommended_order_quantity: number
  } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleFormSubmit = async (data: {
    item_name: string
    current_balance: number
    consumption: number
    cogs: number
  }) => {
    try {
      setErrorMessage(null)

      // Log outgoing data for verification
      console.log('=== SENDING DATA TO API ===')
      console.log('Request data:', JSON.stringify(data, null, 2))

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      });

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        // Read response body once (can only be read once)
        const responseText = await response.text();
        let errorDetails: unknown = null;

        // Try to parse as JSON
        try {
          errorDetails = JSON.parse(responseText);
        } catch {
          // If not JSON, use as text
          errorDetails = responseText || null;
        }

        // Build a readable error message for the UI
        let friendlyMessage = `خطأ ${response.status}: ${response.statusText || 'تعذر الاتصال بالخادم'}`;

        // 1) our proxy returns: { error, status, statusText, details: { detail: [...] }, raw }
        if (typeof errorDetails === 'object' && errorDetails && errorDetails !== null) {
          const err = errorDetails as { error?: unknown; detail?: unknown; details?: { detail?: unknown } }

          if (typeof err.error === 'string') {
            friendlyMessage = err.error
          }

          // 2) If there is a "details.detail" array (FastAPI-style validation errors)
          let detailArray: unknown[] | undefined
          if (Array.isArray(err.detail)) {
            detailArray = err.detail
          } else if (err.details && typeof err.details === 'object' && err.details !== null) {
            const details = err.details as { detail?: unknown }
            if (Array.isArray(details.detail)) {
              detailArray = details.detail as unknown[]
            }
          }

          if (Array.isArray(detailArray) && detailArray.length > 0) {
            const msgs = (detailArray as Array<Record<string, unknown>>)
              .map((d) => {
                if (typeof d.msg === 'string') return d.msg
                if (typeof d.message === 'string') return d.message
                return null
              })
              .filter((m): m is string => m !== null);
            if (msgs.length > 0) {
              friendlyMessage = msgs.join(' | ');
            }
          }
        } else if (typeof errorDetails === 'string' && errorDetails.trim()) {
          // 3) Fall back to raw text body
          friendlyMessage = errorDetails;
        }

        console.error('API error response:', {
          status: response.status,
          statusText: response.statusText,
          responseText: responseText.substring(0, 500), // Limit to first 500 chars for readability
          parsed: errorDetails,
        });
        setErrorMessage(friendlyMessage);
        setResults(null);
        return;
      }

      const result = await response.json();

      // Log received data for verification
      console.log('=== RECEIVED DATA FROM API ===')
      console.log('Full response:', JSON.stringify(result, null, 2))
      console.log('Item name:', result.item_name)
      console.log('Recommended order quantity:', result.recommended_order_quantity)

      // Verify we have the required fields
      if (!result.item_name || result.recommended_order_quantity === undefined) {
        console.error('Missing required fields in response:', result)
        setErrorMessage('الاستجابة من الخادم غير مكتملة')
        setResults(null)
        return
      }

      setResults({
        item_name: result.item_name,
        recommended_order_quantity: result.recommended_order_quantity
      });
      setErrorMessage(null);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      // يمكن إضافة رسالة خطأ هنا
    }
  }

  return (
    <main className="min-h-screen overflow-hidden relative">
      <div className="background-animated" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blob 1 - أخضر فاتح جداً */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-gradient-to-br from-green-100 to-green-200 opacity-8 rounded-full blur-3xl"></div>

        {/* Blob 2 - أخضر مائل للأزرق فاتح */}
        <div className="absolute top-1/3 -left-32 w-96 h-96 bg-gradient-to-br from-emerald-100 to-green-200 opacity-8 rounded-full blur-3xl"></div>

        {/* Blob 3 - أخضر فاتح جداً */}
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-gradient-to-br from-green-50 to-emerald-100 opacity-6 rounded-full blur-3xl"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {/* كارت الإدخال */}
          <div className="animate-slideInLeft">
            <InventoryForm onSubmit={handleFormSubmit} />
          </div>

          {/* كارت النتائج */}
          <div className="animate-slideInRight">
            <ResultsCard results={results} errorMessage={errorMessage} />
          </div>
        </div>
      </div>
    </main>
  )
}
