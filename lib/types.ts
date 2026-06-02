export interface RSVP {
  id: string
  name: string
  email: string
  plus_ones: number
  message: string | null
  created_at: string
  updated_at: string
}

export interface RSVPFormData {
  name: string
  email: string
  plus_ones: number
  message: string
}

export interface AdminStats {
  totalRSVPs: number
  totalPlusOnes: number
  guests: RSVP[]
}
