import { Container } from "@chakra-ui/react";
import {Routes, Route} from "react-router-dom";
import { Header } from "./components/Header";
import Employee from "./components/Employee";
import { useState } from "react";

function App() {
  const [id]= useState(137)
  return (
    <>
      <Header />
      <Container pt="6" maxW="container.md">
          <Routes>
            <Route path="/employee/:id" element={<Employee id={id}/>}/>
        </Routes>
      </Container>
    </>
  );
}

export default App;
