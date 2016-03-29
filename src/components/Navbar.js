import React, { PropTypes } from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import LoginStore from '../stores/LoginStore';

export default class Header extends React.Component {
  static propTypes = {
    header: PropTypes.bool,
    links: PropTypes.arrayOf(
      PropTypes.shape({
        to: PropTypes.string.isRequired,
        component: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        nav: PropTypes.bool,
        auth: PropTypes.bool
      })
    ).isRequired,
    route: PropTypes.string.isRequired
  }

  getVisibleLinks() {
    return this.props.links.filter(link => {
      return (link.nav === true && (link.auth === false || (link.auth === true && LoginStore.isLoggedIn())));
    });
  }

  getLinkComponents() {
    return this.getVisibleLinks().map(link => {
      let cssClass = (link.component === this.props.route) ? 'link active' : 'link';
      return (
        <LinkContainer to={link.to} key={link.component}>
          <NavItem className={cssClass} eventKey={link.component}>{link.title}</NavItem>
        </LinkContainer>
      );
    });
  }

  getNavbarHeader() {
    return (
      this.props.header === true
        ? (
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

  render() {
    return (
      <Navbar>
        {this.getNavbarHeader()}
        <Navbar.Collapse>
          <Nav pullRight>
            {this.getLinkComponents()}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}