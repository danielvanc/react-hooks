// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {fetchPokemon, PokemonInfoFallback, PokemonDataView} from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'
import {PokemonForm} from '../pokemon'

// class ErrorBoundary extends React.Component {
//   state = {error: null}

//   // Turn this component into one that handles errors
//   static getDerivedStateFromError(error) {
//     // Update state so the next render will show the fallback UI.
//     return {error}
//   }

//   componentDidCatch(error, errorInfo) {
//     // You can also log the error to an error reporting service
//     // logErrorToMyService(error, errorInfo)
//   }

//   render() {
//     if (this.state.error) {
//       // You can render any custom fallback UI
//       return <this.props.FallbackComponent error={this.state.error} />
//     }
//     return this.props.children
//   }
// }

function PokemonInfo({pokemonName}) {
  const [{status, pokemon, error}, setState] = React.useState({
    status: 'idle',
    pokemon: null,
    error: null,
  })

  React.useEffect(() => {
    if (!pokemonName) return

    // Use object with it's status together.
    // That way, there's no render issues because
    // 1 state is being set before another.
    setState({status: 'pending'})
    fetchPokemon(pokemonName)
      .then(pokemon => {
        setState({pokemon, status: 'resolved'})
      })
      .catch(error => {
        setState({error, status: 'rejected'})
      })
  }, [pokemonName])

  if (status === 'idle') {
    return 'Submit a pokemon'
  } else if (status === 'pending') {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === 'rejected') {
    // this will be handled  by our error boundary
    throw error
  } else if (status === 'resolved') {
    return <PokemonDataView pokemon={pokemon} />
  }

  throw new Error('This should be impossible')
}

function ErrorFallback({error}) {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>
  )
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary key={pokemonName} FallbackComponent={ErrorFallback}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
