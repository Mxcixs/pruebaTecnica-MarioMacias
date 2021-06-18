import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { Product } from '../models/product.interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private afs: AngularFirestore) {}

  getAllProducts() {
    return this.afs
      .collection('productos')
      .snapshotChanges()
      .pipe(
        map((snapshot) => {
          return snapshot.map((action) => {
            const data = action.payload.doc.data() as Product;
            data.uid = action.payload.doc.id;
            return data;
          });
        })
      );
  }

  getProductByUid(uid: string) {
    return this.afs
      .collection('productos')
      .doc(uid)
      .valueChanges()
      .pipe(map((product: any) => product as Product));
  }

  createProduct(product: Product) {
    const docId = this.afs.createId();
    product.uid = docId;
    return this.afs.collection('productos').doc(docId).set({
      uid: product.uid,
      nombre: product.nombre,
      precio: product.precio,
      descripcion: product.descripcion,
      medida: product.medida,
      activo: product.activo,
    });
  }

  updateProduct(product: Product) {
    const productDocRef = this.afs.collection('productos').doc(product.uid);
    return productDocRef.update(product);
  }

  deleteProduct(uid: string) {
    const productDocRef = this.afs.collection('productos').doc(uid);
    return productDocRef.delete();
  }
}
