import React, {PropTypes} from 'react';

export default class Melody extends React.Component {
  static propTypes = {
    submit: PropTypes.func.isRequired
  };
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <h2>Hello Melody Search!</h2>
    );
  }
}