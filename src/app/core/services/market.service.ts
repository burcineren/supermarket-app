import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, map, switchMap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MarketService {

  private baseUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

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
    return this.http.delete(`${this.baseUrl}/markets/${marketId}/sections/${sectionId}`);
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
  deleteProduct(marketId: number, sectionId: string, productId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/markets/${marketId}/sections/${sectionId}/products/${productId}`);
  }

  
}
