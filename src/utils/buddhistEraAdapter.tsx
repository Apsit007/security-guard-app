import "dayjs/locale/th";
import dayjs, { Dayjs } from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import updateLocale from "dayjs/plugin/updateLocale";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

dayjs.extend(buddhistEra);
dayjs.extend(updateLocale);

dayjs.updateLocale("th", {
  weekStart: 1, // Start week on Monday
});

interface BuddhistEraAdapterOptions {
  locale?: string;
  formats?: Record<string, string>;
}

export default class BuddhistEraAdapter extends AdapterDayjs {
  constructor({ locale, formats }: BuddhistEraAdapterOptions = {}) {
    super({ locale, formats });
  }

  formatByString = (date: Dayjs, format: string): string => {
    const newFormat = format.replace(/\bYYYY\b/g, "BBBB");
    return dayjs(date).locale(this.locale || "th").format(newFormat);
  };
}