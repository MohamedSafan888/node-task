import { useEffect } from 'react'
export function useTitle(title) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} | MediBook` : 'MediBook'
    return () => { document.title = prev }
  }, [title])
}
