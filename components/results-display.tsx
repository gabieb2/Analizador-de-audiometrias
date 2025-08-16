"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import AudiogramChart from "./audiogram-chart"
import type { ResultsDisplayProps } from "@/types" // Assuming AnalysisResults and ResultsDisplayProps are declared in a separate file

const getClassificationStyle = (classification: string) => {
  const colorMap = {
    Normal: "border-green-500 bg-green-50 text-green-700",
    Leve: "border-yellow-500 bg-yellow-50 text-yellow-700",
    Moderada: "border-orange-500 bg-orange-50 text-orange-700",
    Severa: "border-red-500 bg-red-50 text-red-700",
    Profunda: "border-purple-500 bg-purple-50 text-purple-700",
    "Muy Profunda": "border-indigo-500 bg-indigo-50 text-indigo-700",
    "Datos insuficientes": "border-gray-400 bg-gray-50 text-gray-600",
  }

  return colorMap[classification] || colorMap["Datos insuficientes"]
}

export default function ResultsDisplay({ results, onGenerateNew, isGenerating, canGenerateNew }: ResultsDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <CardTitle className="text-center sm:text-left">
            Resultados del Participante <span className="text-primary">{results.participant_id}</span>
          </CardTitle>
          {onGenerateNew && (
            <Button
              onClick={onGenerateNew}
              disabled={isGenerating || !canGenerateNew}
              variant="outline"
              size="sm"
              className="bg-transparent"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  Generando...
                </>
              ) : (
                <>
                  <Shuffle className="h-4 w-4 mr-2" />
                  Generar Nuevo
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <AudiogramChart results={results} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-4 rounded-lg border-2 text-center ${getClassificationStyle(results.loss_RE)}`}>
            <h3 className="font-semibold text-lg">Oído Derecho</h3>
            <p className="text-2xl font-bold">{results.loss_RE}</p>
          </div>
          <div className={`p-4 rounded-lg border-2 text-center ${getClassificationStyle(results.loss_LE)}`}>
            <h3 className="font-semibold text-lg">Oído Izquierdo</h3>
            <p className="text-2xl font-bold">{results.loss_LE}</p>
          </div>
        </div>

        {results.frequencyLoss_RE && results.frequencyLoss_LE && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Clasificación por Frecuencia</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-center">Oído Derecho</h4>
                <div className="space-y-2">
                  {results.freqs.map((freq, index) => (
                    <div key={`RE-${freq}`} className="flex justify-between items-center p-2 rounded border">
                      <span className="font-medium">{freq} Hz</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {results.thresholds_RE[index] !== null
                            ? `${Math.round(results.thresholds_RE[index])} dB`
                            : "Sin datos"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getClassificationStyle(results.frequencyLoss_RE[index])}`}
                        >
                          {results.frequencyLoss_RE[index]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-3 text-center">Oído Izquierdo</h4>
                <div className="space-y-2">
                  {results.freqs.map((freq, index) => (
                    <div key={`LE-${freq}`} className="flex justify-between items-center p-2 rounded border">
                      <span className="font-medium">{freq} Hz</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {results.thresholds_LE[index] !== null
                            ? `${Math.round(results.thresholds_LE[index])} dB`
                            : "Sin datos"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getClassificationStyle(results.frequencyLoss_LE[index])}`}
                        >
                          {results.frequencyLoss_LE[index]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
