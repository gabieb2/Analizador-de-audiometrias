"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HelpCircle } from "lucide-react"
import ResultsDisplay from "@/components/results-display"
import HelpTab from "@/components/help-tab"
import CustomAudiogram from "@/components/custom-audiogram"
import { parseAudiometryDatabase, type AudiometryRecord } from "@/lib/audiometry-database"

interface AnalysisResults {
  participant_id: number
  freqs: number[]
  thresholds_RE: (number | null)[]
  thresholds_LE: (number | null)[]
  loss_RE: string
  loss_LE: string
  frequencyLoss_RE: string[]
  frequencyLoss_LE: string[]
}

export default function AudiometryAnalyzer() {
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("analysis")
  const [audiometryRecords, setAudiometryRecords] = useState<AudiometryRecord[]>([])

  useEffect(() => {
    const loadAudiometryData = async () => {
      try {
        console.log("[v0] Loading real audiometry database...")

        // Import the HTML database file
        const response = await fetch("/data/audiometry-database.html")
        const htmlContent = await response.text()

        const records = parseAudiometryDatabase(htmlContent)
        console.log("[v0] Loaded", records.length, "real audiometry records")

        setAudiometryRecords(records)

        // Generate first participant automatically
        if (records.length > 0) {
          const firstParticipant = convertToAnalysisResults(records[0])
          setResults(firstParticipant)
          console.log("[v0] Loaded first participant:", firstParticipant.participant_id)
        }
      } catch (error) {
        console.error("[v0] Error loading audiometry database:", error)
        setError("Error cargando la base de datos de audiometría")
      } finally {
        setIsLoading(false)
      }
    }

    loadAudiometryData()
  }, [])

  const convertToAnalysisResults = (record: AudiometryRecord): AnalysisResults => {
    const thresholds_RE = [
      record.AUXU500R,
      record.AUXU1K1R,
      record.AUXU2KR,
      record.AUXU3KR,
      record.AUXU4KR,
      record.AUXU6KR,
      record.AUXU8KR,
    ]

    const thresholds_LE = [
      record.AUXU500L,
      record.AUXU1K1L,
      record.AUXU2KL,
      record.AUXU3KL,
      record.AUXU4KL,
      record.AUXU6KL,
      record.AUXU8KL,
    ]

    // Calculate average thresholds for classification
    const calculateAverage = (thresholds: (number | null)[]) => {
      const validThresholds = thresholds.filter((t) => t !== null && !isNaN(t)) as number[]
      return validThresholds.length > 0 ? validThresholds.reduce((a, b) => a + b, 0) / validThresholds.length : 0
    }

    const avgRE = calculateAverage(thresholds_RE)
    const avgLE = calculateAverage(thresholds_LE)

    // Classify hearing loss
    const classifyLoss = (avg: number): string => {
      if (avg <= 25) return "Normal"
      if (avg <= 40) return "Leve"
      if (avg <= 55) return "Moderada"
      if (avg <= 70) return "Severa"
      if (avg <= 90) return "Profunda"
      return "Muy Profunda"
    }

    const classifyFrequencyLoss = (threshold: number | null): string => {
      if (threshold === null) return "Sin datos"
      if (threshold <= 25) return "Normal"
      if (threshold <= 40) return "Leve"
      if (threshold <= 55) return "Moderada"
      if (threshold <= 70) return "Severa"
      if (threshold <= 90) return "Profunda"
      return "Muy Profunda"
    }

    const frequencyLoss_RE = thresholds_RE.map(classifyFrequencyLoss)
    const frequencyLoss_LE = thresholds_LE.map(classifyFrequencyLoss)

    return {
      participant_id: record.SEQN,
      freqs: [500, 1000, 2000, 3000, 4000, 6000, 8000],
      thresholds_RE: thresholds_RE,
      thresholds_LE: thresholds_LE,
      loss_RE: classifyLoss(avgRE),
      loss_LE: classifyLoss(avgLE),
      frequencyLoss_RE: frequencyLoss_RE,
      frequencyLoss_LE: frequencyLoss_LE,
    }
  }

  const handleGenerateRandom = () => {
    if (audiometryRecords.length === 0) {
      console.log("[v0] No audiometry records available")
      return
    }

    setIsGenerating(true)
    setError(null)

    // Simulate processing time
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * audiometryRecords.length)
      const randomRecord = audiometryRecords[randomIndex]
      const randomResults = convertToAnalysisResults(randomRecord)

      setResults(randomResults)
      console.log("[v0] Generated random participant:", randomResults.participant_id, "from index", randomIndex)
      setIsGenerating(false)
    }, 1000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando base de datos de audiometría...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8 max-w-4xl">
      <header className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Analizador de Audiometrías</h1>
        <p className="text-md text-muted-foreground mt-2">
          Analiza datos de audiometría y visualiza audiogramas interactivos.
        </p>
      </header>

      <main className="space-y-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="custom">Generar Propio</TabsTrigger>
            <TabsTrigger value="help">
              <HelpCircle className="h-4 w-4 mr-2" />
              Ayuda
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analysis" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Base de Datos de Audiometría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-muted-foreground">Base de datos: Cargada</span>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Participantes disponibles: {audiometryRecords.length}</span>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {results && (
              <ResultsDisplay
                results={results}
                onGenerateNew={handleGenerateRandom}
                isGenerating={isGenerating}
                canGenerateNew={audiometryRecords.length > 0}
              />
            )}
          </TabsContent>

          <TabsContent value="custom">
            <CustomAudiogram
              onResultsGenerated={(customResults) => {
                setResults(customResults)
                setActiveTab("analysis")
              }}
            />
          </TabsContent>

          <TabsContent value="help">
            <HelpTab />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="text-center mt-12 text-sm text-muted-foreground">
        <p>Analizador de audiometrías con base de datos real.</p>
      </footer>
    </div>
  )
}
