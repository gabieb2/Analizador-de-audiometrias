"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import AudiogramChart from "./audiogram-chart"

interface CustomAudiogramProps {
  onResultsGenerated: (results: any) => void
}

export default function CustomAudiogram({ onResultsGenerated }: CustomAudiogramProps) {
  const [participantId, setParticipantId] = useState("")
  const [airConductionRE, setAirConductionRE] = useState<string[]>(["", "", "", "", "", "", ""])
  const [airConductionLE, setAirConductionLE] = useState<string[]>(["", "", "", "", "", "", ""])
  const [boneConductionRE, setBoneConductionRE] = useState<string[]>(["", "", "", "", "", "", ""])
  const [boneConductionLE, setBoneConductionLE] = useState<string[]>(["", "", "", "", "", "", ""])
  const [useAirOnly, setUseAirOnly] = useState(true)
  const [results, setResults] = useState<any>(null)

  const frequencies = [500, 1000, 2000, 3000, 4000, 6000, 8000]
  const frequencyLabels = ["500Hz", "1kHz", "2kHz", "3kHz", "4kHz", "6kHz", "8kHz"]

  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) => {
    const newValues = [
      ...(setter === setAirConductionRE
        ? airConductionRE
        : setter === setAirConductionLE
          ? airConductionLE
          : setter === setBoneConductionRE
            ? boneConductionRE
            : boneConductionLE),
    ]
    newValues[index] = value
    setter(newValues)
  }

  const classifyLoss = (avg: number): string => {
    if (avg <= 25) return "Normal"
    if (avg <= 40) return "Leve"
    if (avg <= 55) return "Moderada"
    if (avg <= 70) return "Severa"
    if (avg <= 90) return "Profunda"
    return "Muy Profunda"
  }

  const classifyFrequencyLoss = (threshold: number | null): string => {
    if (threshold === null || isNaN(threshold)) return "Sin datos"
    if (threshold <= 25) return "Normal"
    if (threshold <= 40) return "Leve"
    if (threshold <= 55) return "Moderada"
    if (threshold <= 70) return "Severa"
    if (threshold <= 90) return "Profunda"
    return "Muy Profunda"
  }

  const handleGenerate = () => {
    const thresholds_RE = airConductionRE.map((val) => (val === "" ? 0 : Number.parseFloat(val)))
    const thresholds_LE = airConductionLE.map((val) => (val === "" ? 0 : Number.parseFloat(val)))

    const boneConductionREData = !useAirOnly
      ? boneConductionRE.map((val) => (val === "" ? 0 : Number.parseFloat(val)))
      : undefined
    const boneConductionLEData = !useAirOnly
      ? boneConductionLE.map((val) => (val === "" ? 0 : Number.parseFloat(val)))
      : undefined

    // Calculate averages
    const calculateAverage = (thresholds: (number | null)[]) => {
      const validThresholds = thresholds.filter((t) => t !== null && !isNaN(t)) as number[]
      return validThresholds.length > 0 ? validThresholds.reduce((a, b) => a + b, 0) / validThresholds.length : 0
    }

    const avgRE = calculateAverage(thresholds_RE)
    const avgLE = calculateAverage(thresholds_LE)

    const frequencyLoss_RE = thresholds_RE.map(classifyFrequencyLoss)
    const frequencyLoss_LE = thresholds_LE.map(classifyFrequencyLoss)

    const customResults = {
      participant_id: participantId ? Number.parseInt(participantId) : Math.floor(Math.random() * 90000) + 10000,
      freqs: frequencies,
      thresholds_RE: thresholds_RE,
      thresholds_LE: thresholds_LE,
      boneConductionRE: boneConductionREData,
      boneConductionLE: boneConductionLEData,
      loss_RE: classifyLoss(avgRE),
      loss_LE: classifyLoss(avgLE),
      frequencyLoss_RE: frequencyLoss_RE,
      frequencyLoss_LE: frequencyLoss_LE,
      isCustom: true,
    }

    setResults(customResults)
    onResultsGenerated(customResults)
  }

  const clearAll = () => {
    setParticipantId("")
    setAirConductionRE(["", "", "", "", "", "", ""])
    setAirConductionLE(["", "", "", "", "", "", ""])
    setBoneConductionRE(["", "", "", "", "", "", ""])
    setBoneConductionLE(["", "", "", "", "", "", ""])
    setResults(null)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generar Audiograma Personalizado</CardTitle>
          <p className="text-sm text-muted-foreground">
            Ingresa los valores de umbrales auditivos manualmente para crear un audiograma personalizado.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="participant-id">ID del Participante (opcional)</Label>
              <Input
                id="participant-id"
                type="number"
                placeholder="Ej: 12345"
                value={participantId}
                onChange={(e) => setParticipantId(e.target.value)}
              />
            </div>
            <div className="flex items-end space-x-2">
              <Button variant={useAirOnly ? "default" : "outline"} onClick={() => setUseAirOnly(true)} size="sm">
                Solo Vía Aérea
              </Button>
              <Button variant={!useAirOnly ? "default" : "outline"} onClick={() => setUseAirOnly(false)} size="sm">
                Vía Aérea + Ósea
              </Button>
            </div>
          </div>

          <Separator />

          {/* Vía Aérea */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">Vía Aérea</Badge>
              <span className="text-sm text-muted-foreground">Umbrales en dB HL</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-red-600">Oído Derecho (RE)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {frequencyLabels.map((freq, index) => (
                    <div key={`re-air-${index}`}>
                      <Label className="text-xs">{freq}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="0"
                        value={airConductionRE[index]}
                        onChange={(e) => handleInputChange(setAirConductionRE, index, e.target.value)}
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-blue-600">Oído Izquierdo (LE)</h4>
                <div className="grid grid-cols-2 gap-2">
                  {frequencyLabels.map((freq, index) => (
                    <div key={`le-air-${index}`}>
                      <Label className="text-xs">{freq}</Label>
                      <Input
                        type="number"
                        min="0"
                        max="120"
                        placeholder="0"
                        value={airConductionLE[index]}
                        onChange={(e) => handleInputChange(setAirConductionLE, index, e.target.value)}
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Conducción Ósea */}
          {!useAirOnly && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">Conducción Ósea</Badge>
                  <span className="text-sm text-muted-foreground">Umbrales en dB HL</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-medium text-red-600">Oído Derecho (RE)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {frequencyLabels.map((freq, index) => (
                        <div key={`re-bone-${index}`}>
                          <Label className="text-xs">{freq}</Label>
                          <Input
                            type="number"
                            min="0"
                            max="120"
                            placeholder="0"
                            value={boneConductionRE[index]}
                            onChange={(e) => handleInputChange(setBoneConductionRE, index, e.target.value)}
                            className="h-8"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-blue-600">Oído Izquierdo (LE)</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {frequencyLabels.map((freq, index) => (
                        <div key={`le-bone-${index}`}>
                          <Label className="text-xs">{freq}</Label>
                          <Input
                            type="number"
                            min="0"
                            max="120"
                            placeholder="0"
                            value={boneConductionLE[index]}
                            onChange={(e) => handleInputChange(setBoneConductionLE, index, e.target.value)}
                            className="h-8"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <div className="flex space-x-3 pt-4">
            <Button onClick={handleGenerate} className="flex-1">
              Generar Audiograma
            </Button>
            <Button variant="outline" onClick={clearAll}>
              Limpiar Todo
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Audiograma Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <AudiogramChart data={results} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
