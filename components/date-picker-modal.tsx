"use client"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DatePickerModalProps {
  open: boolean
  onClose: () => void
  selectedDate: Date | null
  onSelect: (date: Date | null) => void
}

export default function DatePickerModal({ open, onClose, selectedDate, onSelect }: DatePickerModalProps) {
  // Get today's date at the start of the day (midnight)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select start date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              onSelect(date || null)  // Convert undefined to null
              onClose()
            }}
            initialFocus
            fromDate={today}
            disabled={(date) => {
              // Disable dates before today
              return date < today
            }}
            className="border rounded-md"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

