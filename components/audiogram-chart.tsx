"use client"

import { useEffect, useRef } from "react"

interface AnalysisResults {
  participant_id: number
  freqs: number[]
  thresholds_RE: (number | null)[]
  thresholds_LE: (number | null)[]
  boneConductionRE?: (number | null)[]
  boneConductionLE?: (number | null)[]
  loss_RE: string
  loss_LE: string
}

interface AudiogramChartProps {
  results: AnalysisResults | undefined
}

declare global {
  interface Window {
    Chart: any
  }
}

export default function AudiogramChart({ results }: AudiogramChartProps) {
  const canvasRefRE = useRef<HTMLCanvasElement>(null)
  const canvasRefLE = useRef<HTMLCanvasElement>(null)
  const canvasRefCombined = useRef<HTMLCanvasElement>(null)
  const chartRefRE = useRef<any>(null)
  const chartRefLE = useRef<any>(null)
  const chartRefCombined = useRef<any>(null)

  const hasBoneConduction =
    results &&
    ((results.boneConductionRE && results.boneConductionRE.some((val) => val !== null && val !== 0)) ||
      (results.boneConductionLE && results.boneConductionLE.some((val) => val !== null && val !== 0)))

  const downloadPNG = () => {
    console.log("[v0] Download PNG button clicked")

    if (!results) {
      console.error("[v0] Results not available for download")
      alert("El gráfico no está disponible para descargar. Por favor, espera a que se cargue completamente.")
      return
    }

    try {
      if (hasBoneConduction) {
        // Download both charts as separate files
        if (canvasRefRE.current && chartRefRE.current) {
          const linkRE = document.createElement("a")
          linkRE.download = `audiograma_participante_${results.participant_id}_OD.png`
          linkRE.href = canvasRefRE.current.toDataURL("image/png", 1.0)
          document.body.appendChild(linkRE)
          linkRE.click()
          document.body.removeChild(linkRE)
        }

        if (canvasRefLE.current && chartRefLE.current) {
          const linkLE = document.createElement("a")
          linkLE.download = `audiograma_participante_${results.participant_id}_OI.png`
          linkLE.href = canvasRefLE.current.toDataURL("image/png", 1.0)
          document.body.appendChild(linkLE)
          linkLE.click()
          document.body.removeChild(linkLE)
        }
      } else {
        // Download single combined chart
        if (canvasRefCombined.current && chartRefCombined.current) {
          const link = document.createElement("a")
          link.download = `audiograma_participante_${results.participant_id}.png`
          link.href = canvasRefCombined.current.toDataURL("image/png", 1.0)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }

      console.log("[v0] PNG download completed successfully")
    } catch (error) {
      console.error("[v0] Error downloading PNG:", error)
      alert("Error al descargar la imagen. Por favor, intenta nuevamente.")
    }
  }

  useEffect(() => {
    console.log("[v0] AudiogramChart useEffect triggered with results:", results)

    if (!results) {
      console.log("[v0] No results available, skipping chart creation")
      return
    }

    // Load Chart.js
    const loadChartJS = async () => {
      if (typeof window !== "undefined" && !window.Chart) {
        console.log("[v0] Loading Chart.js...")

        const chartScript = document.createElement("script")
        chartScript.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"
        document.head.appendChild(chartScript)

        await new Promise((resolve, reject) => {
          chartScript.onload = () => {
            console.log("[v0] Chart.js loaded successfully")
            resolve(true)
          }
          chartScript.onerror = () => {
            console.error("[v0] Failed to load Chart.js")
            reject(new Error("Failed to load Chart.js"))
          }
        })
      }

      if (window.Chart && !window.Chart.registry.plugins.get("customBoneConductionSymbols")) {
        const customSymbolPlugin = {
          id: "customBoneConductionSymbols",
          afterDatasetsDraw: (chart: any) => {
            const ctx = chart.ctx
            chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
              if (dataset.label && dataset.label.includes("Vía Ósea")) {
                const meta = chart.getDatasetMeta(datasetIndex)
                meta.data.forEach((point: any, index: number) => {
                  if (dataset.data[index] !== null && dataset.data[index] !== undefined) {
                    const x = point.x
                    const y = point.y
                    const size = 8

                    ctx.save()
                    ctx.strokeStyle = dataset.borderColor
                    ctx.fillStyle = dataset.borderColor
                    ctx.lineWidth = 2

                    // Draw custom symbols
                    if (dataset.label.includes("OD")) {
                      // Draw < symbol for right ear
                      ctx.beginPath()
                      ctx.moveTo(x + size / 2, y - size / 2)
                      ctx.lineTo(x - size / 2, y)
                      ctx.lineTo(x + size / 2, y + size / 2)
                      ctx.stroke()
                    } else if (dataset.label.includes("OI")) {
                      // Draw > symbol for left ear
                      ctx.beginPath()
                      ctx.moveTo(x - size / 2, y - size / 2)
                      ctx.lineTo(x + size / 2, y)
                      ctx.lineTo(x - size / 2, y + size / 2)
                      ctx.stroke()
                    }

                    ctx.restore()
                  }
                })
              }
            })
          },
        }

        window.Chart.register(customSymbolPlugin)
      }

      if (hasBoneConduction) {
        createDualCharts()
      } else {
        createSingleChart()
      }
    }

    const createDualCharts = () => {
      console.log("[v0] Creating dual charts for bone conduction...")

      // Destroy existing charts
      if (chartRefRE.current) chartRefRE.current.destroy()
      if (chartRefLE.current) chartRefLE.current.destroy()
      if (chartRefCombined.current) chartRefCombined.current.destroy()

      // Create Right Ear Chart
      if (canvasRefRE.current && window.Chart) {
        const ctxRE = canvasRefRE.current.getContext("2d")
        if (ctxRE) {
          const chartDataRE = {
            labels: results.freqs.map((f) => `${f} Hz`),
            datasets: [
              {
                label: "Vía Aérea OD (O)",
                data: results.thresholds_RE,
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                pointStyle: "circle",
                pointRadius: 10,
                pointHoverRadius: 12,
                borderWidth: 3,
                tension: 0.1,
                spanGaps: true,
              },
              ...(results.boneConductionRE
                ? [
                    {
                      label: "Vía Ósea OD (<)",
                      data: results.boneConductionRE,
                      borderColor: "rgb(239, 68, 68)",
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      pointStyle: "circle",
                      pointRadius: 0,
                      pointHoverRadius: 12,
                      borderWidth: 3,
                      borderDash: [5, 5],
                      tension: 0.1,
                      spanGaps: true,
                    },
                  ]
                : []),
            ],
          }

          chartRefRE.current = new window.Chart(ctxRE, {
            type: "line",
            data: chartDataRE,
            options: getChartOptions("Oído Derecho (OD)"),
          })
        }
      }

      // Create Left Ear Chart
      if (canvasRefLE.current && window.Chart) {
        const ctxLE = canvasRefLE.current.getContext("2d")
        if (ctxLE) {
          const chartDataLE = {
            labels: results.freqs.map((f) => `${f} Hz`),
            datasets: [
              {
                label: "Vía Aérea OI (X)",
                data: results.thresholds_LE,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                pointStyle: "crossRot",
                pointRadius: 10,
                pointHoverRadius: 12,
                borderWidth: 3,
                tension: 0.1,
                spanGaps: true,
              },
              ...(results.boneConductionLE
                ? [
                    {
                      label: "Vía Ósea OI (>)",
                      data: results.boneConductionLE,
                      borderColor: "rgb(59, 130, 246)",
                      backgroundColor: "rgba(59, 130, 246, 0.1)",
                      pointStyle: "circle",
                      pointRadius: 0,
                      pointHoverRadius: 12,
                      borderWidth: 3,
                      borderDash: [5, 5],
                      tension: 0.1,
                      spanGaps: true,
                    },
                  ]
                : []),
            ],
          }

          chartRefLE.current = new window.Chart(ctxLE, {
            type: "line",
            data: chartDataLE,
            options: getChartOptions("Oído Izquierdo (OI)"),
          })
        }
      }
    }

    const createSingleChart = () => {
      console.log("[v0] Creating single combined chart...")

      // Destroy existing charts
      if (chartRefRE.current) chartRefRE.current.destroy()
      if (chartRefLE.current) chartRefLE.current.destroy()
      if (chartRefCombined.current) chartRefCombined.current.destroy()

      if (!canvasRefCombined.current || !window.Chart) return

      const ctx = canvasRefCombined.current.getContext("2d")
      if (!ctx) return

      const chartData = {
        labels: results.freqs.map((f) => `${f} Hz`),
        datasets: [
          {
            label: "Oído Derecho (RE)",
            data: results.thresholds_RE,
            borderColor: "rgb(239, 68, 68)",
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            pointStyle: "circle",
            pointRadius: 8,
            pointHoverRadius: 10,
            borderWidth: 3,
            tension: 0.1,
            spanGaps: true,
          },
          {
            label: "Oído Izquierdo (LE)",
            data: results.thresholds_LE,
            borderColor: "rgb(59, 130, 246)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            pointStyle: "crossRot",
            pointRadius: 8,
            pointHoverRadius: 10,
            borderWidth: 3,
            borderDash: [5, 5],
            tension: 0.1,
            spanGaps: true,
          },
        ],
      }

      chartRefCombined.current = new window.Chart(ctx, {
        type: "line",
        data: chartData,
        options: getChartOptions("Audiograma Combinado"),
      })
    }

    const getChartOptions = (title: string) => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: "bold",
          },
        },
        tooltip: {
          callbacks: {
            title: (context: any) => context[0].label,
            label: (context: any) => {
              if (context.parsed.y === null) {
                return `${context.dataset.label}: Sin datos`
              }
              return `${context.dataset.label}: ${context.parsed.y} dB HL`
            },
          },
        },
        legend: {
          position: "top" as const,
          labels: {
            font: {
              size: 12,
            },
            usePointStyle: true,
            padding: 15,
          },
        },
      },
      scales: {
        y: {
          reverse: true,
          beginAtZero: true,
          min: -10,
          max: 120,
          title: {
            display: true,
            text: "Umbral de Audición (dB HL)",
            font: {
              size: 12,
              weight: "bold",
            },
          },
          ticks: {
            stepSize: 10,
            font: {
              size: 10,
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
        x: {
          title: {
            display: true,
            text: "Frecuencia (Hz)",
            font: {
              size: 12,
              weight: "bold",
            },
          },
          ticks: {
            font: {
              size: 10,
            },
          },
          grid: {
            color: "rgba(0, 0, 0, 0.1)",
          },
        },
      },
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
    })

    loadChartJS().catch((error) => {
      console.error("[v0] Error loading Chart.js:", error)
    })

    return () => {
      if (chartRefRE.current) chartRefRE.current.destroy()
      if (chartRefLE.current) chartRefLE.current.destroy()
      if (chartRefCombined.current) chartRefCombined.current.destroy()
    }
  }, [results, hasBoneConduction])

  if (!results) {
    return (
      <div className="w-full">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Audiograma</h3>
        </div>
        <div className="relative h-96 bg-gray-50 rounded-lg border p-4 flex items-center justify-center">
          <p className="text-gray-500">Cargando audiograma...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold">Audiograma</h3>
      </div>

      {hasBoneConduction ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative h-96 bg-white rounded-lg border p-4">
              <canvas ref={canvasRefRE} id="audiogram-canvas-re"></canvas>
            </div>
            <div className="relative h-96 bg-white rounded-lg border p-4">
              <canvas ref={canvasRefLE} id="audiogram-canvas-le"></canvas>
            </div>
          </div>
          <div className="text-center">
            <button
              onClick={downloadPNG}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar PNG (Ambos Oídos)
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative h-96 bg-white rounded-lg border p-4">
            <canvas ref={canvasRefCombined} id="audiogram-canvas-combined"></canvas>
          </div>
          <div className="text-center">
            <button
              onClick={downloadPNG}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Descargar PNG
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
