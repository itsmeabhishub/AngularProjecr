import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
    price: 0
  };

  isEdit = false;
  isLoading = false;

  message = '';
  showMessage = false;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // 🔹 GET ALL PRODUCTS
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();   // 🔥 Force UI refresh
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  // 🔹 ADD / UPDATE
  saveProduct() {

    if (this.isLoading) return;

    this.isLoading = true;

    const request = this.isEdit
      ? this.productService.updateProduct(this.product)
      : this.productService.addProduct(this.product);

    request.subscribe({
      next: () => {

        this.showToast(
          this.isEdit
            ? "Product Updated Successfully ✅"
            : "Product Added Successfully ✅"
        );

        this.resetForm();

        // 🔥 React style refresh
        this.loadProducts();

        this.isLoading = false;
      },
      error: () => {
        this.showToast("Operation failed ❌");
        this.isLoading = false;
      }
    });
  }

  // 🔹 EDIT (Only UI change)
  editProduct(p: Product) {
    this.product = { ...p };
    this.isEdit = true;
  }

  // 🔹 DELETE
  deleteProduct(id: number) {

    if (!confirm("Are you sure you want to delete?")) {
      return;
    }

    this.productService.deleteProduct(id).subscribe({
      next: () => {

        this.showToast("Product Deleted Successfully 🗑️");

        // 🔥 Refresh list
        this.loadProducts();
      },
      error: () => {
        this.showToast("Delete failed ❌");
      }
    });
  }

  // 🔹 RESET FORM
  resetForm() {
    this.product = {
      id: 0,
      name: '',
      price: 0
    };
    this.isEdit = false;
  }

  // 🔹 TOAST MESSAGE
  showToast(msg: string) {
    this.message = msg;
    this.showMessage = true;

    setTimeout(() => {
      this.showMessage = false;
      this.cdr.detectChanges();   // 🔥 ensure toast update
    }, 2000);
  }
}