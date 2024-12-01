export interface Product {
  id: string;
  name: string;
  price?: number; 
  [key: string]: any; 
}
  
  export interface Section {
    id: string;
    name: string;
    products: Product[]; 
    [key: string]: any; 
  }
  
  export interface Market {
    id: number;
    name: string;
    location: string;
    sections: Section[]; 
    [key: string]: any;
  }