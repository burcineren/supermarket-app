import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';
import { FormsModule } from '@angular/forms';

export interface Product {
  id: number;
  name: string;
}

export interface Section {
  id: number;
  name: string;
  products: Product[];
}

export interface Market {
  id: number;
  name: string;
  sections: Section[];
}
@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    exchangeRates: { currency: string; value: number }[] = []; // Döviz kurları için bir dizi
    searchTerm: string = '';
    markets: Market[] = [];
    filteredMarkets: Market[] = [];
  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit() {
    this.exchangeRateService.getExchangeRates().subscribe((data) => {
      this.exchangeRates = Object.entries(data.data).map(
        ([currency, value]) => ({
          currency,
          value: value as number,
        })
      );
    });
  }
  filterMarkets() {
    const term = this.searchTerm.toLowerCase();
    this.filteredMarkets = this.markets
      .map((market) => {
        const filteredSections = market.sections
          .map((section) => {
            const filteredProducts = section.products.filter((product) =>
              product.name.toLowerCase().includes(term)
            );
            return { ...section, products: filteredProducts };
          })
          .filter((section) => section.products.length > 0);

        return { ...market, sections: filteredSections };
      })
      .filter((market) => market.sections.length > 0);
  }
}
