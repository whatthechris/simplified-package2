import { useState } from "react"
import { format, differenceInHours, parse } from "date-fns"
import { AlertTriangle, Smartphone, CircleCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ItineraryItem {
  title: string
  date: Date
  time?: string
  duration: string
  ticketOption?: {
    title: string
    price: number
  }
}

interface ItineraryProps {
  items: ItineraryItem[]
  totalPrice: number
}

export default function Itinerary({ items, totalPrice }: ItineraryProps) {
  // Add state to track dismissed warnings
  const [dismissedWarnings, setDismissedWarnings] = useState<Set<string>>(new Set())

  // Sort items by date and time
  const sortedItems = [...items].sort((a, b) => {
    const dateCompare = a.date.getTime() - b.date.getTime()
    if (dateCompare !== 0) return dateCompare

    if (!a.time || !b.time) return 0
    return a.time.localeCompare(b.time)
  })

  // Helper function to check if two attractions are too close together
  const isTimeTooClose = (item1: ItineraryItem, item2: ItineraryItem) => {
    if (!item1.time || !item2.time) return false
    if (item1.date.getTime() !== item2.date.getTime()) return false

    const time1 = parse(item1.time, "HH:mm", item1.date)
    const time2 = parse(item2.time, "HH:mm", item2.date)
    const hoursDiff = Math.abs(differenceInHours(time1, time2))
    
    return hoursDiff <= 3
  }

  // Helper function to check if an item is complete
  const isItemComplete = (item: ItineraryItem) => {
    return item.date && item.ticketOption && item.time
  }

  return (
    <Card className="sticky top-8 mt-11">
      <CardHeader>
        <CardTitle className="text-lg font-semibold tracking-tight">Your package itinerary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedItems.map((item, index) => {
          const warningKey = `${item.title}-${sortedItems[index + 1]?.title}`
          const showWarning = index < sortedItems.length - 1 && 
            isTimeTooClose(item, sortedItems[index + 1]) && 
            !dismissedWarnings.has(warningKey)

          return (
            <div key={`${item.title}-${item.date}`}>
              <div className="flex gap-6">
                <div className="w-[30px] text-sm text-slate-600">
                  <div className="uppercase">{format(item.date, "MMM")}</div>
                  <div className="text-2xl font-bold text-slate-900">{format(item.date, "dd")}</div>
                  {item.time && <div className="mt-1">{item.time}</div>}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm md:text-md">{item.title}</h3>
                    {isItemComplete(item) && (
                      <CircleCheck className="h-7 w-7 text-green-500" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">Plan to spend: {item.duration}</p>
                  {item.ticketOption && (
                    <p className="mt-1 text-xs md:text-sm font-medium text-slate-600">{item.ticketOption.title}</p>
                  )}
                </div>
              </div>

              {showWarning && (
                <Alert variant="warning" className="flex flex-row gap-6 mt-4 mb-4 bg-amber-50 text-amber-700 border-amber-200">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    The attraction below is scheduled less than 3 hours apart. You may not have enough time to visit and travel between both attractions.
                  </AlertDescription>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex items-center justify-center h-6 w-6 text-amber-700 hover:text-amber-900"
                    onClick={() => {
                      setDismissedWarnings(prev => new Set([...prev, warningKey]))
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </Alert>
              )}

              {index < sortedItems.length - 1 && <Separator className="my-4" />}
            </div>
          )
        })}
        <div className="flex gap-7">
          <div className="w-[24px]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1CD4D4]">
              <Smartphone className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm md:text-md">City Audio Guide App</h3>
            <p className="text-sm text-slate-600">No need to reserve tickets</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center justify-between pt-2 text-lg font-bold">
          <span>Total Price</span>
          <span>€{totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

