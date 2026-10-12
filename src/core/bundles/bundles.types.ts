import type { PresentationDto } from "../presentations/presentations.dto";

export interface BundleDto {
  id: number;
  name: string;
  description: string | null;
  price: number;
  original_price: number;
  tags: { name?: string; fa_name?: string; en_name?: string }[];
  presentations: PresentationDto[];
  is_active: boolean;
  remaining_capacity: number;
  is_available: boolean;
  unavailable_reason: "inactive" | "insufficient_presentations" | "started" | "registration_closed" | "sold_out" | null;
}

export interface BundleSelectionDto {
  id: number;
  bundle: BundleDto;
  participation_ids: number[];
}

export const bundleAvailabilityText = (bundle: BundleDto) => {
  if (bundle.is_available) return `${new Intl.NumberFormat("fa-IR").format(bundle.remaining_capacity)} جای خالی`;
  return {
    inactive: "این بسته غیرفعال است",
    insufficient_presentations: "برنامه‌های این بسته کامل نیست",
    started: "یکی از برنامه‌ها شروع شده است",
    registration_closed: "ثبت‌نام این بسته پایان یافته است",
    sold_out: "ظرفیت این بسته تکمیل شده است",
  }[bundle.unavailable_reason ?? "inactive"];
};
