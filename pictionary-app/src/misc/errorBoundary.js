/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable react/destructuring-assignment */
import React from 'react';
import error from '../images/500.png';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.log(error, errorInfo);
    this.setState({ hasError: true });
    // TODO: Log error to sentry
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', textAlign: 'center' }}>
          <div>
            <img src={error} alt="This is embarrassing, even the 500 image pic did not load, its a bad day :(" />
          </div>
          <a href="/" style={{ fontSize: '2em' }}> Go back to home </a>
        </div>
      );
    }

    return this.props.children;
  }
}
