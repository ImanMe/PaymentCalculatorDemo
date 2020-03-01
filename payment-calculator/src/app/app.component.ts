import { Tax } from "./../models/tax";
import { PaymentDetails } from "./../models/paymentDetails";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { TaxService } from "./tax.service";
import { Frequency } from "./../models/frequency";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(private fb: FormBuilder, private taxService: TaxService) {}

  title = "payment-calculator";

  paymentForm: FormGroup;

  paymentDetailsInitializer: PaymentDetails = new PaymentDetails();

  paymentDetailsAdjusted: PaymentDetails = new PaymentDetails();

  frequencies: Frequency[];

  provinceAndTaxes: Tax[];

  isTaxExcluded: boolean = false;

  taxPercentage: number;

  frequency: number;

  ngOnInit(): void {
    this.frequencies = this.taxService.getFrequencies();
    this.provinceAndTaxes = this.taxService.getProvinceAndTaxes();
    this.buildForm();
  }

  calculate = () => {
    this.buildUpdatedPaymentDetails();
    this.reflectNewCalculation();
  };

  buildForm = () => {
    this.paymentForm = this.fb.group({
      sellingPrice: this.paymentDetailsInitializer.SellingPrice,
      downPayment: this.paymentDetailsInitializer.DownPayment,
      tradeInValue: this.paymentDetailsInitializer.TradeInValue,
      tradeInOwing: this.paymentDetailsInitializer.TradeInOwing,
      rebatesAndIncentives: this.paymentDetailsInitializer.RebateAndIncentive,
      amountFinanced: {
        value: this.paymentDetailsInitializer.AmountFinanced,
        disabled: true
      },
      registrationFee: this.paymentDetailsInitializer.RegistrationFee,
      apr: this.paymentDetailsInitializer.APR,
      term: this.paymentDetailsInitializer.Term,
      estimatedTradeInValue: {
        value: this.paymentDetailsInitializer.EstimatedTradeInValue,
        disabled: true
      },
      netSellingPrice: {
        value: this.paymentDetailsInitializer.NetSellingPrice,
        disabled: true
      },
      taxes: { value: this.paymentDetailsInitializer.Taxes, disabled: true },
      totalEstimatedPayment: {
        value: this.paymentDetailsInitializer.TotalEstimatedPayment,
        disabled: true
      },
      frequency: this.frequencies[0].days,
      excludeTaxes: this.paymentDetailsInitializer.ExcludeTaxes,
      taxPercentage: this.provinceAndTaxes[0].TotalTax,
      protectionProducts: 0
    });
  };

  changeTaxExcluded = event => {
    if (event.target.value === "true") this.isTaxExcluded = true;
    else this.isTaxExcluded = false;
  };

  changeProvince = event => (this.taxPercentage = event.target.value);

  changeFrequency = $event => (this.frequency = +$event.target.value);

  buildUpdatedPaymentDetails = () => {
    this.paymentDetailsInitializer = null;
    this.paymentDetailsInitializer = new PaymentDetails(
      this.paymentForm.get("sellingPrice").value,
      this.paymentForm.get("downPayment").value,
      this.paymentForm.get("rebatesAndIncentives").value,
      this.paymentForm.get("tradeInValue").value,
      this.paymentForm.get("tradeInOwing").value,
      this.paymentForm.get("registrationFee").value,
      this.paymentForm.get("apr").value,
      this.paymentForm.get("term").value,
      this.frequency,
      this.isTaxExcluded,
      this.taxPercentage
    );
  };

  reflectNewCalculation = (): void => {
    this.paymentForm.patchValue({
      estimatedTradeInValue: this.paymentDetailsInitializer
        .EstimatedTradeInValue,
      amountFinanced: this.paymentDetailsInitializer.AmountFinanced,
      netSellingPrice: this.paymentDetailsInitializer.NetSellingPrice,
      taxes: this.paymentDetailsInitializer.Taxes,
      totalEstimatedPayment: this.paymentDetailsInitializer
        .TotalEstimatedPayment
    });
  };
}
