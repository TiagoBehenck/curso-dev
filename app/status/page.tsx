'use client'
import useSWR from 'swr'

async function fetchAPI(url: string) {
  const response = await fetch(url)
  const respondeBody = await response.json()
  return respondeBody
}

export default function Page() {
  const { isLoading, data } = useSWR('/api/v1/status', fetchAPI, {
    refreshInterval: 2000, // 2 seconds
  })

  let updatedatText = 'Carregando. . .'

  if (!isLoading && data) {
    updatedatText = new Date(data.updated_at).toLocaleString()
  }

  return (
    <div>
      <h1>Status</h1>
      Última atualização: {updatedatText}
      <pre>{isLoading ? 'Loading...' : JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
