import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Upload, BarChart3, Download, Shuffle, Github } from "lucide-react"

export default function HelpTab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ¿Qué es un Audiograma?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Un audiograma es una representación gráfica de la capacidad auditiva de una persona. Muestra los umbrales de
            audición (el sonido más suave que puede escuchar) para diferentes frecuencias.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Eje X (Frecuencias)</h4>
              <p className="text-sm text-muted-foreground">
                Representa las frecuencias en Hz (250 a 8000 Hz). Los sonidos graves están a la izquierda, los agudos a
                la derecha.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Eje Y (Umbrales)</h4>
              <p className="text-sm text-muted-foreground">
                Representa la intensidad en dB HL. Los valores más altos indican mayor pérdida auditiva.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Clasificación de Pérdida Auditiva
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-green-500 text-green-700">
                Normal
              </Badge>
              <span className="text-sm">&lt;= 25 dB HL</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-yellow-500 text-yellow-700">
                Leve
              </Badge>
              <span className="text-sm">26-40 dB HL</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-orange-500 text-orange-700">
                Moderada
              </Badge>
              <span className="text-sm">41-55 dB HL</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-red-500 text-red-700">
                Severa
              </Badge>
              <span className="text-sm">56-70 dB HL</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-purple-500 text-purple-700">
                Profunda
              </Badge>
              <span className="text-sm">71-90 dB HL</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-indigo-500 text-indigo-700">
                Muy Profunda
              </Badge>
              <span className="text-sm">&gt; 90 dB HL</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cómo Usar la Aplicación</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <BarChart3 className="h-5 w-5 mt-0.5 text-blue-500" />
              <div>
                <h4 className="font-semibold">Pestaña Análisis</h4>
                <p className="text-sm text-muted-foreground">
                  La aplicación carga automáticamente una base de datos con 3860 registros reales de audiometría del
                  NHANES 2011-2012. Usa "Generar Nuevo" para seleccionar participantes aleatorios.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shuffle className="h-5 w-5 mt-0.5 text-green-500" />
              <div>
                <h4 className="font-semibold">Generar Nuevo Participante</h4>
                <p className="text-sm text-muted-foreground">
                  Haz clic en "Generar Nuevo" para seleccionar aleatoriamente un participante de la base de datos y
                  visualizar su audiograma con clasificación de pérdida auditiva.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Upload className="h-5 w-5 mt-0.5 text-purple-500" />
              <div>
                <h4 className="font-semibold">Generar Audiograma Propio</h4>
                <p className="text-sm text-muted-foreground">
                  En la pestaña "Generar Propio", puedes crear audiogramas personalizados ingresando valores de vía
                  aérea y conducción ósea manualmente.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Download className="h-5 w-5 mt-0.5 text-orange-500" />
              <div>
                <h4 className="font-semibold">Descargar Audiograma</h4>
                <p className="text-sm text-muted-foreground">
                  Usa el botón "Descargar PNG" para guardar el audiograma como imagen. Para audiogramas con vía ósea, se
                  descargan gráficos separados por oído.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Fuente de Datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">NHANES 2011-2012 Audiometry Examination (AUX_G)</h4>
              <p className="text-sm text-muted-foreground">
                Los datos de audiometría utilizados en esta aplicación provienen del componente de examen audiométrico
                NHANES 2011-2012, que incluye pruebas de audiometría de conducción aérea por tonos puros realizadas en
                adultos de 20-69 años.
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <h5 className="font-medium text-sm mb-2">Protocolo de Prueba:</h5>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Frecuencias probadas: 500, 1000, 2000, 3000, 4000, 6000, y 8000 Hz</li>
                <li>• Rango efectivo: -10 a 100 dB (500-6000 Hz), -10 a 90 dB (8000 Hz)</li>
                <li>• Procedimiento Hughson Westlake modificado con modo automatizado</li>
                <li>• Pruebas realizadas en sala aislada acústicamente</li>
              </ul>
            </div>

            <div className="text-xs text-muted-foreground">
              <p>
                <strong>Muestra elegible:</strong> Todos los adultos de 20-69 años fueron elegibles para el examen,
                excluyendo participantes con audífonos no removibles o dolor de oído que impidiera el uso de
                auriculares.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Créditos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Desarrollador:</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Gabriel Beinotti</span>
                <a
                  href="https://github.com/gabieb2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fuente de Datos:</span>
              <span className="text-sm text-muted-foreground">NHANES 2011-2012 (AUX_G)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Tecnologías:</span>
              <span className="text-sm text-muted-foreground">Next.js, Chart.js, Tailwind CSS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Contacto:</span>
              <a
                href="https://instagram.com/lab_ia.fono/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-pink-600 hover:text-pink-800 transition-colors"
              >
                <img src="/instagram-logo-pink-gradient.png" alt="Instagram" className="h-5 w-5" />
                <span className="text-sm">@lab_ia.fono</span>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
