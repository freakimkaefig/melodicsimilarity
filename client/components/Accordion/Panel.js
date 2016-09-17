import React, { PropTypes, createClass } from 'react';
import PanelContent from './PanelContent';
import Animate from 'rc-animate';

const CollapsePanel = createClass({
  propTypes: {
    children: PropTypes.any,
    openAnimation: PropTypes.object,
    prefixCls: PropTypes.string,
    header: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.node,
    ]),
    isActive: PropTypes.bool,
    onItemClick: PropTypes.func,
    checkbox: PropTypes.bool,
    onCheckboxClick: PropTypes.func
  },

  getDefaultProps() {
    return {
      isActive: false,
      onItemClick() {
      }
    };
  },

  getInitialState() {
    return { isActive: this.props.isActive };
  },

  handleItemClick() {
    this.props.onItemClick();
  },

  handleCheckboxClick(event) {
    event.preventDefault();
    event.stopPropagation();
    this.props.onCheckboxClick();
  },

  render() {
    const { prefixCls, header, checkbox, children, isActive } = this.props;
    const headerCls = `${prefixCls}-header`;
    const activeCls = isActive ? 'active' : 'inactive';
    const checkboxState = checkbox === true ? 'fa-check-circle-o' : 'fa-times-circle-o';
    return (
      <div className={`${prefixCls}-item ${activeCls}`}>
        <div className={headerCls} onClick={this.handleItemClick}
             role="tab" aria-expanded={isActive}>
          <i className={`fa ${checkboxState}`} onClick={this.handleCheckboxClick}></i>
          <div className="header">
            {header}
          </div>
          <i className="open fa fa-caret-down"></i>
        </div>
        <Animate
          showProp="isActive"
          exclusive
          component=""
          animation={this.props.openAnimation}
        >
          <PanelContent prefixCls={prefixCls} isActive={isActive}>
            {children}
          </PanelContent>
        </Animate>
      </div>
    );
  },
});

export default CollapsePanel;