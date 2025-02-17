"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface TicketInfoModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
}

export default function TicketInfoModal({ open, onClose, title, description }: TicketInfoModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p>{description}</p>
        </div>
        <div className="mt-6">
          <Button onClick={onClose} className="w-full bg-purple-600 hover:bg-purple-700">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 