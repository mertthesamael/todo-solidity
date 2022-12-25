import { Box, Button, Text } from "@chakra-ui/react"
import { ethers } from "ethers";
import { useState } from "react";


const Todo = ({text, index, abi}) =>{
    
    const [marked, setMarked] = useState()

    const mark = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
            "0xf3420cd780995ae660722bB58A2f0b6c6DA1FdD3",
            abi,
            signer
          );

        const toggle = await contract.toggleCompleted(index)
            try{

                return toggle()
            }catch(err){
                console.log(err)
            }

    }
    
    return(
        <Box border='1px solid white' borderRadius='10px' w='100%' p='1rem' justifyContent='space-between' display='flex' alignItems={'center'}>
            <Text color='white' fontSize='25px'>{text}</Text>
            <Button onClick={mark} colorScheme='red'>X</Button>
        </Box>
    )

}


export default Todo;