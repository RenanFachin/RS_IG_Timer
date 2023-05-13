import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  InterruptCurrentCycleAction,
  MarkCurrentCycleAsFinishedAction,
  addNewCycleAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

// Tipagem da função de criar novo ciclo
interface CreateCycleData {
  task: string
  minutesAmount: number
}

// Tipagem dos dados que estão sendo enviados pelo contexto
interface CyclesContextType {
  activeCycle: Cycle | undefined
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
  amountSecondsPassed: number
  setSecondsPassed: (seconds: number) => void
  createNewCycle: (data: CreateCycleData) => void
  interruptCurrentCycle: () => void
  cycles: Cycle[]
}

// Criando o contexto e tipando ele
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
  children: ReactNode
}

// Provider do contexto
export function CyclesContextProvider({
  children,
}: CyclesContextProviderProps) {
  // State para armazenar uma lista de ciclos
  const [cyclesState, dispatch] = useReducer(
    cyclesReducer,
    { cycles: [], activeCycleId: null }, // Valores iniciais do reducer
    (initialState) => {
      // initialState => é o conteúdo do segundo parâmetro do useReducer
      const storedStateAsJSON = localStorage.getItem(
        '@ignite-timer:cycles-state-1.0.0',
      )

      if (storedStateAsJSON) {
        return JSON.parse(storedStateAsJSON)
      }

      // Caso ele não tenha nada no storage
      return initialState
    },
  )

  const { cycles, activeCycleId } = cyclesState

  // Percorrer os ciclos e ver qual item dentro do array tem o mesmo id do ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })

  // Função a ser enviada por contexto para atualizar um state
  function markCurrentCycleAsFinished() {
    dispatch(MarkCurrentCycleAsFinishedAction())
  }

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  function createNewCycle(data: CreateCycleData) {
    const newCycle: Cycle = {
      id: String(new Date().getTime()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    dispatch(addNewCycleAction(newCycle))
    // Mantendo os valores já armazenados no state e adicionando o próximop
    // setCycles((state) => [...state, newCycle])
    setAmountSecondsPassed(0) // Retornando o valor já passado de segundos (para evitar bugs ao criar um novo ciclo já contendo um ciclo ativo)
  }

  function interruptCurrentCycle() {
    dispatch(InterruptCurrentCycleAction())
  }

  // Salvando os dados no localStorage
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)

    localStorage.setItem('@ignite-timer:cycles-state-1.0.0', stateJSON)
  }, [cyclesState])

  return (
    <CyclesContext.Provider
      value={{
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFinished,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
        cycles,
      }}
    >
      {children}
    </CyclesContext.Provider>
  )
}
