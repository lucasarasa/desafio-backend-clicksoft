export interface CreateEventDto {
  name: string
  date_hour: string
  localization: string
  description?: string
  capacity_max: number
}
