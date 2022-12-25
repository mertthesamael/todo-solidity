// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Todo {
    address owner;
    constructor() public{
        owner = msg.sender;
    }
    struct Todo{
        string text;
        bool completed;
    }

    Todo[] public todos;

    event AddTodo(Todo[] _todos);
    function create(string calldata _text) external{
        require(msg.sender == owner, "You need to be owner");
        todos.push(Todo({
            text : _text,
            completed : false
        }));
        emit AddTodo(todos);
    }

    function update(uint _index, string calldata _text) external{
        require(msg.sender == owner, "You need to be owner");
        todos[_index].text = _text;
    }

    function get(uint _index) external view returns(string memory, bool){
        require(msg.sender == owner, "You need to be owner");
        Todo storage todo = todos[_index];
        return (todo.text,todo.completed);
    }

    function toggleCompleted(uint _index) external {
        require(msg.sender == owner, "You need to be owner");
        todos[_index].completed = !todos[_index].completed;
    }

    function getTodos() external view returns (Todo[] memory) {
    return todos;
    }
}
