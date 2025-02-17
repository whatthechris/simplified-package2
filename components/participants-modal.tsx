"use client"

import { Minus, Plus, X } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Participant {
  type: "Adult" | "Youth" | "Infant"
  ageRange: string
  price: number
  count: number
  requiresAdult?: boolean
}

interface ParticipantsModalProps {
  open: boolean
  onClose: () => void
  participants: Participant[]
  setParticipants: (participants: Participant[]) => void
}

export default function ParticipantsModal({ open, onClose, participants, setParticipants }: ParticipantsModalProps) {
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
      <DialogContent className="max-w-lg p-0 max-h-[90vh] flex flex-col">
        <DialogHeader className="p-6 pb-0 flex-none">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">Select the participants</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-auto p-1.5">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <div className="rounded-lg bg-slate-50 p-6">
              <h3 className="text-lg font-bold">Colosseum Entry Price</h3>
              <ul className="mt-2 space-y-1">
                <li>Adult 18+: € 18</li>
                <li>Free 0-17: € 0</li>
              </ul>
              <p className="mt-4 text-sm">
                By proceeding you agree to{" "}
                <Link href="#" className="text-[#1CD4D4] hover:underline">
                  Regolamento Visitatori
                </Link>{" "}
                conditions
              </p>
            </div>

            <div className="space-y-4">
              {participants.map((participant) => (
                <div key={participant.type} className="rounded-lg border p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{participant.type}</h3>
                      <p className="text-sm text-slate-600">Age: {participant.ageRange}</p>
                      {participant.requiresAdult && (
                        <p className="text-sm text-slate-600">Only in combination with: Adult</p>
                      )}
                      <p className="mt-2 font-semibold">
                        From {participant.price === 0 ? "Free" : `€${participant.price.toFixed(2)}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateCount(participant.type, false)}
                        className={cn("h-8 w-8 p-0", participant.count === 0 && "text-slate-300")}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-lg">{participant.count}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => updateCount(participant.type, true)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t p-6 flex-none">
          <div className="mb-4 flex items-center justify-between text-xl font-bold">
            <span>Price</span>
            <span>From €{totalPrice.toFixed(2)}</span>
          </div>
          <Button className="w-full bg-purple-600 py-6 text-lg font-medium hover:bg-purple-700" onClick={onClose}>
            Save and continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

