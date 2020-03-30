export class PaymentDetails {
  constructor(
    public ProductId: number = 1,
    public MSRP: number = 18000.0,
    public SellingPrice: number = 20000.0,
    public ProtectionProducts: number = 0,
    public DownPayment: number = 0,
    public Incentives: number = 0.0,
    public Rebates: number = 0.0,
    public TradeInValue: number = 2000.0,
    public TradeInOwing: number = 1000.0,
    public RegistrationFee: number = 0.0,
    public APR: number = 0.0399,
    public Term: number = 36,
    public Frequency: number = 12,
    public ExcludeTaxes: boolean = false,
    public TaxPercentage: number = 0.15,
    public ResidualPercentage: number = 0.4,
    public OtherFees: number = 0
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
    else
      return (
        Math.ceil(this.PaymentWhithoutLien * this.TaxPercentage * 100) / 100
      );
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
    let rate = this.APR / this.Frequency;

    let result =
      (rate / (Math.pow(1 + rate, this.Term) - 1)) *
      (this.AmountFinanced * Math.pow(1 + rate, this.Term) - 0);

    let periodicalPayment = (Math.ceil(result * 100) / 100).toFixed(2);

    return periodicalPayment;
  }

  private calculatePMTForLease() {
    let rate = this.APR / this.Frequency;

    let result =
      (rate / (Math.pow(1 + rate, this.Term) - 1)) *
      (this.AmountFinanced * Math.pow(1 + rate, this.Term) -
        this.ResidualValue);

    let periodicalPayment = (Math.ceil(result * 100) / 100).toFixed(2);

    return periodicalPayment;
  }

  private CalculatePaymentWithoutLien(): number {
    let rate = this.APR / this.Frequency;

    let result =
      (rate / (Math.pow(1 + rate, this.Term) - 1)) *
      (this.FinanceAmountWithoutLien * Math.pow(1 + rate, this.Term) -
        this.ResidualValue);

    let periodicalPayment = Math.ceil(result * 100) / 100;

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
