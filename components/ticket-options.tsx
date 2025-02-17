import { Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState } from "react"
import TicketInfoModal from "./ticket-info-modal"

interface TicketOption {
  id: string
  title: string
  description?: string
  price: number
  available?: boolean
}

interface TicketOptionsProps {
  options: TicketOption[]
  selectedOption: string | null
  onSelect: (optionId: string) => void
}

export default function TicketOptions({ options, selectedOption, onSelect }: TicketOptionsProps) {
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<TicketOption | null>(null)

  const handleShowMoreInfo = (option: TicketOption) => {
    setSelectedTicket(option)
    setInfoModalOpen(true)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Select a ticket option</h3>
      <RadioGroup value={selectedOption || undefined} onValueChange={onSelect}>
        <div className="space-y-2">
          {options.map((option) => (
            <div
              key={option.id}
              className="flex items-start justify-between rounded-lg border p-4 max-w-[500px] cursor-pointer hover:bg-gray-100"
              onClick={() => onSelect(option.id)}
            >
              <div className="flex items-start gap-3">
                <RadioGroupItem className="mt-1" value={option.id} id={option.id} disabled={option.available === false} />
                <div className="flex flex-col space-y-1">
                  <Label htmlFor={option.id} className="text-base font-medium">
                    {option.title}
                  </Label>
                  <Button variant="link" className="w-fit h-auto p-0 text-[#1CD4D4]" onClick={(e) => { e.stopPropagation(); handleShowMoreInfo(option); }}>
                    Show more info
                    <Info className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right">
                {option.available === false ? (
                  <span className="text-sm font-medium text-slate-600">Sold out</span>
                ) : option.price > 0 ? (
                  <div className="text-sm font-medium text-slate-600">
                    Upgrade for
                    <div className="text-base">+€{option.price.toFixed(2)} total</div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>

      {selectedTicket && (
        <TicketInfoModal
          open={infoModalOpen}
          onClose={() => setInfoModalOpen(false)}
          title={selectedTicket.title}
          description={selectedTicket.description}
        />
      )}
    </div>
  )
}

