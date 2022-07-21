import { Container } from "@chakra-ui/react";

import { Header } from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Container pt="6" maxW="container.md">
        {/* add non-header content here */}
      </Container>
    </>
  );
}

export default App;
