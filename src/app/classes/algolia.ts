import { IMaWindow } from '../interfaces/i-ma-window';

export class Algolia {
  private role: string;
  private _algoliaHelper;

  constructor(index, client, userRole, cb) {
    let params = {
      hierarchicalFacets: [{
        name: 'parent',
        attributes: [
          'hierarchicalCategories.lvl0',
          'hierarchicalCategories.lvl1',
          'hierarchicalCategories.lvl2'
        ],
        rootPath: '',
      }],
      disjunctiveFacets: ['language'],
    };

    this.role = userRole;

    if (this.role !== 'admin' && this.role !== 'Super Admin') {
      params['disjunctiveFacets'].push('objectID');
    }
    this._algoliaHelper = new (window as IMaWindow).algoliasearchHelper(client, index, params);

    this._algoliaHelper.on('result', cb)
  }

  set visibleArticles(ids) {
    if (this.role === 'admin' || this.role === 'Super Admin') {
      return;
    }
    if (!Array.isArray(ids)) {
      if (typeof ids === 'object') {
        return;
      }

      ids = [ids]
    }

    this._algoliaHelper.clearRefinements('objectID');
    ids.forEach((id) => {
      this._algoliaHelper.addDisjunctiveFacetRefinement('objectID', id);
    });
  }

  set hierarchicalCategory(hierarchicalCategory) {
    if (this._algoliaHelper.hasRefinements('parent')) {
      this._algoliaHelper.removeHierarchicalFacetRefinement('parent');
    }
    this._algoliaHelper.addHierarchicalFacetRefinement('parent', hierarchicalCategory);
  }

  set language(language) {
    this._algoliaHelper.addDisjunctiveFacetRefinement('language', language);
  }

  search(query) {
    if (query) {
      this._algoliaHelper.setQuery(query)
    }
    this._algoliaHelper.search()
  }
}
