import { ProdutoDTO } from './../../models/produto.dto';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
//import { Observable } from 'rxjs/Rx';
import { API_CONFIG } from '../../config/api.config';


@Injectable()
export class ProdutoService {
    constructor(public http: HttpClient){}

    findByCategoria(categoria_id: string, page: number = 0, linesPerPage: number = 24) {
        return this.http.get(`${API_CONFIG.baseURL}/produtos/?categorias=${categoria_id}&page=${page}&linesPerPage=${linesPerPage}`)
    }

    findById(produto_id: string){
        return this.http.get<ProdutoDTO>(`${API_CONFIG.baseURL}/produtos/${produto_id}`)
    }

 //   getSmallImageFromBucket(id: string ): Observable<any>{
 //       let url = `${API_CONFIG}/local da imagem`
   //     return this.http.get(url, {responseType: 'blob'})
    //}

    //getImageFromBucket(id : string) : Observable<any> {
 //       let url = `${API_CONFIG.bucketBaseUrl}/prod${id}.jpg`
 //       return this.http.get(url, {responseType : 'blob'});
   // }  
}