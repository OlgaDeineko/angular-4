import { Injectable } from '@angular/core';
import { AlgoliaClient } from '@types/algoliasearch'

import { AuthService } from './auth.service';
import { SessionService } from './session.service';

import { Algolia } from '../classes/algolia';

import { ALGOLIA_ID, ALGOLIA_KEY } from '../../environments/environment';
import { IMaWindow } from '../interfaces/i-ma-window';


@Injectable()
export class AlgoliaService {
  algoliaIndex: string;
  algoliaClient: AlgoliaClient;

  constructor(private $Auth: AuthService,
              private $Session: SessionService) {
    this.algoliaIndex = this.$Session.algoliaIndex.data;
    this.algoliaClient = (window as IMaWindow).algoliasearch(ALGOLIA_ID, ALGOLIA_KEY, {protocol: 'https:'});
  }

  initSearching(cb) {
    return new Algolia(this.algoliaIndex, this.algoliaClient, this.$Auth.getRole(), cb);
  };

}
