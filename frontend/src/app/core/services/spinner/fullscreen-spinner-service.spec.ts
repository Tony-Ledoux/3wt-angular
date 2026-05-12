import { TestBed } from '@angular/core/testing';

import { FullscreenSpinnerService } from './fullscreen-spinner-service';

describe('FullscreenSpinnerService', () => {
  let service: FullscreenSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FullscreenSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
