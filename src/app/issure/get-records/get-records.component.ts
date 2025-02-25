import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { GeneralService } from 'src/app/services/general/general.service';
import { AppConfig } from 'src/app/app.config';

@Component({
  selector: 'app-get-records',
  templateUrl: './get-records.component.html',
  styleUrls: ['./get-records.component.scss']
})
export class GetRecordsComponent implements OnInit, OnChanges {
  item:any;
  recordItems: any;
  vcOsid: any;
  headerName: string = 'plain'
  //headerName : string = 'issuer';

  documentName: string;
  pdfName: any;
  osid: string;
  schemaObj;
  tempObj: any;
  nameArray = [];
  nameArray2;

  constructor(public router: Router, public route: ActivatedRoute,
    public generalService: GeneralService, private http: HttpClient,
    private config: AppConfig) { 
      this.documentName = this.route.snapshot.paramMap.get('document'); 
      this.osid = this.route.snapshot.paramMap.get('osid'); 

   // this.item = this.router.getCurrentNavigation().extras.state.item;

    // if( this.item){
    //   localStorage.setItem('item',  this.item);
    // }else{
    //   this.item =  localStorage.getItem('item');
    // }

  }

  ngOnInit(): void {
    this.getRecords();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.getRecords();
  }

  getRecords(){
    let payout = {
      "filters": {}
    }
    this.generalService.postData('/' + this.documentName + '/search', payout).subscribe((res) => {
      console.log(res);
      this.recordItems = res;
      
    }, err=>{
      this.recordItems = [];
      console.log(err);
    });
  }

  addRecord()
  {
   // this.router.navigate(['/add-records'] );
    // this.router.navigate(['/add-records'], { state: { item: this.item } });

  }

  downloadVc(item){
    this.vcOsid = item.osid;
    this.pdfName = (item.name) ? item.name : this.documentName;

    let headers = {
      Accept: 'text/html',
      'template-key':'html',
    };
   
    this.downloadPDF();
    
  }
  onPress(){
    this.router.navigateByUrl['/pdf-view'];
    
  }

  downloadPDF() {

    let headerOptions = new HttpHeaders({
      'template-key':'html',
        'Accept': 'application/pdf'
    });

    let requestOptions = { headers: headerOptions, responseType: 'blob' as 'blob' };
    // post or get depending on your requirement
    this.http.get(this.config.getEnv('baseUrl')  + '/' + this.documentName + '/' +  this.vcOsid, requestOptions).pipe(map((data: any) => {

        let blob = new Blob([data], {
            type: 'application/pdf' // must match the Accept type
            // type: 'application/octet-stream' // for excel 
        });
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = this.pdfName + '.pdf';
        link.click();
        window.URL.revokeObjectURL(link.href);

    })).subscribe((result: any) => {
    });

}

}
