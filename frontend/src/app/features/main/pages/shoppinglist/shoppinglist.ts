import { Component } from '@angular/core';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { NotImplementedYet } from '../../components/not-implemented-yet/not-implemented-yet';

@Component({
  selector: 'app-shoppinglist',
  imports: [PageHeader, NotImplementedYet],
  templateUrl: './shoppinglist.html',
  styleUrl: './shoppinglist.css',
})
export class Shoppinglist {

}
