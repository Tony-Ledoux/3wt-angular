import { Component, input, model, output, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs';

@Component({
  selector: 'app-autocomplete',
  imports: [],
  templateUrl: './autocomplete.html',
  styleUrl: './autocomplete.css',
})
export class Autocomplete<T> {
  label = input<string>();
  key = input.required<keyof T & string>();
  options = input.required<T[]>();
  availableOptions = signal<T[]>([]);
  searchterm = signal<string>('');
  activeIndex = signal<number>(-1);

  result = output<T>();

  constructor() {
    toObservable(this.searchterm).pipe(
      tap(() => this.activeIndex.set(-1)),
      debounceTime(150),
      distinctUntilChanged(),
      map((term: string) => {
        const allOptions = this.options();
        const searchKey = this.key();
        if (!term.trim()) return [];
        return allOptions.filter(item => {
          const value = item[searchKey] as unknown as string;
          return value?.toLowerCase().includes(term.toLowerCase());
        }
        )
      })
    ).subscribe(data => this.availableOptions.set(data))
  }

  onKeyDown(event: KeyboardEvent) {
    const options = this.availableOptions();
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.moveSelection(1, options.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.moveSelection(-1, options.length);
        break;
      case 'Enter':
        event.preventDefault();
        this.selectCurrent();
        break;
      case 'Escape':
        event.preventDefault();
        this.activeIndex.set(-1);
        break;
    }
  }



  onOptionClick(option: T) {
    this.emitResult(option);
  }

  private moveSelection(direction: number, length: number) {
    if (length === 0) return;
    this.activeIndex.update(p => {
      const next = p + direction;
      if (next < 0) return length - 1;
      if (next >= length) return 0;
      return next
    })
  }

  private selectCurrent() {
    const options = this.availableOptions();
    const index = this.activeIndex();
    if (index >= 0 && index < options.length) {
      this.emitResult(options[index]);
    } else if (options.length === 1) {
      this.emitResult(options[0]);
    }
  }

  private emitResult(option: T) {
    this.result.emit(option);
    this.searchterm.set('');
    this.activeIndex.set(-1);
  }

}
