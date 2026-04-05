interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  handler?: (response: RazorpayPaymentResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

declare class Razorpay {
  constructor(options: RazorpayOptions);
  open(): void;
  on(
    event: string,
    callback: (response: { error: { description: string } }) => void,
  ): void;
}

interface Window {
  Razorpay: typeof Razorpay;
}
