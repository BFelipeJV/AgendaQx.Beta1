'use client'

import { useEffect, useState } from 'react'
import { parseISO, differenceInDays } from 'date-fns'
import type { Surgery } from '@/lib/types'
import { CURRENT_USER_SESSION_KEY, MOCK_SURGERIES_STORAGE_KEY } from '@/lib/constants'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { PieChart, Pie, Cell } from 'recharts'

interface SummaryMap {
  [surgeon: string]: { cirugia: number; procedimiento: number }
}

export default function MonthlySummary() {
  const [summary, setSummary] = useState<SummaryMap>({})
  const [currentSurgeon, setCurrentSurgeon] = useState<string>('')

  useEffect(() => {
    try {
      const userSessionJson = localStorage.getItem(CURRENT_USER_SESSION_KEY)
      if (userSessionJson) {
        const user = JSON.parse(userSessionJson)
        setCurrentSurgeon(user.nombreCompleto || user.email)
      }
    } catch (err) {
      console.error('Error parsing user session', err)
    }

    try {
      const stored = localStorage.getItem(MOCK_SURGERIES_STORAGE_KEY)
      const all: Surgery[] = stored ? JSON.parse(stored) : []
      const last30 = all.filter((s) => {
        if (!s.entryTimestamp) return false
        const entryDate = parseISO(s.entryTimestamp)
        return differenceInDays(new Date(), entryDate) <= 30
      })
      const map: SummaryMap = {}
      last30.forEach((s) => {
        const surgeon = s.surgeon || 'Sin asignar'
        if (!map[surgeon]) {
          map[surgeon] = { cirugia: 0, procedimiento: 0 }
        }
        map[surgeon][s.tipoIntervencion] += 1
      })
      setSummary(map)
    } catch (err) {
      console.error('Error loading surgeries', err)
    }
  }, [])

  const totalUser = summary[currentSurgeon]?.cirugia + summary[currentSurgeon]?.procedimiento || 0
  const totalTeam = Object.values(summary).reduce((sum, val) => sum + val.cirugia + val.procedimiento, 0)

  const chartConfig = {
    cirugia: { label: 'Cirugía', color: 'hsl(var(--chart-1))' },
    procedimiento: { label: 'Procedimiento', color: 'hsl(var(--chart-2))' },
  }

  return (
    <Card className="shadow-lg mt-8">
      <CardHeader>
        <CardTitle>Resumen Mensual</CardTitle>
        <CardDescription>Total de cirugías registradas en los últimos 30 días</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-primary">{totalUser}</p>
            <p className="text-sm text-muted-foreground">Mis cirugías</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-primary">{totalTeam}</p>
            <p className="text-sm text-muted-foreground">Equipo completo</p>
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {Object.entries(summary).map(([surgeon, counts]) => {
            const data = [
              { name: 'cirugia', value: counts.cirugia },
              { name: 'procedimiento', value: counts.procedimiento },
            ]
            return (
              <div key={surgeon} className="flex flex-col items-center">
                <p className="font-medium mb-2 text-center">{surgeon}</p>
                <ChartContainer config={chartConfig} className="w-full h-60">
                  <PieChart>
                    <Pie data={data} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="90%" paddingAngle={1}>
                      {data.map((entry) => (
                        <Cell key={entry.name} fill={`var(--color-${entry.name})`} />
                      ))}
                    </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" />} />
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                  </PieChart>
                </ChartContainer>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

