import { PaymentState } from "../payment/payment.dto.ts";

export enum PresentationService {
  WORKSHOP = "WORKSHOP",
  TALK = "TALK",
  PACKAGE = "PACKAGE",
}

export interface PresenterDto {
  first_name: string;
  last_name: string;
  email: string;
  description: string;
  avatar: string;
}

export interface Tag {
  name: string;
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
  tags: Tag[];
}

export interface PresentationRequest {}
