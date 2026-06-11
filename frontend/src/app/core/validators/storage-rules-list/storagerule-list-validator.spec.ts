import { TestBed } from '@angular/core/testing';

import { StorageruleListValidator } from './storagerule-list-validator';

describe('StorageruleListValidator', () => {
  let service: StorageruleListValidator;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StorageruleListValidator);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
