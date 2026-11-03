// La Cajita de Pagos de Payphone se carga por CDN (usePayphone) y expone esta clase global.
export {}

declare global {
  interface PPaymentButtonBoxConfig {
    token: string
    clientTransactionId: string
    amount: number
    amountWithoutTax: number
    currency: string
    storeId: string
    reference: string
    lang?: 'es' | 'en'
    defaultMethod?: 'card' | 'payphone'
    timeZone?: number
    email?: string
    phoneNumber?: string
  }

  class PPaymentButtonBox {
    constructor(config: PPaymentButtonBoxConfig)
    render(containerId: string): void
  }

  interface Window {
    PPaymentButtonBox?: typeof PPaymentButtonBox
  }
}
