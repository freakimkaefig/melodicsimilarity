import React from 'react';
import { renderIntoDocument, scryRenderedDOMComponentsWithTag } from 'react-addons-test-utils';
import NavBar from '../../../client/components/Navbar';
import 'ignore-styles';
import { expect } from 'chai';

describe('NavBar', () => {

  it('renders navbar with links from props', () => {
    let links = [
      { to: '/', component: 'TestPage', title: 'Test', nav: true, auth: false, default: true }
    ];

    const component = renderIntoDocument(
      <NavBar header={true} links={links} route="TestPage" />
    );

    const navbar = scryRenderedDOMComponentsWithTag(component, 'nav');
    console.log(navbar);
    // expect(navbar.)
  });

});