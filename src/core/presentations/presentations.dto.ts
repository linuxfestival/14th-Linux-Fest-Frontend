import { PaymentState } from "../payment/payment.dto.ts";

export type PresentationService = "WORKSHOP" | "TALK";

export interface PresenterDto {
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  avatar: string;
}

export interface PresentationDto {
  service_type: PresentationService;
  capacity: number;
  start: Date;
  end: Date;
  description: string;
  title: string;
  remained_capacity: number;
  id: number;
  cost: number;
  presenters: PresenterDto[];
  is_registration_active: boolean;
  presentation_link: string;
  // TODO: Gonna remove accessory
  accessories: string;
  accessories_cost: number;
  accessories_capacity: number;
}
