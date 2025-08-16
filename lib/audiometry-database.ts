export interface AudiometryRecord {
  SEQN: number
  AUXU1K1R: number | null
  AUXU500R: number | null
  AUXU2KR: number | null
  AUXU3KR: number | null
  AUXU4KR: number | null
  AUXU6KR: number | null
  AUXU8KR: number | null
  AUXU1K1L: number | null
  AUXU500L: number | null
  AUXU2KL: number | null
  AUXU3KL: number | null
  AUXU4KL: number | null
  AUXU6KL: number | null
  AUXU8KL: number | null
}

export function parseAudiometryDatabase(htmlContent: string): AudiometryRecord[] {
  const records: AudiometryRecord[] = []

  // Extract data rows from HTML
  const lines = htmlContent.split("\n")
  let dataStarted = false

  for (const line of lines) {
    if (line.includes("SEQN,AUAEXSTS")) {
      dataStarted = true
      continue
    }

    if (dataStarted && line.includes("<hr>")) {
      continue
    }

    if (dataStarted && line.trim() && !line.includes("<") && line.includes(",")) {
      const values = line.split(",")
      if (values.length > 50) {
        const record: AudiometryRecord = {
          SEQN: Number.parseFloat(values[1]) || 0,
          AUXU1K1R: Number.parseFloat(values[38]) || null,
          AUXU500R: Number.parseFloat(values[39]) || null,
          AUXU2KR: Number.parseFloat(values[41]) || null,
          AUXU3KR: Number.parseFloat(values[42]) || null,
          AUXU4KR: Number.parseFloat(values[43]) || null,
          AUXU6KR: Number.parseFloat(values[44]) || null,
          AUXU8KR: Number.parseFloat(values[45]) || null,
          AUXU1K1L: Number.parseFloat(values[46]) || null,
          AUXU500L: Number.parseFloat(values[47]) || null,
          AUXU2KL: Number.parseFloat(values[49]) || null,
          AUXU3KL: Number.parseFloat(values[50]) || null,
          AUXU4KL: Number.parseFloat(values[51]) || null,
          AUXU6KL: Number.parseFloat(values[52]) || null,
          AUXU8KL: Number.parseFloat(values[53]) || null,
        }

        // Only include records with valid audiometry data
        const hasValidData = [
          record.AUXU500R,
          record.AUXU1K1R,
          record.AUXU2KR,
          record.AUXU3KR,
          record.AUXU4KR,
          record.AUXU6KR,
          record.AUXU8KR,
          record.AUXU500L,
          record.AUXU1K1L,
          record.AUXU2KL,
          record.AUXU3KL,
          record.AUXU4KL,
          record.AUXU6KL,
          record.AUXU8KL,
        ].some((val) => val !== null && !isNaN(val) && val >= 0 && val <= 120)

        if (hasValidData) {
          records.push(record)
        }
      }
    }
  }

  return records
}
