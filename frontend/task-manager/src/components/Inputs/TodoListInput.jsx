import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import SelectUsers from "../Inputs/SelectUsers"; 

const TodoListInput = ({ todoList, setTodoList, assignedUsers = [] }) => {
  const [option, setOption] = useState("");

  // Add new checklist item
  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([
        ...todoList,
        { text: option.trim(), completed: false, assignedTo: [] },
      ]);
      setOption("");
    }
  };

  // Delete checklist item
  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  // Update text of checklist item
  const handleTextChange = (index, value) => {
    const updatedArr = [...todoList];
    updatedArr[index].text = value;
    setTodoList(updatedArr);
  };

  // Update assigned users of checklist item
  const handleAssignChange = (index, users) => {
  const updatedArr = [...todoList];
  updatedArr[index].assignedTo = users;
  setTodoList(updatedArr);
};


  return (
    <div>
      {todoList.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2"
        >
          <div className="flex justify-between items-center">
            <p className="text-xs text-black flex-1">
              <span className="text-xs text-gray-400 font-semibold mr-2">
                {index < 9 ? `0${index + 1}` : index + 1}
              </span>
              <input
                className="outline-none bg-transparent text-sm w-3/4"
                value={item.text}
                onChange={(e) => handleTextChange(index, e.target.value)}
              />
            </p>

            <button
              className="cursor-pointer"
              onClick={() => handleDeleteOption(index)}
            >
              <HiOutlineTrash className="text-lg text-red-500" />
            </button>
          </div>

          {/* Assign Users per checklist item */}
          <div className="mt-1">
            <SelectUsers
              selectedUsers={item.assignedTo || []}
              setSelectedUsers={(value) => handleAssignChange(index, value)}
              allowedUsers={assignedUsers}
            />
          </div>
        </div>
      ))}

      <div className="flex items-center gap-5 mt-4">
        <input
          type="text"
          placeholder="Enter Task"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          className="w-full text-[13px] text-black outline-none bg-white border border-gray-100 px-3 py-2 rounded-md"
        />

        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" /> Add
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
