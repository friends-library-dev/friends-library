import React from 'react';
import { Dual } from '@friends-library/ui';
import { NODE_ENV } from '../env';

interface State {
  hasError: boolean;
}

interface Props {
  location: string;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: any, errorInfo: any): void {
    if (NODE_ENV === `development`) {
      return;
    }

    let err = error;
    if (error instanceof Error) {
      err = {
        message: error.message,
        name: error.name,
        stack: error.stack,
      };
    }

    window.fetch(`/.netlify/functions/site/log-error`, {
      method: `POST`,
      headers: {
        'Content-Type': `application/json`,
      },
      body: JSON.stringify({
        error: err,
        info: errorInfo,
        location: this.props.location,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <Dual.h1 className="p-6 text-center text-white bg-red-700">
          <>
            Sorry, an unexpected error occurred. We&rsquo;ve been notified of the problem
            and will look into it as soon as possible. Please refresh the page and try
            again. We&rsquo;re very sorry for any inconvenience.
          </>
          <>
            Lo siento, ha ocurrido un error inesperado. Hemos sido notificados sobre el
            problema y lo investigaremos lo antes posible. Actualiza la página e inténtalo
            de nuevo. Lamentamos cualquier inconveniente.
          </>
        </Dual.h1>
      );
    }

    return this.props.children;
  }
}
