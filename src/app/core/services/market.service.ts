import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, map, switchMap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getMarkets(): Observable<any> {
    return this.http.get(`${this.baseUrl}/markets`);
  }

  getSectionTypes(): Observable<string[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sectionTypes`).pipe(
      map((data) => {
        const sectionTypesObject = data[0];
        delete sectionTypesObject.id;
        return Object.values(sectionTypesObject);
      })
    );
  }
  addSection(marketId: number, section: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/markets/${marketId}`).pipe(
      switchMap((market) => {
        const updatedSections = [...(market.sections || []), section];
        return this.http.patch(`${this.baseUrl}/markets/${marketId}`, {
          sections: updatedSections,
        });
      })
    );
  }

  deleteSection(marketId: number, sectionId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/markets/${marketId}`).pipe(
      switchMap((market) => {
        const updatedSections = market.sections.filter((section: any) => section.id !== sectionId);

        return this.http.patch(`${this.baseUrl}/markets/${marketId}`, {
          sections: updatedSections,
        });
      })
    );
  }

  // addProduct(marketId: number, sectionId: string, product: any): Observable<any> {
  //   return this.http.post(`${this.baseUrl}/markets/${marketId}/sections/${sectionId}/products`, product);
  // }


  addProduct(marketId: number, sectionId: string, product: any): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/markets/${marketId}`).pipe(
      switchMap((market) => {
        const updatedSections = market.sections.map((section: any) => {
          if (section.id === sectionId) {
            const updatedProducts = [...(section.products || []), product];
            return { ...section, products: updatedProducts };
          }
          return section;
        });

        return this.http.patch(`${this.baseUrl}/markets/${marketId}`, {
          sections: updatedSections,
        });
      })
    );
  }
  // deleteProduct(marketId: number, sectionId: string, productId: number): Observable<any> {
  //   return this.http.delete(`${this.baseUrl}/markets/${marketId}/sections/${sectionId}/products/${productId}`);
  // }
  moveProduct(
    sourceMarketId: number,
    sourceSectionId: string,
    productId: string,
    targetMarketId: number,
    targetSectionId: string
  ): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/markets`).pipe(
      switchMap((markets) => {
        const sourceMarket = markets.find((market: any) => market.id === sourceMarketId);
        const targetMarket = markets.find((market: any) => market.id === targetMarketId);
  
        if (!sourceMarket || !targetMarket) {
          throw new Error('Market bulunamadı');
        }
  
        const sourceSection = sourceMarket.sections.find((section: any) => section.id === sourceSectionId);
        if (!sourceSection) {
          throw new Error('Kaynak reyon bulunamadı');
        }
  
        const productIndex = sourceSection.products.findIndex((product: any) => product.id === productId);
        if (productIndex === -1) {
          throw new Error('Ürün kaynak reyonda bulunamadı');
        }
        const [product] = sourceSection.products.splice(productIndex, 1);
  
        const targetSection = targetMarket.sections.find((section: any) => section.id === targetSectionId);
        if (!targetSection) {
          throw new Error('Hedef reyon bulunamadı');
        }
        targetSection.products.push(product);
  
        return forkJoin([
          this.http.patch(`${this.baseUrl}/markets/${sourceMarketId}`, { sections: sourceMarket.sections }),
          this.http.patch(`${this.baseUrl}/markets/${targetMarketId}`, { sections: targetMarket.sections }),
        ]);
      })
    );
  }
  deleteProduct(marketId: number, sectionId: string, productId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/markets/${marketId}`).pipe(
      switchMap((market) => {
        const section = market.sections.find((s: any) => s.id === sectionId);
        if (!section) {
          throw new Error('Reyon bulunamadı');
        }
  
        section.products = section.products.filter((product: any) => product.id !== productId);
  
        return this.http.patch(`${this.baseUrl}/markets/${marketId}`, {
          sections: market.sections,
        });
      })
    );
  }
}
