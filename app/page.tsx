"use client"

import { useState } from "react"
import { Calendar, Check, HelpCircle, Info, Users } from "lucide-react"
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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [showParticipantsModal, setShowParticipantsModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [attractionSelections, setAttractionSelections] = useState<{ [key: string]: AttractionSelection }>({})

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
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <Progress value={25} className="h-2" />
          <div className="mt-4 flex justify-between text-sm">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                1
              </div>
              <span className="mt-2">Booking details</span>
            </div>
            <div className="flex flex-col items-center text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border">2</div>
              <span className="mt-2">Upgrades</span>
            </div>
            <div className="flex flex-col items-center text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border">3</div>
              <span className="mt-2">Your details</span>
            </div>
            <div className="flex flex-col items-center text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border">4</div>
              <span className="mt-2">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-2 p-10 bg-white rounded-2xl">
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-bold">Rome Tourist Card</h1>
            <p className="mt-2 text-gray-600">
              Build your perfect Rome adventure with a custom package! Cover all the essentials Rome has to offer by
              creating your own unique combination of top attractions and experiences.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <h2 className="font-semibold">Ticket information</h2>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="flex gap-6 flex-row mt-20">
              <div>
                <label className="text-sm font-bold">Select your participants</label>
                <Button
                  variant="outline"
                  className="w-full justify-between mt-2"
                  onClick={() => setShowParticipantsModal(true)}
                >
                  <div className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {participantSummary}
                  </div>
                  <span className="text-muted-foreground">
                    {totalParticipants > 0 ? `€${totalPrice.toFixed(2)}` : ""}
                  </span>
                </Button>
              </div>

              <div>
                <label className="text-sm font-bold">Select your start date</label>
                <Button
                  variant="outline"
                  className={`w-full justify-between mt-2 ${totalParticipants === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  onClick={() => totalParticipants > 0 && setShowDateModal(true)}
                  disabled={totalParticipants === 0}
                >
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toLocaleDateString() : "Select a date"}
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
            <Image
              src="/rtc_image.png"
              alt="Rome Colosseum with Tourist Card"
              className="object-fill object-center"
              width={1000}
              height={1000}
            />
          </div>
        </div>

        {selectedDate && (
          <div ref={attractionsRef} className="mt-8 grid gap-6 md:grid-cols-[2fr,1fr]">
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Reserve your tickets</h2>
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
        }}
        participants={participants}
        setParticipants={(newParticipants) => {
          setParticipants(newParticipants)
          setAttractionSelections({}) // Clear selections when participants change
        }}
      />

      <DatePickerModal
        open={showDateModal && hasParticipants}
        onClose={() => setShowDateModal(false)}
        selectedDate={selectedDate}
        onSelect={(date) => {
          setSelectedDate(date)
          setAttractionSelections({})
          // Scroll to attractions section after a short delay to ensure rendering
          if (date) {
            setTimeout(() => {
              attractionsRef.current?.scrollIntoView({ behavior: "smooth" })
            }, 100)
          }
        }}
      />
    </div>
  )
}

