import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
    title = ""
    constructor() {}
}