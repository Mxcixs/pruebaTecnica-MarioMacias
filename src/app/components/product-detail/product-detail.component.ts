import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.interface';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css'],
})
export class ProductDetailComponent implements OnInit {
  productForm!: FormGroup;
  productUidPath: string | null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.buildForm();
    this.productUidPath = this.route.snapshot.paramMap.get('id');
  }

  private buildForm() {
    this.productForm = this.fb.group({
      uid: ['', Validators.required],
      nombre: ['', Validators.required],
      precio: ['', Validators.required],
      descripcion: ['', [Validators.required, Validators.maxLength(50)]],
      medida: ['', Validators.required],
      activo: [true],
    });
  }

  ngOnInit(): void {
    this.getProductInfo();
  }

  getProductInfo() {
    if (this.productUidPath !== null) {
      this.productService
        .getProductByUid(this.productUidPath)
        .subscribe((product) => {
          this.setInfo(product);
        });
    }
  }

  setInfo(product: Product) {
    this.productForm.get('uid')?.setValue(product.uid);
    this.productForm.get('nombre')?.setValue(product.nombre);
    this.productForm.get('precio')?.setValue(product.precio);
    this.productForm.get('descripcion')?.setValue(product.descripcion);
    this.productForm.get('medida')?.setValue(product.medida);
    this.productForm.get('activo')?.setValue(product.activo);
  }

  guardar() {
    const productData = this.productForm.value as Product;
    if (this.productUidPath !== null) {
      //Edición
      this.productService
        .updateProduct(productData)
        .then(() => {
          console.log('Producto editado con éxito');
          this.router.navigate(['..']);
        })
        .catch((err) => console.log(err));
    } else {
      //Creación
      this.productService
        .createProduct(productData)
        .then(() => {
          console.log('Producto agregado con éxito');
          this.router.navigate(['..']);
        })
        .catch((err) => console.log(err));
    }
  }

  deleteProduct() {
    this.productService
      .deleteProduct(this.productUidPath as string)
      .then(() => this.router.navigate(['/products']));
  }
}
