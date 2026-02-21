import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from './services/products.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  product: Product = {
    id: 0,
    name: '',
    price: 0,
    quantity: 0
  };

  isEdit = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe(data => {
      this.products = data;
    });
  }

  saveProduct() {
    if (this.isEdit) {
      this.productService.updateProduct(this.product).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    } else {
      this.productService.addProduct(this.product).subscribe(() => {
        this.resetForm();
        this.loadProducts();
      });
    }
  }

  editProduct(p: Product) {
    this.product = { ...p };
    this.isEdit = true;
  }

  deleteProduct(id: number) {
    this.productService.deleteProduct(id).subscribe(() => {
      this.loadProducts();
    });
  }

  resetForm() {
    this.product = {
      id: 0,
      name: '',
      price: 0,
      quantity: 0
    };
    this.isEdit = false;
  }
}