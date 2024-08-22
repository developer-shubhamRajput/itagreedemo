import { useEffect, useRef } from 'react';

const useIframeUrlListener = ({ initialUrl, onUrlChange, callbackDomain = 'submit.jotform.com' }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    const checkIframeUrl = () => {
      console.log('Checking iframe URL...');

      try {
        const iframeWindow = iframeRef.current?.contentWindow;
        const currentUrl = iframeWindow?.location.href;
        console.log('Current URL:', currentUrl);

        if (!currentUrl) {
          console.warn('Unable to retrieve URL from iframe, currentUrl is undefined.');
          return;
        }

        const currentDomain = new URL(currentUrl).hostname;
        console.log('Current Domain:', currentDomain);

        // Check if the domain matches the specified callbackDomain
        if (currentDomain === callbackDomain) {
          console.log('Domain matches:', currentDomain);
          onUrlChange(currentUrl); // Trigger the callback with the updated URL
        } else {
          console.log('Domain does not match:', currentDomain);
        }
      } catch (error) {
        console.error('Error accessing iframe content:', error);
      }
    };

    if (iframeRef.current?.contentWindow) {
      console.log('Adding event listeners to iframe contentWindow...');
      const iframeWindow = iframeRef.current.contentWindow;

      //iframeWindow.addEventListener('popstate', checkIframeUrl);
      iframeWindow.addEventListener('hashchange', checkIframeUrl);
      //iframeWindow.addEventListener('beforeunload', checkIframeUrl); // Use beforeunload as a last resort

      return () => {
        console.log('Cleaning up event listeners from iframe contentWindow...');
        //iframeWindow.removeEventListener('popstate', checkIframeUrl);
        iframeWindow.removeEventListener('hashchange', checkIframeUrl);
        //iframeWindow.removeEventListener('beforeunload', checkIframeUrl);
      };
    } else {
      console.warn('iframe contentWindow is not accessible or not loaded yet.');
    }
  }, [callbackDomain, iframeRef]);

  console.log('Returning iframeRef...');
  return iframeRef;
};

export default useIframeUrlListener;