import buddhistEraAdapter from "../../utils/buddhistEraAdapter"
import { Dayjs } from 'dayjs';

// Material UI
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import type { DateTimePickerProps }from '@mui/x-date-pickers/DateTimePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Typography from '@mui/material/Typography'
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"

type CustomDatePickerProps = Omit<DatePickerProps<any>, 'value' | 'onChange'> & {
  id?: string
  label?: string
  labelTextSize?: string
  className?: string
  value: Dayjs | null
  onChange: (date: Dayjs | null, context: any) => void
  isWithTime?: boolean
  error?: boolean
  register?: any
  sx?: object
  maxDate?: Dayjs
  views?: Array<'year' | 'month' | 'day' | 'hours' | 'minutes'>
  size?: 'small' | 'medium'
  fontSize?: string | number
  bgColor?: string
  color?: string
  borderColor?: string
  height?: string
  yearOnly?: boolean;
}

const DatePickerBuddhist: React.FC<CustomDatePickerProps> = ({
  id,
  label,
  labelTextSize,
  onChange,
  value,
  isWithTime,
  error = false, 
  register,
  sx = {},
  maxDate,
  className,
  views,
  size,
  fontSize = '12px',
  bgColor = '#FFFFFF',
  color = '#000000',
  borderColor = '',
  height = '',
  yearOnly = false,
  ...props
}) => {
  const handleDateChange = (date: Dayjs | null, context: any) => {
    if (onChange) {
      onChange(date, context); // pass Dayjs directly
      if (register) {
        register.onChange({
          target: { name: register.name, value: date?.toDate() || null },
        });
      }
    }
  }

  const datePickerProps = {
    value,
    onChange: handleDateChange,
    format: yearOnly ? "YYYY" : isWithTime ? "DD/MM/YYYY HH:mm" : "DD/MM/YYYY",
    views,
    ...(maxDate && { maxDate }),
  };

  return (
    <div id={id} className={`flex flex-col w-full ${className || ''}`}>
      {label && (
        <Typography
          variant="subtitle1"
          color="white"
          sx={{ fontSize: labelTextSize }}
        >
          {label}
        </Typography>
      )}
      <LocalizationProvider 
        dateAdapter={buddhistEraAdapter} 
        adapterLocale={"th"}
      >
        {
          !isWithTime ? 
          (
            <DatePicker
              {...props}
              {...datePickerProps}
              slotProps={{
                textField: {
                  sx: {
                    width: "100%",
                    '& .MuiPickersInputBase-root': {
                      fontSize: fontSize,
                      borderRadius: '5px',
                      backgroundColor: `${bgColor} !important`,
                      color: `${color} !important`,
                      ...(borderColor
                        ? { borderColor: `${borderColor} !important` }
                        : {}
                      ),
                      ...(height
                        ? { height: `${height} !important` }
                        : {}
                      ),
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: error ? 'red' : 'default',
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: error ? 'red' : 'default',
                        borderWidth: '2px',
                      },
                      '& .Mui-focused fieldset': {
                        borderColor: error ? 'red' : 'default',
                        borderWidth: '2px',
                      },
                    },
                    '& .Mui-disabled': {
                      backgroundColor: "#DDD !important",
                      color: "#81898E !important",
                      WebkitTextFillColor: '#81898E !important',
                    },
                    ...sx,
                  }
                }
              }}
            />
          ) : 
          (
            <DateTimePicker
              {...props as DateTimePickerProps<any>}
              {...datePickerProps}
              slotProps={{
                textField: {
                  sx: {
                    width: "100%",
                    '& .MuiPickersInputBase-root': {
                      fontSize: fontSize,
                      borderRadius: '5px',
                      backgroundColor: `${bgColor} !important`,
                      color: `${color} !important`,
                      ...(borderColor
                        ? { borderColor: `${borderColor} !important` }
                        : {}
                      ),
                      ...(height
                        ? { height: `${height} !important` }
                        : {}
                      ),
                    },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: error ? 'red' : 'default',
                        borderWidth: '2px',
                      },
                      '&:hover fieldset': {
                        borderColor: error ? 'red' : 'default',
                        borderWidth: '2px',
                      },
                      '& .Mui-focused fieldset': {
                        borderColor: error ? 'red' : 'default',
                        borderWidth: '2px',
                      },
                    },
                    '& .Mui-disabled': {
                      backgroundColor: "#DDD !important",
                      color: "#81898E !important",
                      WebkitTextFillColor: '#81898E !important',
                    },
                    ...sx,
                  }
                }
              }}
            />
          )}
      </LocalizationProvider>
    </div>
  )
}

export default DatePickerBuddhist