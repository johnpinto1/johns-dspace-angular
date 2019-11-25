import { SearchService } from '../../../core/shared/search/search.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchSettingsComponent } from './search-settings.component';
import { of as observableOf } from 'rxjs';
import { PaginationComponentOptions } from '../../pagination/pagination-component-options.model';
import { SortDirection, SortOptions } from '../../../core/cache/models/sort-options.model';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { SearchSidebarService } from '../../../core/shared/search/search-sidebar.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { EnumKeysPipe } from '../../utils/enum-keys-pipe';
import { By } from '@angular/platform-browser';
import { SearchFilterService } from '../../../core/shared/search/search-filter.service';
import { VarDirective } from '../../utils/var.directive';
import { first } from 'rxjs/operators';
import { SEARCH_CONFIG_SERVICE } from '../../../+my-dspace-page/my-dspace-page.component';

describe('SearchSettingsComponent', () => {

  let comp: SearchSettingsComponent;
  let fixture: ComponentFixture<SearchSettingsComponent>;
  let searchServiceObject: SearchService;

  const pagination: PaginationComponentOptions = new PaginationComponentOptions();
  pagination.id = 'search-results-pagination';
  pagination.currentPage = 1;
  pagination.pageSize = 10;
  const sort: SortOptions = new SortOptions('score', SortDirection.DESC);
  const mockResults = ['test', 'data'];
  const searchServiceStub = {
    searchOptions: { pagination: pagination, sort: sort },
    search: () => mockResults
  };

  const queryParam = 'test query';
  const scopeParam = '7669c72a-3f2a-451f-a3b9-9210e7a4c02f';
  const paginatedSearchOptions = {
    query: queryParam,
    scope: scopeParam,
    pagination,
    sort
  };

  const activatedRouteStub = {
    queryParams: observableOf({
      query: queryParam,
      scope: scopeParam
    })
  };

  const sidebarService = {
    isCollapsed: observableOf(true),
    collapse: () => this.isCollapsed = observableOf(true),
    expand: () => this.isCollapsed = observableOf(false)
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule.withRoutes([])],
      declarations: [SearchSettingsComponent, EnumKeysPipe, VarDirective],
      providers: [
        { provide: SearchService, useValue: searchServiceStub },

        { provide: ActivatedRoute, useValue: activatedRouteStub },
        {
          provide: SearchSidebarService,
          useValue: sidebarService
        },
        {
          provide: SearchFilterService,
          useValue: {}
        },
        {
          provide: SEARCH_CONFIG_SERVICE,
          useValue: {
            paginatedSearchOptions: observableOf(paginatedSearchOptions),
            getCurrentScope: observableOf('test-id')
          }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchSettingsComponent);
    comp = fixture.componentInstance;

    // SearchPageComponent test instance
    fixture.detectChanges();
    searchServiceObject = (comp as any).service;
    spyOn(comp, 'reloadOrder');
    spyOn(searchServiceObject, 'search').and.callThrough();

  });

  it('it should show the order settings with the respective selectable options', (done) => {
    (comp as any).searchOptions$.pipe(first()).subscribe((options) => {
      fixture.detectChanges();
      const orderSetting = fixture.debugElement.query(By.css('div.result-order-settings'));
      expect(orderSetting).toBeDefined();
      const childElements = orderSetting.query(By.css('.form-control')).children;
      expect(childElements.length).toEqual(comp.searchOptionPossibilities.length);
      done();
    });
  });

  it('it should show the size settings', (done) => {
    (comp as any).searchOptions$.pipe(first()).subscribe((options) => {
        fixture.detectChanges();
        const pageSizeSetting = fixture.debugElement.query(By.css('page-size-settings'));
        expect(pageSizeSetting).toBeDefined();
        done();
      }
    )
  });

  it('should have the proper order value selected by default', (done) => {
    (comp as any).searchOptions$.pipe(first()).subscribe((options) => {
      fixture.detectChanges();
      const orderSetting = fixture.debugElement.query(By.css('div.result-order-settings'));
      const childElementToBeSelected = orderSetting.query(By.css('.form-control option[value="0"][selected="selected"]'));
      expect(childElementToBeSelected).toBeDefined();
      done();
    });
  });
});
