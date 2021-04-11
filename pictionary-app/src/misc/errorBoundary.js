/* eslint-disable react/destructuring-assignment */
import React from 'react';

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
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <h2>Something went wrong.</h2>
        </div>
      );
    }

    return this.props.children;
  }
}
