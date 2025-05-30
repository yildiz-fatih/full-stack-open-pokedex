import React from 'react'
import { Routes, Route, useMatch } from 'react-router-dom'
import { useApi } from './useApi'
import LoadingSpinner from './LoadingSpinner'
import ErrorMessage from './ErrorMessage'
import PokemonPage from './PokemonPage'
import PokemonList from './PokemonList'

const mapResults = ({ results }) =>
  results.map(({ url, name }) => ({
    url,
    name,
    id: parseInt(url.match(/\/(\d+)\//)[1], 10)
  }))

const App = () => {
  const match = useMatch('/pokemon/:name')
  const { data: pokemonList, error, isLoading } = useApi(
    'https://pokeapi.co/api/v2/pokemon/?limit=50',
    mapResults
  )

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  let previous = null
  let next = null

  if (match && match.params) {
    const pokemonId = pokemonList.find(p => p.name === match.params.name).id
    previous = pokemonList.find(p => p.id === pokemonId - 1)
    next = pokemonList.find(p => p.id === pokemonId + 1)
  }

  return (
    <Routes>
      <Route path="/" element={<PokemonList pokemonList={pokemonList} />} />
      <Route
        path="/pokemon/:name"
        element={
          <PokemonPage
            pokemonList={pokemonList}
            previous={previous}
            next={next}
          />
        }
      />
    </Routes>
  )
}

export default App
