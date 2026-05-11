import { Component, input } from '@angular/core';
export type IconImange = 'meatballs'|'trash'| 'device-generic' | 'device-freezer';
@Component({
  selector: 'app-icon-component',
  imports: [],
  templateUrl: './icon-component.html',
  styleUrl: './icon-component.css',
})
export class IconComponent {
  public image = input.required<IconImange>();
}
