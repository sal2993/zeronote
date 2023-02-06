import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'
import { createTheme, NextUIProvider } from '@nextui-org/react';


const theme = createTheme({
  type: "dark",
  theme: {
    colors: {
      text: "#789"
    },
  }
})

function MyApp({ Component, pageProps }: AppProps) {


  return (
    <NextUIProvider theme={theme}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </NextUIProvider>
  )
}

export default MyApp
