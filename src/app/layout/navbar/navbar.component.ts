import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ExchangeRateService } from '../../core/services/exchange-rate.service';

@Component({
  selector: 'navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
    exchangeRates: { currency: string; value: number }[] = []; // Döviz kurları için bir dizi

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
}
