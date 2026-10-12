import { PaymentState } from "../payment/payment.dto";
import {
  PresentationDto,
  PresentationService,
} from "../presentations/presentations.dto";

export interface CartItemDto {
  id: number;
  bundle_selection?: number | null;
  presentation: PresentationDto;
  payment_state: PaymentState;
  service_type: PresentationService;
  // TODO: Gonna Remove accessory
  has_accessories: boolean;
}
