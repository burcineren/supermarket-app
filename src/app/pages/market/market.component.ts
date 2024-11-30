import { Component } from '@angular/core';
import { MarketService } from "../../core/services/market.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-market',
  standalone: true,
  imports: [HttpClientModule, FormsModule],
  templateUrl: './market.component.html',
  styleUrl: './market.component.scss'
})
export class MarketComponent {
  markets: any[] = [];
  sectionTypes: string[] = [];
  isPopupVisible = false;
  selectedMarket: any;
  selectedType: string = '';
  nextSectionId: string = '';
  isProductPopupVisible: boolean = false;
  selectedSection: any = null;
  newProduct: any = {
    id: '',
    name: '',
  };

  constructor(private marketService: MarketService) { }

  ngOnInit(): void {
    this.loadMarkets();
    this.loadSectionTypes();
  }

  loadMarkets(): void {
    this.marketService.getMarkets().subscribe((data) => {
      this.markets = data;
    });
  }

  loadSectionTypes(): void {
    this.marketService.getSectionTypes().subscribe((data) => {
      this.sectionTypes = data;
    });
  }

  openPopup(market: any): void {
    this.selectedMarket = market;
    const lastSectionIndex = market.sections.length;
    this.nextSectionId = `R${lastSectionIndex + 1}`;
    this.isPopupVisible = true;
  }
  closePopup(): void {
    this.isPopupVisible = false;
    this.selectedType = '';
  }
  addSection(): void {
    if (this.selectedType) {
      const newSection = {
        id: this.nextSectionId,
        type: this.selectedType,
        products: []
      };
      this.marketService.addSection(this.selectedMarket.id, newSection).subscribe(() => {

        this.loadMarkets();
        this.closePopup();
      });
    }
  }

  deleteSection(marketId: number, sectionId: string): void {
    this.marketService.deleteSection(marketId, sectionId).subscribe(() => {
      this.loadMarkets();
    });
  }

  openProductPopup(market: any, section: any): void {
    this.selectedMarket = market;
    this.selectedSection = section;
    this.isProductPopupVisible = true;
    this.newProduct = { id: '', name: '' }; // Yeni ürün bilgilerini sıfırla
  }

  closeProductPopup(): void {
    this.isProductPopupVisible = false;
    this.selectedMarket = null;
    this.selectedSection = null;
  }

  addProduct(): void {
    if (this.newProduct.id && this.newProduct.name) {
      this.marketService
        .addProduct(this.selectedMarket.id, this.selectedSection.id, this.newProduct)
        .subscribe(() => {
          this.loadMarkets();
          this.closeProductPopup();
        });
    }
  }
}
