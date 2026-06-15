import { Component } from '@angular/core';
import { PageHeader } from '@app/shared/components/page-header/page-header';
import { NotImplementedYet } from '../../components/not-implemented-yet/not-implemented-yet';

@Component({
  selector: 'app-recipes',
  imports: [PageHeader, NotImplementedYet],
  templateUrl: './recipes.html',
  styleUrl: './recipes.css',
})
export class Recipes {

}
