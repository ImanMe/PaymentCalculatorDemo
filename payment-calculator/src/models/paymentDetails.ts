export class PaymentDetails {
  constructor(
    public ProductId: number = 1,
    public MSRP: number = 18000.0,
    public SellingPrice: number = 36000.0,
    public ProtectionProducts: number = 0,
    public DownPayment: number = 2000,
    public Incentives: number = 2000.0,
    public Rebates: number = 1000.0,
    public TradeInValue: number = 5000.0,
    public TradeInOwing: number = 500.0,
    public RegistrationFee: number = 500.0,
    public APR: number = 0.0399,
    public Term: number = 36,
    public Frequency: number = 12,
    public ExcludeTaxes: boolean = false,
    public TaxPercentage: number = 0.15,
    public ResidualPercentage: number = 0.6,
    public OtherFees: number = 1000
  ) {
    this.EstimatedTradeInValue = this.calculateTradeInValue();

    this.NetSellingPrice = this.calculateNetSellingPrice();

    this.ResidualValue = this.calculateResidualValue();

    if (this.ProductId === 2) {
      this.Taxes = this.calculateTaxes();
      this.AmountFinanced = this.calculateAmountFinanced();
      this.FinanceAmountWithoutLien = this.CalculateFinanceAmountWithoutLien();
      this.PaymentWhithoutLien = this.CalculatePaymentWithoutLien();
    } else {
      this.FinanceAmountWithoutLien = this.CalculateFinanceAmountWithoutLien();
      this.PaymentWhithoutLien = this.CalculatePaymentWithoutLien();
      this.Taxes = this.calculateTaxes();
      this.AmountFinanced = this.calculateAmountFinanced();
    }

    this.TotalEstimatedPayment = this.calculatePMT();
  }

  public EstimatedTradeInValue: number;
  public NetSellingPrice: number;
  public Taxes: number;
  public AmountFinanced: number;
  public TotalEstimatedPayment: string;
  public ResidualValue: number;
  public FinanceAmountWithoutLien: number;
  public PaymentWhithoutLien: number;

  private calculateTradeInValue(): number {
    return this.TradeInValue - this.TradeInOwing;
  }

  private calculateNetSellingPrice(): number {
    return (
      this.SellingPrice -
      this.DownPayment -
      this.EstimatedTradeInValue +
      this.ProtectionProducts -
      this.Incentives
    );
  }

  private calculateTaxes(): number {
    if (this.ExcludeTaxes) return 0;
    if (this.ProductId === 2)
      return Math.ceil(this.NetSellingPrice * this.TaxPercentage * 100) / 100;
    else {
      console.log(this.PaymentWhithoutLien);
      return Math.ceil(
        (this.PaymentWhithoutLien * this.TaxPercentage * 100) / 100
      );
    }
  }

  private calculateResidualValue(): number {
    return this.MSRP * this.ResidualPercentage;
  }

  private calculateAmountFinanced(): number {
    return (
      Math.ceil(
        (this.NetSellingPrice +
          this.Taxes +
          this.RegistrationFee -
          this.Rebates +
          this.OtherFees) *
          100
      ) / 100
    );
  }

  private calculatePMT(): string {
    if (this.ProductId === 2) return this.calculatePMTForLoan();
    if (this.ProductId === 1) return this.calculatePMTForLease();
  }

  private calculatePMTForLoan() {
    let rate = this.APR / 12;
    let type = 0;

    let pmt =
      (rate / (Math.pow(1 + rate, this.Term) - 1)) *
      (this.AmountFinanced * Math.pow(1 + rate, this.Term) - 0);

    if (this.Frequency === 24) pmt = pmt / 2;
    if (this.Frequency === 26) pmt = pmt / 2.166;
    if (this.Frequency === 52) pmt = pmt / 4.333;

    let periodicalPayment = (Math.ceil(pmt * 100) / 100).toFixed(2);
    return periodicalPayment;
  }

  private calculatePMTForLease() {
    let rate = this.APR / 12;
    let type = 1;

    let pmt =
      -(
        rate *
        (this.ResidualValue * -1 +
          this.AmountFinanced * Math.pow(1 + rate, this.Term))
      ) /
      ((1 + rate * type) * (1 - Math.pow(1 + rate, this.Term)));

    if (this.Frequency === 24) pmt = pmt / 2;
    if (this.Frequency === 26) pmt = pmt / 2.166;
    if (this.Frequency === 52) pmt = pmt / 4.333;

    let periodicalPayment = (Math.ceil(pmt * 100) / 100).toFixed(2);
    return periodicalPayment;
  }

  private CalculatePaymentWithoutLien(): number {
    let rate = this.APR / 12;
    let type = 1;

    let pmt =
      -(
        rate *
        (this.ResidualValue * -1 +
          this.FinanceAmountWithoutLien * Math.pow(1 + rate, this.Term))
      ) /
      ((1 + rate * type) * (1 - Math.pow(1 + rate, this.Term)));

    if (this.Frequency === 24) pmt = pmt / 2;
    if (this.Frequency === 26) pmt = pmt / 2.166;
    if (this.Frequency === 52) pmt = pmt / 4.333;

    let periodicalPayment = Math.ceil(pmt * 100) / 100;
    return periodicalPayment;
  }

  private CalculateFinanceAmountWithoutLien(): number {
    return (
      this.NetSellingPrice -
      this.Incentives +
      this.RegistrationFee -
      this.Rebates +
      this.OtherFees -
      this.TradeInOwing
      // + this.ProtectionProductsBeforeTax
    );
  }
}
