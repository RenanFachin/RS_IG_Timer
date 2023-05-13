import { ReactNode, createContext, useReducer, useState } from 'react'

// Tipagem dos dados de um novo ciclo
interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptedDate?: Date
  finishedDate?: Date
}

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
  const [cycles, dispatch] = useReducer((state: Cycle[], action: any) => {
    if (action.type === 'ADD_NEW_CYCLE') {
      return [...state, action.payload.newCycle]
    }

    return state
  }, [])

  const [activeCycleId, setActiveCycleId] = useState<string | null>(null) // State para armazenar a informação de um ciclo ativo no momento
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0)

  // Percorrer os ciclos e ver qual item dentro do array tem o mesmo id do ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  // Função a ser enviada por contexto para atualizar um state
  function markCurrentCycleAsFinished() {
    dispatch({
      type: 'MARK_CURRENT_CYCLE_AS_FINISHED',
      payload: {
        activeCycleId,
      },
    })
    // setCycles((state) =>
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, finishedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )
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

    dispatch({
      type: 'ADD_NEW_CYCLE',
      payload: {
        newCycle,
      },
    })
    // Mantendo os valores já armazenados no state e adicionando o próximop
    // setCycles((state) => [...state, newCycle])

    setActiveCycleId(newCycle.id)

    setAmountSecondsPassed(0) // Retornando o valor já passado de segundos (para evitar bugs ao criar um novo ciclo já contendo um ciclo ativo)
  }

  function interruptCurrentCycle() {
    dispatch({
      type: 'INTERRUPT_CURRENT_CYCLE',
      payload: {
        activeCycleId,
      },
    })
    // Anotando no state o valor de interruptedDate para o atual caso este seja o cycle ativo
    // setCycles((state) =>
    //   // Percorrendo o state e fazendo a validação de o cycle.id passado ser o mesmo do activeCycleId atual no momento
    //   state.map((cycle) => {
    //     if (cycle.id === activeCycleId) {
    //       return { ...cycle, interruptedDate: new Date() }
    //     } else {
    //       return cycle
    //     }
    //   }),
    // )

    setActiveCycleId(null)
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
