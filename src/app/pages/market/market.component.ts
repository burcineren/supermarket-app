import { Component } from '@angular/core';
import { MarketService } from "../../core/services/market.service";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../layout/navbar/navbar.component';
import { addSection, loadMarkets } from '../../core/stores/markets/market.actions';
import { Store } from '@ngrx/store';
import { selectMarkets } from '../../core/stores/markets/market.selectors';


@Component({
  selector: 'app-market',
  standalone: true,
  imports: [HttpClientModule, FormsModule,CommonModule,NavbarComponent],
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
  selectedProduct: any = null; 
  selectedProductName: string = '';
  filteredMarkets: any[] = []; 
  filteredSections: any[] = []; 

  targetMarketId: number | null = null;
  targetSectionId: string | null = null; 

  isProductEditPopupVisible: boolean = false; 
  newProduct: any = {
    id: '',
    name: '',
  };

  constructor(private marketService: MarketService,private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(loadMarkets());
    this.loadSectionTypes();
  }

  // loadMarkets(): void {
  //   this.marketService.getMarkets().subscribe((data) => {
  //     this.markets = data;
  //   });
  // }

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
    if (this.selectedType && this.selectedMarket) {
      const newSection = {
        id: this.nextSectionId,
        name: this.selectedType,
        products: [],
      };
  
      // Dispatch the addSection action
      this.store.dispatch(
        addSection({ marketId: this.selectedMarket.id, section: newSection })
      );
  
      // Close the popup after dispatching the action
      this.closePopup();
    }
  }

  deleteSection(marketId: number, sectionId: string): void {
    if (confirm('Bu reyonu silmek istediğinize emin misiniz?')) {
      this.marketService.deleteSection(marketId, sectionId).subscribe(() => {
        console.log('Reyon başarıyla silindi.');
       
      });
    }
  }
  openProductPopup(market: any, section: any): void {
    this.selectedMarket = market;
    this.selectedSection = section;
    this.isProductPopupVisible = true;
    this.newProduct = { id: '', name: '' };
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
         
          this.closeProductPopup();
        });
    }
  }
  openProductEditPopup(market: any, section: any, product: any): void {
    this.selectedMarket = market;
    this.selectedSection = section;
    this.selectedProduct = product;
  
    if (product) {
      this.selectedProductName = product.name; 
    }
  
  
    this.filteredMarkets = this.markets.map((m) => ({
      ...m,
      sections: m.sections.filter((s:any) => s.type === section.type),
    }));
  
    this.isProductEditPopupVisible = true;
  }
  
  moveProduct(): void {
    if (this.targetMarketId && this.targetSectionId) {
      this.marketService
        .moveProduct(
          this.selectedMarket.id,
          this.selectedSection.id,
          this.selectedProduct.id,
          this.targetMarketId,
          this.targetSectionId
        )
        .subscribe(() => {
      
          this.closeProductEditPopup();
        });
    }
  }
  
  deleteProduct(): void {
    this.marketService
      .deleteProduct(this.selectedMarket.id, this.selectedSection.id, this.selectedProduct.id)
      .subscribe(() => {
        this.closeProductEditPopup();
      });
  }
  
  closeProductEditPopup(): void {
    this.isProductEditPopupVisible = false;
    this.selectedMarket = null;
    this.selectedSection = null;
    this.selectedProduct = null;
  }
  onTargetMarketChange(): void {
    const selectedMarket = this.markets.find((market) => market.id === this.targetMarketId);
    this.filteredSections = selectedMarket ? selectedMarket.sections.filter((section:any) => section.type ) : [];
  }
}
