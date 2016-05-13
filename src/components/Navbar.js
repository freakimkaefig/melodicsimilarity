import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { IndexLinkContainer, LinkContainer } from 'react-router-bootstrap';
import LoginStore from '../stores/LoginStore';

require('../stylesheets/NavBar.less');

export default class NavBar extends React.Component {
  static propTypes = {
    header: PropTypes.bool,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        path: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        nav: PropTypes.bool,
        auth: PropTypes.bool
      })
    ).isRequired,
    route: PropTypes.string.isRequired
  };

  getVisibleLinks() {
    return this.props.links.filter(link => {
      return (link.nav === true && (link.auth === false || (link.auth === true && LoginStore.isLoggedIn())));
    });
  }

  getLinkComponents() {
    return this.getVisibleLinks().map((link, index) => {
      return (
        <LinkContainer to={link.path} key={index}>
          <NavItem active={(link.path === this.props.route)} eventKey={index}>{link.title}</NavItem>
        </LinkContainer>
      );
    });
  }

  getNavbarHeader() {
    return (
      this.props.header === true ? (
          <Navbar.Header>
            <Navbar.Brand>
              <LinkContainer to="/"><div>MusicIR</div></LinkContainer>
            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
        )
        : ''
    );
  }

  getNavbarIndex() {
    return (
      this.props.header === true ? (
        <IndexLinkContainer to="/" key={0}>
          <NavItem active={this.props.route === '/'} eventKey={0}>Home</NavItem>
        </IndexLinkContainer>
      ) : ''
    );
  }

  render() {
    return (
      <div>
        <Navbar fluid={true} fixedTop={this.props.header} fixedBottom={!this.props.header} className={this.props.header ? 'header' : 'footer'}>
          {this.getNavbarHeader()}
          <Navbar.Collapse>
            <Nav pullRight>
              {this.getNavbarIndex()}
              {this.getLinkComponents()}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}