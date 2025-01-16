import "./App.css"
import {RouterProvider} from "react-router-dom"
import {QueryClient, QueryClientProvider} from "react-query"
import {router} from "./router"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function App() {
  const queryClient = new QueryClient()
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

export default App
