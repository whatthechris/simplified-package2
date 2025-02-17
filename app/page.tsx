"use client"

import { useState } from "react"
import { Calendar, Check, HelpCircle, Info, Users, Minus, Plus } from "lucide-react"
import React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import DatePickerModal from "@/components/date-picker-modal"
import ParticipantsModal from "@/components/participants-modal"
import AttractionSection from "@/components/attraction-section"
import Itinerary from "@/components/itinerary"
import Image from "next/image"

interface Participant {
  type: "Adult" | "Youth" | "Infant"
  ageRange: string
  price: number
  count: number
  requiresAdult?: boolean
}

const attractions = [
  {
    title: "Colosseum, Roman Forum & Palatine Hill",
    image: "/colo.jpg",
    duration: "2-3 hours",
    ticketOptions: [
      {
        id: "entry",
        title: "Entry Ticket",
        price: 0,
      },
      {
        id: "entry-prison",
        title: "Entry & Mamertine Prison Ticket",
        price: 10.0,
      },
      {
        id: "entry-audio",
        title: "Entry Ticket + Digital Audio Guide",
        price: 5.0,
        available: false,
      },
    ],
  },
  {
    title: "Vatican Museums & Sistine Chapel",
    image: "/vat.jpg",
    duration: "Half a day",
    ticketOptions: [
      {
        id: "standard",
        title: "Standard Entry",
        price: 0,
      },
      {
        id: "guided",
        title: "Guided Tour",
        price: 15.0,
      },
    ],
  },
  {
    title: "Pantheon",
    image: "/panth.jpg",
    duration: "1-2 hours",
    ticketOptions: [
      {
        id: "free",
        title: "Free Entry",
        price: 0,
      },
      {
        id: "guided",
        title: "Guided Tour",
        price: 12.0,
      },
    ],
  },
]

interface AttractionSelection {
  date: Date
  time?: string
  ticketOption?: string
}

export default function BookingPage() {
  const [participants, setParticipants] = useState<Participant[]>([
    { type: "Adult", ageRange: "18-99", price: 96.0, count: 0 },
    { type: "Youth", ageRange: "6-17", price: 43.0, count: 0, requiresAdult: true },
    { type: "Infant", ageRange: "0-5", price: 0, count: 0, requiresAdult: true },
  ])
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [attractionSelections, setAttractionSelections] = useState<{ [key: string]: AttractionSelection }>({})
  const [showAttractions, setShowAttractions] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [datePickerAttraction, setDatePickerAttraction] = useState<string | null>(null)

  const totalParticipants = participants.reduce((sum, p) => sum + p.count, 0)
  const calculateTotalPrice = () => {
    const basePrice = participants.reduce((sum, p) => sum + p.price * p.count, 0)
    const upgradePrice = Object.entries(attractionSelections).reduce((sum, [title, selection]) => {
      if (!selection.ticketOption) return sum
      const attraction = attractions.find((a) => a.title === title)
      const option = attraction?.ticketOptions.find((o) => o.id === selection.ticketOption)
      return sum + (option?.price || 0) * totalParticipants
    }, 0)
    return basePrice + upgradePrice
  }
  const totalPrice = calculateTotalPrice()
  const hasParticipants = totalParticipants > 0

  const participantSummary =
    totalParticipants > 0
      ? `${totalParticipants} ${totalParticipants === 1 ? "participant" : "participants"}`
      : "Select"

  const handleAttractionDateSelect = (attractionTitle: string, date: Date, time?: string) => {
    setAttractionSelections((prev) => ({
      ...prev,
      [attractionTitle]: {
        ...prev[attractionTitle],
        date,
        // Only update the time if provided, preserve existing ticket option
        ...(time !== undefined && { time }),
        // Only clear ticket option if no time is provided (meaning it's a date change)
        ...(time === undefined && { 
          ticketOption: undefined,
          time: undefined 
        })
      },
    }))
  }

  const handleTicketSelect = (attractionTitle: string, optionId: string) => {
    setAttractionSelections((prev) => ({
      ...prev,
      [attractionTitle]: {
        ...prev[attractionTitle],
        ticketOption: optionId,
        // Clear time when ticket option changes
        time: undefined,
      },
    }))
  }

  const itineraryItems = Object.entries(attractionSelections).map(([title, selection]) => {
    const attraction = attractions.find((a) => a.title === title)
    const ticketOption = attraction?.ticketOptions.find((o) => o.id === selection.ticketOption)
    return {
      title,
      date: selection.date,
      time: selection.time,
      duration: attraction?.duration || "",
      ticketOption: ticketOption
        ? {
            title: ticketOption.title,
            price: ticketOption.price,
          }
        : undefined,
    }
  })

  // Add ref for the attractions section
  const attractionsRef = React.useRef<HTMLDivElement>(null)

  const handleParticipantsSave = () => {
    setShowParticipantsModal(false)
    setShowAttractions(true)
    // Scroll to attractions section after a short delay
    setTimeout(() => {
      attractionsRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  const handleDateSelect = (date: Date | null) => {
    if (date && datePickerAttraction) {
      // Only update the date for the attraction that opened the picker
      handleAttractionDateSelect(datePickerAttraction, date)
    }
    setShowDateModal(false)
    setDatePickerAttraction(null)
    // Update the base date for all date ranges
    if (date) {
      setSelectedDate(date)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-[#1CD4D4]">Logo</div>
            <div className="flex items-center gap-4">
              <Button variant="ghost">
                <HelpCircle className="mr-2 h-4 w-4" />
                Help
              </Button>
              <Button variant="ghost">Sign in</Button>
            </div>
          </div>
        </div>
        <hr/>
        <div className="flex justify-center">
          <Image src="/steps.png" alt="" width={1440} height={74} />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-2 p-10 bg-white rounded-2xl">
          <div className="max-w-md flex flex-col justify-center">
            <h1 className="text-3xl font-bold">Rome Tour Card</h1>
            <p className="mt-2 text-gray-600">
              Build your perfect Rome adventure with a custom package! Cover all the essentials Rome has to offer by
              creating your own unique combination of top attractions and experiences.
            </p>

            <div className="mt-2">
              <Button variant="link" className="w-fit h-auto p-0 text-[#1CD4D4]">
                Show more info
                <Info className="ml-1 h-4 w-4" />
              </Button>
            </div>

              <div className="space-y-4 mt-6">
                <h3 className="font-semibold">Select your participants</h3>
                {participants.map((participant) => (
                  <div key={participant.type} className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200">
                    <div>
                      <div className="font-medium">{participant.type}</div>
                      <div className="text-sm text-gray-500">Age: {participant.ageRange}</div>
                      {participant.requiresAdult && (
                        <div className="text-sm text-gray-500">• Only in combination with: Adult</div>
                      )}
                      <div className="font-medium mt-1">€{participant.price.toFixed(2)}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setParticipants(participants.map(p =>
                            p.type === participant.type 
                              ? { ...p, count: Math.max(0, p.count - 1) }
                              : p
                          ))
                          setAttractionSelections({})
                        }}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{participant.count}</span>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={() => {
                          setParticipants(participants.map(p =>
                            p.type === participant.type 
                              ? { ...p, count: p.count + 1 }
                              : p
                          ))
                          setAttractionSelections({})
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-6"
                onClick={() => {
                  setShowAttractions(true)
                  setTimeout(() => {
                    attractionsRef.current?.scrollIntoView({ behavior: "smooth" })
                  }, 100)
                }}
                disabled={totalParticipants === 0}
              >
                Check availability
              </Button>
          </div>

          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src="/rtc_image.png"
              alt="Rome Colosseum with Tourist Card"
              className="object-fill object-center"
              width={1000}
              height={1000}
            />
          </div>
        </div>

        {showAttractions && (
          <div ref={attractionsRef} className="mt-8 grid gap-6 lg:gap-12 md:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Reserve your tickets</h2>
              <div className="space-y-4">
                {attractions.map((attraction) => (
                  <AttractionSection
                    key={attraction.title}
                    title={attraction.title}
                    image={attraction.image}
                    duration={attraction.duration}
                    selectedDate={selectedDate}
                    attractionDate={attractionSelections[attraction.title]?.date}
                    onDateSelect={(date, time) => handleAttractionDateSelect(attraction.title, date, time)}
                    ticketOptions={attraction.ticketOptions}
                    selectedTicketOption={attractionSelections[attraction.title]?.ticketOption || null}
                    onTicketSelect={(optionId) => handleTicketSelect(attraction.title, optionId)}
                    isDateSelected={!!attractionSelections[attraction.title]?.date}
                    onMoreDatesClick={() => {
                      setDatePickerAttraction(attraction.title)
                      setShowDateModal(true)
                    }}
                  />
                ))}
              </div>
            </div>
            <div>
              <Itinerary items={itineraryItems} totalPrice={calculateTotalPrice()} />
            </div>
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="bg-[#1CD4D4]">
            <CardHeader>
              <CardTitle className="text-white">Need some help?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white">Our customer service team is available 24/7 to answer your questions!</p>
            </CardContent>
            <CardFooter>
              <Button variant="secondary">Contact us</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Why people love us</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "24/7 Customer Service",
                  "Tickets on your smartphone",
                  "Safe and secure payment processing",
                  "Top payment methods accepted",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[#1CD4D4]" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ParticipantsModal
        open={showParticipantsModal}
        onClose={() => {
          setShowParticipantsModal(false)
          setAttractionSelections({}) // Clear selections when participants change
          setShowAttractions(false) // Hide attractions when closing modal
        }}
        participants={participants}
        setParticipants={(newParticipants) => {
          setParticipants(newParticipants)
          setAttractionSelections({}) // Clear selections when participants change
        }}
        onSaveAndContinue={handleParticipantsSave}
      />

      <DatePickerModal
        open={showDateModal}
        onClose={() => setShowDateModal(false)}
        selectedDate={new Date()}
        onSelect={handleDateSelect}
      />
    </div>
  )
}

