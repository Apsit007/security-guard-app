import { styled } from "@mui/material/styles";
import { PickersDay } from "@mui/x-date-pickers";
import type { PickersDayProps } from "@mui/x-date-pickers";

// Icons
import WarningIcon from "../../assets/icons/warning.png";
import AlertIcon from "../../assets/icons/alert.png";
import UnApproveIcon from "../../assets/icons/unapprove.png";

interface CustomDayProps extends PickersDayProps {
  morningCount?: number;
  eveningCount?: number;
  waitApprove?: boolean;
  rejected?: boolean;
  problem?: boolean;
  isNoDataDisable?: boolean;
}

const CustomPickersDay = styled(PickersDay)<CustomDayProps>();

const RenderCustomDay = (props: CustomDayProps) => {
  const {
    morningCount = 0,
    eveningCount = 0,
    waitApprove = false,
    rejected = false,
    problem = false,
    isNoDataDisable = false,
    ...other
  } = props;

  const hasData = morningCount > 0 || eveningCount > 0;

  return (
    <CustomPickersDay 
      {...other} 
      disabled={isNoDataDisable && !hasData}
      sx={{ 
        width: "100%", 
        height: "110px", 
        padding: 1,
        display: "flex",
        flexDirection: "column",
        position: "relative",
        color: isNoDataDisable ? hasData ? "#124692" : "#DBDCDE" : "#124692",
        opacity: isNoDataDisable ? hasData ? 1 : 0.5 : 1,
        pointerEvents: isNoDataDisable ? hasData ? "auto" : "none" : "auto",
      }}
    >
      {/* Day number */}
      <div className="flex justify-end items-start w-full h-full">
        <div className="flex gap-2">
          {
            !isNoDataDisable && (
              <>
                {
                  waitApprove && (
                    <div className="flex justify-center items-center">
                      <img src={WarningIcon} alt="Warning Icon" className="w-[20px] h-[20px]" />
                    </div>
                  )
                }
                {
                  rejected && (
                    <div className="flex justify-center items-center">
                      <img src={UnApproveIcon} alt="UnApprove Icon" className="w-[20px] h-[20px]" />
                    </div>
                  )
                }
              </>
            )
          }
          {
            problem && (
              <div className="flex justify-center items-center">
                <img src={AlertIcon} alt="Alert Icon" className="w-[20px] h-[20px]" />
              </div>
            )
          }
          <span>{props.day.date()}</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full">
        {/* Morning shift */}
        {(morningCount > 0 && (!waitApprove && !rejected)) && (
          <div className="bg-[#133462] text-[#FFC300] font-normal text-[14px] w-full rounded-[8px]">
            เช้า {morningCount} คน
          </div>
        )}

        {/* Evening shift */}
        {(eveningCount > 0 && (!waitApprove && !rejected)) && (
          <div className="bg-[#A3CBF2] text-[#133462] font-normal text-[14px] w-full rounded-[8px]">
            ดึก {eveningCount} คน
          </div>
        )}
      </div>
    </CustomPickersDay>
  );
};

export default RenderCustomDay;