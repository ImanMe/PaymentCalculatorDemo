import { Frequency } from "./../models/frequency";
import { Tax } from "./../models/tax";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class TaxService {
  constructor() {}

  getProvinceAndTaxes = () => {
    var allProvinceAndTaxes: Tax[] = [
      { ProvinceCode: "NS", TotalTax: 0.15 },
      { ProvinceCode: "AB", TotalTax: 0.05 },
      { ProvinceCode: "BC", TotalTax: 0.12 },
      { ProvinceCode: "MB", TotalTax: 0.13 },
      { ProvinceCode: "NM", TotalTax: 0.15 },
      { ProvinceCode: "NW", TotalTax: 0.05 },
      { ProvinceCode: "NF", TotalTax: 0.15 },
      { ProvinceCode: "NU", TotalTax: 0.05 },
      { ProvinceCode: "ON", TotalTax: 0.13 },
      { ProvinceCode: "PEI", TotalTax: 0.15 },
      { ProvinceCode: "QC", TotalTax: 0.1498 },
      { ProvinceCode: "SK", TotalTax: 0.11 },
      { ProvinceCode: "YU", TotalTax: 0.05 }
    ];

    return allProvinceAndTaxes;
  };

  getFrequencies = () => {
    var frequencies: Frequency[] = [
      { text: "Monthly", days: 12 },
      { text: "Semi-Monthly", days: 24 },
      { text: "Bi-Weekly", days: 26 },
      { text: "Weekly", days: 52 }
    ];
    return frequencies;
  };
}
