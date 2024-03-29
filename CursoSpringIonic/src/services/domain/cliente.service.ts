import { StorageService } from './../storage.service';
import { API_CONFIG } from './../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { ClienteDTO } from '../../models/cliente.dto';
import { ImageUtilService } from '../image-util.service';

@Injectable()
export class ClienteService {
    constructor(
        public http: HttpClient, 
        public storage: StorageService,
        public imageUtilService: ImageUtilService
        ){}

    findByEmail(email: string){              
        return this.http.get(`${API_CONFIG.baseURL}/clientes/email?value=${email}`)
    }

    findById(id: string){              
        return this.http.get(`${API_CONFIG.baseURL}/clientes/${id}`)
    }

    insert(obj: ClienteDTO){
        return this.http.post(
            `${API_CONFIG.baseURL}/clientes`,
            obj,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
    }

    //getImageFromBucket(id: string): Observable<any>{
   //     let url = `${API_CONFIG}/caminho da imagem`
   //     return this.http.get(url, {responseType: 'blob'})
   // }

   uploadPicture(picture){
        let pictureBlob = this.imageUtilService.dataUriToBlob(picture)
        let formData : FormData = new FormData()
        formData.set('file', pictureBlob, 'file.png')

        return this.http.post(
            `${API_CONFIG.baseURL}/clientes/picture`,
            formData,
            {
                observe: 'response',
                responseType: 'text'
            }
        )
   }
}