export interface Product {
  id?: string;
  _id?: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  stock?: number;
  // Images stored as Base64 strings by Spring Boot's JSON serialisation of byte[]
  mainImage?: string;
  mainImageType?: string;
  additionalImages?: string[];
  additionalImageTypes?: string[];
}
