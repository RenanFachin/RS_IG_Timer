import 'styled-components'

import { defaultTheme } from '../styles/themes/default'

// Definindo a tipagem de acordo com a inferência já realizada pelo TS (typeof)
type ThemeType = typeof defaultTheme

declare module 'styled-components' {
  export interface DefaultTheme extends ThemeType {}
}
