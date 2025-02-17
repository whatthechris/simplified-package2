"use client"

import { Minus, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface Participant {
  type: "Adult" | "Child" | "Infant"
  price: number
  count: number
}

interface ParticipantsModalProps {
  open: boolean
  onClose: () => void
  participants: Participant[]
  setParticipants: (participants: Participant[]) => void
}

export function ParticipantsModal({ open, onClose, participants, setParticipants }: ParticipantsModalProps) {
  const updateCount = (type: Participant["type"], increment: boolean) => {
    setParticipants(
      participants.map((p) =>
        p.type === type ? { ...p, count: increment ? p.count + 1 : Math.max(0, p.count - 1) } : p,
      ),
    )
  }

  const totalPrice = participants.reduce((sum, p) => sum + p.price * p.count, 0)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select participants</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {participants.map((participant) => (
            <div key={participant.type} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{participant.type}</div>
                <div className="text-sm text-muted-foreground">€{participant.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="icon" onClick={() => updateCount(participant.type, false)}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{participant.count}</span>
                <Button variant="outline" size="icon" onClick={() => updateCount(participant.type, true)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          <Separator />
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <span>€{totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full" onClick={onClose}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

