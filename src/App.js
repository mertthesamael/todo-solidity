import logo from './logo.svg';
import './App.css';
import { Box, Button, ChakraProvider, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import abi from "./contracts/Todo.sol/Todo.json";
import Todo from './components/Todo/Todo';

function App() {
const toast = useToast()
  const [isLogged, setIsLogged] = useState()
  const [todos, setTodos] = useState();
  console.log(todos)
  const fetchSc = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0xeFe1C51f7035e768E160a9Ca3B8A3dD2454f36eD",
      abi.abi,
      provider
    );
    const todos = await contract.getTodos()
    console.log(todos)
    setTodos(todos)
  }
  const addTodo = async(e)=> {
    e.preventDefault()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(
      "0xeFe1C51f7035e768E160a9Ca3B8A3dD2454f36eD",
      abi.abi,
      signer
    );
    await contract.create(e.target.todo.value).then(() => checkEvents())
    
  }
  const checkEvents = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0xeFe1C51f7035e768E160a9Ca3B8A3dD2454f36eD",
      abi.abi,
      provider
    );
    contract.on("AddTodo", (todos)=>{
      setTodos(todos)
    })
    


    
  }
  const connect = async() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const network = await provider.getNetwork();
    if (network.chainId !== 80001) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              rpcUrls: ["https://rpc-mumbai.maticvigil.com"],
              chainName: "Mumbai Testnet",
              nativeCurrency: {
                name: "MATIC",
                symbol: "MATIC",
                decimals: 18,
              },
              blockExplorerUrls: ["https://polygonscan.com/"],
            },
          ],
        });
        await window.ethereum.request({ method: "eth_requestAccounts" });
        setIsLogged(true);
        fetchSc();
      } catch (err) {
        setIsLogged(false);
        toast({
          title: err.message,
          status: "error",
        });
      }
      setIsLogged(true);
    } else {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setIsLogged(true);
      fetchSc();
    }
  }
useEffect(() => {
  fetchSc();

},[])
  return (
   <ChakraProvider>
    <Flex h='100vh' justify={'center'} align='center' bgColor='blackAlpha.700'>
      {isLogged===false&&<Button onClick={connect}>Connect</Button>}
      <Flex h='80%' w='30rem' flexDir='column' bgColor='red'>
        <Box>
          <form onSubmit={addTodo}>
            <Input name='todo'></Input>
            <Input type='submit' as={Button}>Add Todo</Input>
          </form>
        </Box>
        <Box gap='2rem' p='0 2rem' w='100%' h='100%' bgColor={'green.700'} display='flex' flexDir='column' alignItems='center' justifyContent='center'>
          {todos?.map((todo) => <Todo abi={abi.abi} index={todos.indexOf(todo)} text={todo[0]}></Todo>)}
        </Box>
      </Flex>
    </Flex>
    
   </ChakraProvider>
  );
}

export default App;
