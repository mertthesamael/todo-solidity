import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Box, Button, Spinner, Text, useToast } from "@chakra-ui/react"
import { ethers } from "ethers";
import { useState } from "react";


const Todo = ({text, index, abi, completed}) =>{
    const toast = useToast()
    const [marked, setMarked] = useState(completed)
    const [loading, setLoading] = useState(false)
    const checkEvents = async () => {
        setLoading(true)
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(
          "0xB5BB7225A92590aDf7cd44A8709DD2185A967caF",
          abi,
          provider
        );
        contract.on("Marked", (status)=>{
          console.log(status)
          setMarked(status)
          setLoading(false)
        })
        
      }
    const mark = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            "0xB5BB7225A92590aDf7cd44A8709DD2185A967caF",
            abi,
            signer
          );

          try{
              await contract.toggleCompleted(index).then(() => checkEvents())
            }catch(err){
                console.log(err.message)
                if(err.message.includes("owner")){
                    toast({
                        title:'You need to be owner',
                        status:'error'
                    })
                }
            }

    }
    
    return(
        <Box border='1px solid white' borderRadius='10px' w='100%' p='1rem' justifyContent='space-between' display='flex' alignItems={'center'}>
            <Text color='white' textDecoration={marked&&'line-through'} fontSize='25px'>{text}</Text>
            {loading?<Spinner color="red" size='lg'></Spinner>:<Button onClick={mark} colorScheme='purple'>{marked?<CloseIcon color='red'/>:<CheckIcon color='green'/>}</Button>}
        </Box>
    )

}


export default Todo;