import { Container } from "@chakra-ui/react";
import {Routes, Route} from "react-router-dom";


import { Header } from "./components/Header";
import { Employee } from "./components/Employee";


function App() {

  return (
    <>
      <Header />
      <Container pt="6" maxW="container.md">
          <Routes>
            <Route path="/employees/:id" element={<Employee />}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
