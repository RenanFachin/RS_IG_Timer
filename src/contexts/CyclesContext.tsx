import { ReactNode, createContext, useReducer, useState } from 'react'
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import {
  ActionTypes,
  InterruptCurrentCycleAction,
  MarkCurrentCycleAsFinishedAction,
  addNewCycleAction,
} from '../reducers/cycles/actions'

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
  )

  const { cycles, activeCycleId } = cyclesState

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Percorrer os ciclos e ver qual item dentro do array tem o mesmo id do ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

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
