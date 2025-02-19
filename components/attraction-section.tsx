import { Calendar, Clock } from "lucide-react"
import { format, addDays, isToday } from "date-fns"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import TicketOptions from "./ticket-options"

interface AttractionSectionProps {
  title: string
  image: string
  selectedDate: Date
  attractionDate?: Date
  onDateSelect: (date: Date, time?: string) => void
  duration: string
  selectedTicketOption: string | null
  onTicketSelect: (optionId: string) => void
  ticketOptions: Array<{
    id: string
    title: string
    description?: string
    price: number
    available?: boolean
  }>
  isDateSelected: boolean
  onMoreDatesClick: () => void
}

const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"]

export default function AttractionSection({
  title,
  image,
  selectedDate,
  attractionDate,
  onDateSelect,
  duration,
  selectedTicketOption,
  onTicketSelect,
  ticketOptions,
  isDateSelected,
  onMoreDatesClick,
}: AttractionSectionProps) {
  // Use the attraction's selected date if it exists, otherwise use the start date
  const currentAttractionDate = attractionDate || selectedDate;

  // Generate 5 days starting from the start date
  const dateRange = Array.from({ length: 5 }, (_, i) => addDays(selectedDate, i))

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate()
  }

  return (
    <Card className="bg-white rounded-2xl overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-4 bg-slate-100 px-12 py-8">
        <div className="space-y-3">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              Plan to spend: {duration}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Clock className="h-4 w-4" />
              Best time to visit: Early morning
            </div>
          </div>
        </div>
        <div className="relative h-24 w-24 overflow-hidden rounded-lg">
          <img src={image || "/placeholder.svg"} alt={title} className="object-cover" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 px-12 py-8">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Select a visit date</h3>
            <p className="text-sm text-slate-600">{format(selectedDate, "MMM yyyy").toUpperCase()}</p>
          </div>
          <div className="flex gap-2 max-w-[500px]">
            {dateRange.map((date, i) => {
              const isSelected = attractionDate ? isSameDay(date, attractionDate) : false;
              return (
                <Button
                  key={date.toISOString()}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "flex-1 flex-col gap-1 p-2 h-[70px]",
                    isSelected && "bg-[#1CD4D4] hover:bg-[#1CD4D4]/90"
                  )}
                  onClick={() => onDateSelect(date)}
                >
                  <span className={cn(
                    "text-xs",
                    isSelected ? "text-white" : "text-slate-600"
                  )}>
                    {isToday(date) ? "TODAY" : format(date, "EEE").toUpperCase()}
                  </span>
                  <span className={cn(
                    "text-lg font-semibold",
                    isSelected && "text-white"
                  )}>
                    {format(date, "d")}
                  </span>
                </Button>
              )
            })}
            <Button 
              variant="outline" 
              className="flex-1 flex-col gap-1 p-2 h-[70px]" 
              onClick={onMoreDatesClick}
            >
              <Calendar className="h-4 w-4 text-[#1CD4D4]" />
              <span className="text-xs text-[#1CD4D4]">More dates</span>
            </Button>
          </div>
        </div>

        {/* Only show ticket options after a date has been selected for this attraction */}
        {isDateSelected && (
          <TicketOptions 
            options={ticketOptions} 
            selectedOption={selectedTicketOption} 
            onSelect={onTicketSelect} 
          />
        )}

        {/* Only show time selection after a ticket is selected */}
        {selectedTicketOption && (
          <div className="pt-4 max-w-[330px]">
            <h3 className="text-lg font-semibold">Select a timeslot</h3>
            <Select
              onValueChange={(time) => {
                // Use the attraction's current date
                const dateToUse = new Date(currentAttractionDate.getTime())
                onDateSelect(dateToUse, time)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select preferred time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

