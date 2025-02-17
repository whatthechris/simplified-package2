"use client"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface DatePickerModalProps {
  open: boolean
  onClose: () => void
  selectedDate: Date | null
  onSelect: (date: Date | null) => void
}

export function DatePickerModal({ open, onClose, selectedDate, onSelect }: DatePickerModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select start date</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={selectedDate || undefined}
            onSelect={(date) => {
              onSelect(date)
              onClose()
            }}
            initialFocus
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

