import React, { useState } from "react";
import TodoItem from "@/components/TodoItem";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "@/styles/TodoList.module.css";

// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  // 상태를 관리하는 useState 훅을 사용하여 할 일 목록과 입력값을 초기화합니다.
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [errorcode, seterrorcode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("");

  const [but,setbut]=useState('add');
  const [modid,setmodid] =useState("")

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetch('/api/todo')
        .then((res) => res.json())
        .then((data) => setTodos(data))
        .catch((err) => console.log(err));
    }, 1000);
    
    return () => clearInterval(intervalId); // 언마운트 시 intervalId 클리어
  }, []);

  const postTodo = (todoList) => {
    fetch('/api/todo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ todo: todoList })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.message);
      })
  }

  postTodo(todos)
  

  // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addTodo = () => {
    // 입력값이 비어있는 경우 함수를 종료합니다.
    if (input.trim() === "" || deadline === "" || category === "") {
      setIsButtonDisabled(true); // 버튼 비활성화
      seterrorcode("할 일과 마감일, 카테고리를 다시 확인하십시오");
      setTimeout(() => {
        setIsButtonDisabled(false); // 1초 후 버튼 활성화
      }, 1000);
      return;
    }
    // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
    // {
    //   id: 할일의 고유 id,
    //   text: 할일의 내용,
    //   completed: 완료 여부,
    // }
    // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..
    if (but==="add"){
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: input,
          completed: false,
          deadline: deadline,
          category: category,
          dday: Math.ceil(
            (deadline - Date.now()) / (1000 * 60 * 60 * 24)
          ).toString(),
        },
      ]);
      setInput("");
      setDeadline("");
      setCategory("");
      setIsButtonDisabled(true); // 버튼 비활성화
      seterrorcode("");
      setTimeout(() => {
        setIsButtonDisabled(false); // 버튼 활성화
      }, 1000);
    } else {
      setTodos(todos.map((todo)=>todo.id==modid? 
      {...todo,text:input,deadline:deadline,category:category,dday: Math.ceil((deadline - Date.now()) / (1000 * 60 * 60 * 24)).toString(),}
      :todo));
      setInput("");
      setDeadline("");
      setCategory("");
      setIsButtonDisabled(true); // 버튼 비활성화
      seterrorcode("");
      setTimeout(() => {
        setIsButtonDisabled(false); // 버튼 활성화
      }, 1000);
      setbut("add");setmodid("");
    }
  };

  // toggleTodo 함수는 체크박스를 눌러 할 일의 완료 상태를 변경하는 함수입니다.
  const toggleTodo = (id) => {
    // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
    setTodos(
      // todos.map((todo) =>
      //   todo.id === id ? { ...todo, completed: !todo.completed } : todo
      // )
      // ...todo => id: 1, text: "할일1", completed: false
      todos.map((todo) => {
        return todo.id === id ? { ...todo, completed: !todo.completed } : todo;
      })
    );
  };

  const modiTodo = (id) => {
    const selected=todos.filter((todo)=>todo.id===id)[0]
    setInput(selected.text);
    const now = new Date();
    const dDayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + parseInt(selected.dday));
    setDeadline(dDayDate);
    setCategory(selected.category);
    setbut("mod");
    setmodid(id);
  }

  // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
  const deleteTodo = (id) => {
    // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
    // setTodos(todos.filter((todo) => todo.id !== id));
    if (but=="mod"){
      const selected=todos.filter((todo)=>todo.id===modid)[0];
      if (id===selected.id){ //변경 중인 일정이 삭제되는 경우 초기화
        setInput("");
        setDeadline("");
        setCategory("");
        setIsButtonDisabled(true); // 버튼 비활성화
        seterrorcode("");
        setTimeout(() => {
          setIsButtonDisabled(false); // 버튼 활성화
        }, 1000);
        setbut("add");setmodid("");
      }
    }
    setTodos(todos.filter((todo)=>todo.id!==id));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const borderStyle = " text-center border border-blue-500 rounded ";
  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <h1 className="text-xl mb-7 font-bold underline underline-offset-4 decoration-wavy">
        Todo List
      </h1>

      {/* 할 일을 입력받는 텍스트 필드입니다. */}

      <li className="mb-1">
        <select
          className="hover:shadow-lg w-40 p-1 mr-3 mb-4 border border-gray-300 rounded"
          value={category}
          selected={category}
          onKeyPress={handleKeyPress}
          onChange={(e) => {
            if (e.target.value === "__other") {
              setCategory(prompt("Please enter a category"));
            } else {
              setCategory(e.target.value);
            }
          }}
        > 
          <option value="" selected>Select</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Exercise">Exercise</option>
          <option value="__other">입력하기 ...</option>
          {["Work","Study","Exercise","__other",""].includes(category)? "":<option value={category}>{category}</option>}
        </select>

        <input
          type="text"
          className="hover:shadow-lg w-full p-1 mb-4 border border-gray-300 rounded"
          style={{ width: "500%" }}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
        />

        <DatePicker
          className="hover:shadow-lg w-40 p-1 ml-3 mb-4 border border-gray-300 rounded"
          selected={deadline}
          onChange={(date) => setDeadline(date)}
          placeholderText="Select deadline"
          minDate={new Date()}
          onKeyDown={(e) => handleKeyPress(e)}
        />

        <button
          className={but=='add'? `w-12 hover:shadow-lg justify-self-end p-1 ml-3 mb-4 bg-blue-500 text-white border border-blue-500 rounded hover:bg-white hover:text-blue-500 ${
            isButtonDisabled &&
            "bg-red-500 border-red-500 hover:bg-red hover:text-red-500 cursor-not-allowed"
          }`:`w-12 hover:shadow-lg justify-self-end p-1 ml-3 mb-4 bg-green-500 text-white border border-green-500 rounded hover:bg-white hover:text-green-500 ${
            isButtonDisabled &&
            "bg-red-500 border-red-500 hover:bg-red hover:text-red-500 cursor-not-allowed"
          }`}
          onClick={addTodo}
          disabled={isButtonDisabled}
        >
          {but}
        </button>
      </li>

      {/* 할 일을 추가하는 버튼입니다. */}
      <li>
        <span className="w-full pl-5 text-red-500 mr-10 mb-7 ">
          {errorcode}
        </span>
      </li>
      <img className="h-30 w-30 ml-10 mb-10" src="ok.jpg" alt="i'm ok" />

      <li className="mb-1">
        <div className={`${borderStyle} w-12`}>✔</div>
        <div className={`${borderStyle} ml-1 w-20`}>분류</div>

        <div className={`${borderStyle} ml-1 w-60`}>Todo</div>
        <button className={`${borderStyle} ml-1 w-20`}>D-Day</button>
        <div className={`${borderStyle} ml-1 w-32`}>마감일</div>
        <div className={`${borderStyle} ml-1 w-16`}>제거</div>
        <div className={`${borderStyle} ml-1 w-16`}>수정</div>
      </li>

      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
            onModi={()=>modiTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
