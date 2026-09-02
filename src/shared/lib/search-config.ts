interface SearchPageConfig {
  placeholder: string
}

const SEARCH_CONFIG: Record<string, SearchPageConfig> = {
  '/': { placeholder: 'Search recent activity...' },
  '/visitors': { placeholder: 'Search visitors, hosts, companies...' },
  '/employees': { placeholder: 'Search employees, departments...' },
  '/appointments': { placeholder: 'Search appointments, hosts, rooms...' },
  '/reports': { placeholder: 'Search frequent visitors...' },
}

const DEFAULT_CONFIG: SearchPageConfig = {
  placeholder: 'Search visitors, hosts, appointments...',
}

export function getSearchConfig(pathname: string): SearchPageConfig {
  return SEARCH_CONFIG[pathname] ?? DEFAULT_CONFIG
}
