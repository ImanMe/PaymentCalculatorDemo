export class PaymentDetails {
  constructor(
    public SellingPrice: number = 27031.0,
    public DownPayment: number = 1000,
    public RebateAndIncentive: number = 500.0,
    public TradeInValue: number = 15909.0,
    public TradeInOwing: number = 1000.0,
    public RegistrationFee: number = 71.0,
    public APR: number = 0.045,
    public Term: number = 84,
    public Frequency: number = 12,
    public ExcludeTaxes: boolean = false,
    public TaxPercentage: number = 0.15
  ) {
    this.EstimatedTradeInValue = this.calculateTradeInValue();

    this.NetSellingPrice = this.calculateNetSellingPrice();

    this.Taxes = this.calculatesTaxes();

    this.AmountFinanced = this.calculateAmountFinanced();

    this.TotalEstimatedPayment = this.calculatePMT();
  }

  public EstimatedTradeInValue: number;
  public NetSellingPrice: number;
  public Taxes: number;
  public AmountFinanced: number;
  public TotalEstimatedPayment: string;

  private calculateTradeInValue(): number {
    return this.TradeInValue - this.TradeInOwing;
  }

  private calculateNetSellingPrice(): number {
    return this.SellingPrice - this.DownPayment - this.EstimatedTradeInValue;
  }

  private calculatesTaxes(): number {
    if (this.ExcludeTaxes) return 0;
    else
      return Math.ceil(this.NetSellingPrice * this.TaxPercentage * 100) / 100;
  }

  private calculateAmountFinanced(): number {
    return (
      Math.ceil(
        (this.NetSellingPrice -
          this.RebateAndIncentive +
          this.Taxes +
          this.RegistrationFee) *
          100
      ) / 100
    );
  }

  private calculatePMT(): string {
    let rate = this.APR / 12;

    let result =
      ((this.AmountFinanced - 0) * rate) / (1 - Math.pow(1 + rate, -this.Term));

    if (this.Frequency === 24) result = result / 2;
    if (this.Frequency === 26) result = result / 2.166;
    if (this.Frequency === 52) result = result / 4.333;

    let monthlyPayment = (Math.ceil(result * 100) / 100).toFixed(2);

    return monthlyPayment;
  }
}
