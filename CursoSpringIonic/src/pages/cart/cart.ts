import { ProdutoDTO } from './../../models/produto.dto';
import { CartService } from './../../services/domain/cart.service';
import { ProdutoService } from './../../services/domain/produto.service';
import { CartItem } from './../../models/cart-item';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {

  items: CartItem[]

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public cartService: CartService,
    public produtoService: ProdutoService
  ) {
  }

  ionViewDidLoad() {
    let cart = this.cartService.getCart()
    this.items = cart.items
    //this.loadImageUrls()
  }

  /* loadImageUrls(start: number, end: number) {
    for (var i = start; i <= end; i++) {
      let item = this.items[i];
      this.produtoService.getSmallImageFromBucket(item.id)
        .subscribe(response => {
          item.imageUrl = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
        },
          error => { });
    }
  }*/

  removeItem(produto: ProdutoDTO){
    this.items = this.cartService.removeProduto(produto).items
  }

  increaseQuantity(produto: ProdutoDTO){
    this.items = this.cartService.increaseQuantity(produto).items
  }

  decreaseQuantity(produto: ProdutoDTO){
    this.items = this.cartService.decreaseQuantity(produto).items
  }

  total(): number {
    return this.cartService.total()
  }

  goOn(){
    this.navCtrl.setRoot('CategoriasPage')
  }
  
  checkout(){
    this.navCtrl.setRoot('PickAddressPage')
  }

}
