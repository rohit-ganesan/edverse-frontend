import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

interface UseTabRoutingProps {
  defaultTab: string;
  validTabs: string[];
  basePath: string;
}

interface UseTabRoutingReturn {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isValidTab: (tab: string) => boolean;
}

/**
 * Custom hook to manage tab routing with URL parameters
 * @param defaultTab - The default tab to show when no tab is specified in URL
 * @param validTabs - Array of valid tab names
 * @param basePath - Base path for the page (e.g., '/classes')
 * @returns Object with activeTab, setActiveTab function, and isValidTab function
 */
export function useTabRouting({
  defaultTab,
  validTabs,
  basePath,
}: UseTabRoutingProps): UseTabRoutingReturn {
  const { tab } = useParams<{ tab?: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine the active tab
  const activeTab = tab && validTabs.includes(tab) ? tab : defaultTab;

  // Function to check if a tab is valid
  const isValidTab = (tabName: string): boolean => {
    return validTabs.includes(tabName);
  };

  // Function to change the active tab
  const setActiveTab = (newTab: string): void => {
    if (!isValidTab(newTab)) {
      console.warn(
        `Invalid tab: ${newTab}. Valid tabs are: ${validTabs.join(', ')}`
      );
      return;
    }

    // Always navigate to explicit tab URL
    navigate(`${basePath}/${newTab}`, { replace: true });
  };

  // Redirect to explicit tab URL if on base path or invalid tab
  useEffect(() => {
    const currentPath = location.pathname;
    const isBasePath = currentPath === basePath;
    const hasInvalidTab = tab && !validTabs.includes(tab);

    // If we're on the base path (no tab specified), redirect to default tab
    if (isBasePath) {
      navigate(`${basePath}/${defaultTab}`, { replace: true });
    }
    // If we have an invalid tab, redirect to default tab
    else if (hasInvalidTab) {
      navigate(`${basePath}/${defaultTab}`, { replace: true });
    }
  }, [tab, validTabs, basePath, navigate, location.pathname, defaultTab]);

  return {
    activeTab,
    setActiveTab,
    isValidTab,
  };
}
