import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
})
export class ProductComponent implements OnInit {
  products: Product[] = [];

  private unsubscribe$ = new Subject<void>();
  constructor(
    private productService: ProductService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.getProducts();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getProducts() {
    this.productService
      .getAllProducts()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((products) => {
        if (products && products.length > 0) {
          this.products = products;
        }
      });
  }

  deleteProduct(uid: string) {
    this.productService.deleteProduct(uid);
    this.toastr.error(
      'El producto fue eliminado con éxito',
      'Producto eliminado'
    );
  }

  changeProductStatus(product: Product) {
    product.activo = !product.activo;
    this.productService.updateProduct(product);
  }
}
