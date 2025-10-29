import React, { useRef, useState, useEffect } from "react";
import {
  DateCalendar,
} from "@mui/x-date-pickers";
import { DayCalendarSkeleton } from "@mui/x-date-pickers/DayCalendarSkeleton";
import { LocalizationProvider } from "@mui/x-date-pickers";
import buddhistEraAdapter from "../../utils/buddhistEraAdapter";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// Components
import RenderCustomDay from "../custom-pickers-day/CustomPickersDay";

// Icons
import ArrowLeftIcon from "../../assets/icons/left-arrow.png";
import ArrowRightIcon from "../../assets/icons/right-arrow.png";
import WarningIcon from "../../assets/icons/warning.png";
import AlertIcon from "../../assets/icons/alert.png";

// Types
import type {
  DayInfo
} from "../../features/types";

type CalendarProps = {
  onDateSelect?: (date: Dayjs, dayInfo: DayInfo | undefined) => void;
  onInfoSelect?: (dayInfo: DayInfo | undefined) => void;
  divHeight?: string;
  minHeight?: string;
  isShowLegend?: boolean;
  bgColor?: string;
  weekDayLabelColor?: string;
  weekDayLabelBgColor?: string;
  pickersDayBgColor?: string;
  isNoDataDisable?: boolean;
  workSchedule?: DayInfo[];
};

const Calendar: React.FC<CalendarProps> = ({ 
  onDateSelect,
  onInfoSelect,
  divHeight = "240px",
  minHeight = "240px",
  isShowLegend = true,
  bgColor = "#FFF",
  weekDayLabelColor = "#FFFFFF",
  weekDayLabelBgColor = "#133462",
  pickersDayBgColor = "transparent",
  isNoDataDisable = false,
  workSchedule,
}) => {
  const requestAbortController = useRef<AbortController | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [daysData, setDaysData] = useState<DayInfo[]>([]);

  useEffect(() => {
    setDaysData(workSchedule ?? []);
  }, [workSchedule]);

  useEffect(() => {
    const labels = document.querySelectorAll(".MuiDayCalendar-weekDayLabel");
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    labels.forEach((label, index) => {
      const dayName = days[index % 7];
      (label as HTMLElement).textContent = "";
      (label as HTMLElement).setAttribute("data-day", dayName);
    });
  }, [selectedDate]);

  const handleMonthChange = (date: Dayjs) => {
    requestAbortController.current?.abort();
    setDaysData([]);
  };

  return (
    <LocalizationProvider dateAdapter={buddhistEraAdapter} adapterLocale="th">
      <Box
        sx={{
          backgroundColor: bgColor,
          width: "100%",
          position: "relative",
        }}
      >
        {/* Legend */}
        {
          isShowLegend && (
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", position: "absolute", top: "25px" }}>
              <Legend color="#133462" label="กะเช้า" />
              <Legend color="#A3CBF2" label="กะดึก" />
              <Legend color="#FFB300" label="รออนุมัติ" icon={WarningIcon} alt="Warning Icon" />
              <Legend color="#E53935" label="ไม่อนุมัติ" icon={AlertIcon} alt="Alert Icon" />
            </Box>
          )
        }

        <DateCalendar
          value={selectedDate}
          loading={isLoading}
          showDaysOutsideCurrentMonth={true}
          onMonthChange={handleMonthChange}
          onChange={(newDate) => {
            if (newDate) {
              setSelectedDate(newDate);
              const dayData = workSchedule?.find(d =>
                dayjs(d.date).isSame(newDate, "day")
              );
              if (onDateSelect) {
                onDateSelect(newDate, dayData);
              }
              if (onInfoSelect) {
                onInfoSelect(dayData);
              }
            }
          }}
          renderLoading={() => <DayCalendarSkeleton />}
          dayOfWeekFormatter={(date) => {
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            return days[date.day()];
          }}
          slots={{
            leftArrowIcon: () => (
              <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={ArrowLeftIcon}
                  alt="Previous month"
                  className="w-[15px] h-[15px]"
                />
              </Box>
            ),
            rightArrowIcon: () => (
              <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src={ArrowRightIcon}
                  alt="Next month"
                  className="w-[15px] h-[15px]"
                />
              </Box>
            ),
            day: (props) => {
              const dayData = workSchedule?.find(d =>
                dayjs(d.date).isSame(props.day, "day")
              );
              return (
                <RenderCustomDay
                  {...props}
                  morningCount={dayData?.morning ?? 0}
                  eveningCount={dayData?.night ?? 0}
                  waitApprove={dayData?.waitApprove ?? false}
                  rejected={dayData?.rejected ?? false}
                  isNoDataDisable={isNoDataDisable}
                />
              );
            },
          }}
          slotProps={{
            calendarHeader: {
              sx: {
                color: "#FFC300",
              },
            },
          }}
          sx={{
            width: "100%",
            minHeight: `${divHeight} !important`,
            "& .MuiTypography-root": {
              borderRadius: 0,
              width: "100%",
              height: "40px !important",
              padding: 0,
              margin: 0,
              fontSize: "12px",
              fontWeight: 600,
              backgroundColor: "#133462",
              color: "#FFFFFF",
              mt: "10px",
              borderRight: "#D9D9D9",
              borderWidth: "1px"
            },
            "& .MuiDayCalendar-header": {
              p: "0 !important",
            },
            "& .MuiPickersDay-root": {
              borderRadius: 0,
              width: "100%",
              margin: 0,
              fontSize: "24px",
              fontWeight: 700,
              border: "1px solid #F2F2F2",
              backgroundColor: pickersDayBgColor,
            },
            "& .Mui-selected": {
              color: "#124692 !important",
              backgroundColor: "#D9D9D9 !important",
              fontWeight: 700,
            },
            "& .MuiPickersArrowSwitcher-spacer": {
              width: 35,
            },
            "& .MuiPickersCalendarHeader-label": {
              fontSize: "36px !important"
            },
            "& .MuiPickersArrowSwitcher-root": {
              backgroundColor: "#133462",
              borderRadius: "5px",
              height: "23px",
              width: "55px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            },
            "& .MuiPickersCalendarHeader-root": {
              gap: "10px",
              flexDirection: "row-reverse",
              "& .MuiPickersCalendarHeader-labelContainer": {
                mr: 0,
              },
              "& .MuiPickersArrowSwitcher-root": {
                mt: "8px",
              }
            },
            "& .MuiIconButton-root": {
              padding: 0,
            },
            "& .MuiSvgIcon-root": {
              color: "#FFC300",
              fontSize: "1.6rem",
            },
            "& .MuiDayCalendar-weekDayLabel": {
              color: weekDayLabelColor,
              backgroundColor: weekDayLabelBgColor,
              fontSize: "12px",
              fontWeight: 600,
              height: "50px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textTransform: "none",
              position: "relative",
              "&::after": {
                content: "attr(data-day)", 
              },
            },
            "& .MuiPickersSlideTransition-root": {
              minHeight: minHeight,
            },
            "& .MuiPickersDay-dayOutsideMonth": {
              color: "#C2DDF8",
            },
            "& .MuiDayCalendar-weekContainer": {
              margin: 0
            },
            "& .MuiPickersDay-today": {
              border: "2px solid #117E43 !important"
            },
            "& .MuiPickersDay-root.Mui-disabled": {
              backgroundColor: `${pickersDayBgColor} !important`,
              opacity: 1,
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
};

const Legend: React.FC<{ color: string; label: string; icon?: string; alt?: string }> = ({
  color,
  label,
  icon,
  alt
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
    {
      !icon && (
        <Box
          sx={{
            width: 20,
            height: 19,
            backgroundColor: color,
            borderRadius: "2px",
          }}
        />
      )
    }
    <Typography
      variant="body2"
      component="div"
      sx={{ fontSize: "14px", color: "#133462" }}
    >
      {icon ? (
        <div className="flex gap-2">
          <img src={icon} alt={alt} className="w-[20px] h-[20px]" />
          <span>{label}</span>
        </div>
      ) : (
        label
      )}
    </Typography>
  </Box>
);

export default Calendar;