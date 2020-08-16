import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  communityData;
  homesData;
  images = [];
  title = 'OpenHouseAI-exercise';
  communityUrl = 'https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/communities';
  homesUrl = 'https://a18fda49-215e-47d1-9dc6-c6136a04a33a.mock.pstmn.io/homes';
  constructor(private http: HttpClient) { }

  ngOnInit() {      
      this.http.get(this.communityUrl).subscribe(data => {
          this.communityData = data;  
          this.http.get(this.homesUrl).subscribe(data => {
            this.homesData =data;
            this.processData(this.communityData, this.homesData);
          }),
          err => console.log(err),
          () => console.log('Oops')
      }),
      err => console.log(err),
      () => console.log('Oops')
      // Use the angular built in api http.get to get data from Rest backend.
      // Any connection error should be displayed.
  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    // Use binary search to sort the community in alphabetical order. Got this one from Internet. 
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
  
    let comparison = 0;
    if (nameA > nameB) {
      comparison = 1;
    } else if (nameA < nameB) {
      comparison = -1;
    }
    return comparison;
  }

  getAverage(home){
    // Calculate the average house price for the community.
    var sum = 0;
    for (let i = 0; i < home.length; i++) {
      sum = sum + home[i].price;
  }
    return (sum / home.length) - (( sum % home.length ) / home.length);
    // Do the integer division instead of decimal division
}

  processData(community,homes){
    // Processing home and community data and put them into html to display.
    var avgPrice;
    var home = [];
    community =community.sort(this.compare);
    // Sort the community.
    for (let i = 0; i < community.length; i++) {
      home = homes.filter(item => item.communityId === community[i].id);  
      // Find the homes that located in the current community.
      if (home.length != 0){
        avgPrice = this.getAverage(home);
      }
      else{
        avgPrice = 'Not Avaliable';
      }
      this.images.push({ "title" : community[i].name,"href" :community[i].imgUrl,"price" :avgPrice });
      // Push data to html to display.
    }
  }
  


}
