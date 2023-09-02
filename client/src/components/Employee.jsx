import {useParams} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {Stack, Heading, Text, Image, VStack, Flex} from '@chakra-ui/react';

export const Employee = () =>{
    const {id} = useParams();

    const {isLoading, error, data} = useQuery({
        queryKey: ["employee", id],
        queryFn: async()=> {
            const response = await fetch(`http://localhost:3030/employees/${id}`);
            return response.json();
        },
      });
    if (isLoading) return "Loading...";
    if (error) return "An error has occurred: " + error.message;
    console.log("Employee data: ", data);
    console.log("imageFilePath= ", data.imageFilePath);

    return(
        <EmployeeCard data={data}/>
  );
}

const EmployeeCard = ({data})=>{
    const {firstName,lastName, imageFilePath, teamName, jobTitle} = data;
    return(
        <Stack 
        direction={['column', 'row']} 
        spacing={4} 
        alignItems="center"
        >
            <Image
                src={`http://localhost:3030/${imageFilePath}`}
                alt={`${firstName}'s profile picture`}
                borderRadius="full"
                boxSize="175px" 
            />
            <VStack align="start" spacing={2}>
             <Flex alignItems="center">
                <Heading as="h2" size="lg"> {firstName} </Heading>
                 <Text mx={1}> </Text>
                <Text> {lastName} </Text>
             </Flex>
              <Flex alignItems="center">
                <Text> {jobTitle} </Text>
                <Text mx={2}> | </Text>
                <Text fontSize="sm"> {teamName} </Text>
              </Flex>
            </VStack>
        </Stack>
    );
} 