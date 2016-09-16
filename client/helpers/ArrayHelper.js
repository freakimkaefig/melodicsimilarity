/**
 * Helper for merging, intersecting and differentiating arrays.
 */

'use strict';
import _ from 'lodash';

class ArrayHelper {

  /**
   * Merges two arrays of objects by the value of the given property.
   * @param {Array} arr1 - The first array of objects
   * @param {Array} arr2 - The second array of objects (prefered in conflict)
   * @param {string} prop - The property name which value should match for merge
   */
  mergeByProperty(arr1, arr2, prop) {
    _.each(arr2, function (arr2obj) {
      var arr1obj = _.find(arr1, function (arr1obj) {
        return arr1obj[prop] === arr2obj[prop];
      });

      arr1obj ? _.extend(arr1obj, arr2obj) : arr1.push(arr2obj);
    });
  }

  /**
   * Diffs two arrays of objects by the value of the given property.
   * @param {Array} arr1 - The first array of objects
   * @param {Array} arr2 - The second array of objects
   * @param {string} prop - The property name which value should not match
   */
  differenceByProperty(arr1, arr2, prop) {
    return _.xorBy(arr1, arr2, prop);
  }

  /**
   * Intersects two arrays of objects by given property.
   * @param {Array} arr1 - The first array of objects
   * @param {Array} arr2 - The second array of objects
   * @param {string} prop - The property name which value should match for merge
   */
  arrayIntersect(arr1, arr2, prop) {
    return _.intersectionBy(arr1, arr2, prop);
  }

  /**
   * Diffs two arrays of objects by given property.
   * @param {Array} arr1 - The first array of objects (result taken from this)
   * @param {Array} arr2 - The second array of objects
   * @param {string} prop - The property name which value should not match
   */
  arrayDiff(arr1, arr2, prop) {
    return _.differenceBy(arr1, arr2, prop);
  }

  /**
   * Merges two arrays of objects by given property.
   * @param {Array} arr1 - The first array of objects (prefered in conflict)
   * @param {Array} arr2 - The second array of objects
   * @param {string} prop - The property name which value should match for merge
   */
  arrayMerge(arr1, arr2, prop) {
    return _.unionBy(arr1, arr2, prop);
  }

}

export default new ArrayHelper();