import "./App.css";
import {
  Box,
  Button,
  ChakraProvider,
  Flex,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./contracts/Todo.sol/Todo.json";
import Todo from "./components/Todo/Todo";

function App() {
  const toast = useToast();
  const [isLogged, setIsLogged] = useState(false);
  const [todos, setTodos] = useState();
  const [loading, setLoading] = useState(false);

  //Fetch data from SC
  const fetchSc = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0xB5BB7225A92590aDf7cd44A8709DD2185A967caF",
      abi.abi,
      provider
    );
    const todos = await contract.getTodos();
    console.log(todos);
    setTodos(todos);
  };

  //Adding new Todo
  const addTodo = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xB5BB7225A92590aDf7cd44A8709DD2185A967caF",
      abi.abi,
      signer
    );
    try {
      await contract.create(e.target.todo.value).then(() => checkEvents());
    } catch (err) {
      console.log(err.message);
      if (err.message.includes("owner")) {
        toast({
          title: "You need to be owner",
          status: "error",
        });
      }
    }
  };

  //Function for events in SC
  const checkEvents = async () => {
    setLoading(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      "0xB5BB7225A92590aDf7cd44A8709DD2185A967caF",
      abi.abi,
      provider
    );
    contract.on("AddTodo", (todos) => {
      setTodos(todos);
      setLoading(false);
    });
  };

  //Connect Function
  const connect = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
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
    } catch (err) {
      console.log(err);

      setIsLogged(false);
      toast({
        title: err.message,
        status: "error",
      });
    }
  };

  //Getting todo by the index number
  const getTodo = async (e) => {
    e.preventDefault();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      "0xB5BB7225A92590aDf7cd44A8709DD2185A967caF",
      abi.abi,
      signer
    );
    if (e.target.todo.value == "") {
      fetchSc();
    } else {
      const data = await contract.get(e.target.todo.value);
      setTodos(todos.filter((todo) => todo[0] == data[0]));

      try {
        console.log(data);
      } catch (err) {
        console.log(err.message);
      }
    }
  };

  //Checking if the user is already connected
  const isConnected = async () => {
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    if (accounts.length) {
      console.log(`You're connected to: ${accounts[0]}`);
      setIsLogged(true);
    } else {
      console.log("Metamask is not connected");
      setIsLogged(false);
    }
  };
  useEffect(() => {
    fetchSc();
    isConnected();
  }, []);
  return (
    <ChakraProvider>
      <Flex
        bgRepeat="no-repeat"
        bgSize="cover"
        bgImage={
          "url('https://images.squarespace-cdn.com/content/v1/54d15998e4b0553df778d21d/1611881291646-8SXQGH6U54PSXATDZZQA/PixelPro+Animated+Background+8+Preview.png?format=1000w')"
        }
        h="100vh"
        justify={"center"}
        align="center"
        bgColor="#383838"
      >
        {loading && (
          <Flex
            zIndex="23"
            pos="absolute"
            w="100vw"
            h="100vh"
            justify={"center"}
            align="center"
            bgColor="blackAlpha.500"
          >
            <Spinner color="red" size="lg"></Spinner>
          </Flex>
        )}
        <Flex p="2rem" className="maincard" h="80%" w="30rem" flexDir="column">
          <Box>
            <form onSubmit={addTodo}>
              <Input
                placeholder="Add Todo"
                margin="1rem 0"
                color="white"
                name="todo"
              ></Input>
              <Input type="submit" as={Button}>
                Add Todo
              </Input>
            </form>
          </Box>
          <Box>
            <form onSubmit={getTodo}>
              <Input
                placeholder="Todo Index"
                margin="1rem 0"
                color="white"
                name="todo"
              ></Input>
              <Input type="submit" as={Button}>
                Get Todo By Index
              </Input>
            </form>
          </Box>
          <Box
            gap="2rem"
            p="0 2rem"
            w="100%"
            h="100%"
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="center"
          >
            <Text color="white" fontSize="30px">
              TODOS
            </Text>
            {todos?.map((todo) => (
              <Todo
                completed={todo[1]}
                abi={abi.abi}
                index={todos.indexOf(todo)}
                text={todo[0]}
              ></Todo>
            ))}
            {isLogged === false && <Button onClick={connect}>Connect</Button>}
          </Box>
        </Flex>
      </Flex>
    </ChakraProvider>
  );
}

export default App;
