import dayjs from "dayjs";

export const formatNumber = (price: number) => {
  return new Intl.NumberFormat('en-US').format(price)
};

export const formatNumberToFixed = (price: number, fixed: number) => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  }).format(price);
};

export const isValidLatitude = (lat: number): boolean => {
  return !isNaN(lat) && lat >= -90 && lat <= 90
};

export const isValidLongitude = (lng: number): boolean => {
  return !isNaN(lng) && lng >= -180 && lng <= 180
};

export const parseCoordinates = (input: string): { lat: number, lng: number } | null => {
  const coords = input.split(',').map(coord => parseFloat(coord.trim()))
  
  if (coords.length === 2 && isValidLatitude(coords[0]) && isValidLongitude(coords[1])) {
    return { lat: coords[0], lng: coords[1] }
  }
  
  return null
};

export const parseCoordinatesWith2Param = (lat: string, lon: string): { lat: number, lng: number } | null => {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isValidLatitude(latitude) && isValidLongitude(longitude)) {
    return { lat: latitude, lng: longitude }
  }
  
  return null
};

export const calculateTotalYear = (fromDate: string) => {
  if (!fromDate) {
    return `0 ปี 0 เดือน 0 วัน`
  }

  const start = dayjs(fromDate)
  const now = dayjs()

  const years = now.diff(start, 'year')
  const months = now.diff(start.add(years, 'year'), 'month')
  const days = now.diff(start.add(years, 'year').add(months, 'month'), 'day')

  return `${years} ปี ${months} เดือน ${days} วัน`
}

export const formatPhone = (value: string) => {
  return value.replace(
    /(\d{0,3})?(\d{0,3})?(\d{0,4})?/,
    (_, p1, p2, p3) => [p1, p2, p3].filter(Boolean).join('-')
  )
}
export const formatThaiID = (value: string) => {
  return value.replace(
    /(\d{1})(\d{0,4})?(\d{0,5})?(\d{0,2})?(\d{0,1})?/,
    (_, p1, p2, p3, p4, p5) => [p1, p2, p3, p4, p5].filter(Boolean).join('-')
  )
}

export const formatPointTenAsMinutes = (value: number): string => {
  const hours = Math.floor(value);
  const minutes = Math.round((value % 1) * 100);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};