import { CategoriaService } from './../services/domain/categoria.service';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
registerLocaleData(localePt)

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ErrorInterceptorProvider } from '../interceptors/error-interceptor';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';
import { ClienteService } from '../services/domain/cliente.service';
import { AuthInterceptorProvider } from '../interceptors/auth-interceptor';
import { ProdutoService } from '../services/domain/produto.service';
import { CartService } from '../services/domain/cart.service';
import { ImageUtilService } from '../services/image-util.service';

@NgModule({
  declarations: [
    MyApp      
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp       
  ],
  providers: [
    StatusBar,
    SplashScreen,
    CategoriaService,
    AuthInterceptorProvider,
    ErrorInterceptorProvider,
    AuthService,
    StorageService,
    ClienteService,
    ProdutoService,
    CartService,
    ImageUtilService,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: LOCALE_ID, useValue: 'pt-BR'}
  ]
})
export class AppModule {}
